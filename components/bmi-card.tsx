"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface BMICardProps {
  bmi: number | null
  currentWeight: number | null
  height: number | null
}

// BMI categories with semantic colors per guidelines
function getBMICategory(bmi: number): { 
  label: string
  color: string
  bgColor: string
  progress: number
  description: string
} {
  if (bmi < 18.5) return { 
    label: "Bajo peso", 
    color: "text-maintenance", // Blue for info
    bgColor: "bg-maintenance/10",
    progress: (bmi / 18.5) * 30,
    description: "Por debajo del rango saludable"
  }
  if (bmi < 25) return { 
    label: "Normal", 
    color: "text-deficit", // Green for healthy
    bgColor: "bg-deficit/10",
    progress: 30 + ((bmi - 18.5) / 6.5) * 40,
    description: "Rango saludable"
  }
  if (bmi < 30) return { 
    label: "Sobrepeso", 
    color: "text-surplus", // Orange for attention
    bgColor: "bg-surplus/10",
    progress: 70 + ((bmi - 25) / 5) * 20,
    description: "Por encima del rango saludable"
  }
  return { 
    label: "Obesidad", 
    color: "text-extreme", // Red for concern
    bgColor: "bg-extreme/10",
    progress: 90 + Math.min(((bmi - 30) / 10) * 10, 10),
    description: "Requiere atención médica"
  }
}

export function BMICard({ bmi, currentWeight, height }: BMICardProps) {
  // Empty state per guidelines
  if (!bmi) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            IMC
          </CardTitle>
          <Activity className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[120px] text-center">
          <div className="w-10 h-10 mb-2 rounded-full bg-white/5 flex items-center justify-center">
            <Activity className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500">
            Registra tu peso y altura
          </p>
        </CardContent>
      </Card>
    )
  }

  const { label, color, bgColor, progress, description } = getBMICategory(bmi)

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          IMC
        </CardTitle>
        <Activity className={cn(
          "h-3.5 w-3.5 transition-colors",
          bmi >= 18.5 && bmi < 25 ? "text-deficit" : "text-zinc-600"
        )} />
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 flex-1 flex flex-col">
        {/* Main BMI display */}
        <div 
          className="flex items-end gap-2 mb-3"
          role="status"
          aria-label={`Índice de Masa Corporal: ${bmi.toFixed(1)}. Categoría: ${label}. ${description}`}
        >
          <span className="text-2xl font-bold text-white tracking-tight leading-none" aria-hidden="true">
            {bmi.toFixed(1)}
          </span>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mb-0.5",
            color,
            bgColor
          )}>
            {label}
          </span>
        </div>

        {/* Visual progress bar */}
        <div 
          className="relative h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden mb-1.5"
          role="presentation"
          aria-hidden="true"
        >
          {/* Healthy zone indicator */}
          <div 
            className="absolute h-full bg-deficit/20 rounded-full" 
            style={{ left: "30%", width: "40%" }} 
          />
          {/* Current BMI indicator */}
          <div 
            className={cn(
              "absolute h-full w-1 rounded-full shadow-lg transition-all duration-700 ease-out",
              bmi >= 18.5 && bmi < 25 ? "bg-deficit shadow-deficit/50" : "bg-white shadow-white/50"
            )}
            style={{ left: `${Math.max(0, Math.min(100, progress - 0.5))}%` }} 
          />
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-auto">
          <span>Bajo</span>
          <span className="text-deficit/60">Saludable</span>
          <span>Alto</span>
        </div>

        {/* Info - compact */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-2">
          <Info className="h-3 w-3 shrink-0" />
          <p className="leading-tight truncate">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
