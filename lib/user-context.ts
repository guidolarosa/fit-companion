import { prisma } from "@/lib/prisma"
import { format, startOfDay } from "date-fns"
import { calculateBMR, calculateTDEE, getWeightForDate } from "@/lib/calories"

export async function getUserContext(userId: string) {
  // Get user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return "No user data available"
  }

  // Get weight data
  const weightEntries = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 20, // Last 20 entries for trend
  })

  const latestWeight = weightEntries[0] || null
  // Get the oldest weight from the recent entries for trend calculation
  const oldestRecentWeight = weightEntries.length > 1 ? weightEntries[weightEntries.length - 1] : null
  const weightChange = latestWeight && oldestRecentWeight && weightEntries.length > 1
    ? latestWeight.weight - oldestRecentWeight.weight
    : null

  // Calculate BMI
  let bmi: number | null = null
  if (latestWeight && user?.height) {
    const heightInMeters = user.height / 100
    bmi = latestWeight.weight / (heightInMeters * heightInMeters)
  }

  // Get exercise data
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

  const totalCaloriesBurntValue = totalCaloriesBurnt._sum.calories || 0

  // Get food data
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

  const totalCaloriesConsumedValue = totalCaloriesConsumed._sum.calories || 0

  // Calculate net calories (consumed - burnt)
  const netCalories = totalCaloriesConsumedValue - totalCaloriesBurntValue

  // Build daily view for trends (last 30 days)
  const dailyDataMap = new Map<
    string,
    { caloriesConsumed: number; caloriesBurnt: number; protein: number; date: Date }
  >()

  allExercises.forEach((exercise) => {
    const key = format(startOfDay(exercise.date), "yyyy-MM-dd")
    const existing = dailyDataMap.get(key)
    if (existing) {
      existing.caloriesBurnt += exercise.calories
    } else {
      dailyDataMap.set(key, {
        caloriesBurnt: exercise.calories,
        caloriesConsumed: 0,
        protein: 0,
        date: startOfDay(exercise.date),
      })
    }
  })

  allFoods.forEach((food) => {
    const protein = (food as any).protein || 0
    const key = format(startOfDay(food.date), "yyyy-MM-dd")
    const existing = dailyDataMap.get(key)
    if (existing) {
      existing.caloriesConsumed += food.calories
      existing.protein += protein
    } else {
      dailyDataMap.set(key, {
        caloriesBurnt: 0,
        caloriesConsumed: food.calories,
        protein,
        date: startOfDay(food.date),
      })
    }
  })

  const dailyData = Array.from(dailyDataMap.values())
    .map((day) => {
      const weight = getWeightForDate(day.date, weightEntries)
      let bmr = 0
      let tdee = 0
      if (weight && user?.height && user?.age) {
        bmr = calculateBMR(weight, user.height, user.age)
        tdee = calculateTDEE(bmr, user.lifestyle)
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

  const last7 = dailyData.slice(0, 7)
  const avgDeficit = last7.length
    ? last7.reduce((sum, day) => sum + day.netCalories, 0) / last7.length
    : null
  const projectedKgPerWeek = avgDeficit !== null ? (avgDeficit * 7) / 7700 : null

  const sustainabilityMode = (user as any)?.sustainabilityMode ?? "sustainable"
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

  // Format context string
  let context = "USER PROFILE AND FITNESS DATA:\n\n"

  // User profile
  context += "PROFILE:\n"
  if (user?.name) context += `- Name: ${user.name}\n`
  if (user?.age) context += `- Age: ${user.age} years\n`
  if (user?.height) context += `- Height: ${user.height} cm\n`
  if (user?.lifestyle) context += `- Lifestyle: ${user.lifestyle}\n`
  if ((user as any)?.sustainabilityMode) context += `- Mode: ${(user as any).sustainabilityMode}\n`
  if ((user as any)?.targetWeightMin && (user as any)?.targetWeightMax) {
    context += `- Target Weight Range: ${(user as any).targetWeightMin.toFixed(1)}–${(user as any).targetWeightMax.toFixed(1)} kg\n`
  }
  if ((user as any)?.milestoneStep) {
    context += `- Milestone Step: ${(user as any).milestoneStep.toFixed(1)} kg chunks\n`
  }
  context += "\n"

  // Weight information
  context += "WEIGHT TRACKING:\n"
  if (latestWeight) {
    context += `- Current Weight: ${latestWeight.weight} kg (recorded on ${format(latestWeight.date, "MMM d, yyyy")})\n`
    if (weightChange !== null && weightEntries.length > 1) {
      const changeText = weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1)
      context += `- Weight Change: ${changeText} kg (over ${weightEntries.length} entries)\n`
    }
  } else {
    context += "- No weight entries recorded yet\n"
  }
  if (bmi) {
    context += `- BMI: ${bmi.toFixed(1)}`
    if (bmi < 18.5) context += " (Underweight)\n"
    else if (bmi < 25) context += " (Normal)\n"
    else if (bmi < 30) context += " (Overweight)\n"
    else context += " (Obese)\n"
    context += " (reference only)\n"
  }
  context += "\n"

  // Exercise information
  context += "EXERCISE ACTIVITY:\n"
  if (recentExercises.length > 0) {
    context += `- Total Calories Burnt (all time): ${Math.round(totalCaloriesBurntValue)} kcal\n`
    context += `- Recent Exercises (last 10):\n`
    recentExercises.slice(0, 5).forEach((ex) => {
      context += `  • ${ex.name}: ${Math.round(ex.calories)} kcal`
      if (ex.duration) context += ` (${ex.duration} min)`
      context += ` - ${format(ex.date, "MMM d")}\n`
    })
  } else {
    context += "- No exercises recorded yet\n"
  }
  context += "\n"

  // Food information
  context += "FOOD CONSUMPTION:\n"
  if (recentFoods.length > 0) {
    context += `- Total Calories Consumed (all time): ${Math.round(totalCaloriesConsumedValue)} kcal\n`
    context += `- Recent Food Entries (last 10):\n`
    recentFoods.slice(0, 5).forEach((food) => {
      context += `  • ${food.name}: ${Math.round(food.calories)} kcal - ${format(food.date, "MMM d")}\n`
    })
  } else {
    context += "- No food entries recorded yet\n"
  }
  context += "\n"

  // Net calories
  if (totalCaloriesConsumedValue > 0 || totalCaloriesBurntValue > 0) {
    context += "CALORIE BALANCE:\n"
    context += `- Net Calories: ${netCalories > 0 ? "+" : ""}${Math.round(netCalories)} kcal (consumed - burnt)\n`
    context += "\n"
  }

  // Trends and patterns
  context += "TRENDS (last 7 days):\n"
  if (avgDeficit !== null) context += `- Avg deficit: ${Math.round(avgDeficit)} kcal/day\n`
  if (projectedKgPerWeek !== null) {
    context += `- Projected pace: ${
      projectedKgPerWeek < 0
        ? `${Math.abs(projectedKgPerWeek).toFixed(2)} kg/week loss`
        : `${projectedKgPerWeek.toFixed(2)} kg/week gain`
    }\n`
  }
  context += `- Extreme deficit streak: ${extremeDeficitStreak} days (threshold ${
    aggressiveThreshold * 100
  }% of TDEE)\n`
  if (plateauDetected) {
    context += "- Pattern: Weight plateau despite deficit (recent weights stable)\n"
  }
  const proteinTrackedDays = last7.filter((d) => d.protein > 0).length
  const highProteinDays = last7.filter(
    (d) => d.caloriesConsumed > 0 && d.protein * 4 / d.caloriesConsumed >= 0.25
  ).length
  context += `- Protein tracked: ${proteinTrackedDays}/7 days\n`
  context += `- High-protein days (>=25% kcal): ${highProteinDays}/7\n`
  context += "\n"

  return context
}

