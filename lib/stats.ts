import { DailyData } from "./daily-data";

export interface EnhancedStats {
  movingAvgWeight: (number | null)[];
  movingAvgCalories: (number | null)[];
  outliers: { date: string; reason: string }[];
  classification: {
    deficit: number;
    maintenance: number;
    surplus: number;
  };
  streaks: {
    current: number;
    best: number;
  };
  narrative: string;
  avgDeficit: number;
  avgIntake: number;
  projectedWeightChange: number;
}

// Accept an optional translate function for i18n support
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const defaultTranslate: TranslateFn = (key, params) => {
  // Fallback Spanish strings when no translator is provided
  const fallbacks: Record<string, string> = {
    noData: "No hay datos disponibles.",
    highIntake: "Consumo muy elevado respecto a tu promedio",
    lowIntake: "Consumo muy bajo respecto a tu promedio",
    alcoholDay: "Día con alcohol y consumo superior al promedio",
    fallbackExercise: "actividad física",
    trendDown: "descendente",
    trendUp: "ascendente",
    trendStable: "estable",
    weightLost: "Durante este período bajaste {x} kg. ",
    weightGained: "Durante este período subiste {x} kg. ",
    weightMaintained: "Durante este período mantuviste {x} kg. ",
    activityConstant: "Mantuviste actividad física constante, principalmente {exercise}. ",
    outlierCount: "Se identificaron {n} días atípicos. ",
    trendSustained: "La tendencia general es {trend} y sostenida.",
    trendDeveloping: "La tendencia general es {trend} y en desarrollo.",
  };
  let result = fallbacks[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v));
    });
  }
  return result;
};

export function calculateEnhancedStats(
  dailyData: DailyData[],
  foods: any[],
  exercises: any[],
  t?: TranslateFn
): EnhancedStats {
  const tr = t || defaultTranslate;
  const n = dailyData.length;
  if (n === 0) {
    return {
      movingAvgWeight: [],
      movingAvgCalories: [],
      outliers: [],
      classification: { deficit: 0, maintenance: 0, surplus: 0 },
      streaks: { current: 0, best: 0 },
      narrative: tr("noData"),
      avgDeficit: 0,
      avgIntake: 0,
      projectedWeightChange: 0,
    };
  }

  // 1. Moving Averages (7-day)
  const calculateMovingAvg = (data: (number | null)[], window: number) => {
    return data.map((_, idx, arr) => {
      const start = Math.max(0, idx - window + 1);
      const subset = arr.slice(start, idx + 1).filter((v): v is number => v !== null);
      return subset.length > 0 ? subset.reduce((a, b) => a + b, 0) / subset.length : null;
    });
  };

  // dailyData is sorted ASC (oldest first)
  const weights = dailyData.map(d => d.weight);
  const calories = dailyData.map(d => d.caloriesConsumed);
  
  const movingAvgWeight = calculateMovingAvg(weights, 7);
  const movingAvgCalories = calculateMovingAvg(calories, 7);

  // 2. Outliers
  const avgIntake = dailyData.reduce((sum, d) => sum + d.caloriesConsumed, 0) / n;
  const stdDevIntake = Math.sqrt(
    dailyData.reduce((sum, d) => sum + Math.pow(d.caloriesConsumed - avgIntake, 2), 0) / n
  );

  const alcoholKeywords = ["beer", "wine", "alcohol", "vodka", "whisky", "cocktail", "gin", "rum", "tequila"];
  const outliers: { date: string; reason: string }[] = [];

  dailyData.forEach(day => {
    const dayKey = day.date.toISOString().split("T")[0];
    const dayFoods = foods.filter(f => new Date(f.date).toISOString().split("T")[0] === dayKey);
    const hasAlcohol = dayFoods.some(f => alcoholKeywords.some(k => f.name.toLowerCase().includes(k)));

    if (day.caloriesConsumed > avgIntake + 2 * stdDevIntake) {
      outliers.push({ date: dayKey, reason: tr("highIntake") });
    } else if (day.caloriesConsumed < avgIntake - 2 * stdDevIntake && day.caloriesConsumed > 0) {
      outliers.push({ date: dayKey, reason: tr("lowIntake") });
    } else if (hasAlcohol && day.caloriesConsumed > avgIntake) {
      outliers.push({ date: dayKey, reason: tr("alcoholDay") });
    }
  });

  // 3. Classification
  const classification = { deficit: 0, maintenance: 0, surplus: 0 };
  dailyData.forEach(day => {
    if (day.tdee === 0) return;
    const maintenanceRange = 0.05; // 5%
    const ratio = day.caloriesConsumed / (day.tdee + day.caloriesBurnt);
    
    if (ratio < 1 - maintenanceRange) {
      classification.deficit++;
    } else if (ratio > 1 + maintenanceRange) {
      classification.surplus++;
    } else {
      classification.maintenance++;
    }
  });

  // 4. Streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Need chronological order for streaks
  const chronoData = [...dailyData].sort((a, b) => a.date.getTime() - b.date.getTime());
  chronoData.forEach(day => {
    const isComplete = day.caloriesConsumed > 0 && (day.weight !== null || day.caloriesBurnt > 0);
    if (isComplete) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });
  
  for (let i = dailyData.length - 1; i >= 0; i--) {
    const day = dailyData[i];
    const isComplete = day.caloriesConsumed > 0 && (day.weight !== null || day.caloriesBurnt > 0);
  }
  currentStreak = tempStreak;

  // 5. Narrative
  const startWeight = dailyData[0].weight;
  const endWeight = dailyData[dailyData.length - 1].weight;
  const weightChange = (startWeight !== null && endWeight !== null) ? endWeight - startWeight : 0;
  
  const dominantExercise = exercises.length > 0 
    ? exercises.reduce((acc, curr) => {
        acc[curr.name] = (acc[curr.name] || 0) + 1;
        return acc;
      }, {} as any)
    : null;
  const topExercise = dominantExercise 
    ? Object.keys(dominantExercise).reduce((a, b) => (dominantExercise[a] || 0) > (dominantExercise[b] || 0) ? a : b)
    : tr("fallbackExercise");

  const trend = weightChange < 0 
    ? tr("trendDown") 
    : weightChange > 0 
      ? tr("trendUp") 
      : tr("trendStable");
  
  const absChange = Math.abs(weightChange).toFixed(1);
  let narrative = weightChange < 0 
    ? tr("weightLost", { x: absChange })
    : weightChange > 0 
      ? tr("weightGained", { x: absChange })
      : tr("weightMaintained", { x: absChange });
  narrative += tr("activityConstant", { exercise: topExercise });
  if (outliers.length > 0) {
    narrative += tr("outlierCount", { n: outliers.length });
  }
  narrative += bestStreak > 5 
    ? tr("trendSustained", { trend }) 
    : tr("trendDeveloping", { trend });

  const avgDeficit = dailyData.reduce((sum, d) => sum + d.netCalories, 0) / n;
  const projectedWeightChange = (avgDeficit * 7) / 7700;

  return {
    movingAvgWeight,
    movingAvgCalories,
    outliers,
    classification,
    streaks: { current: currentStreak, best: bestStreak },
    narrative,
    avgDeficit,
    avgIntake,
    projectedWeightChange,
  };
}
