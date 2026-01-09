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
        <div className="flex flex-row items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex shrink-0 items-center justify-center">
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
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Consumed</div>
              <div className="text-lg font-bold">
                {Math.round(caloriesConsumed)}
              </div>
              <div className="text-[10px] text-muted-foreground">kcal</div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Daily target</span>
                <span className="font-semibold">{Math.round(dailyTarget)} kcal</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Progress</span>
                <span className={`font-semibold ${isDeficitOrBalanced ? "text-green-400" : "text-red-400"}`}>
                  {(ratio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="pt-2 border-t text-[11px] leading-relaxed text-muted-foreground">
              {isDeficitOrBalanced
                ? "At or below daily target based on activity."
                : "Above daily target based on activity."}
            </div>
            
            <div className="text-[10px] text-muted-foreground/60">
              {format(date, "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


