import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeightLossAgent } from "@/components/weight-loss-agent"
import { MessageSquare } from "lucide-react"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"

export default async function AgentPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Fitty Assistant</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ask Your Questions
              </CardTitle>
              <CardDescription>
                Get personalized advice about weight loss, nutrition, exercise, and healthy living
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeightLossAgent />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

