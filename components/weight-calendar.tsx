"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WeightDay {
  date: Date
  weight: number
}

interface WeightCalendarProps {
  weightDays: WeightDay[]
}

type WeightChange = "lower" | "same" | "higher" | "first"

export function WeightCalendar({ weightDays }: WeightCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }) // Monday
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Sort weight days by date ascending
  const sortedWeightDays = [...weightDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Create a map for quick lookup of weight days and their change status
  const weightMap = new Map<string, { weight: number; change: WeightChange }>()
  sortedWeightDays.forEach((day, index) => {
    const normalizedDate = startOfDay(new Date(day.date))
    const key = format(normalizedDate, "yyyy-MM-dd")
    
    let change: WeightChange = "first"
    if (index > 0) {
      const prevWeight = sortedWeightDays[index - 1].weight
      if (day.weight < prevWeight) {
        change = "lower"
      } else if (day.weight > prevWeight) {
        change = "higher"
      } else {
        change = "same"
      }
    }
    
    weightMap.set(key, { weight: day.weight, change })
  })

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  function handlePreviousMonth() {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  function handleNextMonth() {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  function getDayData(date: Date): { weight: number; change: WeightChange } | null {
    const normalizedDate = startOfDay(date)
    const key = format(normalizedDate, "yyyy-MM-dd")
    return weightMap.get(key) ?? null
  }

  function getColorClasses(change: WeightChange) {
    switch (change) {
      case "lower":
        return {
          bg: "bg-green-500/20 hover:bg-green-500/30",
          text: "text-green-700 dark:text-green-400",
        }
      case "same":
        return {
          bg: "bg-yellow-500/20 hover:bg-yellow-500/30",
          text: "text-yellow-700 dark:text-yellow-400",
        }
      case "higher":
        return {
          bg: "bg-red-500/20 hover:bg-red-500/30",
          text: "text-red-700 dark:text-red-400",
        }
      case "first":
      default:
        return {
          bg: "bg-blue-500/20 hover:bg-blue-500/30",
          text: "text-blue-700 dark:text-blue-400",
        }
    }
  }

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const dayData = getDayData(day)
            const hasWeight = dayData !== null
            const colors = hasWeight ? getColorClasses(dayData.change) : null

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-md transition-colors p-0.5",
                  !isCurrentMonth && "text-muted-foreground opacity-40",
                  isCurrentMonth && !hasWeight && "hover:bg-muted",
                  hasWeight && colors?.bg
                )}
                title={format(day, "MMM d, yyyy")}
              >
                <span
                  className={cn(
                    "text-[10px] sm:text-xs leading-none",
                    hasWeight && colors?.text
                  )}
                >
                  {format(day, "d")}
                </span>
                {hasWeight && (
                  <span className={cn("text-xs sm:text-lg font-bold leading-tight mt-0.5", colors?.text)}>
                    {dayData.weight.toFixed(1)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
          <span>Lower</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
          <span>Same</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
          <span>Higher</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
          <span>First</span>
        </div>
      </div>
    </div>
  )
}
