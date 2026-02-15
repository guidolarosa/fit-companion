import {
  fetchUserProfile,
  fetchWeightEntries,
  fetchExerciseEntries,
  fetchFoodEntries,
  calculateWeightMetrics,
  buildDailyDataMap,
  enrichDailyData,
  calculateTrends,
} from "@/lib/user-context-helpers"

export async function getUserContext(userId: string) {
  // Get user profile
  const user = await fetchUserProfile(userId)

  if (!user) {
    return "No user data available"
  }

  // Fetch all data in parallel
  const [weightEntries, exerciseData, foodData] = await Promise.all([
    fetchWeightEntries(userId),
    fetchExerciseEntries(userId),
    fetchFoodEntries(userId),
  ])

  const { recentExercises, allExercises, totalCaloriesBurnt } = exerciseData
  const { recentFoods, allFoods, totalCaloriesConsumed } = foodData

  // Compute weight metrics
  const { latestWeight, weightChange, bmi } = calculateWeightMetrics(
    weightEntries,
    user?.height ?? null
  )

  // Net calories (consumed - burnt)
  const netCalories = totalCaloriesConsumed - totalCaloriesBurnt

  // Build daily view for trends (last 30 days)
  const dailyDataMap = buildDailyDataMap(allExercises, allFoods)
  const dailyData = enrichDailyData(dailyDataMap, weightEntries, user)

  // Trend analysis
  const sustainabilityMode = (user as any)?.sustainabilityMode ?? "sustainable"
  const trends = calculateTrends(dailyData, weightEntries, sustainabilityMode)

  // ── Format context string ──────────────────────────────────────────

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
    const latestWeightDateStr = new Date(latestWeight.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    context += `- Current Weight: ${latestWeight.weight} kg (recorded on ${latestWeightDateStr})\n`
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
    context += `- Total Calories Burnt (all time): ${Math.round(totalCaloriesBurnt)} kcal\n`
    context += `- Recent Exercises (last 10):\n`
    recentExercises.slice(0, 5).forEach((ex) => {
      const exDateStr = ex.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
      context += `  • ${ex.name}: ${Math.round(ex.calories)} kcal`
      if (ex.duration) context += ` (${ex.duration} min)`
      context += ` - ${exDateStr}\n`
    })
  } else {
    context += "- No exercises recorded yet\n"
  }
  context += "\n"

  // Food information
  context += "FOOD CONSUMPTION:\n"
  if (recentFoods.length > 0) {
    context += `- Total Calories Consumed (all time): ${Math.round(totalCaloriesConsumed)} kcal\n`
    context += `- Recent Food Entries (last 10):\n`
    recentFoods.slice(0, 5).forEach((food) => {
      const foodDateStr = food.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
      context += `  • ${food.name}: ${Math.round(food.calories)} kcal - ${foodDateStr}\n`
    })
  } else {
    context += "- No food entries recorded yet\n"
  }
  context += "\n"

  // Net calories
  if (totalCaloriesConsumed > 0 || totalCaloriesBurnt > 0) {
    context += "CALORIE BALANCE:\n"
    context += `- Net Calories: ${netCalories > 0 ? "+" : ""}${Math.round(netCalories)} kcal (consumed - burnt)\n`
    context += "\n"
  }

  // Trends and patterns
  const aggressiveThreshold = sustainabilityMode === "strict" ? 0.5 : 0.6
  context += "TRENDS (last 7 days):\n"
  if (trends.avgDeficit !== null) context += `- Avg deficit: ${Math.round(trends.avgDeficit)} kcal/day\n`
  if (trends.projectedKgPerWeek !== null) {
    context += `- Projected pace: ${
      trends.projectedKgPerWeek < 0
        ? `${Math.abs(trends.projectedKgPerWeek).toFixed(2)} kg/week loss`
        : `${trends.projectedKgPerWeek.toFixed(2)} kg/week gain`
    }\n`
  }
  context += `- Extreme deficit streak: ${trends.extremeDeficitStreak} days (threshold ${
    aggressiveThreshold * 100
  }% of TDEE)\n`
  if (trends.plateauDetected) {
    context += "- Pattern: Weight plateau despite deficit (recent weights stable)\n"
  }
  context += `- Protein tracked: ${trends.proteinTrackedDays}/7 days\n`
  context += `- High-protein days (>=25% kcal): ${trends.highProteinDays}/7\n`
  context += "\n"

  return context
}
