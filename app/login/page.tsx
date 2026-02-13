"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Activity,
  UtensilsCrossed,
  Weight,
  BarChart3,
  Droplets,
  Brain,
  FlaskConical,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react"

const Aurora = dynamic(() => import("@/components/aurora"), { ssr: false })

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations("login")
  const tc = useTranslations("common")
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  const features = [
    { key: "weight", icon: Weight, title: t("featureWeight"), desc: t("featureWeightDesc") },
    { key: "nutrition", icon: UtensilsCrossed, title: t("featureNutrition"), desc: t("featureNutritionDesc") },
    { key: "exercise", icon: Activity, title: t("featureExercise"), desc: t("featureExerciseDesc") },
    { key: "reports", icon: BarChart3, title: t("featureReports"), desc: t("featureReportsDesc") },
    { key: "hydration", icon: Droplets, title: t("featureHydration"), desc: t("featureHydrationDesc") },
    { key: "lab", icon: FlaskConical, title: t("featureLab"), desc: t("featureLabDesc") },
    { key: "ai", icon: Brain, title: t("featureAI"), desc: t("featureAIDesc") },
    { key: "free", icon: Sparkles, title: t("featureFree"), desc: t("featureFreeDesc") },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(t("invalidCredentials"))
        } else {
          router.push("/")
          router.refresh()
        }
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || t("createAccountError"))
        } else {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            setError(t("accountCreatedPleaseLogin"))
          } else {
            router.push("/onboarding")
            router.refresh()
          }
        }
      }
    } catch (error) {
      setError(t("genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  function switchMode() {
    setIsLogin(!isLogin)
    setError("")
    setEmail("")
    setPassword("")
    setName("")
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex flex-col w-full min-h-screen lg:hidden">
        {/* Top hero area with blur blobs */}
        <div className="relative overflow-hidden" style={{ minHeight: "38vh" }}>
          {/* Dark base matching the app background */}
          <div className="absolute inset-0 bg-background" />
          
          {/* Blur blob gradient */}
          <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] bg-primary/40 rounded-full blur-[80px]" />
          <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-primary/25 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[90px]" />
          <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[70px]" />

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            title={currentLocale === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{currentLocale === "es" ? "EN" : "ES"}</span>
          </button>

          {/* Logo centered on the hero */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-14 pb-20">
            <h1 className="text-4xl font-heading font-bold tracking-tight text-white">
              {tc("brandFit")}<span className="text-primary">{tc("brandCompanion")}</span>
            </h1>
            <p className="mt-2 text-xs text-zinc-400 tracking-wide">{t("tagline")}</p>
          </div>

          {/* Wave separator */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ height: "60px" }}
          >
            <path
              d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
              fill="hsl(240 10% 4%)"
            />
          </svg>
        </div>

        {/* Form area */}
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col">
          {/* Title with accent underline */}
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">
              {isLogin ? t("loginTitle") : t("registerTitle")}
            </h2>
            <div className="mt-2 h-[3px] w-10 rounded-full bg-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="m-name" className="text-xs font-semibold text-zinc-400">{t("nameLabel")}</Label>
                <Input
                  id="m-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="m-email" className="text-xs font-semibold text-zinc-400">{t("emailLabel")}</Label>
              <Input
                id="m-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-password" className="text-xs font-semibold text-zinc-400">{t("passwordLabel")}</Label>
              <Input
                id="m-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                minLength={6}
                className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isLogin ? t("loggingIn") : t("registering")}
                  </span>
                ) : (
                  isLogin ? t("loginButton") : t("registerButton")
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center pb-4">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-zinc-500"
            >
              {isLogin ? (
                <>{t("noAccount")} <span className="text-primary font-semibold">{t("switchToRegister")}</span></>
              ) : (
                <>{t("hasAccount")} <span className="text-primary font-semibold">{t("switchToLogin")}</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT (unchanged)                 */}
      {/* ═══════════════════════════════════════════ */}

      {/* Left Column - Form */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative">
        {/* Language toggle - desktop */}
        <button
          onClick={toggleLocale}
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          title={currentLocale === "es" ? "Switch to English" : "Cambiar a Español"}
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="uppercase">{currentLocale === "es" ? "EN" : "ES"}</span>
        </button>

        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-2xl font-heading font-bold tracking-tight text-white">
              {tc("brandFit")}<span className="text-primary">{tc("brandCompanion")}</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {isLogin
                ? t("subtitleLogin")
                : t("subtitleRegister")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="d-name" className="text-xs text-zinc-400">{t("nameLabel")}</Label>
                <Input
                  id="d-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="d-email" className="text-xs text-zinc-400">{t("emailLabel")}</Label>
              <Input
                id="d-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-password" className="text-xs text-zinc-400">{t("passwordLabel")}</Label>
              <Input
                id="d-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                minLength={6}
                className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {isLogin ? t("loggingInDesktop") : t("registeringDesktop")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? t("loginButton") : t("registerButton")}
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.05]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-zinc-600">{t("divider")}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>{t("noAccount")} <span className="text-primary font-medium">{t("switchToRegister")}</span></>
              ) : (
                <>{t("hasAccount")} <span className="text-primary font-medium">{t("switchToLogin")}</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Panel (desktop only) */}
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("heroBadge")}</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-heading font-bold tracking-tight text-white leading-tight">
              {t("heroTitle1")}<br />
              {t("heroTitle2")}<span className="text-primary">{t("heroTitle3")}</span>
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
                <div key={i} className={`h-7 w-7 rounded-full ${bg} border-2 border-background flex items-center justify-center`}>
                  <span className="text-[8px] font-bold text-white">{["FC", "AI", "↑"][i]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500">
              {t("heroFooter")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
