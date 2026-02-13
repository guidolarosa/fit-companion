"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Zap,
  User,
  Target,
  Scale,
  Timer,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  SkipForward,
} from "lucide-react"

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  const stepMeta = [
    { icon: User, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Target, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Scale, title: t("step3Title"), desc: t("step3Desc") },
    { icon: Timer, title: t("step4Title"), desc: t("step4Desc") },
  ]

  // Step 1 — Basic info
  const [name, setName] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")

  // Step 2 — Activity & Goals
  const [lifestyle, setLifestyle] = useState("")
  const [targetWeightMin, setTargetWeightMin] = useState("")
  const [targetWeightMax, setTargetWeightMax] = useState("")

  // Step 3 — Weight + Sustainability
  const [currentWeight, setCurrentWeight] = useState("")
  const [sustainabilityMode, setSustainabilityMode] = useState("")

  // Step 4 — IF
  const [ifType, setIfType] = useState("")
  const [ifStartTime, setIfStartTime] = useState("08:00")

  // Pre-fill from existing settings (e.g. name set during registration)
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          if (data.name) setName(data.name)
          if (data.height) setHeight(String(data.height))
          if (data.age) setAge(String(data.age))
          if (data.lifestyle) setLifestyle(data.lifestyle)
          if (data.targetWeightMin) setTargetWeightMin(String(data.targetWeightMin))
          if (data.targetWeightMax) setTargetWeightMax(String(data.targetWeightMax))
          if (data.sustainabilityMode) setSustainabilityMode(data.sustainabilityMode)
          if (data.ifType) setIfType(data.ifType)
          if (data.ifStartTime) setIfStartTime(data.ifStartTime)
        }
      } catch {
        // Ignore — defaults are fine
      } finally {
        setIsFetching(false)
      }
    }
    fetchSettings()
  }, [])

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return height.trim() !== "" && age.trim() !== ""
      case 1:
        return lifestyle !== "" && targetWeightMin.trim() !== "" && targetWeightMax.trim() !== ""
      case 2:
        return currentWeight.trim() !== ""
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setDirection("forward")
      setStep((s) => s + 1)
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection("backward")
      setStep((s) => s - 1)
    }
  }

  async function handleFinish() {
    setIsLoading(true)
    try {
      // Save settings
      const settingsRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          height,
          age,
          lifestyle,
          targetWeightMin,
          targetWeightMax,
          milestoneStep: "1",
          sustainabilityMode: sustainabilityMode || "sustainable",
          ifType: ifType && ifType !== "none" ? ifType : null,
          ifStartTime: ifType && ifType !== "none" ? ifStartTime : null,
        }),
      })

      if (!settingsRes.ok) {
        toast.error(t("settingsError"))
        return
      }

      // Save first weight entry
      if (currentWeight) {
        const weightRes = await fetch("/api/weight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weight: parseFloat(currentWeight) }),
        })

        if (!weightRes.ok) {
          toast.error(t("weightError"))
          return
        }
      }

      toast.success(t("success"))

      // Update the session token (triggers JWT callback with trigger="update")
      // This refreshes profileComplete in the JWT
      await updateSession()

      // Set a temporary cookie as a fallback signal for the middleware
      document.cookie = "onboarding_complete=1; path=/; max-age=60"

      // Hard navigation to pick up the fresh cookie
      window.location.href = "/"
    } catch (err) {
      console.error("Onboarding error:", err)
      toast.error(t("connectionError"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Logo */}
      <div className="relative z-10 pt-8 px-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-heading font-bold tracking-tight text-white">
            {tc("brandFit")}<span className="text-primary">{tc("brandCompanion")}</span>
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Progress bar */}
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

          {/* Step card */}
          <div className="glass-card p-6 sm:p-8">
            {/* Step header */}
            <div className="mb-6">
              <h2 className="text-xl font-heading font-bold text-white">
                {stepMeta[step].title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">{stepMeta[step].desc}</p>
            </div>

            {/* Step content with animation */}
            <div
              key={step}
              className={cn(
                "animate-in duration-300 ease-out",
                direction === "forward"
                  ? "slide-in-from-right-4 fade-in"
                  : "slide-in-from-left-4 fade-in"
              )}
            >
              {step === 0 && (
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
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">
                      {t("activityLevel")} <span className="text-primary">{tc("required")}</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "sedentary", label: t("sedentary"), desc: t("sedentaryDesc") },
                        { value: "moderate", label: t("moderate"), desc: t("moderateDesc") },
                        { value: "active", label: t("active"), desc: t("activeDesc") },
                      ].map((opt) => (
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
              )}

              {step === 2 && (
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
                      {[
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
                      ].map((opt) => (
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
              )}

              {step === 3 && (
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
              )}
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                {step > 0 && (
                  <Button
                    variant="ghost"
                    onClick={goBack}
                    className="text-zinc-400 hover:text-white gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("back")}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {step === 3 && (
                  <Button
                    variant="ghost"
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="text-zinc-400 hover:text-white gap-2"
                  >
                    <SkipForward className="h-4 w-4" />
                    {t("skip")}
                  </Button>
                )}

                {step < TOTAL_STEPS - 1 ? (
                  <Button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="gap-2 font-semibold"
                  >
                    {t("next")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="gap-2 font-semibold px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        {t("start")}
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Step counter */}
          <p className="text-center text-[10px] text-zinc-600 mt-4">
            {t("stepCounter", { n: step + 1, total: TOTAL_STEPS })}
          </p>
        </div>
      </div>
    </div>
  )
}
