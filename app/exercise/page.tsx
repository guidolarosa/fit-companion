import { getTranslations } from "next-intl/server"
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
  const t = await getTranslations("exercise")

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
                <ExerciseForm />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 glass-card">
            <CardHeader>
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Flame className="h-3.5 w-3.5" />
                {t("historyTitle")}
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-600">{t("historyDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {exercises.length === 0 ? (
                <p className="text-xs text-zinc-600 italic">{t("historyEmpty")}</p>
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

