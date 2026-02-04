"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface BMICardProps {
  bmi: number | null
  currentWeight: number | null
  height: number | null
  targetWeightMin: number | null
  targetWeightMax: number | null
  milestoneStep: number | null
}

function getBMICategory(bmi: number): { label: string; color: string; bgColor: string; progress: number } {
  if (bmi < 18.5) {
    return { label: "Bajo peso", color: "text-blue-400", bgColor: "bg-blue-400/20", progress: (bmi / 18.5) * 30 }
  } else if (bmi < 25) {
    return { label: "Normal", color: "text-secondary", bgColor: "bg-secondary/20", progress: 30 + ((bmi - 18.5) / (25 - 18.5)) * 40 }
  } else if (bmi < 30) {
    return { label: "Sobrepeso", color: "text-yellow-400", bgColor: "bg-yellow-400/20", progress: 70 + ((bmi - 25) / (30 - 25)) * 20 }
  } else {
    return { label: "Obesidad", color: "text-primary", bgColor: "bg-primary/20", progress: 90 + Math.min(((bmi - 30) / 10) * 10, 10) }
  }
}

export function BMICard({
  bmi,
  currentWeight,
  height,
}: BMICardProps) {
  if (!bmi || !height || !currentWeight) {
    return (
      <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">IMC</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-500 italic">Sin datos</div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Agrega tu altura en Ajustes y registra tu peso para ver el IMC.
          </p>
        </CardContent>
      </Card>
    )
  }

  const category = getBMICategory(bmi)

  return (
    <Card className="glass-card border-none overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400">
          IMC <span className="text-[10px] text-slate-600 normal-case">(referencia)</span>
        </CardTitle>
        <Activity className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="text-3xl font-heading font-bold text-slate-50">{bmi.toFixed(1)}</div>
            <div className={cn(
              "text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-1",
              category.color,
              category.bgColor
            )}>
              {category.label}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="relative h-2.5 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden">
              <div
                className="absolute h-full bg-secondary/40 rounded-full"
                style={{ left: "30%", width: "40%" }}
              />
              <div
                className={cn("absolute h-full border-r-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out", category.bgColor)}
                style={{ left: `${Math.max(0, Math.min(100, category.progress - 0.5))}%`, width: "1%" }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-heading font-bold text-slate-600 tracking-wider uppercase">
              <span>Bajo</span>
              <span className="text-secondary/60">Saludable</span>
              <span>Alto</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
