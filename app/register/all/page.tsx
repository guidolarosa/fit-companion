import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { aggregateDailyData } from "@/lib/daily-data";
import { AllDailyRegisterTable } from "@/components/all-daily-register-table";

export default async function AllDailyRegisterPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 15;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const allExercises = await prisma.exercise.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  const allFoods = await prisma.foodEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  const allWeights = await prisma.weightEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });

  const allDailyData = aggregateDailyData(dbUser, allExercises, allFoods, allWeights);
  
  const totalEntries = allDailyData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  
  const paginatedData = allDailyData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Full Daily Register"
            description="Complete history of your calorie tracking, BMR, and TDEE."
            showBackOnMobile={true}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Register History
              </CardTitle>
              <CardDescription>
                Viewing {paginatedData.length} entries of {totalEntries} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllDailyRegisterTable
                dailyData={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
              />
              
              <div className="mt-8 text-sm text-muted-foreground space-y-2 border-t pt-4">
                <p>
                  <strong>BMR:</strong> Basal Metabolic Rate (calories burned at rest)
                </p>
                <p>
                  <strong>TDEE:</strong> Total Daily Energy Expenditure (BMR × activity factor)
                </p>
                <p>
                  <strong>Net:</strong> Consumed - (TDEE + Exercise calories)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
