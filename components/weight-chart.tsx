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
  chartHeight?: number;
}

export function WeightChart({ weights, chartHeight = 300 }: WeightChartProps) {
  if (weights.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No weight data available. Add your first entry to see the chart.
      </div>
    )
  }

  const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate linear regression for trend line
  const n = sortedWeights.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0

  sortedWeights.forEach((w, i) => {
    sumX += i
    sumY += w.weight
    sumXY += i * w.weight
    sumX2 += i * i
  })

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const chartData = sortedWeights.map((entry, i) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    weight: entry.weight,
    trend: Number((slope * i + intercept).toFixed(2)),
  }))

  const minWeight = Math.min(...weights.map((w) => w.weight))
  const maxWeight = Math.max(...weights.map((w) => w.weight))
  const range = maxWeight - minWeight
  const padding = range > 0 ? Math.max(1, range * 0.1) : 1
  const domainMin = Math.max(0, Math.floor(minWeight - padding))
  const domainMax = Math.ceil(maxWeight + padding)

  return (
    <div style={{ width: "100%", height: `${chartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
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
            domain={[domainMin, domainMax]}
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
            name="Weight"
          />
          <Line
            type="monotone"
            dataKey="trend"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Trend"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

