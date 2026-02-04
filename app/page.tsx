import { PageHeader } from "@/components/page-header";
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
import {
  Weight,
  Activity,
  UtensilsCrossed,
  TrendingDown,
  TrendingUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileQuickActions } from "@/components/mobile-quick-actions";
import { aggregateDailyData } from "@/lib/daily-data";
import { getCurrentUser } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { WeightChart } from "@/components/weight-chart";
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
          <PageHeader 
            title="Dashboard" 
            description="Tu resumen diario de progreso y actividad" 
          />

          {/* Mobile Quick Actions */}
          <MobileQuickActions />

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <div className="h-[180px]">
              <WeightGaugeCard
                currentWeight={data.latestWeight?.weight || null}
                targetWeightMin={data.targetWeightMin}
                targetWeightMax={data.targetWeightMax}
                milestoneStep={data.milestoneStep}
                weightDate={data.latestWeight?.date || null}
              />
            </div>

            <div className="h-[180px]">
              <IFCard
                ifType={data.user?.ifType || null}
                ifStartTime={data.user?.ifStartTime || null}
              />
            </div>

            <div className="h-[180px] hidden sm:block">
              <BMICard
                bmi={data.bmi}
                currentWeight={data.latestWeight?.weight || null}
                height={data.user?.height || null}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-[180px]">
              <Card className="glass-card h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                    Calorías Netas
                  </CardTitle>
                  {data.netCalories < 0 ? (
                    <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                  ) : data.netCalories > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <div
                      className={cn(
                        "text-2xl font-bold tracking-tight",
                        data.netCalories < 0
                          ? "text-green-500"
                          : data.netCalories > 0
                          ? "text-primary"
                          : "text-zinc-500"
                      )}
                    >
                      {data.netCalories > 0 ? "+" : ""}
                      {Math.round(data.netCalories)} 
                      <span className="text-[10px] uppercase font-bold ml-1 opacity-50 tracking-widest">kcal</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-tight text-zinc-500 font-bold">
                    <div className="flex flex-col">
                      <span>Días</span>
                      <span className="text-zinc-300">{data.dailyData.length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Cons.</span>
                      <span className="text-zinc-300">{Math.round(data.totalCaloriesConsumed)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Gasto</span>
                      <span className="text-zinc-300">{Math.round(data.totalCaloriesBurnt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[180px]">
              <DailyTargetRingCard
                date={data.dailyData[0]?.date ?? null}
                caloriesConsumed={data.dailyData[0]?.caloriesConsumed ?? null}
                dailyTarget={data.dailyData[0]?.tdee ?? null}
                netCalories={data.dailyData[0]?.netCalories ?? null}
              />
            </div>

            <div className="h-[180px] hidden sm:block">
              <Card className="glass-card h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Tendencia</CardTitle>
                  <TrendingDown className="h-3.5 w-3.5 text-zinc-600" />
                </CardHeader>
                <CardContent className="pt-2 space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500 font-bold uppercase tracking-tight">Déficit (7d)</span>
                    <span className="text-zinc-300 font-bold">
                      {data.trendInsights.avgDeficit !== null
                        ? `${Math.round(data.trendInsights.avgDeficit)} kcal`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500 font-bold uppercase tracking-tight">Ritmo</span>
                    <span className={cn(
                      "font-bold",
                      data.trendInsights.projectedKgPerWeek === null ? "text-zinc-300" :
                      data.trendInsights.projectedKgPerWeek < 0 ? "text-green-500" : "text-primary"
                    )}>
                      {data.trendInsights.projectedKgPerWeek === null
                        ? "—"
                        : `${Math.abs(data.trendInsights.projectedKgPerWeek).toFixed(2)} kg/sem`}
                    </span>
                  </div>
                  {data.warnings.length > 0 && (
                    <div className="mt-1 flex gap-1.5 items-start text-[10px] text-primary/80 font-bold uppercase tracking-tight leading-tight">
                      <Info className="h-3 w-3 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{data.warnings[0]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Weight Progress - Hidden on mobile, full width */}
            <Card className="hidden sm:block sm:col-span-2 lg:col-span-3 glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-1">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Progreso de Peso
                </CardTitle>
                <Weight className="h-3.5 w-3.5 text-zinc-600" />
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} chartHeight={200} />
              </CardContent>
            </Card>
          </div>

          {/* Calendars and Quality - Hidden on mobile */}
          <div className="mt-6 hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1 glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Calendario Ejercicio
                </CardTitle>
                <Activity className="h-3.5 w-3.5 text-zinc-600" />
              </CardHeader>
              <CardContent>
                <ExerciseCalendar exerciseDays={data.exerciseDays} />
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1 glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Calendario Comida
                </CardTitle>
                <UtensilsCrossed className="h-3.5 w-3.5 text-zinc-600" />
              </CardHeader>
              <CardContent>
                <FoodCalendar foodDays={data.foodDays} />
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Calidad Déficit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Días Entrenamiento</span>
                    <span className="text-zinc-300 font-medium">{data.qualityInsights.trainingDays}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Déficit en Entren.</span>
                    <span className="text-zinc-300 font-medium">
                      {data.qualityInsights.trainingDeficitDays}/{data.qualityInsights.trainingDays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Proteína Ok</span>
                    <span className="text-zinc-300 font-medium">
                      {data.qualityInsights.proteinTrackedDays}/7
                    </span>
                  </div>
                </div>
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
