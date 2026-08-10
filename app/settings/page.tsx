import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { SettingsForm } from "@/components/settings-form"
import { BackfillMacrosButton } from "@/components/backfill-macros-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SettingsFormSkeleton } from "@/components/skeletons"

async function SettingsFormSection({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <SettingsForm user={{
      ...user,
      targetWeightMin: (user as any).targetWeightMin ?? null,
      targetWeightMax: (user as any).targetWeightMax ?? null,
      milestoneStep: (user as any).milestoneStep ?? null,
      sustainabilityMode: (user as any).sustainabilityMode ?? null,
    }} />
  )
}

export default async function SettingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const t = await getTranslations("settings")

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader title={t("title")} showFittyButton={false} />

          <Card>
            <CardHeader>
              <CardTitle>{t("profileTitle")}</CardTitle>
              <CardDescription>
                {t("profileDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SettingsFormSkeleton />}>
                <SettingsFormSection userId={currentUser.id} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("dataToolsTitle")}</CardTitle>
              <CardDescription>
                {t("dataToolsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BackfillMacrosButton />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

