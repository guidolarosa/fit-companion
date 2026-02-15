import Script from "next/script"

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FitCompanion",
  url: baseUrl,
  description:
    "Tu compañero inteligente para perder peso y vivir más sano. Registra comida, ejercicio y peso con estimación automática de calorías y macros por IA.",
  potentialAction: {
    "@type": "SearchAction",
    target: baseUrl,
  },
}

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FitCompanion",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: baseUrl,
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
  screenshot: `${baseUrl}/img/thumbnail.png`,
}

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FitCompanion",
  url: baseUrl,
  logo: `${baseUrl}/favicon.ico`,
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

export function LandingJsonLd() {
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
    </>
  )
}
