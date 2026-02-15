"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

export function LandingCTA() {
  const t = useTranslations("landing")

  return (
    <section aria-label="Call to action" className="py-20 lg:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="reveal-on-scroll relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
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
  )
}
