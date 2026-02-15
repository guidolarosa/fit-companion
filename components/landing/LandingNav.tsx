"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Zap, ArrowRight, Globe } from "lucide-react"

interface LandingNavProps {
  currentLocale: string
  onToggleLocale: () => void
}

export function LandingNav({ currentLocale, onToggleLocale }: LandingNavProps) {
  const t = useTranslations("landing")
  const tc = useTranslations("common")

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
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
            onClick={onToggleLocale}
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
  )
}
