"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

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
        <Select value={ifType || "none"} onValueChange={setIfType}>
          <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.06]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t("ifNone")}</SelectItem>
            <SelectItem value="16:8">{t("if168")}</SelectItem>
            <SelectItem value="18:6">{t("if186")}</SelectItem>
            <SelectItem value="20:4">{t("if204")}</SelectItem>
            <SelectItem value="OMAD">{t("ifOmad")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {ifType && ifType !== "none" && (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">
            {t("ifStartTime")}
          </Label>
          <TimePicker
            value={ifStartTime}
            onChange={setIfStartTime}
            minuteStep={15}
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
