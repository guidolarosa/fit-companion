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

export const metadata: Metadata = {
  title: "Fit Companion - Weight Loss Tracker",
  description: "Track your weight loss progress with AI assistance",
  icons: {
    icon: "/favicon.ico",
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
