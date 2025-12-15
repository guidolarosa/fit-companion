"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface WeightChartProps {
  weights: WeightEntry[]
}

export function WeightChart({ weights }: WeightChartProps) {
  if (weights.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No weight data available. Add your first entry to see the chart.
      </div>
    )
  }

  const chartData = weights.map((entry) => ({
    date: format(new Date(entry.date), "MMM d"),
    weight: entry.weight,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
          label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

