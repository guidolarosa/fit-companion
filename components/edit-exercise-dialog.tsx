"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { parse, format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ExerciseEntry {
  id: string
  name: string
  calories: number
  duration: number | null
  date: Date | string
}

interface EditExerciseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: ExerciseEntry | null
}

export function EditExerciseDialog({ open, onOpenChange, entry }: EditExerciseDialogProps) {
  const router = useRouter()
  const t = useTranslations("exercise")
  const tc = useTranslations("common")
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [duration, setDuration] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (entry) {
      setName(entry.name)
      setCalories(entry.calories.toString())
      setDuration(entry.duration?.toString() || "")
      const entryDate = new Date(entry.date)
      // Extract components from UTC to respect "Pinned UTC"
      const y = entryDate.getUTCFullYear()
      const m = String(entryDate.getUTCMonth() + 1).padStart(2, '0')
      const d = String(entryDate.getUTCDate()).padStart(2, '0')
      const hh = String(entryDate.getUTCHours()).padStart(2, '0')
      const mm = String(entryDate.getUTCMinutes()).padStart(2, '0')
      
      setDate(`${y}-${m}-${d}`)
      setTime(`${hh}:${mm}`)
    }
  }, [entry])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entry) return

    setIsSubmitting(true)

    try {
      // Use "Pinned UTC" strategy: store local date/time as UTC to avoid timezone shifts
      const dateTimeStr = `${date}T${time}:00.000Z`
      const response = await fetch("/api/exercise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entry.id,
          name,
          calories: parseFloat(calories),
          duration: duration ? parseInt(duration) : null,
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
      console.error("Error updating exercise entry:", error)
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
            <Label htmlFor="edit-exercise-name">{t("nameLabel")}</Label>
            <Input
              id="edit-exercise-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-calories">{t("caloriesLabel")}</Label>
            <Input
              id="edit-exercise-calories"
              type="number"
              step="0.1"
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={t("caloriesPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-duration">{t("durationLabel")}</Label>
            <Input
              id="edit-exercise-duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={t("durationPlaceholder")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label>{tc("date")}</Label>
              <DatePicker
                value={date ? parse(date, "yyyy-MM-dd", new Date()) : undefined}
                onChange={(d) => setDate(d ? format(d, "yyyy-MM-dd") : "")}
              />
            </div>
            <div className="space-y-2 min-w-0">
              <Label>{tc("time")}</Label>
              <TimePicker value={time} onChange={(t) => setTime(t)} minuteStep={1} />
            </div>
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
