"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

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
          <Label>{t("languageLabel")}</Label>
          <Select value={locale} onValueChange={setLocale}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">{t("languageEs")}</SelectItem>
              <SelectItem value="en">{t("languageEn")}</SelectItem>
            </SelectContent>
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
        <Label>{t("lifestyleLabel")}</Label>
        <Select value={lifestyle} onValueChange={setLifestyle}>
          <SelectTrigger>
            <SelectValue placeholder={t("lifestyleSelect")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">{t("lifestyleSedentary")}</SelectItem>
            <SelectItem value="moderate">{t("lifestyleModerate")}</SelectItem>
            <SelectItem value="active">{t("lifestyleActive")}</SelectItem>
          </SelectContent>
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
          <Label>{t("sustainabilityLabel")}</Label>
          <Select value={sustainabilityMode} onValueChange={setSustainabilityMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strict">{t("sustainabilityStrict")}</SelectItem>
              <SelectItem value="sustainable">{t("sustainabilitySustainable")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("sustainabilityHelp")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label>{t("ifTypeLabel")}</Label>
          <Select value={ifType || "none"} onValueChange={(v) => setIfType(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("ifTypeNone")}</SelectItem>
              <SelectItem value="16:8">{t("ifType168")}</SelectItem>
              <SelectItem value="18:6">{t("ifType186")}</SelectItem>
              <SelectItem value="20:4">{t("ifType204")}</SelectItem>
              <SelectItem value="OMAD">{t("ifTypeOmad")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 min-w-0">
          <Label>{t("ifStartLabel")}</Label>
          <TimePicker
            value={ifStartTime}
            onChange={setIfStartTime}
            disabled={!ifType}
            minuteStep={15}
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
