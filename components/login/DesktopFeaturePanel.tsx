"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import {
  Activity,
  UtensilsCrossed,
  Weight,
  BarChart3,
  Droplets,
  Brain,
  FlaskConical,
  Sparkles,
} from "lucide-react"

const Aurora = dynamic(() => import("@/components/aurora"), { ssr: false })

export function DesktopFeaturePanel() {
  const t = useTranslations("login")

  const features = useMemo(
    () => [
      { key: "weight", icon: Weight, title: t("featureWeight"), desc: t("featureWeightDesc") },
      {
        key: "nutrition",
        icon: UtensilsCrossed,
        title: t("featureNutrition"),
        desc: t("featureNutritionDesc"),
      },
      {
        key: "exercise",
        icon: Activity,
        title: t("featureExercise"),
        desc: t("featureExerciseDesc"),
      },
      {
        key: "reports",
        icon: BarChart3,
        title: t("featureReports"),
        desc: t("featureReportsDesc"),
      },
      {
        key: "hydration",
        icon: Droplets,
        title: t("featureHydration"),
        desc: t("featureHydrationDesc"),
      },
      { key: "lab", icon: FlaskConical, title: t("featureLab"), desc: t("featureLabDesc") },
      { key: "ai", icon: Brain, title: t("featureAI"), desc: t("featureAIDesc") },
      { key: "free", icon: Sparkles, title: t("featureFree"), desc: t("featureFreeDesc") },
    ],
    [t]
  )

  return (
    <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#EA580C", "#F59E0B", "#FACC15"]}
          amplitude={1.0}
          blend={0.6}
          speed={0.4}
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col justify-center px-12 xl:px-20 w-full">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {t("heroBadge")}
            </span>
          </div>
          <h2 className="text-3xl xl:text-4xl font-heading font-bold tracking-tight text-white leading-tight">
            {t("heroTitle1")}
            <br />
            {t("heroTitle2")}
            <span className="text-primary">{t("heroTitle3")}</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-500 max-w-md leading-relaxed">
            {t("heroDescription")}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 max-w-lg">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.key}
                className="group flex items-start gap-3 rounded-lg p-3 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200">{f.title}</p>
                  <p className="text-[10px] text-zinc-600 leading-relaxed mt-0.5">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom badge */}
        <div className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["bg-primary/30", "bg-blue-500/30", "bg-green-500/30"].map((bg, i) => (
              <div
                key={i}
                className={`h-7 w-7 rounded-full ${bg} border-2 border-background flex items-center justify-center`}
              >
                <span className="text-[8px] font-bold text-white">
                  {["FC", "AI", "↑"][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-zinc-500">{t("heroFooter")}</p>
        </div>
      </div>
    </div>
  )
}
