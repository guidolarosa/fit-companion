"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Step3WeightProps {
  currentWeight: string
  setCurrentWeight: (value: string) => void
  sustainabilityMode: string
  setSustainabilityMode: (value: string) => void
}

export function Step3Weight({
  currentWeight,
  setCurrentWeight,
  sustainabilityMode,
  setSustainabilityMode,
}: Step3WeightProps) {
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")

  const modeOptions = [
    {
      value: "sustainable",
      label: t("sustainable"),
      desc: t("sustainableDesc"),
    },
    {
      value: "strict",
      label: t("strict"),
      desc: t("strictDesc"),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-xs text-zinc-400">
          {t("currentWeight")} <span className="text-primary">{tc("required")}</span>
        </Label>
        <Input
          id="weight"
          type="number"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          placeholder={t("currentWeightPlaceholder")}
          step="0.1"
          min="0"
          className="h-14 text-2xl font-heading font-bold text-center bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
        />
        <p className="text-[10px] text-zinc-600 text-center">
          {t("firstWeightNote")}
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">{t("sustainabilityMode")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSustainabilityMode(opt.value)}
              className={cn(
                "rounded-lg border p-3 text-left transition-all",
                sustainabilityMode === opt.value
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
    </div>
  )
}
