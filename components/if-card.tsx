"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Utensils, Coffee, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface IFCardProps {
  ifType: string | null
  ifStartTime: string | null
}

interface IFConfig {
  fastHours: number
  eatHours: number
  label: string
}

const IF_TYPES: Record<string, IFConfig> = {
  "16:8": { fastHours: 16, eatHours: 8, label: "16:8" },
  "18:6": { fastHours: 18, eatHours: 6, label: "18:6" },
  "20:4": { fastHours: 20, eatHours: 4, label: "20:4" },
  OMAD: { fastHours: 23, eatHours: 1, label: "OMAD" },
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return { hours, minutes }
}

function getCurrentStatus(ifType: string | null, ifStartTime: string | null) {
  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) return null

  const config = IF_TYPES[ifType]
  const now = new Date()
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes()
  const { hours: startHours, minutes: startMinutes } = parseTime(ifStartTime)
  const startTotalMinutes = startHours * 60 + startMinutes

  let minutesSinceStart = (currentTotalMinutes - startTotalMinutes + 1440) % 1440
  const isEating = minutesSinceStart < config.eatHours * 60
  
  let remaining = isEating 
    ? (config.eatHours * 60) - minutesSinceStart
    : (1440 - minutesSinceStart)

  // Calculate progress percentage
  const totalPhaseMinutes = isEating ? config.eatHours * 60 : config.fastHours * 60
  const elapsedInPhase = isEating 
    ? minutesSinceStart 
    : minutesSinceStart - (config.eatHours * 60)
  const progress = Math.min(100, (elapsedInPhase / totalPhaseMinutes) * 100)

  return { isEating, remaining, config, progress }
}

export function IFCard({ ifType, ifStartTime }: IFCardProps) {
  const [status, setStatus] = useState(getCurrentStatus(ifType, ifStartTime))

  useEffect(() => {
    // Update immediately on mount
    setStatus(getCurrentStatus(ifType, ifStartTime))
    
    // Then update every minute
    const interval = setInterval(() => setStatus(getCurrentStatus(ifType, ifStartTime)), 60000)
    return () => clearInterval(interval)
  }, [ifType, ifStartTime])

  // Empty state with clear CTA per guidelines
  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            Ayuno Intermitente
          </CardTitle>
          <Clock className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[120px] text-center">
          <div className="w-10 h-10 mb-2 rounded-full bg-white/5 flex items-center justify-center">
            <Clock className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Configura tu horario de ayuno
          </p>
          <Link href="/settings">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Configurar
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const { isEating, remaining, config, progress } = status!
  const h = Math.floor(remaining / 60)
  const m = remaining % 60

  // Status text for accessibility
  const statusText = isEating 
    ? `Ventana de comida activa. ${h} horas y ${m} minutos restantes.`
    : `Período de ayuno activo. ${h} horas y ${m} minutos restantes.`

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Ayuno Intermitente
        </CardTitle>
        <Clock className={cn(
          "h-3.5 w-3.5 transition-colors",
          isEating ? "text-deficit" : "text-surplus"
        )} />
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 flex-1 flex flex-col justify-between">
        {/* Status indicator with accessibility */}
        <div 
          className="flex items-center gap-3"
          role="status"
          aria-label={statusText}
        >
          <div className={cn(
            "p-2 rounded-lg transition-colors shrink-0",
            isEating ? "bg-deficit/10" : "bg-surplus/10"
          )}>
            {isEating ? (
              <Utensils className="h-4 w-4 text-deficit" aria-hidden="true" />
            ) : (
              <Coffee className="h-4 w-4 text-surplus" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className={cn(
              "text-sm font-bold leading-tight",
              isEating ? "text-deficit" : "text-white"
            )}>
              {isEating ? "Ventana de comida" : "Ayunando"}
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
              Faltan {h}h {m}m
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="my-3">
          <div 
            className="relative h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isEating ? "bg-deficit" : "bg-surplus"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Details - compact */}
        <div className="space-y-1 text-[10px] font-bold uppercase tracking-tight text-zinc-500">
          <div className="flex justify-between">
            <span>Protocolo</span>
            <span className="text-surplus">{ifType}</span>
          </div>
          <div className="flex justify-between">
            <span>Ventana</span>
            <span className="text-zinc-300">{ifStartTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
