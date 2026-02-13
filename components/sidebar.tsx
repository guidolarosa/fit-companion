"use client"

import { useState, useEffect } from "react"
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
  ChevronLeft,
  ChevronRight,
  PanelLeft
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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  function toggleCollapsed() {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem("sidebar-collapsed", String(next))
  }

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <div 
      className={cn(
        "hidden lg:flex h-screen flex-col border-r border-white/[0.05] bg-background transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex h-16 items-center px-4 mb-4",
        isCollapsed ? "justify-center" : "px-6"
      )}>
        {isCollapsed ? (
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg italic">F</span>
          </div>
        ) : (
          <h1 className="text-xl font-heading font-bold tracking-tight text-white whitespace-nowrap">
            Fit<span className="text-primary">Companion</span>
          </h1>
        )}
      </div>
      
      <nav className={cn(
        "flex-1 space-y-1",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center rounded-md transition-colors",
                isCollapsed ? "justify-center h-10 w-full px-0" : "gap-3 px-3 py-2 text-sm",
                isActive
                  ? "bg-white/[0.05] text-primary"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="lg:text-[14px] font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        "p-4 border-t border-white/[0.05]",
        isCollapsed ? "px-2 flex justify-center" : ""
      )}>
        <Button
          variant="ghost"
          className={cn(
            "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] transition-colors",
            isCollapsed ? "h-10 w-10 p-0 rounded-md" : "w-full justify-start h-9 text-xs"
          )}
          onClick={handleLogout}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-20 bg-background border border-white/[0.05] rounded-full p-1 text-zinc-500 hover:text-white transition-all shadow-xl z-50 hover:bg-white/[0.05]"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
