"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Utensils, Coffee } from "lucide-react"
import { useEffect, useState } from "react"

interface IFCardProps {
  ifType: string | null
  ifStartTime: string | null
}

interface IFConfig {
  fastHours: number
  eatHours: number
  label: string
}

const IF_TYPES: Record<string, IFConfig> = {
  "16:8": { fastHours: 16, eatHours: 8, label: "16:8" },
  "18:6": { fastHours: 18, eatHours: 6, label: "18:6" },
  "20:4": { fastHours: 20, eatHours: 4, label: "20:4" },
  OMAD: { fastHours: 23, eatHours: 1, label: "OMAD" },
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return { hours, minutes }
}

function getCurrentStatus(ifType: string | null, ifStartTime: string | null) {
  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return null
  }

  const config = IF_TYPES[ifType]
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  const currentTotalMinutes = currentHours * 60 + currentMinutes

  const { hours: startHours, minutes: startMinutes } = parseTime(ifStartTime)
  const startTotalMinutes = startHours * 60 + startMinutes

  // Calculate time since start of eating window (in minutes)
  let minutesSinceStart = currentTotalMinutes - startTotalMinutes
  if (minutesSinceStart < 0) {
    minutesSinceStart += 24 * 60 // Add a full day if negative
  }

  // Calculate where we are in the 24-hour cycle
  const cycleMinutes = minutesSinceStart % (24 * 60)
  const isEating = cycleMinutes < config.eatHours * 60

  // Calculate remaining time
  let remainingMinutes = 0
  let statusText = ""
  let statusIcon = null

  if (isEating) {
    remainingMinutes = config.eatHours * 60 - cycleMinutes
    const hours = Math.floor(remainingMinutes / 60)
    const mins = remainingMinutes % 60
    statusText = `Eating window - ${hours}h ${mins}m remaining`
    statusIcon = <Utensils className="h-4 w-4 text-green-400" />
  } else {
    const fastStart = config.eatHours * 60
    const fastProgress = cycleMinutes - fastStart
    remainingMinutes = config.fastHours * 60 - fastProgress
    const hours = Math.floor(remainingMinutes / 60)
    const mins = remainingMinutes % 60
    statusText = `Fasting - ${hours}h ${mins}m remaining`
    statusIcon = <Coffee className="h-4 w-4 text-yellow-400" />
  }

  // Calculate progress percentage for the 24-hour cycle
  const cycleProgress = (cycleMinutes / (24 * 60)) * 100

  return {
    isEating,
    remainingMinutes,
    statusText,
    statusIcon,
    cycleProgress,
    config,
  }
}

export function IFCard({ ifType, ifStartTime }: IFCardProps) {
  const [status, setStatus] = useState(getCurrentStatus(ifType, ifStartTime))
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setStatus(getCurrentStatus(ifType, ifStartTime))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [ifType, ifStartTime])

  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Intermittent Fasting</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Configure your IF schedule in Settings
          </div>
        </CardContent>
      </Card>
    )
  }

  const config = IF_TYPES[ifType]

  // Create data for the 24-hour cycle visualization
  const { hours: startHours, minutes: startMinutes } = parseTime(ifStartTime)
  const startTotalMinutes = startHours * 60 + startMinutes
  const eatingWindowEnd = config.eatHours * 60

  const cycleData = Array.from({ length: 24 }, (_, hour) => {
    // Calculate the start minute of this hour (0-1439)
    const hourStartMinutes = hour * 60
    // Calculate where this hour falls in the IF cycle (relative to start time)
    const cycleStart = (hourStartMinutes - startTotalMinutes + 24 * 60) % (24 * 60)
    const cycleEnd = cycleStart + 60 // One hour later

    // Check if this hour overlaps with the eating window
    // Eating window is from 0 to eatingWindowEnd minutes in the cycle
    const isInEatingWindow = (cycleStart < eatingWindowEnd) || 
                            (cycleEnd > 0 && cycleStart < eatingWindowEnd) ||
                            (cycleStart >= 24 * 60 - 60 && cycleEnd <= eatingWindowEnd)

    return {
      hour,
      isEating: cycleStart < eatingWindowEnd,
    }
  })

  const currentHour = currentTime.getHours()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Intermittent Fasting</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {status?.statusIcon}
              <span className="text-sm font-medium">{status?.statusText}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {ifType} - Eating window: {config.eatHours}h, Fasting: {config.fastHours}h
            </div>
          </div>

          {/* 24-hour cycle visualization */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground mb-1">24-Hour Cycle</div>
            <div className="relative h-8 w-full rounded-lg overflow-hidden border">
              {cycleData.map((data, index) => (
                <div
                  key={index}
                  className={`absolute h-full ${
                    data.isEating ? "bg-green-500/30" : "bg-yellow-500/30"
                  }`}
                  style={{
                    left: `${(index / 24) * 100}%`,
                    width: `${(1 / 24) * 100}%`,
                  }}
                />
              ))}
              {/* Current time indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                style={{
                  left: `${(currentHour / 24) * 100}%`,
                }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12 AM</span>
              <span>12 PM</span>
              <span>12 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

