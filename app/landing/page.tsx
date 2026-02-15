"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { LandingNav } from "@/components/landing/LandingNav"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsBar } from "@/components/landing/StatsBar"
import { FeaturesGrid } from "@/components/landing/FeaturesGrid"
import { AIHighlightSection } from "@/components/landing/AIHighlightSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { WeightLossFocus } from "@/components/landing/WeightLossFocus"
import { LandingCTA } from "@/components/landing/LandingCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

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

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header role="banner">
        <LandingNav currentLocale={currentLocale} onToggleLocale={toggleLocale} />
      </header>
      <main id="main-content" role="main">
        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        <AIHighlightSection />
        <HowItWorks />
        <WeightLossFocus />
        <LandingCTA />
      </main>
      <LandingFooter />

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
        .reveal-on-scroll:nth-child(2) { transition-delay: 80ms; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 160ms; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 240ms; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 320ms; }
        .reveal-on-scroll:nth-child(6) { transition-delay: 400ms; }
      `}</style>
    </div>
  )
}
