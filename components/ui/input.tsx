import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isDateOrTime = type === "date" || type === "time" || type === "datetime-local"
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full min-w-0 max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // iOS Safari date/time input fixes
          isDateOrTime && [
            "text-base",
            "appearance-none",
            "[&::-webkit-date-and-time-value]:text-left",
            "[&::-webkit-date-and-time-value]:text-foreground",
            "[&::-webkit-calendar-picker-indicator]:opacity-100",
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
          ],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

