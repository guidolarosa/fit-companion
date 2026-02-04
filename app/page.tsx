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
              className={cn(
                "glass-card border-none transition-all duration-300",
                data.netCalories < 0
                  ? "shadow-green-500/10"
                  : data.netCalories > 0
                  ? "shadow-red-500/10"
                  : "shadow-yellow-500/10"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">
                  Calorías Netas
                </CardTitle>
                {data.netCalories < 0 ? (
                  <TrendingDown className="h-4 w-4 text-secondary" />
                ) : data.netCalories > 0 ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <div
                      className={cn(
                        "text-3xl font-heading font-bold",
                        data.netCalories < 0
                          ? "text-secondary"
                          : data.netCalories > 0
                          ? "text-primary"
                          : "text-yellow-400"
                      )}
                    >
                      {data.netCalories > 0 ? "+" : ""}
                      {Math.round(data.netCalories)} 
                      <span className="text-xs uppercase ml-1">kcal</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 uppercase font-heading text-[10px] tracking-wider">Días Registrados</span>
                      <span className="font-bold text-slate-200">
                        {data.dailyData.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 uppercase font-heading text-[10px] tracking-wider">Consumo Total</span>
                      <span className="font-bold text-slate-200">
                        {Math.round(data.totalCaloriesConsumed)} <span className="text-[10px] text-slate-500">kcal</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 uppercase font-heading text-[10px] tracking-wider">Gasto Total</span>
                      <span className="font-bold text-slate-200">
                        {Math.round(data.totalCaloriesBurnt)} <span className="text-[10px] text-slate-500">kcal</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic px-1">
                    {data.netCalories < 0
                      ? "¡Déficit calórico detectado! Excelente para perder peso."
                      : data.netCalories > 0
                      ? "Superávit calórico detectado."
                      : "Balance perfecto."}
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
            <Card className="hidden sm:block glass-card border-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Insights de Tendencia</CardTitle>
                <TrendingDown className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-4 text-sm pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Déficit Prom. (7d)</span>
                    <span className="font-bold text-slate-200">
                      {data.trendInsights.avgDeficit !== null
                        ? `${Math.round(data.trendInsights.avgDeficit)} kcal/día`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Consumo Prom. (7d)</span>
                    <span className="font-bold text-slate-200">
                      {data.trendInsights.avgIntake !== null
                        ? `${Math.round(data.trendInsights.avgIntake)} kcal/día`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Ritmo Proyectado</span>
                    <span className={cn(
                      "font-bold",
                      data.trendInsights.projectedKgPerWeek === null ? "text-slate-200" :
                      data.trendInsights.projectedKgPerWeek < 0 ? "text-secondary" : "text-primary"
                    )}>
                      {data.trendInsights.projectedKgPerWeek === null
                        ? "—"
                        : data.trendInsights.projectedKgPerWeek < 0
                        ? `${Math.abs(data.trendInsights.projectedKgPerWeek).toFixed(2)} kg/semana`
                        : `${data.trendInsights.projectedKgPerWeek.toFixed(2)} kg/semana`}
                    </span>
                  </div>
                </div>
                {data.warnings.length > 0 && (
                  <div className="mt-2 rounded-xl bg-primary/10 border border-primary/20 p-3 text-[11px] text-primary flex gap-2 items-start">
                    <Info className="h-4 w-4 shrink-0" />
                    <div className="space-y-1">
                      {data.warnings.map((w, idx) => (
                        <p key={idx}>{w}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Weight Progress - Hidden on mobile, full width */}
            <Card className="hidden sm:block sm:col-span-2 lg:col-span-3 glass-card border-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-1">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">
                  Progreso de Peso
                </CardTitle>
                <Weight className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} chartHeight={200} />
              </CardContent>
            </Card>
          </div>

          {/* Calendars and Quality - Hidden on mobile */}
          <div className="mt-6 hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1 glass-card border-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">
                  Calendario de Ejercicio
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <ExerciseCalendar exerciseDays={data.exerciseDays} />
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1 glass-card border-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">
                  Calendario de Comida
                </CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <FoodCalendar foodDays={data.foodDays} />
              </CardContent>
            </Card>
            <Card className="glass-card border-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Calidad del Déficit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Días de Entrenamiento (7d)</span>
                    <span className="font-bold text-slate-200">{data.qualityInsights.trainingDays}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Déficit en Entrenamiento</span>
                    <span className="font-bold text-slate-200">
                      {data.qualityInsights.trainingDeficitDays}/{data.qualityInsights.trainingDays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Proteína Registrada</span>
                    <span className="font-bold text-slate-200">
                      {data.qualityInsights.proteinTrackedDays}/7
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-slate-400 font-heading text-[10px] uppercase tracking-wider">Días Alta Proteína ({">="}25%)</span>
                    <span className="font-bold text-slate-200">
                      {data.qualityInsights.highProteinDays}/7
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-tight bg-white/5 p-2 rounded-lg">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>Una nutrición balanceada en días de entrenamiento apoya el progreso sostenible.</span>
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
