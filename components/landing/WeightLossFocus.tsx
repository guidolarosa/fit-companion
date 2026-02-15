"use client"

import { useTranslations } from "next-intl"
import { TrendingDown, CheckCircle2 } from "lucide-react"

export function WeightLossFocus() {
  const t = useTranslations("landing")

  const miniMetrics = [
    { key: "start", label: t("weightLossMockupStart"), value: "82.8 kg" },
    { key: "current", label: t("weightLossMockupCurrent"), value: "78.2 kg" },
    { key: "goal", label: t("weightLossMockupGoal"), value: "75.0 kg" },
  ]

  const bullets = [
    { key: "1", text: t("weightLossBullet1") },
    { key: "2", text: t("weightLossBullet2") },
    { key: "3", text: t("weightLossBullet3") },
    { key: "4", text: t("weightLossBullet4") },
  ]

  return (
    <section aria-labelledby="weight-loss-heading" className="py-20 lg:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Visual */}
          <div className="reveal-on-scroll relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-green-500/5 rounded-2xl blur-[40px] scale-95" />
            <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t("weightLossMockupTitle")}</p>
                  <p className="text-[10px] text-zinc-500">{t("weightLossMockupPeriod")}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-heading font-bold text-green-400">-4.6</span>
                <span className="text-lg text-zinc-500">kg</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {miniMetrics.map((m) => (
                  <div key={m.key} className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-3 text-center">
                    <p className="text-[10px] text-zinc-600">{m.label}</p>
                    <p className="text-sm font-bold text-zinc-200 mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 mb-2">
                  <span>{t("weightLossMockupProgressLabel")}</span>
                  <span className="text-green-400 font-semibold">59%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: "59%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <TrendingDown className="h-3 w-3 text-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                {t("weightLossBadge")}
              </span>
            </div>
            <h2 id="weight-loss-heading" className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
              {t("weightLossTitle1")}
              <br />
              <span className="text-green-400">{t("weightLossTitle2")}</span>
            </h2>
            <p className="reveal-on-scroll mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
              {t("weightLossDesc")}
            </p>
            <div className="reveal-on-scroll mt-8 space-y-4">
              {bullets.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                  </div>
                  <span className="text-sm text-zinc-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
