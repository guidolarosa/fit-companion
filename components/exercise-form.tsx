"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

type Intensity = "light" | "moderate" | "high" | "extreme" | ""

interface ExerciseSuggestion {
  name: string
  calories: number
  duration: number | null
}

export function ExerciseForm() {
  const router = useRouter()
  const t = useTranslations("exercise")
  const tc = useTranslations("common")

  const INTENSITY_OPTIONS = [
    { value: "light" as const, emoji: "🚶", label: t("intensityLight") },
    { value: "moderate" as const, emoji: "🏃", label: t("intensityModerate") },
    { value: "high" as const, emoji: "🔥", label: t("intensityHigh") },
    { value: "extreme" as const, emoji: "💀", label: t("intensityExtreme") },
  ]

  const getLocalDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const getLocalTimeString = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [duration, setDuration] = useState("")
  const [intensity, setIntensity] = useState<Intensity>("")
  const [date, setDate] = useState(getLocalDateString())
  const [time, setTime] = useState(getLocalTimeString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchSuggestions() {
      if (name.trim().length < 2) { setSuggestions([]); return }
      try {
        const response = await fetch(`/api/exercise/search?q=${encodeURIComponent(name)}`, { signal: controller.signal })
        if (response.ok) { const data = await response.json(); setSuggestions(data.suggestions || []) }
      } catch (error) { if ((error as Error).name !== "AbortError") console.error("Error fetching suggestions:", error) }
    }
    const timeoutId = setTimeout(fetchSuggestions, 200)
    return () => { clearTimeout(timeoutId); controller.abort() }
  }, [name])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelectSuggestion(suggestion: ExerciseSuggestion) {
    setName(suggestion.name); setCalories(suggestion.calories.toString())
    if (suggestion.duration) setDuration(suggestion.duration.toString())
    setSuggestions([]); setShowSuggestions(false)
  }

  async function handleEstimateCalories() {
    if (!name.trim()) { toast.error(t("enterNameFirst")); return }
    setIsEstimating(true)
    try {
      const response = await fetch("/api/estimate-exercise-calories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exerciseName: name, duration: duration ? parseInt(duration) : null, intensity: intensity || null }) })
      if (response.ok) {
        const data = await response.json()
        if (data.calories > 0) { setCalories(data.calories.toString()); toast.success(t("estimatedKcal", { calories: data.calories })) }
        else toast.error(t("estimateFailed"))
      } else { const errorData = await response.json(); toast.error(errorData.error || t("estimateErrorFallback")) }
    } catch (error) { console.error("Error estimating calories:", error); toast.error(t("estimateError")) }
    finally { setIsEstimating(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsSubmitting(true)
    try {
      const dateTimeStr = `${date}T${time}:00.000Z`
      const response = await fetch("/api/exercise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, calories: parseFloat(calories), duration: duration ? parseInt(duration) : null, date: dateTimeStr }) })
      if (response.ok) {
        setName(""); setCalories(""); setDuration(""); setIntensity(""); setDate(getLocalDateString()); setTime(getLocalTimeString())
        toast.success(t("createdSuccess")); router.refresh()
      } else { const errorData = await response.json(); toast.error(errorData.error || t("createFailedFallback")) }
    } catch (error) { console.error("Error submitting exercise:", error); toast.error(t("createError")) }
    finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input ref={inputRef} id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setShowSuggestions(true)} placeholder={t("namePlaceholder")} required autoComplete="off" />
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button key={index} type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center" onClick={() => handleSelectSuggestion(suggestion)}>
                    <span className="truncate">{suggestion.name}</span>
                    <span className="text-muted-foreground ml-2 shrink-0">{Math.round(suggestion.calories)} {tc("kcal")}{suggestion.duration && ` · ${suggestion.duration}m`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {INTENSITY_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setIntensity(intensity === opt.value ? "" : opt.value)}
                className={`w-9 h-9 rounded-md text-lg transition-all ${intensity === opt.value ? "bg-primary/20 ring-2 ring-primary scale-110" : "bg-muted hover:bg-muted/80"}`}
                title={opt.label}>{opt.emoji}</button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {intensity ? `${t("intensityPrefix")} ${INTENSITY_OPTIONS.find((o) => o.value === intensity)?.label}` : t("selectIntensity")}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="calories">{t("caloriesLabel")}</Label>
        <div className="flex gap-2">
          <Input id="calories" type="number" step="0.1" min="0" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder={t("caloriesPlaceholder")} required className="flex-1" />
          <Button type="button" variant="outline" size="icon" onClick={handleEstimateCalories} disabled={isEstimating || !name.trim()} title={tc("estimateAI")}>
            <Sparkles className={`h-4 w-4 ${isEstimating ? "animate-pulse" : ""}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{tc("estimateAIHelp")}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">{t("durationLabel")}</Label>
        <Input id="duration" type="number" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={t("durationPlaceholder")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="date">{tc("date")}</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="min-w-0" />
        </div>
        <div className="space-y-2 min-w-0">
          <Label htmlFor="time">{tc("time")}</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="min-w-0" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? tc("submitting") : t("addEntry")}
      </Button>
    </form>
  )
}
