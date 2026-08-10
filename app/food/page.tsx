import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { FoodForm } from "@/components/food-form"
import { HealthyProductsList } from "@/components/healthy-products-list"
import { FoodEntryList } from "@/components/food-entry-list"
import { PageHeader } from "@/components/page-header"
import { UtensilsCrossed } from "lucide-react"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { EntryListSkeleton } from "@/components/skeletons"

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

async function FoodHistorySection({ userId }: { userId: string }) {
  const { foods, totalCount } = await getFoodEntries(userId)
  const t = await getTranslations("food")

  if (foods.length === 0) {
    return <p className="text-xs text-zinc-600 italic">{t("historyEmpty")}</p>
  }

  return <FoodEntryList entries={foods} showViewAll={totalCount > 5} />
}

export default async function FoodPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const t = await getTranslations("food")

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title={t("pageTitle")} />

          <div className="grid gap-6 lg:grid-cols-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t("formTitle")}</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">{t("formDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodForm />
              </CardContent>
            </Card>

          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t("healthyProductsTitle")}</CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">{t("healthyProductsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthyProductsList />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {t("historyTitle")}
                </CardTitle>
                <CardDescription className="text-[11px] text-zinc-600">{t("historyDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <Suspense fallback={<EntryListSkeleton rows={5} />}>
                  <FoodHistorySection userId={user.id} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

