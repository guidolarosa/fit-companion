"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FoodDay {
  date: Date
  netCalories: number
  caloriesConsumed: number
  caloriesBurnt: number
  tdee: number
}

interface FoodCalendarProps {
  foodDays: FoodDay[]
}

export function FoodCalendar({ foodDays }: FoodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }) // Monday
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Create a map for quick lookup of food days
  const foodMap = new Map<string, FoodDay>()
  foodDays.forEach((day) => {
    const key = day.date.toISOString().split('T')[0]
    foodMap.set(key, day)
  })

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  function handlePreviousMonth() {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  function handleNextMonth() {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  function getDayData(date: Date): FoodDay | null {
    // Match calendar day (local) to "Pinned UTC" key
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${d}`
    return foodMap.get(key) ?? null
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
            const hasData = dayData !== null
            const isDeficit = hasData && dayData.netCalories < 0

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm rounded-md transition-colors relative group",
                  !isCurrentMonth && "text-muted-foreground opacity-40",
                  isCurrentMonth && !hasData && "hover:bg-muted",
                  hasData && isDeficit && "bg-green-500/20 hover:bg-green-500/30 cursor-pointer border border-green-500/30",
                  hasData && !isDeficit && "bg-red-500/20 hover:bg-red-500/30 cursor-pointer border border-red-500/30"
                )}
                title={
                  hasData
                    ? `${format(day, "MMM d, yyyy")}: ${dayData.netCalories < 0 ? "Deficit" : "Surplus"} - ${Math.round(Math.abs(dayData.netCalories))} kcal`
                    : format(day, "MMM d, yyyy")
                }
              >
                <span
                  className={cn(
                    "relative z-10",
                    hasData && isDeficit && "font-semibold text-green-700 dark:text-green-400",
                    hasData && !isDeficit && "font-semibold text-red-700 dark:text-red-400"
                  )}
                >
                  {format(day, "d")}
                </span>
                {/* Tooltip */}
                {hasData && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-popover text-popover-foreground text-xs rounded-md px-2 py-1.5 shadow-lg border whitespace-nowrap">
                      <div className="font-semibold">
                        {dayData.netCalories < 0 ? "Deficit" : "Surplus"}: {Math.round(Math.abs(dayData.netCalories))} kcal
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Consumed: {Math.round(dayData.caloriesConsumed)} | Burnt: {Math.round(dayData.caloriesBurnt + dayData.tdee)}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-popover"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
          <span>Calorie deficit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
          <span>Calorie surplus</span>
        </div>
      </div>
    </div>
  )
}
