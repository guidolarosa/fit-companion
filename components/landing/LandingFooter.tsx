"use client"

import { useTranslations } from "next-intl"
import { Zap } from "lucide-react"

export function LandingFooter() {
  const t = useTranslations("landing")
  const tc = useTranslations("common")

  return (
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
  )
}
