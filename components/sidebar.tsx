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
  LogOut
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
    <div className="hidden lg:flex h-screen w-64 flex-col border-r border-white/[0.05] bg-background">
      <div className="flex h-16 items-center px-6 mb-4">
        <h1 className="text-xl font-heading font-bold tracking-tight text-white">
          Fit<span className="text-primary">Companion</span>
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-white/[0.05] text-primary"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.05]">
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] h-9 text-xs"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
