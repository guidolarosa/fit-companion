"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface NetCaloriesCardProps {
  netCalories: number
  daysCount: number
  totalCaloriesConsumed: number
  totalTdee: number
}

export function NetCaloriesCard({
  netCalories,
  daysCount,
  totalCaloriesConsumed,
  totalTdee,
}: NetCaloriesCardProps) {
  const t = useTranslations("dashboard")

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          {t("netCalories")}
        </CardTitle>
        {netCalories < 0 ? (
          <TrendingDown className="h-3.5 w-3.5 text-green-500" />
        ) : netCalories > 0 ? (
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-baseline gap-2">
          <div
            className={cn(
              "text-xl font-bold tracking-tight px-2 rounded-[4px] py-0.5",
              netCalories < 0
                ? "text-green-500 bg-green-500/10 border border-green-500/20"
                : netCalories > 0
                ? "text-primary bg-primary/10 border border-primary/20"
                : "text-zinc-500 bg-zinc-500/10 border border-zinc-500/20"
            )}
          >
            {netCalories > 0 ? "+" : ""}
            {Math.round(netCalories)}
            <span className="text-[10px] uppercase font-bold ml-1 opacity-50 tracking-widest">kcal</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-tight text-zinc-500 font-bold">
          <div className="flex flex-col">
            <span>{t("daysLabel")}</span>
            <span className="text-zinc-300">{daysCount}</span>
          </div>
          <div className="flex flex-col">
            <span>{t("consumedLabel")}</span>
            <span className="text-zinc-300">{Math.round(totalCaloriesConsumed)}</span>
          </div>
          <div className="flex flex-col">
            <span>{t("spentLabel")}</span>
            <span className="text-zinc-300">{Math.round(totalTdee)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
