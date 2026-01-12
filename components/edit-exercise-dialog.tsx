"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
        toast.success("Exercise entry updated successfully!")
        onOpenChange(false)
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update exercise entry")
      }
    } catch (error) {
      console.error("Error updating exercise entry:", error)
      toast.error("An error occurred while updating the exercise entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise Entry</DialogTitle>
          <DialogDescription>
            Update your exercise entry information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-name">Exercise Name</Label>
            <Input
              id="edit-exercise-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Running, Cycling, Swimming"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-calories">Calories Burnt</Label>
            <Input
              id="edit-exercise-calories"
              type="number"
              step="0.1"
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories burnt"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-duration">Duration (minutes, optional)</Label>
            <Input
              id="edit-exercise-duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in minutes"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="edit-exercise-date">Date</Label>
              <Input
                id="edit-exercise-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="min-w-0"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <Label htmlFor="edit-exercise-time">Time</Label>
              <Input
                id="edit-exercise-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="min-w-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

