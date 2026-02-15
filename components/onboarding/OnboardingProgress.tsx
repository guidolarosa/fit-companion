"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { User, Target, Scale, Timer, Check } from "lucide-react"
import { TOTAL_STEPS } from "./useOnboarding"
import type { LucideIcon } from "lucide-react"

interface StepMeta {
  icon: LucideIcon
  title: string
  desc: string
}

interface OnboardingProgressProps {
  step: number
}

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  const t = useTranslations("onboarding")

  const stepMeta: StepMeta[] = [
    { icon: User, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Target, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Scale, title: t("step3Title"), desc: t("step3Desc") },
    { icon: Timer, title: t("step4Title"), desc: t("step4Desc") },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {stepMeta.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                  i < step
                    ? "bg-primary border-primary text-white"
                    : i === step
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-600"
                )}
              >
                {i < step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] mt-1.5 font-medium transition-colors hidden sm:block",
                  i <= step ? "text-zinc-300" : "text-zinc-600"
                )}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>
      {/* Progress line */}
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}
