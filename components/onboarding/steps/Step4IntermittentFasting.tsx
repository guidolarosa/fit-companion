"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface Step4IntermittentFastingProps {
  ifType: string
  setIfType: (value: string) => void
  ifStartTime: string
  setIfStartTime: (value: string) => void
}

export function Step4IntermittentFasting({
  ifType,
  setIfType,
  ifStartTime,
  setIfStartTime,
}: Step4IntermittentFastingProps) {
  const t = useTranslations("onboarding")

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">
          {t("ifType")}
        </Label>
        <Select
          value={ifType}
          onChange={(e) => setIfType(e.target.value)}
          className="h-11 bg-white/[0.03] border-white/[0.06]"
        >
          <option value="none">{t("ifNone")}</option>
          <option value="16:8">{t("if168")}</option>
          <option value="18:6">{t("if186")}</option>
          <option value="20:4">{t("if204")}</option>
          <option value="OMAD">{t("ifOmad")}</option>
        </Select>
      </div>
      {ifType && ifType !== "none" && (
        <div className="space-y-2">
          <Label htmlFor="ifStart" className="text-xs text-zinc-400">
            {t("ifStartTime")}
          </Label>
          <Input
            id="ifStart"
            type="time"
            value={ifStartTime}
            onChange={(e) => setIfStartTime(e.target.value)}
            className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50"
          />
        </div>
      )}
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
        <p className="text-xs text-zinc-400 leading-relaxed">
          {t("ifDisclaimer")}
        </p>
      </div>
    </div>
  )
}
