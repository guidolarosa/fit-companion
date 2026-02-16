"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col md:flex-row gap-4 relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 text-zinc-400 hover:text-white",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 text-zinc-400 hover:text-white",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-7 w-full",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-sm font-medium select-none",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-1", defaultClassNames.week),
        day: cn(
          "relative w-9 h-9 p-0 text-center text-sm group/day select-none",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l-md bg-primary/20", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-primary/20", defaultClassNames.range_end),
        today: cn(
          "bg-white/[0.06] text-white rounded-md",
          defaultClassNames.today
        ),
        outside: cn(
          "text-zinc-600 aria-selected:text-zinc-400",
          defaultClassNames.outside
        ),
        disabled: cn("text-zinc-700 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
        DayButton: ({ className: dayClassName, day, modifiers, ...dayProps }) => {
          const ref = React.useRef<HTMLButtonElement>(null)
          React.useEffect(() => {
            if (modifiers.focused) ref.current?.focus()
          }, [modifiers.focused])

          return (
            <button
              ref={ref}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-md text-sm transition-colors",
                "hover:bg-white/[0.06] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                modifiers.selected &&
                  "bg-primary text-white hover:bg-primary/90",
                modifiers.today && !modifiers.selected &&
                  "bg-white/[0.06] text-white",
                modifiers.outside && "text-zinc-600",
                modifiers.disabled && "text-zinc-700 pointer-events-none",
                dayClassName
              )}
              {...dayProps}
            />
          )
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
