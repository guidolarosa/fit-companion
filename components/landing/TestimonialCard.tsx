"use client"

import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  initials: string
  accentColor: string
  starColor: string
  gradient: string
}

export function TestimonialCard({
  quote,
  name,
  role,
  initials,
  accentColor,
  starColor,
  gradient,
}: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "reveal-on-scroll relative group border-white/[0.06] bg-transparent transition-all duration-300",
        "hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20"
      )}
      style={{
        background: gradient,
      }}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Quote icon */}
        <div className="mb-4">
          <Quote className={cn("h-5 w-5 opacity-40", accentColor)} />
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("h-3.5 w-3.5 fill-current", starColor)}
            />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/[0.04]">
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10",
              accentColor.replace("text-", "text-") // simplify for now or pass explicit bg class
            )}
            style={{
               backgroundColor: accentColor.includes("blue") ? "rgba(59, 130, 246, 0.2)" : 
                               accentColor.includes("emerald") ? "rgba(16, 185, 129, 0.2)" : 
                               "rgba(168, 85, 247, 0.2)"
            }}
          >
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">{name}</p>
            <p className="text-[10px] text-zinc-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
