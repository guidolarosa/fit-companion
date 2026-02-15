import { WeeklyProgressCard } from "@/components/weekly-progress-card";
import { WeeklyCaloriesChart } from "@/components/weekly-calories-chart";
import { WaterCard } from "@/components/water-card";
import type { DashboardData } from "@/lib/dashboard-data";

interface WeeklyOverviewProps {
  weekDayData: DashboardData["weekDayData"];
  waterTargetGlasses: DashboardData["waterTargetGlasses"];
}

export function WeeklyOverview({ weekDayData, waterTargetGlasses }: WeeklyOverviewProps) {
  return (
    <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
      <WeeklyProgressCard weekData={weekDayData} />
      <WeeklyCaloriesChart weekData={weekDayData} />
      <WaterCard targetGlasses={waterTargetGlasses} />
    </div>
  );
}
