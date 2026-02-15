import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { MobileQuickActions } from "@/components/mobile-quick-actions";
import { getCurrentUser } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { getDashboardData, getWeightData } from "@/lib/dashboard-data";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { WeeklyOverview } from "@/components/dashboard/WeeklyOverview";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { RecentEntries } from "@/components/dashboard/RecentEntries";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [data, weights] = await Promise.all([
    getDashboardData(user.id),
    getWeightData(user.id),
  ]);

  const t = await getTranslations("dashboard");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader 
            title={t("title")} 
            description={t("description")} 
          />

          {/* Mobile Quick Actions */}
          <MobileQuickActions />

          <MetricsGrid data={data} />

          {/* Weekly overview + Water */}
          <WeeklyOverview
            weekDayData={data.weekDayData}
            waterTargetGlasses={data.waterTargetGlasses}
          />

          <ChartsSection data={data} weights={weights} />

          {/* Recent entries */}
          <RecentEntries
            recentExercises={data.recentExercises}
            recentFoods={data.recentFoods}
          />
        </div>
      </main>
    </div>
  );
}
