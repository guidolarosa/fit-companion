import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AgentChat } from "@/components/agent/AgentChat"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import Aurora from "@/components/aurora"

export default async function AgentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 flex flex-col min-h-0 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-50">
          <Aurora />
        </div>
        <div className="z-10 relative h-full w-full">
          <AgentChat />
        </div>
      </main>
    </div>
  )
}
