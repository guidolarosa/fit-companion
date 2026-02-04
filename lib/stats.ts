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

export function calculateEnhancedStats(
  dailyData: DailyData[],
  foods: any[],
  exercises: any[]
): EnhancedStats {
  const n = dailyData.length;
  if (n === 0) {
    return {
      movingAvgWeight: [],
      movingAvgCalories: [],
      outliers: [],
      classification: { deficit: 0, maintenance: 0, surplus: 0 },
      streaks: { current: 0, best: 0 },
      narrative: "No data available.",
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
      outliers.push({ date: dayKey, reason: "Consumo muy elevado respecto a tu promedio" });
    } else if (day.caloriesConsumed < avgIntake - 2 * stdDevIntake && day.caloriesConsumed > 0) {
      outliers.push({ date: dayKey, reason: "Consumo muy bajo respecto a tu promedio" });
    } else if (hasAlcohol && day.caloriesConsumed > avgIntake) {
      outliers.push({ date: dayKey, reason: "Día con alcohol y consumo superior al promedio" });
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
  
  // Current streak needs to be calculated from the latest date backwards
  for (let i = dailyData.length - 1; i >= 0; i--) {
    const day = dailyData[i];
    const isComplete = day.caloriesConsumed > 0 && (day.weight !== null || day.caloriesBurnt > 0);
    // If today is not complete, current streak might be 0, or we check if yesterday was the end of it
    // For simplicity, let's just count from most recent
  }
  currentStreak = tempStreak; // This is actually correct if the loop above is chronological

  // 5. Narrative
  // dailyData is ASC, so index 0 is start, length-1 is end
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
    : "actividad física";

  const trend = weightChange < 0 ? "descendente" : weightChange > 0 ? "ascendente" : "estable";
  
  let narrative = `Durante este período ${weightChange < 0 ? 'bajaste' : weightChange > 0 ? 'subiste' : 'mantuviste'} ${Math.abs(weightChange).toFixed(1)} kg. `;
  narrative += `Mantuviste actividad física constante, principalmente ${topExercise}. `;
  if (outliers.length > 0) {
    narrative += `Se identificaron ${outliers.length} días atípicos. `;
  }
  narrative += `La tendencia general es ${trend} y ${bestStreak > 5 ? 'sostenida' : 'en desarrollo'}.`;

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
