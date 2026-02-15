"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { LocaleToggle } from "@/components/locale-toggle"
import { LoginForm } from "@/components/login/LoginForm"
import { MobileLoginHero } from "@/components/login/MobileLoginHero"
import { DesktopFeaturePanel } from "@/components/login/DesktopFeaturePanel"

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations("login")
  const tc = useTranslations("common")
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(t("invalidCredentials"))
        } else {
          router.push("/")
          router.refresh()
        }
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || t("createAccountError"))
        } else {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            setError(t("accountCreatedPleaseLogin"))
          } else {
            router.push("/onboarding")
            router.refresh()
          }
        }
      }
    } catch (error) {
      setError(t("genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  function switchMode() {
    setIsLogin(!isLogin)
    setError("")
    setEmail("")
    setPassword("")
    setName("")
  }

  const formProps = {
    isLogin,
    name,
    email,
    password,
    error,
    isLoading,
    onNameChange: setName,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: handleSubmit,
    onSwitchMode: switchMode,
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex flex-col w-full min-h-screen lg:hidden">
        <MobileLoginHero />

        {/* Form area */}
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col">
          <LoginForm {...formProps} variant="mobile" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT                             */}
      {/* ═══════════════════════════════════════════ */}

      {/* Left Column - Form */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative">
        {/* Language toggle - desktop */}
        <LocaleToggle className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors" />

        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-2xl font-heading font-bold tracking-tight text-white">
              {tc("brandFit")}
              <span className="text-primary">{tc("brandCompanion")}</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {isLogin ? t("subtitleLogin") : t("subtitleRegister")}
            </p>
          </div>

          <LoginForm {...formProps} variant="desktop" />
        </div>
      </div>

      {/* Right Column - Hero Panel (desktop only) */}
      <DesktopFeaturePanel />
    </div>
  )
}
