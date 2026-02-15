"use client"

import { useTranslations } from "next-intl"
import { LocaleToggle } from "@/components/locale-toggle"

export function MobileLoginHero() {
  const t = useTranslations("login")
  const tc = useTranslations("common")

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "38vh" }}>
      {/* Dark base matching the app background */}
      <div className="absolute inset-0 bg-background" />

      {/* Blur blob gradient */}
      <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] bg-primary/40 rounded-full blur-[80px]" />
      <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-primary/25 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[90px]" />
      <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[70px]" />

      {/* Language toggle */}
      <LocaleToggle className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors" />

      {/* Logo centered on the hero */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-14 pb-20">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-white">
          {tc("brandFit")}
          <span className="text-primary">{tc("brandCompanion")}</span>
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
  )
}
