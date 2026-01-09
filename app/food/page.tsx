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
            <Card>
              <CardHeader>
                <CardTitle>Add Food Entry</CardTitle>
                <CardDescription>Record your food consumption and calories</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Food Suggestions</CardTitle>
                <CardDescription>Ask AI about healthy food options</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodAgent />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Healthy Products List</CardTitle>
                <CardDescription>Create and export your shopping list</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthyProductsList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Food History
                </CardTitle>
                <CardDescription>Your recorded food entries and calories consumed</CardDescription>
              </CardHeader>
              <CardContent>
                {foods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No food entries yet</p>
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

