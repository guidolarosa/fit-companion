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
      date: Date;
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
        date: startOfDay(exercise.date),
      });
    }
  });

  // Aggregate foods by day
  allFoods.forEach((food) => {
    const dayKey = format(startOfDay(food.date), "yyyy-MM-dd");
    const existing = dailyDataMap.get(dayKey);
    if (existing) {
      existing.caloriesConsumed += food.calories;
    } else {
      dailyDataMap.set(dayKey, {
        caloriesConsumed: food.calories,
        caloriesBurnt: 0,
        date: startOfDay(food.date),
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

      return {
        ...day,
        bmr,
        tdee,
        netCalories: day.caloriesConsumed - (tdee + day.caloriesBurnt),
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

  return {
    latestWeight,
    user,
    bmi,
    idealWeight,
    totalCaloriesBurnt: caloriesBurnt,
    totalCaloriesConsumed: caloriesConsumed,
    netCalories: totalNetCalories,
    recentExercises,
    recentFoods,
    dailyData,
    exerciseDays,
    foodDays,
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(user.id);

  const weights = await getWeightData(user.id);

  console.log('hello')

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

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WeightGaugeCard
              currentWeight={data.latestWeight?.weight || null}
              idealWeight={data.idealWeight}
              weightDate={data.latestWeight?.date || null}
            />

            <BMICard
              bmi={data.bmi}
              currentWeight={data.latestWeight?.weight || null}
              idealWeight={data.idealWeight}
              height={data.user?.height || null}
            />

            <IFCard
              ifType={data.user?.ifType || null}
              ifStartTime={data.user?.ifStartTime || null}
            />

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

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <Card>
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

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          </div>

          <div className="mt-6 sm:mt-8">
            <DailyRegister dailyData={data.dailyData} />
          </div>

          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Exercises
                </CardTitle>
                <CardDescription>
                  Your latest exercise activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentExercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No exercises recorded yet
                  </p>
                ) : (
                  <ExerciseEntryList entries={data.recentExercises} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Recent Food Entries
                </CardTitle>
                <CardDescription>Your latest food consumption</CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentFoods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No food entries yet
                  </p>
                ) : (
                  <FoodEntryList entries={data.recentFoods} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
