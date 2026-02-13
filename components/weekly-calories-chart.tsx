"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Flame } from "lucide-react"
import { useTranslations } from "next-intl"

interface DayData {
  date: string
  consumed: number
  burnt: number
  tdee: number
}

interface WeeklyCaloriesChartProps {
  weekData: DayData[]
}

export function WeeklyCaloriesChart({ weekData }: WeeklyCaloriesChartProps) {
  const t = useTranslations("dashboard")

  const chartData = weekData.map((d) => {
    const dateObj = new Date(d.date + "T00:00:00Z")
    const label = dateObj.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", timeZone: "UTC" })
    return {
      name: label,
      consumed: Math.round(d.consumed),
      burned: Math.round(d.burnt + d.tdee),
    }
  })

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          {t("chartTitle")}
        </CardTitle>
        <Flame className="h-3.5 w-3.5 text-zinc-600" />
      </CardHeader>
      <CardContent className="pt-2">
        {chartData.length === 0 ? (
          <p className="text-xs text-zinc-600 italic">{t("chartEmpty")}</p>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
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
                    `${value.toLocaleString()} kcal`,
                    name === "consumed" ? t("chartConsumed") : t("chartBurned"),
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "10px" }}
                  formatter={(value: string) => (value === "consumed" ? t("chartConsumed") : t("chartBurned"))}
                />
                <Bar dataKey="burned" fill="rgb(34 197 94)" radius={[2, 2, 0, 0]} name="burned" />
                <Bar dataKey="consumed" fill="rgb(239 68 68)" radius={[2, 2, 0, 0]} name="consumed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
