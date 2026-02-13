"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"
import { 
  LayoutDashboard, 
  Weight, 
  Dumbbell, 
  UtensilsCrossed, 
  MessageSquare, 
  Settings,
  FileText,
  FlaskConical,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "weight", href: "/weight", icon: Weight },
  { key: "exercise", href: "/exercise", icon: Dumbbell },
  { key: "food", href: "/food", icon: UtensilsCrossed },
  { key: "assistant", href: "/agent", icon: MessageSquare },
  { key: "lab", href: "/lab", icon: FlaskConical },
  { key: "report", href: "/report", icon: FileText },
  { key: "settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("nav")
  const tc = useTranslations("common")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed") === "true"
    setIsCollapsed(stored)
    setHasMounted(true)
  }, [])

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

  // Before mount, render at collapsed width + invisible to prevent any flash
  const mounted = hasMounted

  return (
    <div 
      className={cn(
        "hidden lg:flex h-screen flex-col border-r border-white/[0.05] bg-background relative",
        mounted ? "transition-all duration-300 ease-in-out opacity-100" : "opacity-0 w-16",
        mounted && (isCollapsed ? "w-16" : "w-64")
      )}
    >
      <div className={cn(
        "flex h-16 items-center px-4 mb-4",
        isCollapsed ? "justify-center" : "px-6"
      )}>
        {isCollapsed ? (
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg italic">{tc("brandLetter")}</span>
          </div>
        ) : (
          <h1 className="text-xl font-heading font-bold tracking-tight text-white whitespace-nowrap">
            {tc("brandFit")}<span className="text-primary">{tc("brandCompanion")}</span>
          </h1>
        )}
      </div>
      
      <nav className={cn(
        "flex-1 space-y-1",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const label = t(item.key)
          return (
            <Link
              key={item.key}
              href={item.href}
              title={isCollapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-md transition-colors",
                isCollapsed ? "justify-center h-10 w-full px-0" : "gap-3 px-3 py-2 text-sm",
                isActive
                  ? "bg-white/[0.05] text-primary"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="lg:text-[14px] font-medium">{label}</span>}
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
          title={isCollapsed ? t("logout") : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="ml-2">{t("logout")}</span>}
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
