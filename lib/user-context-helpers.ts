import { prisma } from "@/lib/prisma"
import { calculateBMR, calculateTDEE, getWeightForDate } from "@/lib/calories"

// ── Data-fetching helpers ──────────────────────────────────────────────

export async function fetchUserProfile(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } })
}

export async function fetchWeightEntries(userId: string) {
  return prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 20,
  })
}

export async function fetchExerciseEntries(userId: string) {
  const recentExercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  })

  const allExercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })

  const totalCaloriesBurnt = await prisma.exercise.aggregate({
    where: { userId },
    _sum: { calories: true },
  })

  return {
    recentExercises,
    allExercises,
    totalCaloriesBurnt: totalCaloriesBurnt._sum.calories || 0,
  }
}

export async function fetchFoodEntries(userId: string) {
  const recentFoods = await prisma.foodEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  })

  const allFoods = await prisma.foodEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })

  const totalCaloriesConsumed = await prisma.foodEntry.aggregate({
    where: { userId },
    _sum: { calories: true },
  })

  return {
    recentFoods,
    allFoods,
    totalCaloriesConsumed: totalCaloriesConsumed._sum.calories || 0,
  }
}

// ── Calculation helpers ────────────────────────────────────────────────

export function calculateWeightMetrics(
  weightEntries: Array<{ weight: number; date: Date | string }>,
  userHeight: number | null
) {
  const latestWeight = weightEntries[0] || null
  const oldestRecentWeight =
    weightEntries.length > 1 ? weightEntries[weightEntries.length - 1] : null
  const weightChange =
    latestWeight && oldestRecentWeight && weightEntries.length > 1
      ? latestWeight.weight - oldestRecentWeight.weight
      : null

  let bmi: number | null = null
  if (latestWeight && userHeight) {
    const heightInMeters = userHeight / 100
    bmi = latestWeight.weight / (heightInMeters * heightInMeters)
  }

  return { latestWeight, weightChange, bmi }
}

// ── Daily aggregation ──────────────────────────────────────────────────

interface DailyBucket {
  caloriesConsumed: number
  caloriesBurnt: number
  protein: number
  date: Date
}

export function buildDailyDataMap(
  allExercises: Array<{ calories: number; date: Date }>,
  allFoods: Array<{ calories: number; date: Date; protein?: number | null }>
): Map<string, DailyBucket> {
  const dailyDataMap = new Map<string, DailyBucket>()

  allExercises.forEach((exercise) => {
    const key = exercise.date.toISOString().split("T")[0]
    const existing = dailyDataMap.get(key)
    if (existing) {
      existing.caloriesBurnt += exercise.calories
    } else {
      const [y, m, d] = key.split("-").map(Number)
      dailyDataMap.set(key, {
        caloriesBurnt: exercise.calories,
        caloriesConsumed: 0,
        protein: 0,
        date: new Date(Date.UTC(y, m - 1, d)),
      })
    }
  })

  allFoods.forEach((food) => {
    const protein = (food as any).protein || 0
    const key = food.date.toISOString().split("T")[0]
    const existing = dailyDataMap.get(key)
    if (existing) {
      existing.caloriesConsumed += food.calories
      existing.protein += protein
    } else {
      const [y, m, d] = key.split("-").map(Number)
      dailyDataMap.set(key, {
        caloriesBurnt: 0,
        caloriesConsumed: food.calories,
        protein,
        date: new Date(Date.UTC(y, m - 1, d)),
      })
    }
  })

  return dailyDataMap
}

export function enrichDailyData(
  dailyDataMap: Map<string, DailyBucket>,
  weightEntries: Array<{ weight: number; date: Date | string }>,
  user: { height?: number | null; age?: number | null; lifestyle?: string | null }
) {
  return Array.from(dailyDataMap.values())
    .map((day) => {
      const weight = getWeightForDate(day.date, weightEntries)
      let bmr = 0
      let tdee = 0
      if (weight && user?.height && user?.age) {
        bmr = calculateBMR(weight, user.height, user.age)
        tdee = calculateTDEE(bmr, user.lifestyle ?? null)
      }
      const net = day.caloriesConsumed - (tdee + day.caloriesBurnt)
      return {
        ...day,
        bmr,
        tdee,
        netCalories: net,
        ratioToTdee: tdee > 0 ? day.caloriesConsumed / tdee : null,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 30)
}

// ── Trend analysis ─────────────────────────────────────────────────────

export interface TrendAnalysis {
  avgDeficit: number | null
  projectedKgPerWeek: number | null
  extremeDeficitStreak: number
  plateauDetected: boolean
  proteinTrackedDays: number
  highProteinDays: number
}

export function calculateTrends(
  dailyData: Array<{
    netCalories: number
    ratioToTdee: number | null
    protein: number
    caloriesConsumed: number
  }>,
  weightEntries: Array<{ weight: number }>,
  sustainabilityMode: string
): TrendAnalysis {
  const last7 = dailyData.slice(0, 7)
  const avgDeficit = last7.length
    ? last7.reduce((sum, day) => sum + day.netCalories, 0) / last7.length
    : null
  const projectedKgPerWeek = avgDeficit !== null ? (avgDeficit * 7) / 7700 : null

  const aggressiveThreshold = sustainabilityMode === "strict" ? 0.5 : 0.6

  let extremeDeficitStreak = 0
  for (const day of dailyData) {
    if (day.ratioToTdee !== null && day.ratioToTdee < aggressiveThreshold) {
      extremeDeficitStreak += 1
    } else {
      break
    }
  }

  let plateauDetected = false
  if (weightEntries.length >= 3 && avgDeficit !== null && avgDeficit < -150) {
    const recent = weightEntries.slice(0, 3).map((w) => w.weight)
    plateauDetected = Math.max(...recent) - Math.min(...recent) < 0.2
  }

  const proteinTrackedDays = last7.filter((d) => d.protein > 0).length
  const highProteinDays = last7.filter(
    (d) => d.caloriesConsumed > 0 && (d.protein * 4) / d.caloriesConsumed >= 0.25
  ).length

  return {
    avgDeficit,
    projectedKgPerWeek,
    extremeDeficitStreak,
    plateauDetected,
    proteinTrackedDays,
    highProteinDays,
  }
}
