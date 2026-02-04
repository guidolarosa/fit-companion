"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Weight, 
  Dumbbell, 
  UtensilsCrossed, 
  MessageSquare, 
  Settings,
  FileText,
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Weight", href: "/weight", icon: Weight },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Food", href: "/food", icon: UtensilsCrossed },
  { name: "Assistant", href: "/agent", icon: MessageSquare },
  { name: "Report", href: "/report", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="flex h-20 items-center px-6">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tighter uppercase italic">
          Fit Companion
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-primary")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
