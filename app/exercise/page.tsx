import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { ExerciseForm } from "@/components/exercise-form"
import { ExerciseAgent } from "@/components/exercise-agent"
import { ExerciseEntryList } from "@/components/exercise-entry-list"
import { PageHeader } from "@/components/page-header"
import { Flame } from "lucide-react"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"

async function getExercises(userId: string) {
  const [exercises, totalCount] = await Promise.all([
    prisma.exercise.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.exercise.count({
      where: { userId },
    }),
  ])
  return { exercises, totalCount }
}

export default async function ExercisePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const { exercises, totalCount } = await getExercises(user.id)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Exercise & Calorie Burn" />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Add Exercise</CardTitle>
                <CardDescription>Record your exercise and calories burnt</CardDescription>
              </CardHeader>
              <CardContent>
                <ExerciseForm />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Exercise Suggestions</CardTitle>
                <CardDescription>Ask AI for exercise recommendations</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <ExerciseAgent />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Exercise History
              </CardTitle>
              <CardDescription>Your recorded exercises and calories burnt</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {exercises.length === 0 ? (
                <p className="text-sm text-muted-foreground">No exercises recorded yet</p>
              ) : (
                <ExerciseEntryList entries={exercises} showViewAll={totalCount > 10} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

