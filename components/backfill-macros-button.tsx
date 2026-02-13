"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

export function BackfillMacrosButton() {
  const t = useTranslations("backfill")
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
          toast.success(t("successToast", { count: data.updated }))
        } else {
          toast.info(data.message || t("noEntries"))
        }
      } else {
        toast.error(data.error || t("errorFallback"))
      }
    } catch (error) {
      console.error("Backfill error:", error)
      toast.error(t("error"))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium">{t("title")}</h4>
        <p className="text-xs text-muted-foreground mt-1">
          {t("description")}
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
            {t("loading")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {t("button")}
          </>
        )}
      </Button>

      {result && (
        <div className="text-xs text-muted-foreground space-y-0.5 border rounded-md p-3 bg-muted/30">
          <p>{t("total")} <span className="font-medium text-foreground">{result.total}</span></p>
          <p>{t("updated")} <span className="font-medium text-green-500">{result.updated}</span></p>
          {result.failed > 0 && (
            <p>{t("failed")} <span className="font-medium text-destructive">{result.failed}</span></p>
          )}
        </div>
      )}
    </div>
  )
}
