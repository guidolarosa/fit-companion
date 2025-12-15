"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ExerciseForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [duration, setDuration] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dateTime = new Date(`${date}T${time}`)
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          calories: parseFloat(calories),
          duration: duration ? parseInt(duration) : null,
          date: dateTime.toISOString(),
        }),
      })

      if (response.ok) {
        setName("")
        setCalories("")
        setDuration("")
        setDate(new Date().toISOString().split("T")[0])
        setTime(new Date().toTimeString().slice(0, 5))
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Running, Cycling, Swimming"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="calories">Calories Burnt</Label>
        <Input
          id="calories"
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
        <Label htmlFor="duration">Duration (minutes, optional)</Label>
        <Input
          id="duration"
          type="number"
          min="0"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter duration in minutes"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="min-w-0"
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="min-w-0"
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Exercise"}
      </Button>
    </form>
  )
}

