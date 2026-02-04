"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
  // Empty state with clear CTA per guidelines
  if (!caloriesConsumed || !dailyTarget || dailyTarget <= 0) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            Consumo Hoy
          </CardTitle>
          <Flame className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[120px] text-center">
          <div className="w-10 h-10 mb-2 rounded-full bg-white/5 flex items-center justify-center">
            <Flame className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Sin registros hoy
          </p>
          <Link href="/food">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Registrar comida
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const ratio = caloriesConsumed / dailyTarget
  const progress = Math.max(0, Math.min(ratio, 1))
  const isDeficit = (netCalories ?? 0) <= 0
  const isAlmostThere = ratio >= 0.9 && ratio < 1
  const isExceeded = ratio > 1
  
  // Color based on caloric state per guidelines
  const ringColor = isDeficit ? "hsl(var(--color-deficit))" : "hsl(var(--color-surplus))"

  // Calculate remaining calories for feedback
  const remaining = dailyTarget - caloriesConsumed
  const remainingText = remaining > 0 
    ? `${Math.round(remaining)} kcal restantes`
    : `${Math.round(Math.abs(remaining))} kcal sobre`

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Consumo Hoy
        </CardTitle>
        <Flame className={cn(
          "h-3.5 w-3.5 transition-colors",
          isAlmostThere ? "text-yellow-500" : "text-zinc-600"
        )} />
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 flex-1 flex items-center">
        <div className="flex items-center gap-4 w-full">
          {/* Progress Ring - Apple Watch style */}
          <div 
            className="relative flex shrink-0 items-center justify-center"
            style={{ width: '80px', height: '80px' }}
            role="progressbar"
            aria-valuenow={caloriesConsumed}
            aria-valuemin={0}
            aria-valuemax={dailyTarget}
            aria-label={`${caloriesConsumed} de ${dailyTarget} calorías consumidas hoy. ${remainingText}`}
          >
            <svg 
              width="80" 
              height="80"
              className={cn(isDeficit && progress >= 1 && "animate-pulse-glow")}
            >
              {/* Background track */}
              <circle 
                cx="40" 
                cy="40" 
                r="34" 
                fill="transparent" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="5" 
              />
              {/* Progress ring */}
              <circle 
                cx="40" 
                cy="40" 
                r="34" 
                fill="transparent" 
                stroke={ringColor} 
                strokeWidth="5" 
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress)}`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ 
                  transform: "rotate(-90deg)", 
                  transformOrigin: "50% 50%",
                }} 
              />
            </svg>
            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
              <span className="text-lg font-bold text-white tracking-tight leading-none">
                {Math.round(caloriesConsumed).toLocaleString()}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 mt-0.5">
                kcal
              </span>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-tight text-zinc-500">
              <div className="flex justify-between">
                <span>Meta TDEE</span>
                <span className="text-zinc-300">{Math.round(dailyTarget).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Progreso</span>
                <span className={cn(
                  "font-bold",
                  isExceeded ? "text-surplus" : "text-deficit"
                )}>
                  {(ratio * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>{remaining > 0 ? "Restante" : "Exceso"}</span>
                <span className={cn(
                  "font-bold",
                  remaining > 0 ? "text-zinc-300" : "text-surplus"
                )}>
                  {Math.round(Math.abs(remaining)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
