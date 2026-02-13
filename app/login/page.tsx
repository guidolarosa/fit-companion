"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Activity,
  UtensilsCrossed,
  Weight,
  BarChart3,
  Droplets,
  Brain,
  ChevronRight,
  Sparkles,
} from "lucide-react"

const features = [
  { icon: Weight, title: "Seguimiento de peso", desc: "Registra y visualiza tu progreso con tendencias" },
  { icon: UtensilsCrossed, title: "Control nutricional", desc: "Calorías, proteínas, carbs, grasa, fibra y azúcar" },
  { icon: Activity, title: "Registro de ejercicio", desc: "Lleva un historial de tu actividad física" },
  { icon: BarChart3, title: "Reportes e insights", desc: "Análisis de tendencias y resúmenes con IA" },
  { icon: Droplets, title: "Hidratación", desc: "Contador diario de vasos de agua con meta personalizada" },
  { icon: Brain, title: "Asistente con IA", desc: "Estimación de macros y asesoría nutricional inteligente" },
]

export default function LoginPage() {
  const router = useRouter()
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
          setError("Email o contraseña inválidos")
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
          setError(data.error || "Error al crear la cuenta")
        } else {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            setError("Cuenta creada. Por favor, inicia sesión.")
          } else {
            router.push("/")
            router.refresh()
          }
        }
      }
    } catch (error) {
      setError("Ocurrió un error. Intenta de nuevo.")
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

  return (
    <div className="flex min-h-screen bg-background">

      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex flex-col w-full min-h-screen lg:hidden">
        {/* Top hero area with blur blobs */}
        <div className="relative overflow-hidden" style={{ minHeight: "38vh" }}>
          {/* Dark base matching the app background */}
          <div className="absolute inset-0 bg-background" />
          
          {/* Blur blob gradient */}
          <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] bg-primary/40 rounded-full blur-[80px]" />
          <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-primary/25 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[90px]" />
          <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[70px]" />

          {/* Logo centered on the hero */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-14 pb-20">
            <h1 className="text-4xl font-heading font-bold tracking-tight text-white">
              Fit<span className="text-primary">Companion</span>
            </h1>
            <p className="mt-2 text-xs text-zinc-400 tracking-wide">Tu compañero de bienestar</p>
          </div>

          {/* Wave separator */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ height: "60px" }}
          >
            <path
              d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
              fill="hsl(240 10% 4%)"
            />
          </svg>
        </div>

        {/* Form area */}
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col">
          {/* Title with accent underline */}
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <div className="mt-2 h-[3px] w-10 rounded-full bg-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="m-name" className="text-xs font-semibold text-zinc-400">Nombre (opcional)</Label>
                <Input
                  id="m-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="m-email" className="text-xs font-semibold text-zinc-400">Email</Label>
              <Input
                id="m-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-password" className="text-xs font-semibold text-zinc-400">Contraseña</Label>
              <Input
                id="m-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="h-12 bg-transparent border-0 border-b border-white/[0.08] rounded-none px-0 focus:border-primary placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isLogin ? "Iniciando..." : "Creando..."}
                  </span>
                ) : (
                  isLogin ? "Iniciar sesión" : "Crear cuenta"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center pb-4">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-zinc-500"
            >
              {isLogin ? (
                <>¿No tenés cuenta? <span className="text-primary font-semibold">Registrate</span></>
              ) : (
                <>¿Ya tenés cuenta? <span className="text-primary font-semibold">Iniciá sesión</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT (unchanged)                 */}
      {/* ═══════════════════════════════════════════ */}

      {/* Left Column - Form */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-2xl font-heading font-bold tracking-tight text-white">
              Fit<span className="text-primary">Companion</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {isLogin
                ? "Inicia sesión para continuar tu progreso"
                : "Crea tu cuenta y comienza tu camino"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="d-name" className="text-xs text-zinc-400">Nombre (opcional)</Label>
                <Input
                  id="d-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="d-email" className="text-xs text-zinc-400">Email</Label>
              <Input
                id="d-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-password" className="text-xs text-zinc-400">Contraseña</Label>
              <Input
                id="d-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="h-11 bg-white/[0.03] border-white/[0.06] focus:border-primary/50 placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.05]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-zinc-600">o</span>
              </div>
            </div>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>¿No tenés cuenta? <span className="text-primary font-medium">Registrate</span></>
              ) : (
                <>¿Ya tenés cuenta? <span className="text-primary font-medium">Iniciá sesión</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Panel (desktop only) */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {/* Abstract gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] translate-y-1/3" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-green-500/5 rounded-full blur-[80px]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col justify-center px-12 xl:px-20 w-full">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Con inteligencia artificial</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-heading font-bold tracking-tight text-white leading-tight">
              Tu compañero<br />
              de <span className="text-primary">bienestar</span>
            </h2>
            <p className="mt-4 text-sm text-zinc-500 max-w-md leading-relaxed">
              Registra tu alimentación, ejercicio y peso. Obtené insights personalizados
              y reportes detallados para alcanzar tus objetivos.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group flex items-start gap-3 rounded-lg p-3 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200">{f.title}</p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom badge */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-primary/30", "bg-blue-500/30", "bg-green-500/30"].map((bg, i) => (
                <div key={i} className={`h-7 w-7 rounded-full ${bg} border-2 border-background flex items-center justify-center`}>
                  <span className="text-[8px] font-bold text-white">{["FC", "AI", "↑"][i]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500">
              Seguimiento completo &middot; 100% gratuito &middot; Datos privados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
