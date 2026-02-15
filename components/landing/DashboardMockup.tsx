"use client"

import { useTranslations } from "next-intl"

export function DashboardMockup() {
  const t = useTranslations("landing")
  const tc = useTranslations("common")

  const metricCards = [
    { key: "weight", label: t("mockupWeight"), value: "78.2 kg", sub: "↓ 4.6 kg", color: "text-green-400" },
    { key: "calories", label: t("mockupCalories"), value: "1,840", sub: "de 2,200 meta", color: "text-primary" },
    { key: "exercise", label: t("mockupExercise"), value: "45 min", sub: "320 kcal", color: "text-purple-400" },
    { key: "water", label: t("mockupWater"), value: "6/8", sub: "vasos", color: "text-cyan-400" },
  ]

  const macros = [
    { key: "protein", label: tc("protein"), value: "82g", pct: "68%", color: "bg-blue-500" },
    { key: "carbs", label: tc("carbs"), value: "195g", pct: "75%", color: "bg-green-500" },
    { key: "fiber", label: tc("fiber"), value: "22g", pct: "88%", color: "bg-amber-500" },
  ]

  return (
    <div className="reveal-on-scroll mt-16 lg:mt-24 relative max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-[60px] scale-90" />

      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
            <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
            <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-white/[0.04] text-[10px] text-zinc-500">
              {t("mockupUrl")}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Top row of metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metricCards.map((card) => (
              <div
                key={card.key}
                className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 sm:p-4"
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-lg sm:text-xl font-heading font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart area mockup */}
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-zinc-400">{t("mockupChartTitle")}</p>
              <p className="text-[10px] text-zinc-600">{t("mockupChartPeriod")}</p>
            </div>
            <svg viewBox="0 0 600 120" className="w-full h-20 sm:h-28" role="img" aria-label="Weight trend chart showing progressive weight loss over 30 days">
              {[0, 30, 60, 90, 120].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}
              <line x1="0" y1="25" x2="600" y2="90" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
              <polyline
                points="0,22 40,25 80,28 120,24 160,32 200,35 240,38 280,42 320,48 360,45 400,55 440,60 480,65 520,70 560,78 600,85"
                fill="none"
                stroke="hsl(25, 95%, 53%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,22 40,25 80,28 120,24 160,32 200,35 240,38 280,42 320,48 360,45 400,55 440,60 480,65 520,70 560,78 600,85 600,120 0,120"
                fill="url(#chartGrad)"
              />
            </svg>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-3 gap-3">
            {macros.map((macro) => (
              <div key={macro.key} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <p className="text-[10px] text-zinc-500">{macro.label}</p>
                <p className="text-sm font-bold text-zinc-200 mt-1">{macro.value}</p>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-full rounded-full ${macro.color}`} style={{ width: macro.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
