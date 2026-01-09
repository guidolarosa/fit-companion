"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FittyDialog } from "@/components/fitty-dialog"
import { Sparkles } from "lucide-react"

export function FittyButton() {
  const [open, setOpen] = useState(false)
  const [shortcut, setShortcut] = useState("Ctrl+K")

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Determine keyboard shortcut display based on platform (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return
    const isMac = navigator.platform.toUpperCase().includes("MAC")
    setShortcut(isMac ? "⌘K" : "Ctrl+K")
  }, [])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2 hidden sm:flex"
        size="sm"
      >
        <Sparkles className="h-4 w-4" />
        <span>Talk with Fitty</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          {shortcut}
        </kbd>
      </Button>
      <FittyDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

