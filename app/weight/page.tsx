import { getTranslations } from "next-intl/server";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { WeightForm } from "@/components/weight-form";
import { WeightChart } from "@/components/weight-chart";
import { WeightEntryList } from "@/components/weight-entry-list";
import { WeightCalendar } from "@/components/weight-calendar";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/get-session";
import { redirect } from "next/navigation";

async function getWeightData(userId: string) {
  const weights = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  return weights;
}

export default async function WeightPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const weights = await getWeightData(user.id);
  const t = await getTranslations("weight");

  // Prepare weight days for calendar
  const weightDays = weights.map((w) => ({
    date: w.date,
    weight: w.weight,
  }));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title={t("pageTitle")} />

          <div className="grid gap-6 lg:grid-cols-1">
            <div className="grid gap-6 lg:grid-cols-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                    {t("formTitle")}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-zinc-600">
                    {t("formDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WeightForm />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Second row: Weight Progress Chart */}
              {weights.length > 0 && (
                <Card className=" glass-card">
                  <CardHeader>
                    <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                      {t("progressTitle")}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-zinc-600">
                      {t("progressDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WeightChart weights={weights} />
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                    {t("historyTitle")}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-zinc-600">
                    {t("historyDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WeightCalendar weightDays={weightDays} />
                </CardContent>
              </Card>
            </div>

            {/* Third row: Weight Entry List */}
            {weights.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                    {t("allEntriesTitle")}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-zinc-600">
                    {t("allEntriesDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <WeightEntryList entries={weights} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
