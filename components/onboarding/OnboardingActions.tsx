"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  SkipForward,
} from "lucide-react"
import { TOTAL_STEPS } from "./useOnboarding"

interface OnboardingActionsProps {
  step: number
  canProceed: boolean
  isLoading: boolean
  goBack: () => void
  goNext: () => void
  handleFinish: () => void
}

export function OnboardingActions({
  step,
  canProceed,
  isLoading,
  goBack,
  goNext,
  handleFinish,
}: OnboardingActionsProps) {
  const t = useTranslations("onboarding")

  return (
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
            disabled={!canProceed}
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
  )
}
