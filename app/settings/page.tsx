import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { SettingsForm } from "@/components/settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader title="Settings" showFittyButton={false} />

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Configure your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm user={{
                ...user,
                targetWeightMin: (user as any).targetWeightMin ?? null,
                targetWeightMax: (user as any).targetWeightMax ?? null,
                milestoneStep: (user as any).milestoneStep ?? null,
                sustainabilityMode: (user as any).sustainabilityMode ?? null,
              }} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

