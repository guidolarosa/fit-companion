import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Weight, Activity, UtensilsCrossed } from "lucide-react";
import { WeightChart } from "@/components/weight-chart";
import { ExerciseCalendar } from "@/components/exercise-calendar";
import { FoodCalendar } from "@/components/food-calendar";
import { DailyRegister } from "@/components/daily-register";
import type { DashboardData, WeightData } from "@/lib/dashboard-data";

interface ChartsSectionProps {
  data: DashboardData;
  weights: WeightData;
}

export async function ChartsSection({ data, weights }: ChartsSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <>
      <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Weight Progress - Hidden on mobile, full width */}
        <Card className="hidden sm:block sm:col-span-2 lg:col-span-3 glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-1">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              {t("weightProgress")}
            </CardTitle>
            <Weight className="h-3.5 w-3.5 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <WeightChart weights={weights} chartHeight={200} />
          </CardContent>
        </Card>
      </div>

      {/* Calendars and Quality - Hidden on mobile */}
      <div className="mt-6 hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="md:col-span-2 lg:col-span-1 glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              {t("exerciseCalendar")}
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
              {t("foodCalendar")}
            </CardTitle>
            <UtensilsCrossed className="h-3.5 w-3.5 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <FoodCalendar foodDays={data.foodDays} />
          </CardContent>
        </Card>
      </div>

      {/* Daily Register - Hidden on mobile */}
      <div className="mt-6 sm:mt-8 hidden sm:block">
        <DailyRegister dailyData={data.dailyData} />
      </div>
    </>
  );
}
