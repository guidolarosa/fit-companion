"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface CaloriePillProps {
  calories: number
  className?: string
}

export function CaloriePill({ calories, className }: CaloriePillProps) {
  const tc = useTranslations("common")
  const roundedCalories = Math.round(calories)

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold text-green-600 dark:text-green-400 bg-green-600/20 dark:bg-green-700/40 border border-green-600/30 dark:border-green-600/40 rounded-md px-2 py-1 whitespace-nowrap",
        className
      )}
    >
      {roundedCalories} {tc("kcal")}
    </span>
  )
}
