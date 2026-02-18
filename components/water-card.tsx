"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const ML_PER_GLASS = 250

interface WaterCardProps {
  targetGlasses: number
  initialGlasses?: number
}

export function WaterCard({ targetGlasses, initialGlasses = 0 }: WaterCardProps) {
  const t = useTranslations("dashboard")
  const [glasses, setGlasses] = useState(initialGlasses)
  const [isSaving, setIsSaving] = useState(false)
  const wasCompleteRef = useRef(false)
  const hasUserAddedWaterRef = useRef(false)

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
    if (newCount > prev) hasUserAddedWaterRef.current = true
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
        toast.error(t("waterSaveError"))
      }
    } catch {
      setGlasses(prev)
      toast.error(t("waterConnectionError"))
    } finally {
      setIsSaving(false)
    }
  }

  const percentage = targetGlasses > 0 ? Math.min(100, (glasses / targetGlasses) * 100) : 0
  const totalMl = glasses * ML_PER_GLASS
  const targetMl = targetGlasses * ML_PER_GLASS
  const isComplete = glasses >= targetGlasses

  // Confetti when user reaches target by adding water (not on initial load)
  useEffect(() => {
    if (isComplete && !wasCompleteRef.current && hasUserAddedWaterRef.current && targetGlasses > 0) {
      wasCompleteRef.current = true
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#38bdf8", "#0ea5e9", "#0284c7", "#7dd3fc"],
        })
      })
    }
    if (!isComplete) {
      wasCompleteRef.current = false
    }
  }, [isComplete, targetGlasses])

  return (
    <Card className="glass-card h-full relative overflow-hidden">
      {/* Wavy water background - level animates with glasses */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden transition-[height] duration-500 ease-out opacity-40"
        style={{ height: `${percentage}%` }}
      >
        {/* Waves extend well beyond edges—250% width, -75% left = 75% overflow each side */}
        <svg
          className="absolute bottom-0 left-[-75%] h-full w-[250%] min-w-[500%]"
          preserveAspectRatio="none"
          viewBox="0 0 600 100"
        >
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(56, 189, 248)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="waterGradientDeep" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(30, 64, 175)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* All paths tile every 200 units for seamless 33.333% loop */}
          <path
            fill="url(#waterGradient)"
            className="animate-water-wave"
            d="M0 50 Q50 35 100 50 T200 50 T400 50 T600 50 L600 100 L0 100 Z"
          />
          <path
            fill="url(#waterGradient)"
            className="animate-water-wave-reverse animation-delay-500"
            opacity="0.8"
            d="M0 55 Q100 38 200 55 T400 55 T600 55 L600 100 L0 100 Z"
          />
          {/* All paths use 200-unit period (0/200/400/600) for seamless loop */}
          <path
            fill="url(#waterGradientDeep)"
            className="animate-water-wave animation-delay-1000"
            opacity="0.6"
            d="M0 60 Q50 42 100 60 T200 60 T400 60 T600 60 L600 100 L0 100 Z"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          {t("waterTitle")}
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
                / {targetGlasses} {t("waterGlasses")}
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {totalMl} ml / {targetMl} ml ({ML_PER_GLASS} {t("waterMlPerGlass")})
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
              title={t("waterGlassTitle", { n: i + 1 })}
            >
              <Droplets className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>

        {isComplete && (
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-3">
            {t("waterGoalReached")}
          </p>
        )}
      </CardContent>
      </div>
    </Card>
  )
}
