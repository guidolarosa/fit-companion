"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Flame, Info } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Meta Diaria</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500 italic">
            Sin datos diarios disponibles. Registra comida para ver tu progreso.
          </div>
        </CardContent>
      </Card>
    )
  }

  const ratio = caloriesConsumed / dailyTarget
  const progress = Math.max(0, Math.min(ratio, 1.5))
  const isDeficitOrBalanced = (netCalories ?? 0) <= 0
  
  const ringColor = isDeficitOrBalanced ? "hsl(var(--secondary))" : "hsl(var(--primary))"
  const size = 120
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const visibleProgress = Math.min(progress, 1)
  const dashOffset = circumference * (1 - visibleProgress)

  return (
    <Card className="glass-card border-none group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Objetivo Diario</CardTitle>
        <Flame className="h-4 w-4 text-primary group-hover:animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex shrink-0 items-center justify-center">
            <svg width={size} height={size} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
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
                  transition: "stroke-dashoffset 1s ease-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[9px] font-heading font-bold uppercase tracking-widest text-slate-500">Consumo</div>
              <div className="text-2xl font-heading font-bold text-slate-50">
                {Math.round(caloriesConsumed)}
              </div>
              <div className="text-[9px] font-heading font-bold uppercase tracking-widest text-primary">kcal</div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Meta TDEE</span>
                <span className="font-heading font-bold text-slate-200">{Math.round(dailyTarget)} kcal</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Progreso</span>
                <span className={cn(
                  "font-bold px-2 py-0.5 rounded-full bg-white/5",
                  isDeficitOrBalanced ? "text-secondary" : "text-primary"
                )}>
                  {(ratio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-tight">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  {isDeficitOrBalanced
                    ? "Vas por buen camino, manteniéndote en tu rango objetivo."
                    : "Has superado tu objetivo estimado por actividad."}
                </span>
              </div>
              
              <div className="text-[9px] text-slate-600 uppercase tracking-tighter">
                {date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
