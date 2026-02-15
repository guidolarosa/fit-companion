"use client"

import { useTranslations } from "next-intl"

export function StatsBar() {
  const t = useTranslations("landing")

  const stats = [
    { key: "macros", value: "6+", label: t("statsMacros") },
    { key: "ai", value: "IA", label: t("statsAI") },
    { key: "pdf", value: "PDF", label: t("statsPDF") },
    { key: "access", value: "24/7", label: t("statsAccess") },
  ]

  return (
    <section aria-label="Key statistics" className="border-y border-white/[0.04] bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.key} className="reveal-on-scroll text-center">
              <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
