"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface BMICardProps {
  bmi: number | null
  currentWeight: number | null
  idealWeight: number | null
  height: number | null
}

function getBMICategory(bmi: number): { label: string; color: string; bgColor: string } {
  if (bmi < 18.5) {
    return { label: "Underweight", color: "text-blue-400", bgColor: "bg-blue-400/20" }
  } else if (bmi < 25) {
    return { label: "Normal", color: "text-green-400", bgColor: "bg-green-400/20" }
  } else if (bmi < 30) {
    return { label: "Overweight", color: "text-yellow-400", bgColor: "bg-yellow-400/20" }
  } else {
    return { label: "Obese", color: "text-red-400", bgColor: "bg-red-400/20" }
  }
}

function getBMIProgress(bmi: number): number {
  // Normalize BMI to 0-100% for visualization
  // Healthy range is 18.5-24.9, so we'll map that to the progress bar
  if (bmi < 18.5) {
    return (bmi / 18.5) * 30 // Map underweight to 0-30%
  } else if (bmi < 25) {
    return 30 + ((bmi - 18.5) / (25 - 18.5)) * 40 // Map normal to 30-70%
  } else if (bmi < 30) {
    return 70 + ((bmi - 25) / (30 - 25)) * 20 // Map overweight to 70-90%
  } else {
    return 90 + Math.min(((bmi - 30) / 10) * 10, 10) // Map obese to 90-100%
  }
}

export function BMICard({ bmi, currentWeight, idealWeight, height }: BMICardProps) {
  if (!bmi || !height || !currentWeight) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BMI</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">No data</div>
          <p className="text-xs text-muted-foreground mt-2">
            Add your height in settings and weight entry to see your BMI
          </p>
        </CardContent>
      </Card>
    )
  }

  const category = getBMICategory(bmi)
  const progress = getBMIProgress(bmi)
  const weightDifference = idealWeight ? currentWeight - idealWeight : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">BMI</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
              <span className={`text-sm font-medium px-2 py-1 rounded ${category.color} ${category.bgColor}`}>
                {category.label}
              </span>
            </div>
          </div>

          {/* BMI Progress Bar */}
          <div className="space-y-2">
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
              {/* Healthy range indicator */}
              <div
                className="absolute h-full bg-green-400/30"
                style={{
                  left: "30%",
                  width: "40%",
                }}
              />
              {/* Current BMI indicator */}
              <div
                className={`absolute h-full ${category.bgColor} border-2`}
                style={{
                  left: `${Math.max(0, Math.min(100, progress - 1))}%`,
                  width: "2%",
                  borderColor: category.color.includes("blue") ? "rgb(96 165 250)" : 
                               category.color.includes("green") ? "rgb(74 222 128)" :
                               category.color.includes("yellow") ? "rgb(250 204 21)" :
                               "rgb(248 113 113)",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>18.5</span>
              <span className="text-green-400">Healthy</span>
              <span>24.9</span>
            </div>
          </div>

          {/* Weight to ideal */}
          {weightDifference !== null && idealWeight && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">Ideal Weight</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-xl font-semibold">{idealWeight.toFixed(1)} kg</div>
                {Math.abs(weightDifference) > 0.1 && (
                  <span
                    className={`text-sm font-medium ${
                      weightDifference > 0
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {weightDifference > 0 ? "+" : ""}
                    {weightDifference.toFixed(1)} kg to reach
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

