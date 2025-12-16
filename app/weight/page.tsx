import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { WeightForm } from "@/components/weight-form"
import { WeightChart } from "@/components/weight-chart"
import { WeightEntryList } from "@/components/weight-entry-list"
import { FittyButton } from "@/components/fitty-button"
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Weight Tracking</h1>
            <FittyButton />
          </div>

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
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Track your weight over time</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart weights={weights} />
              </CardContent>
            </Card>
          </div>

          {weights.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
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

