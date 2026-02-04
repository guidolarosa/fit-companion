"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyTargetRingCardProps {
  date: Date | null
  caloriesConsumed: number | null
  dailyTarget: number | null
  netCalories: number | null
}

export function DailyTargetRingCard({
  caloriesConsumed,
  dailyTarget,
  netCalories,
}: DailyTargetRingCardProps) {
  if (!caloriesConsumed || !dailyTarget || dailyTarget <= 0) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Consumo Hoy</CardTitle>
          <Flame className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[120px]">
          <div className="text-xs text-zinc-600 italic">Sin registros</div>
        </CardContent>
      </Card>
    )
  }

  const ratio = caloriesConsumed / dailyTarget
  const progress = Math.max(0, Math.min(ratio, 1))
  const ringColor = (netCalories ?? 0) <= 0 ? "rgb(34 197 94)" : "hsl(var(--primary))"
  
  const size = 90
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Consumo Hoy</CardTitle>
        <Flame className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-0 flex grow">
        <div className="flex items-center gap-6 grow">
          <div className="relative flex shrink-0 items-center justify-center h-[90px] w-[90px]">
            <svg width={size} height={size}>
              <circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} />
              <circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke={ringColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="square" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s ease-out" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-white tracking-tight">{Math.round(caloriesConsumed)}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">kcal</div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-tight text-zinc-500">
              <div className="flex justify-between">
                <span>Meta TDEE</span>
                <span className="text-zinc-300">{Math.round(dailyTarget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Progreso</span>
                <span className={cn("font-bold", ratio > 1 ? "text-primary" : "text-green-500")}>
                  {(ratio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
