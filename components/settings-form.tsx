"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface User {
  id: string
  name: string | null
  height: number | null
  age: number | null
  lifestyle: string | null
  ifType: string | null
  ifStartTime: string | null
  targetWeightMin: number | null
  targetWeightMax: number | null
  milestoneStep: number | null
  sustainabilityMode: string | null
  locale?: string | null
}

interface SettingsFormProps {
  user: User
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const t = useTranslations("settings")
  const tc = useTranslations("common")
  const [name, setName] = useState(user.name || "")
  const [height, setHeight] = useState(user.height?.toString() || "")
  const [age, setAge] = useState(user.age?.toString() || "")
  const [lifestyle, setLifestyle] = useState(user.lifestyle || "")
  const [ifType, setIfType] = useState(user.ifType || "")
  const [ifStartTime, setIfStartTime] = useState(user.ifStartTime || "08:00")
  const [targetWeightMin, setTargetWeightMin] = useState(user.targetWeightMin?.toString() || "")
  const [targetWeightMax, setTargetWeightMax] = useState(user.targetWeightMax?.toString() || "")
  const [milestoneStep, setMilestoneStep] = useState(user.milestoneStep?.toString() || "1")
  const [sustainabilityMode, setSustainabilityMode] = useState(user.sustainabilityMode || "sustainable")
  const [locale, setLocale] = useState(user.locale || "es")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          height: height ? parseFloat(height) : null,
          age: age ? parseInt(age) : null,
          lifestyle: lifestyle || null,
          ifType: ifType || null,
          ifStartTime: ifType ? ifStartTime : null,
          targetWeightMin: targetWeightMin ? parseFloat(targetWeightMin) : null,
          targetWeightMax: targetWeightMax ? parseFloat(targetWeightMax) : null,
          milestoneStep: milestoneStep ? parseFloat(milestoneStep) : null,
          sustainabilityMode: sustainabilityMode || null,
          locale,
        }),
      })

      if (response.ok) {
        // Set locale cookie for middleware/i18n
        document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
        toast.success(t("updatedSuccess"))
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("updateFailedFallback"))
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error(t("updateError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("nameLabel")}</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locale">{t("languageLabel")}</Label>
          <Select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="es">{t("languageEs")}</option>
            <option value="en">{t("languageEn")}</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="height">{t("heightLabel")}</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={t("heightPlaceholder")}
            className="min-w-0"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="age">{t("ageLabel")}</Label>
          <Input
            id="age"
            type="number"
            min="0"
            max="150"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={t("agePlaceholder")}
            className="min-w-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lifestyle">{t("lifestyleLabel")}</Label>
        <Select
          id="lifestyle"
          value={lifestyle}
          onChange={(e) => setLifestyle(e.target.value)}
        >
          <option value="">{t("lifestyleSelect")}</option>
          <option value="sedentary">{t("lifestyleSedentary")}</option>
          <option value="moderate">{t("lifestyleModerate")}</option>
          <option value="active">{t("lifestyleActive")}</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="targetWeightMin">{t("targetWeightMinLabel")}</Label>
          <Input
            id="targetWeightMin"
            type="number"
            step="0.1"
            min="0"
            value={targetWeightMin}
            onChange={(e) => setTargetWeightMin(e.target.value)}
            placeholder={t("targetWeightMinPlaceholder")}
            className="min-w-0"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="targetWeightMax">{t("targetWeightMaxLabel")}</Label>
          <Input
            id="targetWeightMax"
            type="number"
            step="0.1"
            min="0"
            value={targetWeightMax}
            onChange={(e) => setTargetWeightMax(e.target.value)}
            placeholder={t("targetWeightMaxPlaceholder")}
            className="min-w-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="milestoneStep">{t("milestoneStepLabel")}</Label>
          <Input
            id="milestoneStep"
            type="number"
            step="0.1"
            min="0"
            value={milestoneStep}
            onChange={(e) => setMilestoneStep(e.target.value)}
            placeholder={t("milestoneStepPlaceholder")}
            className="min-w-0"
          />
          <p className="text-xs text-muted-foreground">
            {t("milestoneStepHelp")}
          </p>
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="sustainabilityMode">{t("sustainabilityLabel")}</Label>
          <Select
            id="sustainabilityMode"
            value={sustainabilityMode}
            onChange={(e) => setSustainabilityMode(e.target.value)}
          >
            <option value="strict">{t("sustainabilityStrict")}</option>
            <option value="sustainable">{t("sustainabilitySustainable")}</option>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("sustainabilityHelp")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="ifType">{t("ifTypeLabel")}</Label>
          <Select
            id="ifType"
            value={ifType}
            onChange={(e) => setIfType(e.target.value)}
            className="min-w-0"
          >
            <option value="">{t("ifTypeNone")}</option>
            <option value="16:8">{t("ifType168")}</option>
            <option value="18:6">{t("ifType186")}</option>
            <option value="20:4">{t("ifType204")}</option>
            <option value="OMAD">{t("ifTypeOmad")}</option>
          </Select>
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="ifStartTime">{t("ifStartLabel")}</Label>
          <Input
            id="ifStartTime"
            type="time"
            value={ifStartTime}
            onChange={(e) => setIfStartTime(e.target.value)}
            required={!!ifType}
            disabled={!ifType}
            className="min-w-0"
          />
          <p className="text-xs text-muted-foreground">
            {t("ifStartHelp")}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? tc("saving") : t("saveButton")}
      </Button>
    </form>
  )
}
