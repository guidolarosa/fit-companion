"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import type { ReportData } from "@/lib/report-pdf"

interface ReportSummaryProps {
  reportData: ReportData
}

export function ReportSummary({ reportData }: ReportSummaryProps) {
  const t = useTranslations("report")
  const tc = useTranslations("common")

  return (
    <>
      <Card className="glass-card border-l-primary border-l-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-primary" />
            {t("summaryTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium leading-relaxed text-zinc-200 italic">
            &ldquo;{reportData.stats.narrative}&rdquo;
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              {t("dailyDeficit")}
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {Math.round(reportData.stats.avgDeficit)}{" "}
              <span className="text-[10px] text-zinc-600 uppercase">{tc("kcal")}</span>
            </h3>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              {t("projectedChange")}
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {reportData.stats.projectedWeightChange > 0 ? "+" : ""}
              {reportData.stats.projectedWeightChange.toFixed(2)}{" "}
              <span className="text-[10px] text-zinc-600 uppercase">{tc("kg")}</span>
            </h3>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              {t("currentStreak")}
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {reportData.stats.streaks.current}{" "}
              <span className="text-[10px] text-zinc-600 uppercase">{tc("days")}</span>
            </h3>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
