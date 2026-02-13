"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ML_PER_GLASS = 250

interface WaterCardProps {
  targetGlasses: number
  initialGlasses?: number
}

export function WaterCard({ targetGlasses, initialGlasses = 0 }: WaterCardProps) {
  const [glasses, setGlasses] = useState(initialGlasses)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch today's water on mount
  useEffect(() => {
    async function fetchWater() {
      try {
        const res = await fetch("/api/water")
        if (res.ok) {
          const data = await res.json()
          setGlasses(data.glasses ?? 0)
        }
      } catch (err) {
        console.error("Error fetching water:", err)
      }
    }
    fetchWater()
  }, [])

  async function updateGlasses(newCount: number) {
    const prev = glasses
    setGlasses(newCount)
    setIsSaving(true)
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glasses: newCount }),
      })
      if (!res.ok) {
        setGlasses(prev)
        toast.error("Error al guardar")
      }
    } catch {
      setGlasses(prev)
      toast.error("Error de conexión")
    } finally {
      setIsSaving(false)
    }
  }

  const percentage = targetGlasses > 0 ? Math.min(100, (glasses / targetGlasses) * 100) : 0
  const totalMl = glasses * ML_PER_GLASS
  const targetMl = targetGlasses * ML_PER_GLASS
  const isComplete = glasses >= targetGlasses

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Agua
        </CardTitle>
        <Droplets className={cn("h-3.5 w-3.5", isComplete ? "text-blue-400" : "text-zinc-600")} />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={cn("text-2xl font-bold", isComplete ? "text-blue-400" : "text-white")}>
                {glasses}
              </span>
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
                / {targetGlasses} vasos
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {totalMl} ml / {targetMl} ml ({ML_PER_GLASS} ml/vaso)
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-white/[0.05] hover:bg-white/[0.05]"
              onClick={() => glasses > 0 && updateGlasses(glasses - 1)}
              disabled={glasses <= 0 || isSaving}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-white/[0.05] hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400"
              onClick={() => updateGlasses(glasses + 1)}
              disabled={isSaving}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/[0.03] rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              isComplete ? "bg-blue-400" : "bg-blue-500/50"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Glass dots */}
        <div className="flex flex-wrap gap-1 mt-3">
          {Array.from({ length: targetGlasses }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "w-5 h-5 rounded-sm flex items-center justify-center transition-all text-[8px]",
                i < glasses
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/[0.02] text-zinc-700 border border-white/[0.04]"
              )}
              onClick={() => updateGlasses(i < glasses ? i : i + 1)}
              disabled={isSaving}
              title={`Vaso ${i + 1}`}
            >
              <Droplets className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>

        {isComplete && (
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-3">
            Meta alcanzada
          </p>
        )}
      </CardContent>
    </Card>
  )
}
