"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed } from "lucide-react"
import { format } from "date-fns"

interface DailyTargetRingCardProps {
  date: Date | null
  caloriesConsumed: number | null
  dailyTarget: number | null
  netCalories: number | null
}

export function DailyTargetRingCard({
  date,
  caloriesConsumed,
  dailyTarget,
  netCalories,
}: DailyTargetRingCardProps) {
  if (!date || !caloriesConsumed || !dailyTarget || dailyTarget <= 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Target</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No daily data available yet. Track food and exercise to see this card.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Progress is how much of the target you've eaten (capped at 150% visually)
  const ratio = caloriesConsumed / dailyTarget
  const progress = Math.max(0, Math.min(ratio, 1.5))

  // Color: green if eating less than you spend (net <= 0), red otherwise
  const isDeficitOrBalanced = (netCalories ?? 0) <= 0
  const ringColor = isDeficitOrBalanced ? "#22c55e" : "#ef4444" // green or red

  // SVG ring
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const visibleProgress = Math.min(progress, 1) // 0-1 for ring fill
  const dashOffset = circumference * (1 - visibleProgress)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Target</CardTitle>
        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          {/* Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground">Consumed</div>
              <div className="text-lg font-semibold">
                {Math.round(caloriesConsumed)} kcal
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1 text-xs text-center">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Daily target</span>
              <span className="font-medium">{Math.round(dailyTarget)} kcal</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Progress</span>
              <span className={`font-medium ${isDeficitOrBalanced ? "text-green-400" : "text-red-400"}`}>
                {(ratio * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {isDeficitOrBalanced
                ? "You are at or below your daily target based on what you spent."
                : "You have eaten more than you spent today."}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {format(date, "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


