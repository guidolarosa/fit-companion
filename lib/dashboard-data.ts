import { prisma } from "@/lib/prisma";
import { aggregateDailyData } from "@/lib/daily-data";

export async function getWeightData(userId: string) {
  const weights = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  return weights;
}

export async function getDashboardData(userId: string) {
  const [
    latestWeight,
    user,
    totalCaloriesBurnt,
    totalCaloriesConsumed,
    recentExercises,
    recentFoods,
    allExercises,
    allFoods,
    allWeights
  ] = await Promise.all([
    prisma.weightEntry.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.exercise.aggregate({
      where: { userId },
      _sum: { calories: true },
    }),
    prisma.foodEntry.aggregate({
      where: { userId },
      _sum: { calories: true },
    }),
    prisma.exercise.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: "desc" },
    }),
    prisma.foodEntry.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: "desc" },
    }),
    prisma.exercise.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.foodEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    })
  ]);

  // Calculate BMI
  let bmi: number | null = null;
  let idealWeight: number | null = null;

  if (latestWeight && user?.height) {
    const heightInMeters = user.height / 100;
    bmi = latestWeight.weight / (heightInMeters * heightInMeters);
    // Ideal BMI is 22 (middle of healthy range 18.5-24.9)
    idealWeight = 22 * (heightInMeters * heightInMeters);
  }

  const caloriesBurnt = totalCaloriesBurnt._sum.calories || 0;
  const caloriesConsumed = totalCaloriesConsumed._sum.calories || 0;

  // Calculate daily register data
  const allDailyData = aggregateDailyData(user, allExercises, allFoods, allWeights);
  const dailyData = allDailyData.slice(0, 30); // Last 30 days for dashboard logic

  // Calculate total net calories from all registered days
  const totalNetCalories = allDailyData.reduce((sum, day) => {
    const totalBurnt = day.tdee + day.caloriesBurnt;
    const netCalories = day.caloriesConsumed - totalBurnt;
    return sum + netCalories;
  }, 0);

  // Group exercises by day for calendar
  const exerciseDaysMap = new Map<string, number>();
  allExercises.forEach((exercise) => {
    const dayKey = exercise.date.toISOString().split("T")[0];
    const existing = exerciseDaysMap.get(dayKey);
    if (existing) {
      exerciseDaysMap.set(dayKey, existing + exercise.calories);
    } else {
      exerciseDaysMap.set(dayKey, exercise.calories);
    }
  });

  const exerciseDays = Array.from(exerciseDaysMap.entries()).map(([dateKey, calories]) => {
    // Parse date string (yyyy-MM-dd) as UTC date to match "Pinned UTC"
    const [year, month, day] = dateKey.split("-").map(Number);
    return {
      date: new Date(Date.UTC(year, month - 1, day)),
      calories,
    };
  });

  // Prepare food days for calendar (all days with food/exercise data)
  const foodDays = dailyData.map((day) => ({
    date: day.date,
    netCalories: day.netCalories,
    caloriesConsumed: day.caloriesConsumed,
    caloriesBurnt: day.caloriesBurnt,
    tdee: day.tdee,
  }));

  const targetWeightMin = (user as any)?.targetWeightMin ?? (idealWeight ? idealWeight - 2 : null);
  const targetWeightMax = (user as any)?.targetWeightMax ?? (idealWeight ? idealWeight + 2 : null);
  const milestoneStep = (user as any)?.milestoneStep ?? 2;
  const sustainabilityMode = (user as any)?.sustainabilityMode ?? "sustainable";
  const aggressiveThreshold = sustainabilityMode === "strict" ? 0.5 : 0.6;

  // Build last 7 days data for weekly cards
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  
  const weekDayData: { date: string; consumed: number; burnt: number; tdee: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const match = allDailyData.find(
      (dd) => dd.date.toISOString().split("T")[0] === dateStr
    );
    if (match) {
      weekDayData.push({
        date: dateStr,
        consumed: match.caloriesConsumed,
        burnt: match.caloriesBurnt,
        tdee: match.tdee,
      });
    }
  }

  // Calculate water target (ml) based on weight, age, and activity
  // General formula: ~30-35ml per kg body weight, adjusted for activity
  const currentWeight = latestWeight?.weight || 70;
  const activityMultiplier = user?.lifestyle === "active" ? 40 : user?.lifestyle === "moderate" ? 35 : 30;
  const waterTargetMl = Math.round(currentWeight * activityMultiplier);
  const waterTargetGlasses = Math.round(waterTargetMl / 250); // 250ml per glass

  const last7 = dailyData.slice(0, 7);
  const avgDeficit = last7.length
    ? last7.reduce((sum, day) => sum + day.netCalories, 0) / last7.length
    : null;
  const avgIntake = last7.length
    ? last7.reduce((sum, day) => sum + day.caloriesConsumed, 0) / last7.length
    : null;
  const projectedKgPerWeek = avgDeficit !== null ? (avgDeficit * 7) / 7700 : null;

  // Soft warnings
  const warnings: string[] = [];
  const today = dailyData[0];
  if (today?.ratioToTdee != null && today.ratioToTdee < aggressiveThreshold) {
    warnings.push("warningLowIntake");
  }

  // Deficit quality
  const trainingDays = last7.filter((d) => d.hasExercise);
  const trainingDeficitCount = trainingDays.filter((d) => d.netCalories < 0).length;
  const proteinTrackedDays = last7.filter((d) => d.protein > 0).length;
  const highProteinDays = last7.filter(
    (d) => d.caloriesConsumed > 0 && d.protein * 4 / d.caloriesConsumed >= 0.25
  ).length;

  // Assistant patterns
  let extremeDeficitStreak = 0;
  for (const day of dailyData) {
    if (day.ratioToTdee !== null && day.ratioToTdee < aggressiveThreshold) {
      extremeDeficitStreak += 1;
    } else {
      break;
    }
  }

  let plateauDetected = false;
  if (allWeights.length >= 3 && avgDeficit !== null && avgDeficit < -150) {
    const recentWeights = allWeights.slice(-3).map((w) => w.weight);
    const maxW = Math.max(...recentWeights);
    const minW = Math.min(...recentWeights);
    plateauDetected = maxW - minW < 0.2;
  }

  return {
    latestWeight,
    user,
    bmi,
    idealWeight,
    targetWeightMin,
    targetWeightMax,
    milestoneStep,
    sustainabilityMode,
    totalCaloriesBurnt: caloriesBurnt,
    totalCaloriesConsumed: caloriesConsumed,
    netCalories: totalNetCalories,
    recentExercises,
    recentFoods,
    dailyData,
    exerciseDays,
    foodDays,
    trendInsights: {
      avgDeficit,
      avgIntake,
      projectedKgPerWeek,
    },
    warnings,
    qualityInsights: {
      trainingDays: trainingDays.length,
      trainingDeficitDays: trainingDeficitCount,
      proteinTrackedDays,
      highProteinDays,
    },
    assistantPatterns: {
      extremeDeficitStreak,
      plateauDetected,
    },
    weekDayData,
    waterTargetGlasses,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
export type WeightData = Awaited<ReturnType<typeof getWeightData>>;
