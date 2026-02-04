"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface BMICardProps {
  bmi: number | null
  currentWeight: number | null
  height: number | null
}

function getBMICategory(bmi: number): { label: string; color: string; progress: number } {
  if (bmi < 18.5) return { label: "Bajo", color: "text-blue-400", progress: (bmi / 18.5) * 30 }
  if (bmi < 25) return { label: "Normal", color: "text-green-500", progress: 30 + ((bmi - 18.5) / 6.5) * 40 }
  if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-500", progress: 70 + ((bmi - 25) / 5) * 20 }
  return { label: "Obesidad", color: "text-primary", progress: 90 + Math.min(((bmi - 30) / 10) * 10, 10) }
}

export function BMICard({ bmi }: BMICardProps) {
  if (!bmi) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">IMC</CardTitle>
          <Activity className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[120px]">
          <div className="text-xs text-zinc-600 italic">Sin datos</div>
        </CardContent>
      </Card>
    )
  }

  const { label, color, progress } = getBMICategory(bmi)

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">IMC</CardTitle>
        <Activity className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-end gap-3 mb-6">
          <div className="text-2xl font-bold text-white tracking-tight">{bmi.toFixed(1)}</div>
          <div className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/[0.03] mb-1", color)}>
            {label}
          </div>
        </div>

        <div className="relative h-1.5 w-full rounded-full bg-white/[0.03] overflow-hidden mb-2">
          <div className="absolute h-full bg-green-500/20" style={{ left: "30%", width: "40%" }} />
          <div 
            className="absolute h-full w-1 bg-white shadow-[0_0_8px_white] transition-all duration-1000 ease-out" 
            style={{ left: `${Math.max(0, Math.min(100, progress - 0.5))}%` }} 
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500">
          <span>Bajo</span>
          <span className="text-green-500/40">Ok</span>
          <span>Alto</span>
        </div>
      </CardContent>
    </Card>
  )
}
