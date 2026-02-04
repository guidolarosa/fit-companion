import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-body antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
