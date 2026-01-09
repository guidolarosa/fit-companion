"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
  targetWeightMin: number | null
  targetWeightMax: number | null
  milestoneStep: number | null
  sustainabilityMode: string | null
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
  const [targetWeightMin, setTargetWeightMin] = useState(user.targetWeightMin?.toString() || "")
  const [targetWeightMax, setTargetWeightMax] = useState(user.targetWeightMax?.toString() || "")
  const [milestoneStep, setMilestoneStep] = useState(user.milestoneStep?.toString() || "1")
  const [sustainabilityMode, setSustainabilityMode] = useState(user.sustainabilityMode || "sustainable")
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
          targetWeightMin: targetWeightMin ? parseFloat(targetWeightMin) : null,
          targetWeightMax: targetWeightMax ? parseFloat(targetWeightMax) : null,
          milestoneStep: milestoneStep ? parseFloat(milestoneStep) : null,
          sustainabilityMode: sustainabilityMode || null,
        }),
      })

      if (response.ok) {
        toast.success("Settings updated successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("An error occurred while updating settings")
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height in centimeters"
            className="min-w-0"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="0"
            max="150"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className="min-w-0"
          />
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="targetWeightMin">Target Weight Min (kg)</Label>
          <Input
            id="targetWeightMin"
            type="number"
            step="0.1"
            min="0"
            value={targetWeightMin}
            onChange={(e) => setTargetWeightMin(e.target.value)}
            placeholder="e.g., 62"
            className="min-w-0"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="targetWeightMax">Target Weight Max (kg)</Label>
          <Input
            id="targetWeightMax"
            type="number"
            step="0.1"
            min="0"
            value={targetWeightMax}
            onChange={(e) => setTargetWeightMax(e.target.value)}
            placeholder="e.g., 66"
            className="min-w-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="milestoneStep">Milestone Step (kg)</Label>
          <Input
            id="milestoneStep"
            type="number"
            step="0.1"
            min="0"
            value={milestoneStep}
            onChange={(e) => setMilestoneStep(e.target.value)}
            placeholder="e.g., 2"
            className="min-w-0"
          />
          <p className="text-xs text-muted-foreground">
            Next milestone delta (e.g., lose 3 kg).
          </p>
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="sustainabilityMode">Sustainability Mode</Label>
          <Select
            id="sustainabilityMode"
            value={sustainabilityMode}
            onChange={(e) => setSustainabilityMode(e.target.value)}
          >
            <option value="strict">Strict</option>
            <option value="sustainable">Sustainable</option>
          </Select>
          <p className="text-xs text-muted-foreground">
            Strict = minimal warnings. Sustainable = softer caps and nudges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="ifType">Intermittent Fasting Type</Label>
          <Select
            id="ifType"
            value={ifType}
            onChange={(e) => setIfType(e.target.value)}
            className="min-w-0"
          >
            <option value="">No IF</option>
            <option value="16:8">16:8 (16h fast, 8h eating)</option>
            <option value="18:6">18:6 (18h fast, 6h eating)</option>
            <option value="20:4">20:4 (20h fast, 4h eating)</option>
            <option value="OMAD">OMAD (23h fast, 1h eating)</option>
          </Select>
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="ifStartTime">Eating Window Start Time</Label>
          <Input
            id="ifStartTime"
            type="time"
            value={ifStartTime}
            onChange={(e) => setIfStartTime(e.target.value)}
            required={!!ifType}
            disabled={!ifType}
            className="min-w-0"
          />
          <p className="text-xs text-muted-foreground">
            When your eating window starts each day
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}

