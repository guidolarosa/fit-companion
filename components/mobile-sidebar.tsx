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
        className="lg:hidden fixed top-4 right-4 z-50 bg-zinc-900 border border-white/[0.05] rounded-md h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-[260px] flex-col bg-zinc-950 z-40 transform transition-transform duration-300 ease-in-out border-r border-white/[0.05]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-white/[0.05]">
          <h1 className="text-xl font-heading font-bold tracking-tight text-white">
            Fit<span className="text-primary">Companion</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.05] text-primary"
                    : "text-zinc-500 hover:text-zinc-200"
                )}
                onClick={() => setIsOpen(false)}
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
            className="w-full justify-start text-zinc-500 hover:text-zinc-200 h-10 text-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  )
}
