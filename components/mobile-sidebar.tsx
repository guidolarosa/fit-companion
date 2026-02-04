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
  Menu,
  X,
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

export function MobileSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 right-4 z-50 glass-card rounded-full h-12 w-12 shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-[280px] flex-col bg-slate-900 z-40 transform transition-transform duration-300 ease-out border-r border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center border-b border-white/5 px-6">
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tighter uppercase italic">
            Fit Companion
          </h1>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:bg-white/5"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-red-400 rounded-xl h-12"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
