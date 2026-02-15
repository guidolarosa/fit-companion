"use client"

import { useTranslations } from "next-intl"
import { Zap, Apple, Dumbbell, LineChart, FileText } from "lucide-react"

export function HowItWorks() {
  const t = useTranslations("landing")

  const steps = [
    { number: "01", title: t("howStep1Title"), desc: t("howStep1Desc"), icon: Apple },
    { number: "02", title: t("howStep2Title"), desc: t("howStep2Desc"), icon: Dumbbell },
    { number: "03", title: t("howStep3Title"), desc: t("howStep3Desc"), icon: LineChart },
    { number: "04", title: t("howStep4Title"), desc: t("howStep4Desc"), icon: FileText },
  ]

  return (
    <section aria-labelledby="how-it-works-heading" className="py-20 lg:py-32 border-t border-white/[0.04] bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {t("howBadge")}
            </span>
          </div>
          <h2 id="how-it-works-heading" className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white">
            {t("howTitle")}<span className="text-primary">{t("howTitleAccent")}</span>
          </h2>
          <p className="reveal-on-scroll mt-4 text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            {t("howSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="reveal-on-scroll relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-px bg-gradient-to-r from-white/[0.08] to-transparent w-[calc(100%-56px)]" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-4 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                    <Icon className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">
                    {t("howStepPrefix")} {step.number}
                  </p>
                  <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
