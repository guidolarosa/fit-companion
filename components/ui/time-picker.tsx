"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minuteStep?: number
}

function TimePicker({
  value = "",
  onChange,
  placeholder = "Pick a time",
  className,
  disabled,
  minuteStep = 5,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => (i * minuteStep).toString().padStart(2, "0")
  )

  const [selectedHour, selectedMinute] = value
    ? value.split(":")
    : ["", ""]

  const hourRef = React.useRef<HTMLDivElement>(null)
  const minuteRef = React.useRef<HTMLDivElement>(null)

  // Scroll to selected values when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        const hourEl = hourRef.current?.querySelector("[data-selected=true]")
        const minEl = minuteRef.current?.querySelector("[data-selected=true]")
        hourEl?.scrollIntoView({ block: "center" })
        minEl?.scrollIntoView({ block: "center" })
      }, 50)
    }
  }, [open])

  function handleSelect(hour: string, minute: string) {
    const time = `${hour}:${minute}`
    onChange?.(time)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {value || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-56">
          {/* Hours column */}
          <div
            ref={hourRef}
            className="overflow-y-auto py-1 px-1 border-r border-white/[0.06] scrollbar-thin"
          >
            <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider sticky top-0 bg-zinc-900">
              Hr
            </div>
            {hours.map((h) => (
              <button
                key={h}
                data-selected={h === selectedHour}
                className={cn(
                  "block w-full rounded-md px-3 py-1.5 text-sm text-center transition-colors",
                  h === selectedHour
                    ? "bg-primary text-white"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                )}
                onClick={() =>
                  handleSelect(h, selectedMinute || "00")
                }
              >
                {h}
              </button>
            ))}
          </div>
          {/* Minutes column */}
          <div
            ref={minuteRef}
            className="overflow-y-auto py-1 px-1 scrollbar-thin"
          >
            <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider sticky top-0 bg-zinc-900">
              Min
            </div>
            {minutes.map((m) => (
              <button
                key={m}
                data-selected={m === selectedMinute}
                className={cn(
                  "block w-full rounded-md px-3 py-1.5 text-sm text-center transition-colors",
                  m === selectedMinute
                    ? "bg-primary text-white"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                )}
                onClick={() =>
                  handleSelect(selectedHour || "08", m)
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

TimePicker.displayName = "TimePicker"

export { TimePicker }
export type { TimePickerProps }
