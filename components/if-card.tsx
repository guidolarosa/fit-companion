"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Utensils, Coffee, Info } from "lucide-react"
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
  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return null
  }

  const config = IF_TYPES[ifType]
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  const currentTotalMinutes = currentHours * 60 + currentMinutes

  const { hours: startHours, minutes: startMinutes } = parseTime(ifStartTime)
  const startTotalMinutes = startHours * 60 + startMinutes

  let minutesSinceStart = currentTotalMinutes - startTotalMinutes
  if (minutesSinceStart < 0) {
    minutesSinceStart += 24 * 60
  }

  const cycleMinutes = minutesSinceStart % (24 * 60)
  const isEating = cycleMinutes < config.eatHours * 60

  let remainingMinutes = 0
  let statusText = ""
  let statusIcon = null

  if (isEating) {
    remainingMinutes = config.eatHours * 60 - cycleMinutes
    const hours = Math.floor(remainingMinutes / 60)
    const mins = remainingMinutes % 60
    statusText = `Ventana de alimentación - ${hours}h ${mins}m restantes`
    statusIcon = <Utensils className="h-4 w-4 text-secondary" />
  } else {
    const fastStart = config.eatHours * 60
    const fastProgress = cycleMinutes - fastStart
    remainingMinutes = config.fastHours * 60 - fastProgress
    const hours = Math.floor(remainingMinutes / 60)
    const mins = remainingMinutes % 60
    statusText = `Ayuno - ${hours}h ${mins}m restantes`
    statusIcon = <Coffee className="h-4 w-4 text-primary" />
  }

  const cycleProgress = (cycleMinutes / (24 * 60)) * 100

  return {
    isEating,
    remainingMinutes,
    statusText,
    statusIcon,
    cycleProgress,
    config,
  }
}

export function IFCard({ ifType, ifStartTime }: IFCardProps) {
  const [status, setStatus] = useState(getCurrentStatus(ifType, ifStartTime))
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setStatus(getCurrentStatus(ifType, ifStartTime))
    }, 60000)

    return () => clearInterval(interval)
  }, [ifType, ifStartTime])

  if (!ifType || !ifStartTime || !IF_TYPES[ifType]) {
    return (
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Ayuno Intermitente</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500">
            Configura tu horario de ayuno en Ajustes
          </div>
        </CardContent>
      </Card>
    )
  }

  const config = IF_TYPES[ifType]
  const { hours: startHours, minutes: startMinutes } = parseTime(ifStartTime)
  const startTotalMinutes = startHours * 60 + startMinutes
  const eatingWindowEnd = config.eatHours * 60

  const cycleData = Array.from({ length: 24 }, (_, hour) => {
    const hourStartMinutes = hour * 60
    const cycleStart = (hourStartMinutes - startTotalMinutes + 24 * 60) % (24 * 60)
    return {
      hour,
      isEating: cycleStart < eatingWindowEnd,
    }
  })

  const currentHour = currentTime.getHours()

  return (
    <Card className="glass-card border-none group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">Ayuno Intermitente</CardTitle>
        <Clock className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                status?.isEating ? "bg-secondary/10" : "bg-primary/10"
              )}>
                {status?.statusIcon}
              </div>
              <span className="text-sm font-heading font-bold text-slate-100">{status?.statusText}</span>
            </div>
            <div className="text-[10px] font-heading text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-primary font-bold">{ifType}</span> 
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              Alimentación: {config.eatHours}h 
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              Ayuno: {config.fastHours}h
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading font-bold uppercase tracking-tighter text-slate-500">Ciclo 24 Horas</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-secondary/40" />
                  <span className="text-[9px] text-slate-600">COMER</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                  <span className="text-[9px] text-slate-600">AYUNAR</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-10 w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1">
              <div className="relative w-full h-full flex gap-0.5">
                {cycleData.map((data, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 h-full rounded-sm transition-all duration-500",
                      data.isEating ? "bg-secondary/30" : "bg-primary/30",
                      currentHour === index && "ring-2 ring-white/20 ring-inset"
                    )}
                  />
                ))}
                
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10 transition-all duration-1000 ease-in-out"
                  style={{
                    left: `${((currentHour + currentTime.getMinutes() / 60) / 24) * 100}%`,
                  }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-[9px] font-heading font-bold text-slate-600 tracking-tighter uppercase">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
