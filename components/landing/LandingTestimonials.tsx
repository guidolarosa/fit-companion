"use client"

import { useTranslations } from "next-intl"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { TestimonialCard } from "./TestimonialCard"

const TESTIMONIALS = [
  {
    key: "t1",
    gradient: "from-blue-500/10 via-blue-500/5",
    accentColor: "text-blue-400",
    starColor: "text-blue-400",
  },
  {
    key: "t2",
    gradient: "from-emerald-500/10 via-emerald-500/5",
    accentColor: "text-emerald-400",
    starColor: "text-emerald-400",
  },
  {
    key: "t3",
    gradient: "from-purple-500/10 via-purple-500/5",
    accentColor: "text-purple-400",
    starColor: "text-purple-400",
  },
]

export function LandingTestimonials() {
  const t = useTranslations("landing")

  return (
    <section aria-label="Testimonials" className="py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="reveal-on-scroll text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {t("testimonialsBadge")}
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">
            {t("testimonialsTitle1")}
            <span className="text-primary"> {t("testimonialsTitle2")}</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            {t("testimonialsSubtitle")}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, idx) => (
            <TestimonialCard
              key={testimonial.key}
              quote={t(`testimonial${idx + 1}Quote`)}
              name={t(`testimonial${idx + 1}Name`)}
              role={t(`testimonial${idx + 1}Role`)}
              initials={t(`testimonial${idx + 1}Initials`)}
              accentColor={testimonial.accentColor}
              starColor={testimonial.starColor}
              gradient={`linear-gradient(135deg, ${
                idx === 0
                  ? "rgba(96, 165, 250, 0.08)"
                  : idx === 1
                  ? "rgba(52, 211, 153, 0.08)"
                  : "rgba(167, 139, 250, 0.08)"
              } 0%, rgba(255, 255, 255, 0.02) 100%)`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
