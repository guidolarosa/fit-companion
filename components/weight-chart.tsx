"use client"

import { useState, useMemo, type ReactNode } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, eachDayOfInterval, startOfDay, subMonths } from "date-fns"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"

type RangeMode = "month" | "all" | "period"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface WeightChartProps {
  weights: WeightEntry[]
  chartHeight?: number
  title: string
  description?: string
  icon?: ReactNode
  cardClassName?: string
}

function buildChartData(
  weights: WeightEntry[],
  fromDate: Date | undefined,
  toDate: Date | undefined
) {
  if (weights.length === 0) return { chartData: [], domainMin: 0, domainMax: 100 }

  const sorted = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const weightByDay = new Map<string, number>()
  for (const w of sorted) {
    const key = format(startOfDay(new Date(w.date)), "yyyy-MM-dd")
    weightByDay.set(key, w.weight)
  }

  const rangeStart = fromDate ?? startOfDay(new Date(sorted[0].date))
  const rangeEnd = toDate ?? startOfDay(new Date(sorted[sorted.length - 1].date))

  if (rangeStart > rangeEnd) return { chartData: [], domainMin: 0, domainMax: 100 }

  const allDays = eachDayOfInterval({ start: rangeStart, end: rangeEnd })

  const entriesInRange = sorted.filter((w) => {
    const d = startOfDay(new Date(w.date))
    return d >= rangeStart && d <= rangeEnd
  })

  if (entriesInRange.length === 0) return { chartData: [], domainMin: 0, domainMax: 100 }

  // Linear regression on actual entries (index-based within range)
  const n = entriesInRange.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  entriesInRange.forEach((w, i) => {
    sumX += i
    sumY += w.weight
    sumXY += i * w.weight
    sumX2 += i * i
  })
  const denom = n * sumX2 - sumX * sumX
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0
  const intercept = (sumY - slope * sumX) / n

  let trendIdx = 0
  const chartData = allDays.map((day) => {
    const key = format(day, "yyyy-MM-dd")
    const weight = weightByDay.get(key) ?? null
    let trend: number | null = null

    if (weight !== null) {
      trend = Number((slope * trendIdx + intercept).toFixed(2))
      trendIdx++
    }

    return {
      dateRaw: key,
      date: format(day, "MMM d"),
      weight,
      trend,
    }
  })

  const allWeights = entriesInRange.map((w) => w.weight)
  const minWeight = Math.min(...allWeights)
  const maxWeight = Math.max(...allWeights)
  const range = maxWeight - minWeight
  const padding = range > 0 ? Math.max(1, range * 0.1) : 1
  const domainMin = Math.max(0, Math.floor(minWeight - padding))
  const domainMax = Math.ceil(maxWeight + padding)

  return { chartData, domainMin, domainMax }
}

export function WeightChart({
  weights,
  chartHeight = 432,
  title,
  description,
  icon,
  cardClassName,
}: WeightChartProps) {
  const t = useTranslations("weight")
  const [mode, setMode] = useState<RangeMode>("month")
  const [periodFrom, setPeriodFrom] = useState<Date | undefined>(undefined)
  const [periodTo, setPeriodTo] = useState<Date | undefined>(undefined)

  const fromDate = useMemo(() => {
    if (mode === "month") return startOfDay(subMonths(new Date(), 1))
    if (mode === "period") return periodFrom
    return undefined
  }, [mode, periodFrom])

  const toDate = useMemo(() => {
    if (mode === "period") return periodTo
    return undefined
  }, [mode, periodTo])

  const { chartData, domainMin, domainMax } = useMemo(
    () => buildChartData(weights, fromDate, toDate),
    [weights, fromDate, toDate]
  )

  const toggleBtnClass = (active: boolean) =>
    `px-2.5 py-1 rounded-md font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-zinc-400 hover:text-zinc-200"
    }`

  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-[11px] text-zinc-600">
              {description}
            </CardDescription>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-zinc-700/60 p-0.5 text-[11px]">
            <button onClick={() => setMode("month")} className={toggleBtnClass(mode === "month")}>
              {t("chartLastMonth")}
            </button>
            <button onClick={() => setMode("all")} className={toggleBtnClass(mode === "all")}>
              {t("chartAll")}
            </button>
            <button onClick={() => setMode("period")} className={toggleBtnClass(mode === "period")}>
              {t("chartPeriod")}
            </button>
          </div>
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        {mode === "period" && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              {t("chartFrom")}
            </span>
            <DatePicker
              value={periodFrom}
              onChange={setPeriodFrom}
              placeholder={t("chartFromPlaceholder")}
              className="w-auto h-7 text-xs"
            />
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              {t("chartTo")}
            </span>
            <DatePicker
              value={periodTo}
              onChange={setPeriodTo}
              placeholder={t("chartToPlaceholder")}
              className="w-auto h-7 text-xs"
            />
          </div>
        )}

        {weights.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            {t("noDataChart")}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            {t("noDataRange")}
          </div>
        ) : (
          <div style={{ width: "100%", height: `${chartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  label={{ value: t("yAxisLabel"), angle: -90, position: "insideLeft" }}
                  domain={[domainMin, domainMax]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: unknown) => {
                    const v = value as number | null
                    return v !== null ? [`${v} kg`, t("tooltipWeight")] : ["-", t("tooltipWeight")]
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  connectNulls
                  name={t("tooltipWeight")}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls
                  name={t("tooltipTrend")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
