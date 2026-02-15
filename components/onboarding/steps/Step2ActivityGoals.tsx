"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Step2ActivityGoalsProps {
  lifestyle: string
  setLifestyle: (value: string) => void
  targetWeightMin: string
  setTargetWeightMin: (value: string) => void
  targetWeightMax: string
  setTargetWeightMax: (value: string) => void
}

export function Step2ActivityGoals({
  lifestyle,
  setLifestyle,
  targetWeightMin,
  setTargetWeightMin,
  targetWeightMax,
  setTargetWeightMax,
}: Step2ActivityGoalsProps) {
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")

  const activityOptions = [
    { value: "sedentary", label: t("sedentary"), desc: t("sedentaryDesc") },
    { value: "moderate", label: t("moderate"), desc: t("moderateDesc") },
    { value: "active", label: t("active"), desc: t("activeDesc") },
  ]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">
          {t("activityLevel")} <span className="text-primary">{tc("required")}</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {activityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLifestyle(opt.value)}
              className={cn(
                "rounded-lg border p-3 text-left transition-all",
                lifestyle === opt.value
                  ? "bg-primary/10 border-primary/30 text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.04] hover:border-white/[0.1]"
              )}
            >
              <p className="text-xs font-semibold">{opt.label}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetMin" className="text-xs text-zinc-400">
            {t("targetWeightMin")} <span className="text-primary">{tc("required")}</span>
          </Label>
          <Input
            id="targetMin"
            type="number"
            value={targetWeightMin}
            onChange={(e) => setTargetWeightMin(e.target.value)}
            placeholder={t("targetWeightMinPlaceholder")}
            step="0.1"
            className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetMax" className="text-xs text-zinc-400">
            {t("targetWeightMax")} <span className="text-primary">{tc("required")}</span>
          </Label>
          <Input
            id="targetMax"
            type="number"
            value={targetWeightMax}
            onChange={(e) => setTargetWeightMax(e.target.value)}
            placeholder={t("targetWeightMaxPlaceholder")}
            step="0.1"
            className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
          />
        </div>
      </div>
    </div>
  )
}
