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

          {/* Top row: Add Weight Entry + Weight History Calendar */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Weight Entry</CardTitle>
                <CardDescription>Record your current weight in kilograms</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>Days with weight entries</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightCalendar weightDays={weightDays} />
              </CardContent>
            </Card>
          </div>

          {/* Second row: Weight Progress Chart */}
          {weights.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Track your weight over time</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} />
              </CardContent>
            </Card>
          )}

          {/* Third row: Weight Entry List */}
          {weights.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>All Entries</CardTitle>
                <CardDescription>All your recorded weight entries</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightEntryList entries={weights} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

