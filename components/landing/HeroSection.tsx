"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { Sparkles, ArrowRight, Shield, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardMockup } from "./DashboardMockup"

const Aurora = dynamic(() => import("@/components/aurora"), { ssr: false })

export function HeroSection() {
  const t = useTranslations("landing")

  return (
    <section aria-label="Hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <Aurora
          colorStops={[
            "#22C55E",
            "#10B981",
            "#34D399"
          ]}
          amplitude={1.2}
          blend={0.7}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-background/60" />
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
          <div className="reveal-on-scroll inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {t("heroBadge")}
            </span>
          </div>

          <h1 className="reveal-on-scroll text-4xl sm:text-5xl lg:text-7xl font-heading font-bold tracking-tight text-white leading-[1.1]">
            {t("heroTitle1")}
            <br />
            <span className="text-primary">{t("heroTitle2")}</span>
          </h1>

          <p className="reveal-on-scroll mt-6 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="reveal-on-scroll mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40">
              <Link href="/login">
                {t("heroCtaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-8 py-3.5 rounded-lg bg-white/[0.04] border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.12]">
              <a href="#features">
                {t("heroCtaSecondary")}
              </a>
            </Button>
          </div>

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

        <DashboardMockup />
      </div>
    </section>
  )
}
