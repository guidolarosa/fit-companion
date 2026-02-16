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

interface FoodEntry {
  id: string
  name: string
  calories: number
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  fiber?: number | null
  sugar?: number | null
  date: Date | string
}

interface EditFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: FoodEntry | null
}

export function EditFoodDialog({ open, onOpenChange, entry }: EditFoodDialogProps) {
  const router = useRouter()
  const t = useTranslations("food")
  const tc = useTranslations("common")
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")
  const [fiber, setFiber] = useState("")
  const [sugar, setSugar] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (entry) {
      setName(entry.name)
      setCalories(entry.calories.toString())
      setProtein(entry.protein != null ? entry.protein.toString() : "")
      setCarbs(entry.carbs != null ? entry.carbs.toString() : "")
      setFat(entry.fat != null ? entry.fat.toString() : "")
      setFiber(entry.fiber != null ? entry.fiber.toString() : "")
      setSugar(entry.sugar != null ? entry.sugar.toString() : "")
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
      const response = await fetch("/api/food", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entry.id,
          name,
          calories: parseFloat(calories),
          protein: protein ? parseFloat(protein) : null,
          carbs: carbs ? parseFloat(carbs) : null,
          fat: fat ? parseFloat(fat) : null,
          fiber: fiber ? parseFloat(fiber) : null,
          sugar: sugar ? parseFloat(sugar) : null,
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
      console.error("Error updating food entry:", error)
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
            <Label htmlFor="edit-food-name">{t("nameLabel")}</Label>
            <Input
              id="edit-food-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-food-calories">{t("caloriesLabel")}</Label>
            <Input
              id="edit-food-calories"
              type="number"
              step="0.1"
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={t("caloriesPlaceholder")}
              required
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-protein" className="text-xs">{t("proteinLabel")}</Label>
              <Input
                id="edit-protein"
                type="number"
                step="0.1"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-carbs" className="text-xs">{t("carbsLabel")}</Label>
              <Input
                id="edit-carbs"
                type="number"
                step="0.1"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-fat" className="text-xs">{t("fatLabel")}</Label>
              <Input
                id="edit-fat"
                type="number"
                step="0.1"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-fiber" className="text-xs">{t("fiberLabel")}</Label>
              <Input
                id="edit-fiber"
                type="number"
                step="0.1"
                min="0"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                placeholder="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-sugar" className="text-xs">{t("sugarLabel")}</Label>
              <Input
                id="edit-sugar"
                type="number"
                step="0.1"
                min="0"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                placeholder="0"
                className="h-9"
              />
            </div>
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
