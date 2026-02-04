import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { WeightForm } from "@/components/weight-form"
import { WeightChart } from "@/components/weight-chart"
import { WeightEntryList } from "@/components/weight-entry-list"
import { WeightCalendar } from "@/components/weight-calendar"
import { PageHeader } from "@/components/page-header"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"

async function getWeightData(userId: string) {
  const weights = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  })
  return weights
}

export default async function WeightPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const weights = await getWeightData(user.id)

  // Prepare weight days for calendar
  const weightDays = weights.map((w) => ({
    date: w.date,
    weight: w.weight,
  }))

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Weight Tracking" />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Registrar Peso</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Registra tu peso actual en kilogramos</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightForm />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Historial de Peso</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Días con registros de peso</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightCalendar weightDays={weightDays} />
              </CardContent>
            </Card>
          </div>

          {/* Second row: Weight Progress Chart */}
          {weights.length > 0 && (
            <Card className="mt-6 glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Progreso de Peso</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Seguimiento de tu peso a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} />
              </CardContent>
            </Card>
          )}

          {/* Third row: Weight Entry List */}
          {weights.length > 0 && (
            <Card className="mt-6 glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Todos los Registros</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Lista completa de tus registros de peso</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <WeightEntryList entries={weights} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

