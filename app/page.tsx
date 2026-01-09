import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BMICard } from "@/components/bmi-card";
import { IFCard } from "@/components/if-card";
import { WeightGaugeCard } from "@/components/weight-gauge-card";
import { DailyTargetRingCard } from "@/components/daily-target-ring-card";
import { DailyRegister } from "@/components/daily-register";
import { ExerciseEntryList } from "@/components/exercise-entry-list";
import { FoodEntryList } from "@/components/food-entry-list";
import { prisma } from "@/lib/prisma";
import { format, startOfDay } from "date-fns";
import {
  Weight,
  Flame,
  Activity,
  UtensilsCrossed,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { calculateBMR, calculateTDEE, getWeightForDate } from "@/lib/calories";
import { getCurrentUser } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { WeightChart } from "@/components/weight-chart";
import { FittyButton } from "@/components/fitty-button";
import { ExerciseCalendar } from "@/components/exercise-calendar";
import { FoodCalendar } from "@/components/food-calendar";

async function getWeightData(userId: string) {
  const weights = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  return weights;
}

async function getDashboardData(userId: string) {
  const latestWeight = await prisma.weightEntry.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const totalCaloriesBurnt = await prisma.exercise.aggregate({
    where: { userId },
    _sum: { calories: true },
  });

  const totalCaloriesConsumed = await prisma.foodEntry.aggregate({
    where: { userId },
    _sum: { calories: true },
  });

  const recentExercises = await prisma.exercise.findMany({
    where: { userId },
    take: 5,
    orderBy: { date: "desc" },
  });

  const recentFoods = await prisma.foodEntry.findMany({
    where: { userId },
    take: 5,
    orderBy: { date: "desc" },
  });

  // Get all exercises and foods for daily aggregation
  const allExercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  const allFoods = await prisma.foodEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  const allWeights = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

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
  const dailyDataMap = new Map<
    string,
    {
      caloriesConsumed: number;
      caloriesBurnt: number;
      protein: number;
      date: Date;
      hasExercise: boolean;
    }
  >();

  // Aggregate exercises by day
  allExercises.forEach((exercise) => {
    const dayKey = format(startOfDay(exercise.date), "yyyy-MM-dd");
    const existing = dailyDataMap.get(dayKey);
    if (existing) {
      existing.caloriesBurnt += exercise.calories;
    } else {
      dailyDataMap.set(dayKey, {
        caloriesConsumed: 0,
        caloriesBurnt: exercise.calories,
        protein: 0,
        date: startOfDay(exercise.date),
        hasExercise: true,
      });
    }
  });

  // Aggregate foods by day
  allFoods.forEach((food) => {
    const protein = (food as any).protein || 0;
    const dayKey = format(startOfDay(food.date), "yyyy-MM-dd");
    const existing = dailyDataMap.get(dayKey);
    if (existing) {
      existing.caloriesConsumed += food.calories;
      existing.protein += protein;
    } else {
      dailyDataMap.set(dayKey, {
        caloriesConsumed: food.calories,
        caloriesBurnt: 0,
        protein,
        date: startOfDay(food.date),
        hasExercise: false,
      });
    }
  });

  // Convert to array and calculate BMR/TDEE for each day
  const dailyData = Array.from(dailyDataMap.values())
    .map((day) => {
      const weight = getWeightForDate(day.date, allWeights);
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
        netCalories,
        ratioToTdee,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
    .slice(0, 30); // Last 30 days

  // Calculate total net calories from all registered days
  const totalNetCalories = dailyData.reduce((sum, day) => {
    const totalBurnt = day.tdee + day.caloriesBurnt;
    const netCalories = day.caloriesConsumed - totalBurnt;
    return sum + netCalories;
  }, 0);

  // Group exercises by day for calendar
  const exerciseDaysMap = new Map<string, number>();
  allExercises.forEach((exercise) => {
    const dayKey = format(startOfDay(exercise.date), "yyyy-MM-dd");
    const existing = exerciseDaysMap.get(dayKey);
    if (existing) {
      exerciseDaysMap.set(dayKey, existing + exercise.calories);
    } else {
      exerciseDaysMap.set(dayKey, exercise.calories);
    }
  });

  const exerciseDays = Array.from(exerciseDaysMap.entries()).map(([dateKey, calories]) => {
    // Parse date string (yyyy-MM-dd) as local date to avoid timezone issues
    const [year, month, day] = dateKey.split("-").map(Number);
    return {
      date: new Date(year, month - 1, day),
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
  if (today?.ratioToTdee !== null && today.ratioToTdee < aggressiveThreshold) {
    warnings.push(
      "Today's intake is very low versus TDEE. Long-term consistency matters more than speed."
    );
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
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(user.id);

  const weights = await getWeightData(user.id);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <FittyButton />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <WeightGaugeCard
              currentWeight={data.latestWeight?.weight || null}
              targetWeightMin={data.targetWeightMin}
              targetWeightMax={data.targetWeightMax}
              milestoneStep={data.milestoneStep}
              weightDate={data.latestWeight?.date || null}
            />

            <IFCard
              ifType={data.user?.ifType || null}
              ifStartTime={data.user?.ifStartTime || null}
            />

            {/* BMI Card - Hidden on mobile (per SPEC-V2 de-emphasis) */}
            <div className="hidden sm:block">
              <BMICard
                bmi={data.bmi}
                currentWeight={data.latestWeight?.weight || null}
                height={data.user?.height || null}
                targetWeightMin={data.targetWeightMin}
                targetWeightMax={data.targetWeightMax}
                milestoneStep={data.milestoneStep}
              />
            </div>

            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calories Burnt</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.totalCaloriesBurnt)} kcal
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card> */}
          </div>

          <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              className={
                data.netCalories < 0
                  ? "border-green-500/50 bg-green-500/5"
                  : data.netCalories > 0
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-yellow-500/50 bg-yellow-500/5"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Calories
                </CardTitle>
                {data.netCalories < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-400" />
                ) : data.netCalories > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-400" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <div
                      className={`text-2xl font-bold ${
                        data.netCalories < 0
                          ? "text-green-400"
                          : data.netCalories > 0
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {data.netCalories > 0 ? "+" : ""}
                      {Math.round(data.netCalories)} kcal
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Days:</span>
                      <span className="font-medium">
                        {data.dailyData.length} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Consumed:
                      </span>
                      <span className="font-medium">
                        {Math.round(data.totalCaloriesConsumed)} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Burnt:
                      </span>
                      <span className="font-medium">
                        {Math.round(data.totalCaloriesBurnt)} kcal
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {data.netCalories < 0
                      ? "Calorie deficit - Great for weight loss!"
                      : data.netCalories > 0
                      ? "Calorie surplus"
                      : "Perfectly balanced"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <DailyTargetRingCard
              date={data.dailyData[0]?.date ?? null}
              caloriesConsumed={data.dailyData[0]?.caloriesConsumed ?? null}
              dailyTarget={data.dailyData[0]?.tdee ?? null}
              netCalories={data.dailyData[0]?.netCalories ?? null}
            />
            {/* Trend Insights - Hidden on mobile */}
            <Card className="hidden sm:block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trend Insights</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg deficit (7d)</span>
                  <span className="font-semibold">
                    {data.trendInsights.avgDeficit !== null
                      ? `${Math.round(data.trendInsights.avgDeficit)} kcal/day`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg intake (7d)</span>
                  <span className="font-semibold">
                    {data.trendInsights.avgIntake !== null
                      ? `${Math.round(data.trendInsights.avgIntake)} kcal/day`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected pace</span>
                  <span className="font-semibold">
                    {data.trendInsights.projectedKgPerWeek === null
                      ? "—"
                      : data.trendInsights.projectedKgPerWeek < 0
                      ? `${Math.abs(data.trendInsights.projectedKgPerWeek).toFixed(2)} kg/week loss`
                      : `${data.trendInsights.projectedKgPerWeek.toFixed(2)} kg/week gain`}
                  </span>
                </div>
                {data.warnings.length > 0 && (
                  <div className="mt-2 rounded-md bg-amber-500/10 border border-amber-500/40 p-2 text-xs text-amber-500">
                    {data.warnings.map((w, idx) => (
                      <p key={idx}>• {w}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Weight Progress - Hidden on mobile, full width */}
            <Card className="hidden sm:block sm:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-1">
                <CardTitle className="text-sm font-medium">
                  <span>Weight Progress</span>
                </CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} chartHeight={200} />
              </CardContent>
            </Card>
          </div>

          {/* Calendars and Quality - Hidden on mobile */}
          <div className="mt-6 hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Exercise Calendar
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ExerciseCalendar exerciseDays={data.exerciseDays} />
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Food Calendar
                </CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <FoodCalendar foodDays={data.foodDays} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deficit Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Training days (7d)</span>
                  <span className="font-semibold">{data.qualityInsights.trainingDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deficit on training days</span>
                  <span className="font-semibold">
                    {data.qualityInsights.trainingDeficitDays}/{data.qualityInsights.trainingDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protein tracked days</span>
                  <span className="font-semibold">
                    {data.qualityInsights.proteinTrackedDays}/7
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High-protein days ({">="}25%)</span>
                  <span className="font-semibold">
                    {data.qualityInsights.highProteinDays}/7
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Balanced fueling on training days supports sustainable progress.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Register - Hidden on mobile */}
          <div className="mt-6 sm:mt-8 hidden sm:block">
            <DailyRegister dailyData={data.dailyData} />
          </div>

          {/* Recent entries - Simplified on mobile */}
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Recent Exercises
                </CardTitle>
                <CardDescription className="hidden sm:block">
                  Your latest exercise activities
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                {data.recentExercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No exercises recorded yet
                  </p>
                ) : (
                  <ExerciseEntryList entries={data.recentExercises.slice(0, 3)} />
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                  Recent Food Entries
                </CardTitle>
                <CardDescription className="hidden sm:block">Your latest food consumption</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                {data.recentFoods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No food entries yet
                  </p>
                ) : (
                  <FoodEntryList entries={data.recentFoods.slice(0, 3)} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
