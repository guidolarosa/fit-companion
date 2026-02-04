"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Weight } from "lucide-react"
import { cn } from "@/lib/utils"

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
}: WeightGaugeCardProps) {
  if (!currentWeight || !targetWeightMin || !targetWeightMax) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Peso Actual</CardTitle>
          <Weight className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[120px]">
          <div className="text-xl font-bold text-zinc-600">Sin datos</div>
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

  const progress = inRange
    ? 100
    : Math.max(0, Math.min(100, (rangeSpan / (rangeSpan + distance)) * 100))

  const strokeColor = inRange ? "rgb(34 197 94)" : "hsl(var(--primary))"

  const radius = 55
  const centerX = 80
  const centerY = 80
  const strokeWidth = 7
  const circumference = Math.PI * radius
  const progressLength = (progress / 100) * circumference

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Peso Actual</CardTitle>
        <Weight className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-6">
          <div className="relative flex shrink-0 justify-center items-center h-[100px] w-[130px]">
            <svg width="300" height="110" viewBox="0 0 160 100" className="overflow-visible">
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={strokeWidth}
                strokeLinecap="square"
              />
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="square"
                strokeDasharray={`${progressLength} ${circumference + 100}`}
                strokeDashoffset={0}
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <div className="text-2xl font-bold text-white tracking-tight">{currentWeight.toFixed(1)}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">kg</div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="space-y-1.5 text-[11px] uppercase font-bold tracking-tight">
              <div className="flex justify-between text-zinc-500">
                <span>Meta</span>
                <span className="text-zinc-300">{targetWeightMin.toFixed(1)}–{targetWeightMax.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estado</span>
                {inRange ? (
                  <span className="text-green-500">Ok</span>
                ) : (
                  <span className="text-primary">{distance.toFixed(1)} kg</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
