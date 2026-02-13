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
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const pageSize = 15;

  const [dbUser, allExercises, allFoods, allWeights] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.exercise.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    prisma.foodEntry.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    prisma.weightEntry.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
  ]);

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
            title="Registro Completo"
            description="Historial detallado de consumo, gasto energético y metabolismo."
            showBackButton
          />

          <Card className="mt-8 glass-card border-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading uppercase tracking-wider text-slate-400">
                <Calendar className="h-5 w-5 text-primary" />
                Historial de Actividad
              </CardTitle>
              <CardDescription className="text-slate-500">
                Mostrando {paginatedData.length} registros de {totalEntries} en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllDailyRegisterTable
                dailyData={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
              />
              
              <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-heading font-bold uppercase tracking-widest text-slate-500 border-t border-white/5 pt-6">
                <p><strong className="text-slate-400">BMR:</strong> Metabolismo Basal (en reposo)</p>
                <p><strong className="text-slate-400">TDEE:</strong> Gasto Total (BMR × actividad)</p>
                <p><strong className="text-slate-400">NETO:</strong> Consumo - (TDEE + Ejercicio)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
