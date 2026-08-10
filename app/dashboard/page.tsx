import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { MobileQuickActions } from "@/components/mobile-quick-actions";
import { getCurrentUser } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { getDashboardData, getWeightData } from "@/lib/dashboard-data";
import { WidgetGrid } from "@/components/dashboard/WidgetGrid";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { WeightChartSection } from "@/components/dashboard/WeightChartSection";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { normalizeDashboardLayout } from "@/lib/dashboard-layout";
import { DashboardWidgetsSkeleton, WeightChartSkeleton } from "@/components/skeletons";

async function DashboardMainSection({ userId }: { userId: string }) {
  const data = await getDashboardData(userId);

  return (
    <>
      <WidgetGrid data={data} initialLayout={normalizeDashboardLayout(data.user?.dashboardLayout)} />

      <Suspense fallback={<WeightChartSkeleton />}>
        <DashboardWeightChartSection userId={userId} />
      </Suspense>

      <ChartsSection data={data} />

      <RecentEntries
        recentExercises={data.recentExercises}
        recentFoods={data.recentFoods}
      />
    </>
  );
}

async function DashboardWeightChartSection({ userId }: { userId: string }) {
  const weights = await getWeightData(userId);
  return <WeightChartSection weights={weights} />;
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

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

          <Suspense fallback={<DashboardWidgetsSkeleton />}>
            <DashboardMainSection userId={user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
