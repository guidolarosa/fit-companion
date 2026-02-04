"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Weight, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
  weightDate,
}: WeightGaugeCardProps) {
  // Empty state with clear CTA per guidelines
  if (!currentWeight || !targetWeightMin || !targetWeightMax) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            Peso Actual
          </CardTitle>
          <Weight className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[120px] text-center">
          <div className="w-10 h-10 mb-2 rounded-full bg-white/5 flex items-center justify-center">
            <Weight className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Sin registros de peso
          </p>
          <Link href="/weight">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Registrar peso
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const rangeSpan = Math.max(0.1, targetWeightMax - targetWeightMin)
  const inRange = currentWeight >= targetWeightMin && currentWeight <= targetWeightMax
  const isAboveTarget = currentWeight > targetWeightMax
  const isBelowTarget = currentWeight < targetWeightMin
  
  const distance = isAboveTarget
    ? currentWeight - targetWeightMax
    : isBelowTarget
    ? targetWeightMin - currentWeight
    : 0

  const progress = inRange
    ? 100
    : Math.max(0, Math.min(100, (rangeSpan / (rangeSpan + distance)) * 100))

  // Color based on weight state per guidelines
  const strokeColor = inRange 
    ? "hsl(var(--color-deficit))" // Green for in range
    : "hsl(var(--color-surplus))" // Orange for out of range

  const radius = 55
  const centerX = 80
  const centerY = 80
  const strokeWidth = 7
  const circumference = Math.PI * radius
  const progressLength = (progress / 100) * circumference

  // Status text for accessibility
  const statusText = inRange 
    ? "En rango objetivo" 
    : isAboveTarget 
    ? `${distance.toFixed(1)} kg sobre el objetivo`
    : `${distance.toFixed(1)} kg bajo el objetivo`

  // Format date for display
  const formattedDate = weightDate 
    ? new Date(weightDate).toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        timeZone: 'UTC'
      })
    : null

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Peso Actual
        </CardTitle>
        <Weight className={cn(
          "h-3.5 w-3.5 transition-colors",
          inRange ? "text-deficit" : "text-zinc-600"
        )} />
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 flex-1 flex items-center">
        <div className="flex items-center gap-4 w-full">
          {/* Gauge visualization - properly sized */}
          <div 
            className="relative flex shrink-0 justify-center items-end"
            style={{ width: '100px', height: '60px' }}
            role="status"
            aria-label={`Peso actual: ${currentWeight.toFixed(1)} kilogramos. ${statusText}. Meta: ${targetWeightMin.toFixed(1)} a ${targetWeightMax.toFixed(1)} kilogramos.`}
          >
            <svg 
              width="120" 
              height="80" 
              viewBox="0 0 100 55"
              className="overflow-visible"
              aria-hidden="true"
            >
              {/* Background arc - semicircle */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke={strokeColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 126} 126`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            {/* Center value display */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" aria-hidden="true">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {currentWeight.toFixed(1)}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 mt-0.5">
                kg
              </span>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1.5 text-[11px] uppercase font-bold tracking-tight">
              <div className="flex justify-between text-zinc-500">
                <span>Meta</span>
                <span className="text-zinc-300">
                  {targetWeightMin.toFixed(1)}–{targetWeightMax.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estado</span>
                {inRange ? (
                  <span className="text-deficit flex items-center gap-1">
                    En rango
                  </span>
                ) : isAboveTarget ? (
                  <span className="text-surplus flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {distance.toFixed(1)} kg
                  </span>
                ) : (
                  <span className="text-maintenance flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {distance.toFixed(1)} kg
                  </span>
                )}
              </div>
              {formattedDate && (
                <div className="flex justify-between text-zinc-500">
                  <span>Último</span>
                  <span className="text-zinc-400 normal-case">{formattedDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
