"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Weight } from "lucide-react"
import { format } from "date-fns"

interface WeightGaugeCardProps {
  currentWeight: number | null
  targetWeightMin: number | null
  targetWeightMax: number | null
  milestoneStep: number | null
  weightDate: Date | string | null
}

export function WeightGaugeCard({
  currentWeight,
  targetWeightMin,
  targetWeightMax,
  milestoneStep,
  weightDate,
}: WeightGaugeCardProps) {
  if (!currentWeight || !targetWeightMin || !targetWeightMax) {
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

  const rangeSpan = Math.max(0.1, targetWeightMax - targetWeightMin)
  const inRange = currentWeight >= targetWeightMin && currentWeight <= targetWeightMax
  const distance =
    currentWeight > targetWeightMax
      ? currentWeight - targetWeightMax
      : currentWeight < targetWeightMin
      ? targetWeightMin - currentWeight
      : 0

  // Progress tapers the farther from the range
  const progress = inRange
    ? 100
    : Math.max(0, Math.min(100, (rangeSpan / (rangeSpan + distance)) * 100))

  // Determine color based on progress
  const getColor = () => {
    if (progress >= 95) return "#22c55e" // green
    if (progress >= 80) return "#84cc16" // lime
    if (progress >= 60) return "#eab308" // yellow
    if (progress >= 40) return "#f97316" // orange
    return "#ef4444" // red
  }

  const color = getColor()
  const isOver = currentWeight > targetWeightMax + 0.1
  const isUnder = currentWeight < targetWeightMin - 0.1
  const nextMilestone = milestoneStep
    ? (isOver ? currentWeight - milestoneStep : currentWeight + milestoneStep)
    : null

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
        <div className="flex flex-row items-center gap-6">
          {/* Gauge */}
          <div className="relative flex shrink-0 justify-center items-center" style={{ height: "100px", width: "160px" }}>
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
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">kg</div>
            </div>
          </div>

          {/* Progress info */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Target</span>
                <span className="font-semibold text-foreground">
                  {targetWeightMin.toFixed(1)}–{targetWeightMax.toFixed(1)} kg
                </span>
              </div>
              
              {!inRange && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">To reach</span>
                  {isOver ? (
                    <span className="text-yellow-400 font-medium">
                      { (currentWeight - targetWeightMax).toFixed(1)} kg loss
                    </span>
                  ) : (
                    <span className="text-blue-400 font-medium">
                      { (targetWeightMin - currentWeight).toFixed(1)} kg gain
                    </span>
                  )}
                </div>
              )}
              
              {inRange && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-400 font-medium">✓ In range</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t space-y-1">
              {nextMilestone && (
                <div className="text-[11px] leading-tight text-muted-foreground">
                  <span className="font-medium text-foreground/80">Next milestone:</span> {isOver ? "-" : "+"}
                  {milestoneStep?.toFixed(1)} kg ({nextMilestone.toFixed(1)} kg)
                </div>
              )}
              
              {weightDate && (
                <div className="text-[10px] text-muted-foreground/60 pt-1">
                  {format(new Date(weightDate), "MMM d, yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

