"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface DailyTargetRingCardProps {
  date: Date | null
  caloriesConsumed: number | null
  dailyTarget: number | null
  netCalories: number | null
  protein?: number
  carbs?: number
  fiber?: number
  currentWeight?: number | null
}

// Recommended daily targets based on general nutrition guidelines
function getMacroTargets(weight: number | null | undefined) {
  const w = weight ?? 70
  return {
    protein: Math.round(w * 1.6),  // 1.6g per kg body weight
    carbs: 250,                     // ~250g general target
    fiber: 30,                      // 30g recommended daily
  }
}

interface MiniGaugeProps {
  value: number
  target: number
  label: string
  unit: string
  color: string
  bgColor: string
  size?: number
}

function MiniGauge({ value, target, label, unit, color, bgColor, size = 56 }: MiniGaugeProps) {
  const ratio = target > 0 ? Math.min(value / target, 1) : 0
  const r = (size / 2) - 4
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-white leading-none">
            {Math.round(value)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
        <p className="text-[8px] text-zinc-600">{Math.round(value)}/{target}{unit}</p>
      </div>
    </div>
  )
}

export function DailyTargetRingCard({
  caloriesConsumed,
  dailyTarget,
  netCalories,
  protein = 0,
  carbs = 0,
  fiber = 0,
  currentWeight,
}: DailyTargetRingCardProps) {
  const t = useTranslations("dashboard")

  if (!caloriesConsumed || !dailyTarget || dailyTarget <= 0) {
    return (
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            {t("consumptionTitle")}
          </CardTitle>
          <Flame className="h-3.5 w-3.5 text-zinc-600" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[120px] text-center">
          <div className="w-10 h-10 mb-2 rounded-full aspect-square bg-white/5 flex items-center justify-center">
            <Flame className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500 mb-3">{t("consumptionEmpty")}</p>
          <Link href="/food">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              {t("consumptionRegister")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const ratio = caloriesConsumed / dailyTarget
  const progress = Math.max(0, Math.min(ratio, 1))
  const isDeficit = (netCalories ?? 0) <= 0
  const isExceeded = ratio > 1
  const remaining = dailyTarget - caloriesConsumed

  const ringColor = isDeficit ? "hsl(var(--color-deficit))" : "hsl(var(--color-surplus))"
  const targets = getMacroTargets(currentWeight)

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          {t("consumptionTitle")}
        </CardTitle>
        <Flame className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 flex-1 flex flex-col justify-center">
        {/* Main calorie ring + macro gauges */}
        <div className="flex items-center gap-3 w-full">
          {/* Big calorie ring */}
          <div
            className="relative flex shrink-0 items-center justify-center"
            style={{ width: "76px", height: "76px" }}
            role="progressbar"
            aria-valuenow={caloriesConsumed}
            aria-valuemin={0}
            aria-valuemax={dailyTarget}
          >
            <svg width="76" height="76">
              <circle cx="38" cy="38" r="32" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
              <circle
                cx="38" cy="38" r="32"
                fill="transparent"
                stroke={ringColor}
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress)}`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-white leading-none">
                {Math.round(caloriesConsumed).toLocaleString()}
              </span>
              <span className="text-[8px] font-medium uppercase tracking-widest text-zinc-500 mt-0.5">kcal</span>
            </div>
          </div>

          {/* Macro mini gauges */}
          <div className="flex-1 flex justify-around">
            <MiniGauge
              value={protein}
              target={targets.protein}
              label={t("consumptionProt")}
              unit="g"
              color="rgb(96 165 250)"
              bgColor="rgba(96,165,250,0.1)"
            />
            <MiniGauge
              value={carbs}
              target={targets.carbs}
              label={t("consumptionCarbs")}
              unit="g"
              color="rgb(251 191 36)"
              bgColor="rgba(251,191,36,0.1)"
            />
            <MiniGauge
              value={fiber}
              target={targets.fiber}
              label={t("consumptionFiber")}
              unit="g"
              color="rgb(52 211 153)"
              bgColor="rgba(52,211,153,0.1)"
            />
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-tight text-zinc-500">
          <div className="flex flex-col items-center">
            <span>{t("consumptionGoal")}</span>
            <span className="text-zinc-300">{Math.round(dailyTarget).toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{t("consumptionProgress")}</span>
            <span className={cn("font-bold", isExceeded ? "text-surplus" : "text-deficit")}>
              {(ratio * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span>{remaining > 0 ? t("consumptionRemaining") : t("consumptionExcess")}</span>
            <span className={cn("font-bold", remaining > 0 ? "text-zinc-300" : "text-surplus")}>
              {Math.round(Math.abs(remaining)).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
