"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Zap, User, Target, Scale, Timer, Loader2 } from "lucide-react"
import { useOnboarding, TOTAL_STEPS } from "@/components/onboarding/useOnboarding"
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress"
import { OnboardingActions } from "@/components/onboarding/OnboardingActions"
import { Step1BasicInfo } from "@/components/onboarding/steps/Step1BasicInfo"
import { Step2ActivityGoals } from "@/components/onboarding/steps/Step2ActivityGoals"
import { Step3Weight } from "@/components/onboarding/steps/Step3Weight"
import { Step4IntermittentFasting } from "@/components/onboarding/steps/Step4IntermittentFasting"

export default function OnboardingPage() {
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")

  const {
    step,
    direction,
    isLoading,
    isFetching,
    canProceed,
    goNext,
    goBack,
    handleFinish,
    name, setName,
    height, setHeight,
    age, setAge,
    lifestyle, setLifestyle,
    targetWeightMin, setTargetWeightMin,
    targetWeightMax, setTargetWeightMax,
    currentWeight, setCurrentWeight,
    sustainabilityMode, setSustainabilityMode,
    ifType, setIfType,
    ifStartTime, setIfStartTime,
  } = useOnboarding()

  const stepMeta = [
    { icon: User, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Target, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Scale, title: t("step3Title"), desc: t("step3Desc") },
    { icon: Timer, title: t("step4Title"), desc: t("step4Desc") },
  ]

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
          <OnboardingProgress step={step} />

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
                <Step1BasicInfo
                  name={name}
                  setName={setName}
                  height={height}
                  setHeight={setHeight}
                  age={age}
                  setAge={setAge}
                />
              )}

              {step === 1 && (
                <Step2ActivityGoals
                  lifestyle={lifestyle}
                  setLifestyle={setLifestyle}
                  targetWeightMin={targetWeightMin}
                  setTargetWeightMin={setTargetWeightMin}
                  targetWeightMax={targetWeightMax}
                  setTargetWeightMax={setTargetWeightMax}
                />
              )}

              {step === 2 && (
                <Step3Weight
                  currentWeight={currentWeight}
                  setCurrentWeight={setCurrentWeight}
                  sustainabilityMode={sustainabilityMode}
                  setSustainabilityMode={setSustainabilityMode}
                />
              )}

              {step === 3 && (
                <Step4IntermittentFasting
                  ifType={ifType}
                  setIfType={setIfType}
                  ifStartTime={ifStartTime}
                  setIfStartTime={setIfStartTime}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <OnboardingActions
              step={step}
              canProceed={canProceed()}
              isLoading={isLoading}
              goBack={goBack}
              goNext={goNext}
              handleFinish={handleFinish}
            />
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
