"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export const TOTAL_STEPS = 4

export function useOnboarding() {
  const { update: updateSession } = useSession()
  const t = useTranslations("onboarding")

  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

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
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Onboarding error:", err)
      toast.error(t("connectionError"))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Navigation
    step,
    direction,
    isLoading,
    isFetching,
    canProceed,
    goNext,
    goBack,
    handleFinish,

    // Step 1
    name,
    setName,
    height,
    setHeight,
    age,
    setAge,

    // Step 2
    lifestyle,
    setLifestyle,
    targetWeightMin,
    setTargetWeightMin,
    targetWeightMax,
    setTargetWeightMax,

    // Step 3
    currentWeight,
    setCurrentWeight,
    sustainabilityMode,
    setSustainabilityMode,

    // Step 4
    ifType,
    setIfType,
    ifStartTime,
    setIfStartTime,
  }
}
