"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"

interface LoginFormProps {
  isLogin: boolean
  name: string
  email: string
  password: string
  error: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchMode: () => void
  variant: "mobile" | "desktop"
}

export function LoginForm({
  isLogin,
  name,
  email,
  password,
  error,
  isLoading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
  variant,
}: LoginFormProps) {
  const t = useTranslations("login")

  const isMobile = variant === "mobile"
  const idPrefix = isMobile ? "m" : "d"

  const inputClassName = isMobile
    ? "h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
    : "h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"

  const labelClassName = isMobile
    ? "text-xs font-semibold text-zinc-400"
    : "text-xs text-zinc-400"

  return (
    <>
      {/* Title (mobile only) */}
      {isMobile && (
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">
            {isLogin ? t("loginTitle") : t("registerTitle")}
          </h2>
          <div className="mt-2 h-[3px] w-10 rounded-full bg-primary" />
        </div>
      )}

      <form onSubmit={onSubmit} className={isMobile ? "space-y-5 flex-1" : "space-y-5"}>
        {!isLogin && (
          <div className={isMobile ? "space-y-1.5" : "space-y-2"}>
            <Label htmlFor={`${idPrefix}-name`} className={labelClassName}>
              {t("nameLabel")}
            </Label>
            <Input
              id={`${idPrefix}-name`}
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t("namePlaceholder")}
              className={inputClassName}
            />
          </div>
        )}

        <div className={isMobile ? "space-y-1.5" : "space-y-2"}>
          <Label htmlFor={`${idPrefix}-email`} className={labelClassName}>
            {t("emailLabel")}
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className={inputClassName}
          />
        </div>

        <div className={isMobile ? "space-y-1.5" : "space-y-2"}>
          <Label htmlFor={`${idPrefix}-password`} className={labelClassName}>
            {t("passwordLabel")}
          </Label>
          <Input
            id={`${idPrefix}-password`}
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            required
            minLength={6}
            className={inputClassName}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {isMobile ? (
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {isLogin ? t("loggingIn") : t("registering")}
                </span>
              ) : isLogin ? (
                t("loginButton")
              ) : (
                t("registerButton")
              )}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full h-11 font-semibold text-sm tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {isLogin ? t("loggingInDesktop") : t("registeringDesktop")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isLogin ? t("loginButton") : t("registerButton")}
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        )}
      </form>

      {/* Switch mode link */}
      {isMobile ? (
        <div className="mt-6 text-center pb-4">
          <button type="button" onClick={onSwitchMode} className="text-sm text-zinc-500">
            {isLogin ? (
              <>
                {t("noAccount")}{" "}
                <span className="text-primary font-semibold">{t("switchToRegister")}</span>
              </>
            ) : (
              <>
                {t("hasAccount")}{" "}
                <span className="text-primary font-semibold">{t("switchToLogin")}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.05]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-zinc-600">{t("divider")}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            {isLogin ? (
              <>
                {t("noAccount")}{" "}
                <span className="text-primary font-medium">{t("switchToRegister")}</span>
              </>
            ) : (
              <>
                {t("hasAccount")}{" "}
                <span className="text-primary font-medium">{t("switchToLogin")}</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  )
}
