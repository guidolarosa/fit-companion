"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

export function BackfillMacrosButton() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{
    total: number
    updated: number
    failed: number
  } | null>(null)

  async function handleBackfill() {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/backfill-macros", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          total: data.total || 0,
          updated: data.updated || 0,
          failed: data.failed || 0,
        })
        if (data.updated > 0) {
          toast.success(`Estimated macros for ${data.updated} entries`)
        } else {
          toast.info(data.message || "No entries to update")
        }
      } else {
        toast.error(data.error || "Failed to backfill macros")
      }
    } catch (error) {
      console.error("Backfill error:", error)
      toast.error("An error occurred during backfill")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium">Backfill Nutritional Data</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Use AI to estimate protein, carbs, fat, fiber, and sugar for all food entries that are missing this data. 
          This uses the food name and calorie count to generate estimates.
        </p>
      </div>

      <Button
        onClick={handleBackfill}
        disabled={isRunning}
        variant="outline"
        className="gap-2"
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Estimating macros...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Backfill Macros with AI
          </>
        )}
      </Button>

      {result && (
        <div className="text-xs text-muted-foreground space-y-0.5 border rounded-md p-3 bg-muted/30">
          <p>Total entries processed: <span className="font-medium text-foreground">{result.total}</span></p>
          <p>Successfully updated: <span className="font-medium text-green-500">{result.updated}</span></p>
          {result.failed > 0 && (
            <p>Failed: <span className="font-medium text-destructive">{result.failed}</span></p>
          )}
        </div>
      )}
    </div>
  )
}
