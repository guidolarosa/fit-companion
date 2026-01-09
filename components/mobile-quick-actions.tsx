"use client"

import Link from "next/link"
import { useState } from "react"
import { Weight, Activity, UtensilsCrossed, Sparkles } from "lucide-react"
import { FittyDialog } from "@/components/fitty-dialog"

export function MobileQuickActions() {
  const [fittyOpen, setFittyOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-6 sm:hidden">
        <Link
          href="/weight"
          className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card border hover:bg-muted transition-colors"
        >
          <Weight className="h-5 w-5 text-blue-500" />
          <span className="text-xs font-medium">Weight</span>
        </Link>
        <Link
          href="/exercise"
          className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card border hover:bg-muted transition-colors"
        >
          <Activity className="h-5 w-5 text-green-500" />
          <span className="text-xs font-medium">Exercise</span>
        </Link>
        <Link
          href="/food"
          className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card border hover:bg-muted transition-colors"
        >
          <UtensilsCrossed className="h-5 w-5 text-orange-500" />
          <span className="text-xs font-medium">Food</span>
        </Link>
        <button
          onClick={() => setFittyOpen(true)}
          className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card border hover:bg-muted transition-colors"
        >
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-xs font-medium">Fitty</span>
        </button>
      </div>
      <FittyDialog open={fittyOpen} onOpenChange={setFittyOpen} />
    </>
  )
}
