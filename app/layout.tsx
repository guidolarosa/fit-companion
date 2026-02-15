import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const barlow = Barlow({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow"
});

const barlowCondensed = Barlow_Condensed({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed"
});

// Resolve the base URL dynamically: Vercel production → Vercel preview → localhost
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "FitCompanion – Tracker de Peso, Nutrición y Ejercicio con IA",
    template: "%s | FitCompanion",
  },
  description:
    "Registra tu alimentación, ejercicio y peso. Obtené insights personalizados con Inteligencia Artificial para alcanzar tus objetivos de salud y bienestar. 100% gratuito.",
  keywords: [
    "fitness tracker",
    "weight loss tracker",
    "nutrition tracker",
    "AI health app",
    "calorie counter",
    "macro tracker",
    "exercise log",
    "weight tracker",
    "health app",
    "wellness app",
    "seguimiento de peso",
    "contador de calorías",
    "tracker de nutrición",
    "registro de ejercicio",
    "pérdida de peso",
    "macronutrientes",
    "inteligencia artificial salud",
    "app de salud gratuita",
    "fitcompanion",
  ],
  authors: [{ name: "FitCompanion" }],
  creator: "FitCompanion",
  publisher: "FitCompanion",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
    url: baseUrl,
    siteName: "FitCompanion",
    title: "FitCompanion – Tu Compañero de Salud con IA",
    description:
      "Registra tu alimentación, ejercicio y peso. Obtené insights personalizados con IA para alcanzar tus objetivos de salud y bienestar.",
    images: [
      {
        url: "/img/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "FitCompanion – Tu camino hacia una vida más sana",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitCompanion – Tu Compañero de Salud con IA",
    description:
      "Registra tu alimentación, ejercicio y peso. Obtené insights personalizados con IA para alcanzar tus objetivos.",
    images: ["/img/thumbnail.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-body antialiased text-foreground relative`}>
        {/* Background gradient orbs - fancy subtle effect */}
        <div className="bg-orb-container" aria-hidden="true">
          <div className="bg-orb bg-orb-primary" />
          <div className="bg-orb bg-orb-secondary" />
        </div>
        
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
        >
          {locale === "en" ? "Skip to main content" : "Saltar al contenido principal"}
        </a>
        
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
        
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            className: "glass-card",
            style: {
              background: "rgba(24, 24, 27, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
            }
          }}
        />
      </body>
    </html>
  );
}
