"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Weight,
  UtensilsCrossed,
  Activity,
  BarChart3,
  Droplets,
  FlaskConical,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Target,
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  LineChart,
  Apple,
  Dumbbell,
  FileText,
  Globe,
} from "lucide-react"

// ─── Intersection Observer hook for scroll animations ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    )

    const children = el.querySelectorAll(".reveal-on-scroll")
    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [])

  return ref
}

export default function LandingPage() {
  const containerRef = useScrollReveal()
  const router = useRouter()
  const t = useTranslations("landing")
  const tc = useTranslations("common")

  const [currentLocale, setCurrentLocale] = useState("es")

  useEffect(() => {
    const cookie = document.cookie.split("; ").find(c => c.startsWith("locale="))
    if (cookie) setCurrentLocale(cookie.split("=")[1])
  }, [])

  function toggleLocale() {
    const next = currentLocale === "es" ? "en" : "es"
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(next)
    router.refresh()
  }

  // ─── Data ───
  const features = [
    {
      key: "weight",
      icon: Weight,
      title: t("featureWeight"),
      desc: t("featureWeightDesc"),
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
    },
    {
      key: "nutrition",
      icon: UtensilsCrossed,
      title: t("featureNutrition"),
      desc: t("featureNutritionDesc"),
      color: "from-green-500/20 to-green-600/5",
      iconColor: "text-green-400",
    },
    {
      key: "exercise",
      icon: Activity,
      title: t("featureExercise"),
      desc: t("featureExerciseDesc"),
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
    },
    {
      key: "reports",
      icon: BarChart3,
      title: t("featureReports"),
      desc: t("featureReportsDesc"),
      color: "from-amber-500/20 to-amber-600/5",
      iconColor: "text-amber-400",
    },
    {
      key: "hydration",
      icon: Droplets,
      title: t("featureHydration"),
      desc: t("featureHydrationDesc"),
      color: "from-cyan-500/20 to-cyan-600/5",
      iconColor: "text-cyan-400",
    },
    {
      key: "lab",
      icon: FlaskConical,
      title: t("featureLab"),
      desc: t("featureLabDesc"),
      color: "from-rose-500/20 to-rose-600/5",
      iconColor: "text-rose-400",
    },
  ]

  const steps = [
    { number: "01", title: t("howStep1Title"), desc: t("howStep1Desc"), icon: Apple },
    { number: "02", title: t("howStep2Title"), desc: t("howStep2Desc"), icon: Dumbbell },
    { number: "03", title: t("howStep3Title"), desc: t("howStep3Desc"), icon: LineChart },
    { number: "04", title: t("howStep4Title"), desc: t("howStep4Desc"), icon: FileText },
  ]

  const stats = [
    { key: "macros", value: "6+", label: t("statsMacros") },
    { key: "ai", value: "IA", label: t("statsAI") },
    { key: "pdf", value: "PDF", label: t("statsPDF") },
    { key: "access", value: "24/7", label: t("statsAccess") },
  ]

  const benefits = [
    { key: "cal", text: t("benefitCalorieEstimate") },
    { key: "wt", text: t("benefitWeightTrend") },
    { key: "daily", text: t("benefitDailyTracking") },
    { key: "lab", text: t("benefitLabAnalysis") },
    { key: "pdf", text: t("benefitPdfReports") },
    { key: "goals", text: t("benefitPersonalGoals") },
  ]

  const weightLossBullets = [
    { key: "1", text: t("weightLossBullet1") },
    { key: "2", text: t("weightLossBullet2") },
    { key: "3", text: t("weightLossBullet3") },
    { key: "4", text: t("weightLossBullet4") },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══ NAV BAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight text-white">
              {tc("brandFit")}<span className="text-primary">{tc("brandCompanion")}</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title={currentLocale === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{currentLocale === "es" ? "EN" : "ES"}</span>
            </button>
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:inline-flex"
            >
              {t("navLogin")}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("navCta")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Gradient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-5%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {t("heroBadge")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="reveal-on-scroll text-4xl sm:text-5xl lg:text-7xl font-heading font-bold tracking-tight text-white leading-[1.1]">
              {t("heroTitle1")}
              <br />
              <span className="text-primary">{t("heroTitle2")}</span>
            </h1>

            {/* Subtitle */}
            <p className="reveal-on-scroll mt-6 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* CTA buttons */}
            <div className="reveal-on-scroll mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                {t("heroCtaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
              >
                {t("heroCtaSecondary")}
              </a>
            </div>

            {/* Social proof line */}
            <div className="reveal-on-scroll mt-12 flex items-center justify-center gap-6 text-zinc-600 text-xs">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                {t("trustFree")}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                {t("trustPrivate")}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" />
                {t("trustAI")}
              </span>
            </div>
          </div>

          {/* ═══ Hero Mockup ═══ */}
          <div className="reveal-on-scroll mt-16 lg:mt-24 relative max-w-4xl mx-auto">
            {/* Glow behind the mockup */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-[60px] scale-90" />

            {/* Browser-like frame */}
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

              {/* Dashboard mockup content */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Top row of metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { key: "weight", label: t("mockupWeight"), value: "78.2 kg", sub: "↓ 4.6 kg", color: "text-green-400" },
                    { key: "calories", label: t("mockupCalories"), value: "1,840", sub: "de 2,200 meta", color: "text-primary" },
                    { key: "exercise", label: t("mockupExercise"), value: "45 min", sub: "320 kcal", color: "text-purple-400" },
                    { key: "water", label: t("mockupWater"), value: "6/8", sub: "vasos", color: "text-cyan-400" },
                  ].map((card) => (
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
                  {/* SVG chart mockup */}
                  <svg viewBox="0 0 600 120" className="w-full h-20 sm:h-28">
                    {/* Grid lines */}
                    {[0, 30, 60, 90, 120].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="600"
                        y2={y}
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Trend line (dashed) */}
                    <line
                      x1="0"
                      y1="25"
                      x2="600"
                      y2="90"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    {/* Data line - descending weight */}
                    <polyline
                      points="0,22 40,25 80,28 120,24 160,32 200,35 240,38 280,42 320,48 360,45 400,55 440,60 480,65 520,70 560,78 600,85"
                      fill="none"
                      stroke="hsl(25, 95%, 53%)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Area gradient */}
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
                  {[
                    { key: "protein", label: tc("protein"), value: "82g", pct: "68%", color: "bg-blue-500" },
                    { key: "carbs", label: tc("carbs"), value: "195g", pct: "75%", color: "bg-green-500" },
                    { key: "fiber", label: tc("fiber"), value: "22g", pct: "88%", color: "bg-amber-500" },
                  ].map((macro) => (
                    <div
                      key={macro.key}
                      className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3"
                    >
                      <p className="text-[10px] text-zinc-500">{macro.label}</p>
                      <p className="text-sm font-bold text-zinc-200 mt-1">{macro.value}</p>
                      <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${macro.color}`}
                          style={{ width: macro.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="border-y border-white/[0.04] bg-white/[0.01]">
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

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
              <Target className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {t("featuresBadge")}
              </span>
            </div>
            <h2 className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white">
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
                  {/* Gradient accent on hover */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
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

      {/* ═══ AI HIGHLIGHT SECTION ═══ */}
      <section className="py-20 lg:py-32 border-t border-white/[0.04]">
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
              <h2 className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
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
                {/* Chat-like AI interaction mockup */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-zinc-400">{t("aiDemoLabel")}</span>
                  </div>

                  {/* User input */}
                  <div className="flex justify-end">
                    <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2.5 max-w-[80%]">
                      <p className="text-xs text-zinc-200">
                        {t("aiDemoUserMsg")}
                      </p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3 max-w-[90%]">
                      <p className="text-xs text-zinc-300 mb-3">{t("aiDemoResponseIntro")}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: "cal", label: tc("calories"), value: "520 kcal", color: "text-primary" },
                          { key: "prot", label: tc("protein"), value: "38g", color: "text-blue-400" },
                          { key: "carbs", label: tc("carbs"), value: "52g", color: "text-green-400" },
                          { key: "fat", label: tc("fat"), value: "14g", color: "text-amber-400" },
                          { key: "fiber", label: tc("fiber"), value: "6g", color: "text-teal-400" },
                          { key: "sugar", label: tc("sugar"), value: "3g", color: "text-rose-400" },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="rounded-md bg-white/[0.03] border border-white/[0.04] p-2 text-center"
                          >
                            <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                            <p className="text-[9px] text-zinc-600 mt-0.5">{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Typing indicator */}
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 lg:py-32 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {t("howBadge")}
              </span>
            </div>
            <h2 className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white">
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
                  {/* Connector line (not on last item) */}
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

      {/* ═══ WEIGHT LOSS FOCUS SECTION ═══ */}
      <section className="py-20 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Visual */}
            <div className="reveal-on-scroll relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-green-500/5 rounded-2xl blur-[40px] scale-95" />
              <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden p-6">
                {/* Weight loss progress mockup */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t("weightLossMockupTitle")}</p>
                    <p className="text-[10px] text-zinc-500">{t("weightLossMockupPeriod")}</p>
                  </div>
                </div>

                {/* Big metric */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-heading font-bold text-green-400">-4.6</span>
                  <span className="text-lg text-zinc-500">kg</span>
                </div>

                {/* Mini metrics row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { key: "start", label: t("weightLossMockupStart"), value: "82.8 kg" },
                    { key: "current", label: t("weightLossMockupCurrent"), value: "78.2 kg" },
                    { key: "goal", label: t("weightLossMockupGoal"), value: "75.0 kg" },
                  ].map((m) => (
                    <div key={m.key} className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-3 text-center">
                      <p className="text-[10px] text-zinc-600">{m.label}</p>
                      <p className="text-sm font-bold text-zinc-200 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
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
              <h2 className="reveal-on-scroll text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
                {t("weightLossTitle1")}
                <br />
                <span className="text-green-400">{t("weightLossTitle2")}</span>
              </h2>
              <p className="reveal-on-scroll mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
                {t("weightLossDesc")}
              </p>
              <div className="reveal-on-scroll mt-8 space-y-4">
                {weightLossBullets.map((item) => (
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

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal-on-scroll relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-50%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">
                {t("ctaTitle1")}
                <br />
                {t("ctaTitle2")}<span className="text-primary">{t("ctaTitle2Accent")}</span>
              </h2>
              <p className="mt-4 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                {t("ctaSubtitle")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  {t("ctaButton")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <p className="mt-6 text-[11px] text-zinc-600">
                {t("ctaDisclaimer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm font-heading font-bold text-zinc-500">
              {tc("brandFit")}<span className="text-zinc-400">{tc("brandCompanion")}</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-600">
            {t("footerCopyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>

      {/* ═══ Scroll reveal styles ═══ */}
      <style jsx global>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1),
                      transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        /* Stagger children */
        .reveal-on-scroll:nth-child(2) { transition-delay: 80ms; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 160ms; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 240ms; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 320ms; }
        .reveal-on-scroll:nth-child(6) { transition-delay: 400ms; }
      `}</style>
    </div>
  )
}
