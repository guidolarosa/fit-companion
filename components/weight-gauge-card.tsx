"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Weight, Target, Info } from "lucide-react"
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
  milestoneStep,
  weightDate,
}: WeightGaugeCardProps) {
  if (!currentWeight || !targetWeightMin || !targetWeightMax) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Current Weight</CardTitle>
          <Weight className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-heading font-bold text-slate-500">No data</div>
          <p className="text-xs text-slate-400 mt-2">
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

  const progress = inRange
    ? 100
    : Math.max(0, Math.min(100, (rangeSpan / (rangeSpan + distance)) * 100))

  const colorClass = inRange ? "text-secondary" : progress > 80 ? "text-yellow-400" : "text-primary"
  const strokeColor = inRange ? "hsl(var(--secondary))" : progress > 80 ? "#facc15" : "hsl(var(--primary))"

  const isOver = currentWeight > targetWeightMax + 0.1
  const nextMilestone = milestoneStep
    ? (isOver ? currentWeight - milestoneStep : currentWeight + milestoneStep)
    : null

  const radius = 60
  const centerX = 80
  const centerY = 80
  const strokeWidth = 12
  const circumference = Math.PI * radius
  const progressLength = (progress / 100) * circumference

  return (
    <Card className="glass-card border-none overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Peso Actual</CardTitle>
        <Weight className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex shrink-0 justify-center items-center" style={{ height: "100px", width: "160px" }}>
            <svg width="160" height="100" viewBox="0 0 160 100" className="overflow-visible">
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${progressLength} ${circumference + 100}`}
                strokeDashoffset={0}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <div className="text-3xl font-heading font-bold text-slate-50">{currentWeight.toFixed(1)}</div>
              <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary">kg</div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Target className="h-3 w-3" /> Meta
                </span>
                <span className="font-heading font-bold text-slate-200">
                  {targetWeightMin.toFixed(1)}–{targetWeightMax.toFixed(1)} kg
                </span>
              </div>
              
              {!inRange && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Faltan</span>
                  <span className={cn("font-bold px-2 py-0.5 rounded-full bg-white/5", colorClass)}>
                    {isOver ? `-${(currentWeight - targetWeightMax).toFixed(1)} kg` : `+${(targetWeightMin - currentWeight).toFixed(1)} kg`}
                  </span>
                </div>
              )}
              
              {inRange && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Estado</span>
                  <span className="text-secondary font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                    En meta
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              {nextMilestone && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Info className="h-3 w-3" />
                  <span>Siguiente hito: <span className="text-slate-300 font-medium">{nextMilestone.toFixed(1)} kg</span></span>
                </div>
              )}
              
              {weightDate && (
                <div className="text-[9px] text-slate-600 uppercase tracking-tighter">
                  Último registro: {new Date(weightDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
