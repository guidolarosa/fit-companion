import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

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
    take: 10, // Last 10 entries for trend
  })

  const latestWeight = weightEntries[0] || null
  // Get the oldest weight from the recent entries for trend calculation
  const oldestRecentWeight = weightEntries.length > 1 ? weightEntries[weightEntries.length - 1] : null
  const weightChange = latestWeight && oldestRecentWeight && weightEntries.length > 1
    ? latestWeight.weight - oldestRecentWeight.weight
    : null

  // Calculate BMI
  let bmi: number | null = null
  let idealWeight: number | null = null
  if (latestWeight && user?.height) {
    const heightInMeters = user.height / 100
    bmi = latestWeight.weight / (heightInMeters * heightInMeters)
    idealWeight = 22 * (heightInMeters * heightInMeters)
  }

  // Get exercise data
  const recentExercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
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

  const totalCaloriesConsumed = await prisma.foodEntry.aggregate({
    where: { userId },
    _sum: { calories: true },
  })

  const totalCaloriesConsumedValue = totalCaloriesConsumed._sum.calories || 0

  // Calculate net calories (consumed - burnt)
  const netCalories = totalCaloriesConsumedValue - totalCaloriesBurntValue

  // Format context string
  let context = "USER PROFILE AND FITNESS DATA:\n\n"

  // User profile
  context += "PROFILE:\n"
  if (user?.name) context += `- Name: ${user.name}\n`
  if (user?.age) context += `- Age: ${user.age} years\n`
  if (user?.height) context += `- Height: ${user.height} cm\n`
  if (user?.lifestyle) context += `- Lifestyle: ${user.lifestyle}\n`
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
  }
  if (idealWeight && latestWeight) {
    const diff = latestWeight.weight - idealWeight
    context += `- Ideal Weight: ${idealWeight.toFixed(1)} kg (${diff > 0 ? "need to lose" : "need to gain"} ${Math.abs(diff).toFixed(1)} kg)\n`
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

  return context
}

