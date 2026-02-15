"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"

interface LocaleToggleProps {
  className?: string
}

export function LocaleToggle({ className }: LocaleToggleProps) {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState("es")

  useEffect(() => {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("locale="))
    if (cookie) setCurrentLocale(cookie.split("=")[1])
  }, [])

  function toggleLocale() {
    const next = currentLocale === "es" ? "en" : "es"
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(next)
    router.refresh()
  }

  return (
    <button
      onClick={toggleLocale}
      className={className}
      title={currentLocale === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="uppercase">{currentLocale === "es" ? "EN" : "ES"}</span>
    </button>
  )
}
