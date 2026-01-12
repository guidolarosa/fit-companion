"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WeightForm() {
  const router = useRouter()
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(getLocalDateString())
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Use "Pinned UTC" strategy: store local date/time as UTC to avoid timezone shifts
      // For weight, we use midnight of the selected date
      const dateTimeStr = `${date}T00:00:00.000Z`
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: parseFloat(weight),
          date: dateTimeStr,
        }),
      })

      if (response.ok) {
        setWeight("")
        setDate(getLocalDateString())
        toast.success("Weight entry created successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to create weight entry")
      }
    } catch (error) {
      console.error("Error submitting weight:", error)
      toast.error("An error occurred while creating the weight entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
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
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Weight Entry"}
      </Button>
    </form>
  )
}

