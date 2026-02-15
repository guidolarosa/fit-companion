"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Brain, CheckCircle2, ChevronRight, Sparkles } from "lucide-react"

export function AIHighlightSection() {
  const t = useTranslations("landing")
  const tc = useTranslations("common")

  const benefits = [
    { key: "cal", text: t("benefitCalorieEstimate") },
    { key: "wt", text: t("benefitWeightTrend") },
    { key: "daily", text: t("benefitDailyTracking") },
    { key: "lab", text: t("benefitLabAnalysis") },
    { key: "pdf", text: t("benefitPdfReports") },
    { key: "goals", text: t("benefitPersonalGoals") },
  ]

  const aiDemoItems = [
    { key: "cal", label: tc("calories"), value: "520 kcal", color: "text-primary" },
    { key: "prot", label: tc("protein"), value: "38g", color: "text-blue-400" },
    { key: "carbs", label: tc("carbs"), value: "52g", color: "text-green-400" },
    { key: "fat", label: tc("fat"), value: "14g", color: "text-amber-400" },
    { key: "fiber", label: tc("fiber"), value: "6g", color: "text-teal-400" },
    { key: "sugar", label: tc("sugar"), value: "3g", color: "text-rose-400" },
  ]

  return (
    <section aria-labelledby="ai-heading" className="py-20 lg:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Brain className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {t("aiBadge")}
              </span>
            </div>
            <h2 id="ai-heading" className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
              {t("aiTitle1")}
              <br />
              <span className="text-primary">{t("aiTitle2")}</span>
            </h2>
            <p className="reveal-on-scroll mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
              {t("aiDescription")}
            </p>
            <ul className="reveal-on-scroll mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit.key} className="flex items-start gap-3 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
            <div className="reveal-on-scroll mt-8">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {t("aiCta")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right - AI Demo Card */}
          <div className="reveal-on-scroll relative">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-[40px] scale-95" />
            <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400">{t("aiDemoLabel")}</span>
                </div>

                <div className="flex justify-end">
                  <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2.5 max-w-[80%]">
                    <p className="text-xs text-zinc-200">{t("aiDemoUserMsg")}</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3 max-w-[90%]">
                    <p className="text-xs text-zinc-300 mb-3">{t("aiDemoResponseIntro")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {aiDemoItems.map((item) => (
                        <div key={item.key} className="rounded-md bg-white/[0.03] border border-white/[0.04] p-2 text-center">
                          <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                          <p className="text-[9px] text-zinc-600 mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 pl-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" style={{ animationDelay: "300ms" }} />
                  <span className="text-[10px] text-zinc-600 ml-1">{t("aiDemoAutoRegistered")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
