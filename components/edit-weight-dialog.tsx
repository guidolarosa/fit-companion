"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface EditWeightDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: WeightEntry | null
}

export function EditWeightDialog({ open, onOpenChange, entry }: EditWeightDialogProps) {
  const router = useRouter()
  const t = useTranslations("weight")
  const tc = useTranslations("common")
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (entry) {
      setWeight(entry.weight.toString())
      const entryDate = new Date(entry.date)
      // Extract components from UTC to respect "Pinned UTC"
      const y = entryDate.getUTCFullYear()
      const m = String(entryDate.getUTCMonth() + 1).padStart(2, '0')
      const d = String(entryDate.getUTCDate()).padStart(2, '0')
      setDate(`${y}-${m}-${d}`)
    }
  }, [entry])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entry) return

    setIsSubmitting(true)

    try {
      // Use "Pinned UTC" strategy: store local date/time as UTC to avoid timezone shifts
      const dateTimeStr = `${date}T00:00:00.000Z`
      const response = await fetch("/api/weight", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entry.id,
          weight: parseFloat(weight),
          date: dateTimeStr,
        }),
      })

      if (response.ok) {
        toast.success(t("updatedSuccess"))
        onOpenChange(false)
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("updateFailedFallback"))
      }
    } catch (error) {
      console.error("Error updating weight entry:", error)
      toast.error(t("updateError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("editDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-weight">{t("weightLabel")}</Label>
            <Input
              id="edit-weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={t("weightPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">{tc("date")}</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? tc("updating") : tc("updateEntry")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
