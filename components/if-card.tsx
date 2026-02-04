"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Utensils, Coffee } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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

  return { isEating, remaining, config }
}

export function IFCard({ ifType, ifStartTime }: IFCardProps) {
  const [status, setStatus] = useState(getCurrentStatus(ifType, ifStartTime))

  useEffect(() => {
    const interval = setInterval(() => setStatus(getCurrentStatus(ifType, ifStartTime)), 60000)
    return () => clearInterval(interval)
  }, [ifType, ifStartTime])

  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Ayuno</CardTitle>
          <Clock className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[120px]">
          <div className="text-xs text-zinc-600 italic">Configura tu horario</div>
        </CardContent>
      </Card>
    )
  }

  const { isEating, remaining, config } = status!
  const h = Math.floor(remaining / 60)
  const m = remaining % 60

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Ayuno Intermitente</CardTitle>
        <Clock className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-md", isEating ? "bg-green-500/10" : "bg-primary/10")}>
            {isEating ? <Utensils className="h-4 w-4 text-green-500" /> : <Coffee className="h-4 w-4 text-primary" />}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{isEating ? "Ventana de comida" : "Ayunando"}</div>
            <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">Faltan {h}h {m}m</div>
          </div>
        </div>
        
        <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-tight text-zinc-500">
          <div className="flex justify-between">
            <span>Tipo</span>
            <span className="text-primary">{ifType}</span>
          </div>
          <div className="flex justify-between">
            <span>Inicio</span>
            <span className="text-zinc-300">{ifStartTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
