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
        toast.success("Weight entry updated successfully!")
        onOpenChange(false)
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update weight entry")
      }
    } catch (error) {
      console.error("Error updating weight entry:", error)
      toast.error("An error occurred while updating the weight entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Weight Entry</DialogTitle>
          <DialogDescription>
            Update your weight entry information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-weight">Weight (kg)</Label>
            <Input
              id="edit-weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
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

