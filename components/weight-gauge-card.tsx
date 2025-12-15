"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Weight } from "lucide-react"
import { format } from "date-fns"

interface WeightGaugeCardProps {
  currentWeight: number | null
  idealWeight: number | null
  weightDate: Date | string | null
}

export function WeightGaugeCard({ currentWeight, idealWeight, weightDate }: WeightGaugeCardProps) {
  if (!currentWeight || !idealWeight) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">No data</div>
          <p className="text-xs text-muted-foreground mt-2">
            Add your weight entry to see progress
          </p>
        </CardContent>
      </Card>
    )
  }

  const difference = currentWeight - idealWeight
  const absDifference = Math.abs(difference)
  
  // Calculate progress percentage (0-100%)
  // If at ideal weight: 100%
  // If overweight: progress decreases as weight increases
  // If underweight: progress decreases as weight decreases
  let progress = 0
  if (Math.abs(difference) < 0.1) {
    progress = 100 // At ideal weight
  } else if (difference > 0) {
    // Overweight: progress = (idealWeight / currentWeight) * 100
    progress = Math.max(0, Math.min(100, (idealWeight / currentWeight) * 100))
  } else {
    // Underweight: progress = (currentWeight / idealWeight) * 100
    progress = Math.max(0, Math.min(100, (currentWeight / idealWeight) * 100))
  }

  // Determine color based on progress
  const getColor = () => {
    if (progress >= 95) return "#22c55e" // green
    if (progress >= 80) return "#84cc16" // lime
    if (progress >= 60) return "#eab308" // yellow
    if (progress >= 40) return "#f97316" // orange
    return "#ef4444" // red
  }

  const color = getColor()
  const isOverweight = difference > 0.1
  const isUnderweight = difference < -0.1

  // SVG semicircle gauge
  const radius = 60
  const centerX = 80
  const centerY = 80
  const strokeWidth = 10
  const circumference = Math.PI * radius // Half circle circumference
  
  // Calculate the dash array for the progress
  // stroke-dasharray: [visible length, gap length]
  // For progress, we want: [progressLength, large gap so rest is invisible]
  const progressLength = (progress / 100) * circumference

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
        <Weight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Gauge */}
          <div className="flex justify-center items-center relative" style={{ height: "100px" }}>
            <svg width="160" height="100" viewBox="0 0 160 100" className="overflow-visible">
              {/* Background arc (full semicircle) */}
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Progress arc (filled portion) */}
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${progressLength} ${circumference + 100}`}
                strokeDashoffset={0}
                style={{
                  transition: "stroke-dasharray 0.5s ease-in-out",
                }}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <div className="text-2xl font-bold">{currentWeight.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">kg</div>
            </div>
          </div>

          {/* Progress info */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="text-sm text-muted-foreground">Ideal Weight:</div>
              <div className="text-sm font-semibold">{idealWeight.toFixed(1)} kg</div>
            </div>
            {absDifference > 0.1 && (
              <div className="text-xs">
                {isOverweight ? (
                  <span className="text-yellow-400">
                    {absDifference.toFixed(1)} kg to lose
                  </span>
                ) : (
                  <span className="text-blue-400">
                    {absDifference.toFixed(1)} kg to gain
                  </span>
                )}
              </div>
            )}
            {absDifference <= 0.1 && (
              <div className="text-xs text-green-400 font-medium">
                ✓ At ideal weight!
              </div>
            )}
            {weightDate && (
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(weightDate), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

