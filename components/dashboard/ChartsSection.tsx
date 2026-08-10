import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, UtensilsCrossed } from "lucide-react";
import { ExerciseCalendar } from "@/components/exercise-calendar";
import { FoodCalendar } from "@/components/food-calendar";
import { DailyRegister } from "@/components/daily-register";
import type { DashboardData } from "@/lib/dashboard-data";

interface ChartsSectionProps {
  data: DashboardData;
}

export async function ChartsSection({ data }: ChartsSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <>
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
