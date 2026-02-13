import { calculateBMR, calculateTDEE, getWeightForDate } from "./calories";

export interface DailyData {
  date: Date;
  caloriesConsumed: number;
  caloriesBurnt: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  bmr: number;
  tdee: number;
  weight: number | null;
  netCalories: number;
  ratioToTdee: number | null;
  hasExercise: boolean;
}

export function aggregateDailyData(
  user: any,
  exercises: any[],
  foods: any[],
  weights: any[]
): DailyData[] {
  const dailyDataMap = new Map<
    string,
    {
      caloriesConsumed: number;
      caloriesBurnt: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      date: Date;
      hasExercise: boolean;
    }
  >();

  // Aggregate exercises by day
  exercises.forEach((exercise) => {
    const dayKey = exercise.date instanceof Date 
      ? exercise.date.toISOString().split("T")[0]
      : new Date(exercise.date).toISOString().split("T")[0];
    const existing = dailyDataMap.get(dayKey);
    if (existing) {
      existing.caloriesBurnt += exercise.calories;
      existing.hasExercise = true;
    } else {
      const [y, m, d] = dayKey.split("-").map(Number);
      dailyDataMap.set(dayKey, {
        caloriesConsumed: 0,
        caloriesBurnt: exercise.calories,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        date: new Date(Date.UTC(y, m - 1, d)),
        hasExercise: true,
      });
    }
  });

  // Aggregate foods by day
  foods.forEach((food) => {
    const protein = (food as any).protein || 0;
    const carbs = (food as any).carbs || 0;
    const fat = (food as any).fat || 0;
    const fiber = (food as any).fiber || 0;
    const sugar = (food as any).sugar || 0;
    const dayKey = food.date instanceof Date
      ? food.date.toISOString().split("T")[0]
      : new Date(food.date).toISOString().split("T")[0];
    const existing = dailyDataMap.get(dayKey);
    if (existing) {
      existing.caloriesConsumed += food.calories;
      existing.protein += protein;
      existing.carbs += carbs;
      existing.fat += fat;
      existing.fiber += fiber;
      existing.sugar += sugar;
    } else {
      const [y, m, d] = dayKey.split("-").map(Number);
      dailyDataMap.set(dayKey, {
        caloriesConsumed: food.calories,
        caloriesBurnt: 0,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        date: new Date(Date.UTC(y, m - 1, d)),
        hasExercise: false,
      });
    }
  });

  // Convert to array and calculate BMR/TDEE for each day
  return Array.from(dailyDataMap.values())
    .map((day) => {
      const weight = getWeightForDate(day.date, weights);
      let bmr = 0;
      let tdee = 0;

      if (weight && user?.height && user?.age) {
        bmr = calculateBMR(weight, user.height, user.age);
        tdee = calculateTDEE(bmr, user.lifestyle);
      }

      const netCalories = day.caloriesConsumed - (tdee + day.caloriesBurnt);
      const ratioToTdee = tdee > 0 ? day.caloriesConsumed / tdee : null;

      return {
        ...day,
        bmr,
        tdee,
        weight,
        netCalories,
        ratioToTdee,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
