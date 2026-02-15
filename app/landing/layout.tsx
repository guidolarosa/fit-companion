import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "FitCompanion – Tracker de Peso, Nutrición y Ejercicio con IA",
  description:
    "Tu compañero inteligente para perder peso y vivir más sano. Registra comida, ejercicio y peso con estimación automática de calorías y macros por IA. Gratis, privado y sin tarjeta de crédito.",
  keywords: [
    "app para bajar de peso",
    "tracker de calorías gratis",
    "contador de macronutrientes",
    "seguimiento de peso con IA",
    "app fitness gratuita",
    "registro de ejercicio",
    "control de hidratación",
    "análisis de laboratorio con IA",
    "reportes de salud PDF",
    "weight loss app free",
    "AI calorie counter",
    "nutrition tracker AI",
    "fitness companion",
    "health tracker",
  ],
  alternates: {
    canonical: "https://fitcompanion.app/landing",
  },
  openGraph: {
    title: "FitCompanion – Tu Camino Hacia una Vida Más Sana",
    description:
      "Registra tu alimentación, ejercicio y peso. Obtené insights personalizados con IA. 100% gratuito y privado.",
    url: "https://fitcompanion.app/landing",
    images: [
      {
        url: "/img/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "FitCompanion – Tu camino hacia una vida más sana. App de salud potenciada con Inteligencia Artificial.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitCompanion – Tu Camino Hacia una Vida Más Sana",
    description:
      "Registra tu alimentación, ejercicio y peso. Insights con IA. 100% gratuito.",
    images: ["/img/thumbnail.png"],
  },
}

// ─── JSON-LD Structured Data ───────────────────────────────────────
const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FitCompanion",
  url: "https://fitcompanion.app",
  description:
    "Tu compañero inteligente para perder peso y vivir más sano. Registra comida, ejercicio y peso con estimación automática de calorías y macros por IA.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fitcompanion.app/landing",
  },
}

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FitCompanion",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://fitcompanion.app",
  description:
    "App gratuita para registro de alimentación, ejercicio y peso con inteligencia artificial. Tracker de calorías, macronutrientes, hidratación y análisis de laboratorio.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Seguimiento de peso con gráficos de tendencia",
    "Control nutricional: calorías, proteínas, carbohidratos, grasa, fibra, azúcar",
    "Registro de ejercicio con estimación de calorías quemadas",
    "Estimación automática con Inteligencia Artificial",
    "Control de hidratación diaria",
    "Análisis de laboratorio con IA",
    "Reportes exportables en PDF",
  ],
  screenshot: "https://fitcompanion.app/img/thumbnail.png",
}

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FitCompanion",
  url: "https://fitcompanion.app",
  logo: "https://fitcompanion.app/favicon.ico",
  sameAs: [],
}

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿FitCompanion es gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, FitCompanion es 100% gratuito. No necesitás tarjeta de crédito para registrarte ni usar ninguna funcionalidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona la estimación con IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Describís lo que comiste o tu ejercicio en lenguaje natural y nuestra IA estima automáticamente calorías, proteínas, carbohidratos, grasa, fibra y azúcar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Mis datos son privados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, tus datos son completamente privados. Solo vos podés acceder a tu información de salud.",
      },
    },
  ],
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="json-ld-website"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <Script
        id="json-ld-software-app"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
      />
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      {children}
    </>
  )
}
