/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * Since we don't have gender, we'll use a general formula
 */
export function calculateBMR(weight: number, height: number, age: number): number {
  // Using general formula (average of male and female)
  // Male: BMR = 10 × weight + 6.25 × height - 5 × age + 5
  // Female: BMR = 10 × weight + 6.25 × height - 5 × age - 161
  // General: BMR = 10 × weight + 6.25 × height - 5 × age - 78 (average)
  return 10 * weight + 6.25 * height - 5 * age - 78
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE) based on lifestyle
 */
export function calculateTDEE(bmr: number, lifestyle: string | null): number {
  if (!lifestyle) return bmr * 1.2 // Default to sedentary

  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.725,
  }

  const factor = activityFactors[lifestyle] || 1.2
  return bmr * factor
}

/**
 * Get weight for a specific date (use latest weight entry on or before that date)
 */
export function getWeightForDate(
  date: Date,
  weightEntries: Array<{ weight: number; date: Date | string }>
): number | null {
  // Extract YYYY-MM-DD from the UTC date to match "Pinned UTC"
  const targetDateStr = date.toISOString().split('T')[0]

  // Find the latest weight entry on or before the target date
  const relevantWeights = weightEntries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const entryDateStr = entryDate.toISOString().split('T')[0]
      return entryDateStr <= targetDateStr
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })

  return relevantWeights.length > 0 ? relevantWeights[0].weight : null
}


