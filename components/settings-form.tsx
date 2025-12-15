"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface User {
  id: string
  name: string | null
  height: number | null
  age: number | null
  lifestyle: string | null
  ifType: string | null
  ifStartTime: string | null
}

interface SettingsFormProps {
  user: User
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(user.name || "")
  const [height, setHeight] = useState(user.height?.toString() || "")
  const [age, setAge] = useState(user.age?.toString() || "")
  const [lifestyle, setLifestyle] = useState(user.lifestyle || "")
  const [ifType, setIfType] = useState(user.ifType || "")
  const [ifStartTime, setIfStartTime] = useState(user.ifStartTime || "08:00")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name || null,
          height: height ? parseFloat(height) : null,
          age: age ? parseInt(age) : null,
          lifestyle: lifestyle || null,
          ifType: ifType || null,
          ifStartTime: ifType ? ifStartTime : null,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          step="0.1"
          min="0"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter your height in centimeters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="0"
          max="150"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lifestyle">Lifestyle</Label>
        <Select
          id="lifestyle"
          value={lifestyle}
          onChange={(e) => setLifestyle(e.target.value)}
        >
          <option value="">Select lifestyle</option>
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="moderate">Moderate (light exercise 1-3 days/week)</option>
          <option value="active">Active (moderate to intense exercise 3+ days/week)</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ifType">Intermittent Fasting Type</Label>
        <Select
          id="ifType"
          value={ifType}
          onChange={(e) => setIfType(e.target.value)}
        >
          <option value="">No IF</option>
          <option value="16:8">16:8 (16h fast, 8h eating)</option>
          <option value="18:6">18:6 (18h fast, 6h eating)</option>
          <option value="20:4">20:4 (20h fast, 4h eating)</option>
          <option value="OMAD">OMAD (23h fast, 1h eating)</option>
        </Select>
      </div>

      {ifType && (
        <div className="space-y-2 min-w-0">
          <Label htmlFor="ifStartTime">Eating Window Start Time</Label>
          <Input
            id="ifStartTime"
            type="time"
            value={ifStartTime}
            onChange={(e) => setIfStartTime(e.target.value)}
            required={!!ifType}
            className="min-w-0"
          />
          <p className="text-xs text-muted-foreground">
            When your eating window starts each day
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}

