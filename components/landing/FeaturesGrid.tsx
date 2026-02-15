"use client"

import { useTranslations } from "next-intl"
import { Weight, UtensilsCrossed, Activity, BarChart3, Droplets, FlaskConical, Target } from "lucide-react"

export function FeaturesGrid() {
  const t = useTranslations("landing")

  const features = [
    { key: "weight", icon: Weight, title: t("featureWeight"), desc: t("featureWeightDesc"), color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400" },
    { key: "nutrition", icon: UtensilsCrossed, title: t("featureNutrition"), desc: t("featureNutritionDesc"), color: "from-green-500/20 to-green-600/5", iconColor: "text-green-400" },
    { key: "exercise", icon: Activity, title: t("featureExercise"), desc: t("featureExerciseDesc"), color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400" },
    { key: "reports", icon: BarChart3, title: t("featureReports"), desc: t("featureReportsDesc"), color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400" },
    { key: "hydration", icon: Droplets, title: t("featureHydration"), desc: t("featureHydrationDesc"), color: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-400" },
    { key: "lab", icon: FlaskConical, title: t("featureLab"), desc: t("featureLabDesc"), color: "from-rose-500/20 to-rose-600/5", iconColor: "text-rose-400" },
  ]

  return (
    <section id="features" aria-labelledby="features-heading" className="py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {t("featuresBadge")}
            </span>
          </div>
          <h2 id="features-heading" className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white">
            {t("featuresTitle1")}
            <br />
            <span className="text-primary">{t("featuresTitle2")}</span>
          </h2>
          <p className="reveal-on-scroll mt-4 text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="reveal-on-scroll group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-white/[0.1] transition-colors">
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
