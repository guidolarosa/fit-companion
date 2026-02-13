"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface DayData {
  date: string
  consumed: number
  burnt: number
  tdee: number
}

interface WeeklyProgressCardProps {
  weekData: DayData[]
}

export function WeeklyProgressCard({ weekData }: WeeklyProgressCardProps) {
  const t = useTranslations("dashboard")

  const totalConsumed = weekData.reduce((s, d) => s + d.consumed, 0)
  const totalBurnt = weekData.reduce((s, d) => s + d.burnt, 0)
  const totalTdee = weekData.reduce((s, d) => s + d.tdee, 0)
  const totalExpenditure = totalTdee + totalBurnt
  const netBalance = totalConsumed - totalExpenditure
  const avgDaily = weekData.length > 0 ? totalConsumed / weekData.length : 0
  const daysTracked = weekData.length

  const isDeficit = netBalance < 0
  const isSurplus = netBalance > 0

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          {t("weeklyTitle")}
        </CardTitle>
        {isDeficit ? (
          <TrendingDown className="h-3.5 w-3.5 text-green-500" />
        ) : isSurplus ? (
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Minus className="h-3.5 w-3.5 text-zinc-500" />
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {daysTracked === 0 ? (
          <p className="text-xs text-zinc-600 italic">{t("weeklyEmpty")}</p>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-white">
                {Math.round(totalConsumed).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{t("weeklyConsumed")}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("weeklyAvgDaily")}</span>
                <span className="text-zinc-300 font-bold">{Math.round(avgDaily)} kcal</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("weeklyTotalExpenditure")}</span>
                <span className="text-zinc-300 font-bold">{Math.round(totalExpenditure).toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("weeklyBalance")}</span>
                <span className={cn(
                  "font-bold px-1.5 py-0.5 rounded-sm text-[10px]",
                  isDeficit
                    ? "text-green-500 bg-green-500/10"
                    : isSurplus
                    ? "text-primary bg-primary/10"
                    : "text-zinc-500 bg-zinc-500/10"
                )}>
                  {netBalance > 0 ? "+" : ""}{Math.round(netBalance).toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("weeklyDaysTracked")}</span>
                <span className="text-zinc-300 font-bold">{daysTracked} / 7</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
