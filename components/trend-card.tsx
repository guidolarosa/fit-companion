"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface TrendCardProps {
  avgDeficit: number | null
  projectedKgPerWeek: number | null
  warningKey: string | null
}

export function TrendCard({ avgDeficit, projectedKgPerWeek, warningKey }: TrendCardProps) {
  const t = useTranslations("dashboard")

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t("trend")}</CardTitle>
        <TrendingDown className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("deficit7d")}</span>
          <span className="text-zinc-300 font-bold">
            {avgDeficit !== null ? `${Math.round(avgDeficit)} kcal` : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("pace")}</span>
          <span className={cn(
            "font-bold",
            projectedKgPerWeek === null ? "text-zinc-300" :
            projectedKgPerWeek < 0 ? "text-green-500" : "text-primary"
          )}>
            {projectedKgPerWeek === null
              ? "—"
              : `${Math.abs(projectedKgPerWeek).toFixed(2)} ${t("paceUnit")}`}
          </span>
        </div>
        {warningKey && (
          <div className="mt-1 flex gap-1.5 items-start text-[10px] text-primary/80 font-bold uppercase tracking-tight leading-tight">
            <Info className="h-3 w-3 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{t(warningKey as any)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
