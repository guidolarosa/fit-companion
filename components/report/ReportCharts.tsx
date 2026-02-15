"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import type { ReportData } from "@/lib/report-pdf"

interface ReportChartsProps {
  reportData: ReportData
}

export function ReportCharts({ reportData }: ReportChartsProps) {
  const t = useTranslations("report")
  const tc = useTranslations("common")

  const chartData = useMemo(() => {
    return reportData.dailyData.map((day, idx) => ({
      date: new Date(day.date).toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      weight: day.weight,
      movingAvgWeight: reportData.stats.movingAvgWeight[idx],
      calories: day.caloriesConsumed,
      movingAvgCalories: reportData.stats.movingAvgCalories[idx],
      net: day.netCalories,
      burnt: day.caloriesBurnt,
      protein: day.protein || 0,
      carbs: day.carbs || 0,
      fat: day.fat || 0,
      fiber: day.fiber || 0,
      sugar: day.sugar || 0,
    }))
  }, [reportData])

  const macroAverages = useMemo(() => {
    if (reportData.dailyData.length === 0) return null
    const n = reportData.dailyData.length
    return {
      protein: Math.round(
        reportData.dailyData.reduce((s: number, d: any) => s + (d.protein || 0), 0) / n
      ),
      carbs: Math.round(
        reportData.dailyData.reduce((s: number, d: any) => s + (d.carbs || 0), 0) / n
      ),
      fat: Math.round(
        reportData.dailyData.reduce((s: number, d: any) => s + (d.fat || 0), 0) / n
      ),
      fiber: Math.round(
        reportData.dailyData.reduce((s: number, d: any) => s + (d.fiber || 0), 0) / n
      ),
      sugar: Math.round(
        reportData.dailyData.reduce((s: number, d: any) => s + (d.sugar || 0), 0) / n
      ),
    }
  }, [reportData])

  return (
    <>
      {/* Weight & Caloric intake charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
              {t("chartWeightTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="date"
                  fontSize={9}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgb(82 82 91)" }}
                />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(9 9 11)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  name={t("chartWeight")}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="movingAvgWeight"
                  stroke="#9333ea"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 4"
                  name={t("chartAverage")}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
              {t("chartCaloricIntake")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="date"
                  fontSize={9}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgb(82 82 91)" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(9 9 11)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                />
                <Bar
                  dataKey="calories"
                  fill="rgba(249, 115, 22, 0.2)"
                  name={t("chartIntake")}
                />
                <Line
                  type="monotone"
                  dataKey="movingAvgCalories"
                  stroke="#facc15"
                  strokeWidth={1.5}
                  dot={false}
                  name={t("chartAverage")}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Macro Averages */}
      {macroAverages && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              {
                key: "protein",
                label: tc("protein"),
                value: macroAverages.protein,
                unit: tc("g"),
                color: "text-blue-400",
              },
              {
                key: "carbs",
                label: tc("carbs"),
                value: macroAverages.carbs,
                unit: tc("g"),
                color: "text-amber-400",
              },
              {
                key: "fat",
                label: tc("fat"),
                value: macroAverages.fat,
                unit: tc("g"),
                color: "text-rose-400",
              },
              {
                key: "fiber",
                label: tc("fiber"),
                value: macroAverages.fiber,
                unit: tc("g"),
                color: "text-emerald-400",
              },
              {
                key: "sugar",
                label: tc("sugar"),
                value: macroAverages.sugar,
                unit: tc("g"),
                color: "text-purple-400",
              },
            ].map((m) => (
              <Card key={m.key} className="glass-card">
                <CardContent className="pt-4 pb-3 px-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                    {m.label}
                  </p>
                  <h3 className={cn("text-xl font-bold mt-1", m.color)}>
                    {m.value}{" "}
                    <span className="text-[10px] text-zinc-600">
                      {m.unit}
                      {tc("perDay")}
                    </span>
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                {t("chartMacrosPerDay")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.03)"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={9}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgb(82 82 91)" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(9 9 11)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                    formatter={(value: number, name: string) => [
                      `${Math.round(value)}g`,
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar
                    dataKey="protein"
                    stackId="macros"
                    fill="rgb(96 165 250)"
                    name={tc("protein")}
                  />
                  <Bar
                    dataKey="carbs"
                    stackId="macros"
                    fill="rgb(251 191 36)"
                    name={tc("carbs")}
                  />
                  <Bar
                    dataKey="fat"
                    stackId="macros"
                    fill="rgb(251 113 133)"
                    name={tc("fat")}
                  />
                  <Bar
                    dataKey="fiber"
                    stackId="macros"
                    fill="rgb(52 211 153)"
                    name={tc("fiber")}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
