import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AgentChat } from "@/components/agent/AgentChat"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"

export default async function AgentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 flex flex-col min-h-0">
        <AgentChat />
      </main>
    </div>
  )
}
