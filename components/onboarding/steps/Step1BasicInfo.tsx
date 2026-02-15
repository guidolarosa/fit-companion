"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Step1BasicInfoProps {
  name: string
  setName: (value: string) => void
  height: string
  setHeight: (value: string) => void
  age: string
  setAge: (value: string) => void
}

export function Step1BasicInfo({
  name,
  setName,
  height,
  setHeight,
  age,
  setAge,
}: Step1BasicInfoProps) {
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs text-zinc-400">
          {t("nameLabel")}
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-xs text-zinc-400">
            {t("heightLabel")} <span className="text-primary">{tc("required")}</span>
          </Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={t("heightPlaceholder")}
            step="0.1"
            min="0"
            className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-xs text-zinc-400">
            {t("ageLabel")} <span className="text-primary">{tc("required")}</span>
          </Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={t("agePlaceholder")}
            min="1"
            max="150"
            className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
          />
        </div>
      </div>
    </div>
  )
}
