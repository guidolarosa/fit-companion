"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { Sparkles, Camera } from "lucide-react"
import { parse, format } from "date-fns"

const MAX_PHOTO_DIMENSION = 1024
const PHOTO_JPEG_QUALITY = 0.85

function resizeImageToJpeg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      let { width, height } = img
      if (width > MAX_PHOTO_DIMENSION || height > MAX_PHOTO_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_PHOTO_DIMENSION) / width)
          width = MAX_PHOTO_DIMENSION
        } else {
          width = Math.round((width * MAX_PHOTO_DIMENSION) / height)
          height = MAX_PHOTO_DIMENSION
        }
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      URL.revokeObjectURL(objectUrl)
      if (!ctx) { reject(new Error("Canvas not supported")); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
        "image/jpeg",
        PHOTO_JPEG_QUALITY
      )
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Failed to load image")) }
    img.src = objectUrl
  })
}

interface FoodSuggestion {
  name: string
  calories: number
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  fiber?: number | null
  sugar?: number | null
}

export function FoodForm() {
  const router = useRouter()
  const t = useTranslations("food")
  const tc = useTranslations("common")
  const locale = useLocale()
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [mode, setMode] = useState<"initial" | "manual" | "review">("initial")
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")
  const [fiber, setFiber] = useState("")
  const [sugar, setSugar] = useState("")
  const [date, setDate] = useState(getLocalDateString())
  const [time, setTime] = useState(getLocalTimeString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false)
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchSuggestions() {
      if (name.trim().length < 2) { setSuggestions([]); return }
      try {
        const response = await fetch(`/api/food/search?q=${encodeURIComponent(name)}`, { signal: controller.signal })
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

  function handleSelectSuggestion(suggestion: FoodSuggestion) {
    setName(suggestion.name)
    setCalories(suggestion.calories.toString())
    setProtein(suggestion.protein != null ? suggestion.protein.toString() : "")
    setCarbs(suggestion.carbs != null ? suggestion.carbs.toString() : "")
    setFat(suggestion.fat != null ? suggestion.fat.toString() : "")
    setFiber(suggestion.fiber != null ? suggestion.fiber.toString() : "")
    setSugar(suggestion.sugar != null ? suggestion.sugar.toString() : "")
    setSuggestions([])
    setShowSuggestions(false)
    setMode("review") // Switch to review mode after selection
  }

  async function handleEstimateCalories() {
    if (!name.trim()) { toast.error(t("enterNameFirst")); return }
    setIsEstimating(true)
    try {
      const response = await fetch("/api/estimate-calories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foodName: name }) })
      if (response.ok) {
        const data = await response.json()
        if (data.calories > 0) {
          setCalories(data.calories.toString())
          setProtein(data.protein != null ? data.protein.toString() : "")
          setCarbs(data.carbs != null ? data.carbs.toString() : "")
          setFat(data.fat != null ? data.fat.toString() : "")
          setFiber(data.fiber != null ? data.fiber.toString() : "")
          setSugar(data.sugar != null ? data.sugar.toString() : "")
          setMode("review") // Switch to review mode after estimation
          toast.success(t("estimatedKcalMacros", { calories: data.calories }))
        } else { toast.error(t("estimateFailed")) }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("estimateErrorFallback"))
      }
    } catch (error) {
      console.error("Error estimating calories:", error)
      toast.error(t("estimateError"))
    } finally { setIsEstimating(false) }
  }

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setIsAnalyzingPhoto(true)
    try {
      const resized = await resizeImageToJpeg(file)
      const formData = new FormData()
      formData.append("image", resized, "photo.jpg")
      formData.append("locale", locale)

      const response = await fetch("/api/estimate-calories-image", { method: "POST", body: formData })
      if (response.ok) {
        const data = await response.json()
        if (data.calories > 0) {
          setName(data.name || name)
          setCalories(data.calories.toString())
          setProtein(data.protein != null ? data.protein.toString() : "")
          setCarbs(data.carbs != null ? data.carbs.toString() : "")
          setFat(data.fat != null ? data.fat.toString() : "")
          setFiber(data.fiber != null ? data.fiber.toString() : "")
          setSugar(data.sugar != null ? data.sugar.toString() : "")
          setMode("review")
          toast.success(t("estimatedKcalMacros", { calories: data.calories }))
        } else { toast.error(t("estimatePhotoFailed")) }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("estimatePhotoErrorFallback"))
      }
    } catch (error) {
      console.error("Error analyzing photo:", error)
      toast.error(t("estimatePhotoError"))
    } finally { setIsAnalyzingPhoto(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dateTimeStr = `${date}T${time}:00.000Z`
      const response = await fetch("/api/food", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, calories: parseFloat(calories), protein: protein ? parseFloat(protein) : null, carbs: carbs ? parseFloat(carbs) : null, fat: fat ? parseFloat(fat) : null, fiber: fiber ? parseFloat(fiber) : null, sugar: sugar ? parseFloat(sugar) : null, date: dateTimeStr }),
      })
      if (response.ok) {
        // Reset form
        setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat(""); setFiber(""); setSugar("")
        setDate(getLocalDateString()); setTime(getLocalTimeString())
        setMode("initial") // Reset mode
        toast.success(t("createdSuccess")); router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("createFailedFallback"))
      }
    } catch (error) {
      console.error("Error submitting food:", error)
      toast.error(t("createError"))
    } finally { setIsSubmitting(false) }
  }

  // Helper component for macro cards
  const MacroCard = ({ label, value, colorClass, borderClass, bgClass }: { label: string, value: string, colorClass: string, borderClass: string, bgClass: string }) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${borderClass} ${bgClass} min-w-[70px]`}>
      <span className={`text-lg font-bold ${colorClass}`}>{value || "0"}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Date and Time (Always visible at top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label className="text-xs text-muted-foreground">{tc("date")}</Label>
          <DatePicker
            value={date ? parse(date, "yyyy-MM-dd", new Date()) : undefined}
            onChange={(d) => setDate(d ? format(d, "yyyy-MM-dd") : getLocalDateString())}
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label className="text-xs text-muted-foreground">{tc("time")}</Label>
          <TimePicker value={time} onChange={(t) => setTime(t)} minuteStep={1} />
        </div>
      </div>

      {/* 2. Food Name + AI Button Group */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <Input 
              ref={inputRef} 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onFocus={() => setShowSuggestions(true)} 
              placeholder={t("namePlaceholder")} 
              required 
              autoComplete="off" 
            />
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button key={index} type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center" onClick={() => handleSelectSuggestion(suggestion)}>
                    <span className="truncate">{suggestion.name}</span>
                    <span className="text-muted-foreground ml-2 shrink-0">{Math.round(suggestion.calories)} {tc("kcal")}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="default" // Changed to default to stand out
            size="icon"
            onClick={handleEstimateCalories}
            disabled={isEstimating || isAnalyzingPhoto || !name.trim()}
            title={tc("estimateAI")}
            className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20"
          >
            <Sparkles className={`h-4 w-4 ${isEstimating ? "animate-pulse" : ""}`} />
          </Button>
          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={() => photoInputRef.current?.click()}
            disabled={isEstimating || isAnalyzingPhoto}
            title={tc("estimatePhotoAI")}
            className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20"
          >
            <Camera className={`h-4 w-4 ${isAnalyzingPhoto ? "animate-pulse" : ""}`} />
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelected}
            className="hidden"
          />
        </div>
      </div>

      {/* 3. Dynamic Content based on Mode */}
      
      {/* INITIAL MODE */}
      {mode === "initial" && (
        <div className="flex justify-center pt-2">
           <Button type="button" variant="ghost" size="sm" onClick={() => setMode("manual")} className="text-muted-foreground hover:text-foreground">
             {tc("inputManually")}
           </Button>
        </div>
      )}

      {/* REVIEW MODE (Macro Cards) */}
      {mode === "review" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
           {/* Kcal Main Display */}
           <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/40">
              <div>
                <p className="text-sm text-muted-foreground">{tc("calories")}</p>
                <p className="text-3xl font-bold">{calories || "0"} <span className="text-sm font-normal text-muted-foreground">kcal</span></p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setMode("manual")} className="h-8 text-xs">
                {tc("editManually")}
              </Button>
           </div>

           {/* Macro Cards Row */}
           {/* Mobile: 2 rows (2 cols then 3 cols) -> grid-cols-6 pattern */}
           {/* Row 1: 2 items (span 3 each) */}
           {/* Row 2: 3 items (span 2 each) */}
           {/* Desktop: 1 row (5 items) -> sm:grid-cols-5 */}
           <div className="grid grid-cols-6 sm:grid-cols-5 gap-2">
              <div className="col-span-3 sm:col-span-1">
                <MacroCard label={tc("protShort")} value={protein} colorClass="text-blue-500" borderClass="border-blue-500/20" bgClass="bg-blue-500/5" />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <MacroCard label={tc("carbsShort")} value={carbs} colorClass="text-emerald-500" borderClass="border-emerald-500/20" bgClass="bg-emerald-500/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <MacroCard label={tc("fatShort")} value={fat} colorClass="text-amber-500" borderClass="border-amber-500/20" bgClass="bg-amber-500/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <MacroCard label={tc("fiberShort")} value={fiber} colorClass="text-cyan-500" borderClass="border-cyan-500/20" bgClass="bg-cyan-500/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <MacroCard label={tc("sugarShort")} value={sugar} colorClass="text-rose-500" borderClass="border-rose-500/20" bgClass="bg-rose-500/5" />
              </div>
           </div>
           
           <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? tc("submitting") : t("addEntry")}
          </Button>
        </div>
      )}

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <Label htmlFor="calories">{t("caloriesLabel")}</Label>
            <Input id="calories" type="number" step="0.1" min="0" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder={t("caloriesPlaceholder")} required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label htmlFor="protein" className="text-xs">{t("proteinLabel")}</Label>
              <Input id="protein" type="number" step="0.1" min="0" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="0" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="carbs" className="text-xs">{t("carbsLabel")}</Label>
              <Input id="carbs" type="number" step="0.1" min="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="0" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fat" className="text-xs">{t("fatLabel")}</Label>
              <Input id="fat" type="number" step="0.1" min="0" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="0" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fiber" className="text-xs">{t("fiberLabel")}</Label>
              <Input id="fiber" type="number" step="0.1" min="0" value={fiber} onChange={(e) => setFiber(e.target.value)} placeholder="0" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sugar" className="text-xs">{t("sugarLabel")}</Label>
              <Input id="sugar" type="number" step="0.1" min="0" value={sugar} onChange={(e) => setSugar(e.target.value)} placeholder="0" className="h-9" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setMode("initial")}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? tc("submitting") : t("addEntry")}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
