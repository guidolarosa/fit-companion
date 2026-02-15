"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Loader2, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportDatePickerProps {
  rangeType: "all" | "period"
  onRangeTypeChange: (value: "all" | "period") => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  isFetching: boolean
  onAnalyze: () => void
}

export function ReportDatePicker({
  rangeType,
  onRangeTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  isFetching,
  onAnalyze,
}: ReportDatePickerProps) {
  const t = useTranslations("report")

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {t("configTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center space-x-1 p-1 bg-white/[0.03] rounded-md">
            <div
              className={cn(
                "px-4 py-1.5 rounded-sm cursor-pointer transition-all text-[10px] uppercase font-bold tracking-widest",
                rangeType === "period"
                  ? "bg-white/[0.05] text-primary"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              onClick={() => onRangeTypeChange("period")}
            >
              {t("tabPeriod")}
            </div>
            <div
              className={cn(
                "px-4 py-1.5 rounded-sm cursor-pointer transition-all text-[10px] uppercase font-bold tracking-widest",
                rangeType === "all"
                  ? "bg-white/[0.05] text-primary"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              onClick={() => onRangeTypeChange("all")}
            >
              {t("tabAll")}
            </div>
          </div>

          {rangeType === "period" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-9 bg-white/[0.02] border-white/[0.05] text-xs text-zinc-300"
              />
              <span className="text-zinc-600">—</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-9 bg-white/[0.02] border-white/[0.05] text-xs text-zinc-300"
              />
            </div>
          )}

          <Button
            onClick={onAnalyze}
            disabled={isFetching}
            className="w-full sm:w-auto ml-auto h-9 text-[10px] font-bold uppercase tracking-widest"
          >
            {isFetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Activity className="h-3.5 w-3.5 mr-2" />
            )}
            {t("analyzeButton")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
