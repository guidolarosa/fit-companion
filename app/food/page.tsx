import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { FoodForm } from "@/components/food-form"
import { FoodAgent } from "@/components/food-agent"
import { HealthyProductsList } from "@/components/healthy-products-list"
import { FoodEntryList } from "@/components/food-entry-list"
import { PageHeader } from "@/components/page-header"
import { UtensilsCrossed } from "lucide-react"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"

async function getFoodEntries(userId: string) {
  const [foods, totalCount] = await Promise.all([
    prisma.foodEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.foodEntry.count({
      where: { userId },
    }),
  ])
  return { foods, totalCount }
}

export default async function FoodPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const { foods, totalCount } = await getFoodEntries(user.id)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Food & Nutrition" />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Registrar Comida</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Registra tu consumo de alimentos y calorías</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodForm />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Sugerencias de IA</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Consulta opciones saludables con la IA</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <FoodAgent />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Lista de Productos Saludables</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Crea y exporta tu lista de compras</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthyProductsList />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Historial de Comida
                </CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">Tus registros recientes</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                {foods.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic">Aún no hay registros de comida</p>
                ) : (
                  <FoodEntryList entries={foods} showViewAll={totalCount > 5} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

