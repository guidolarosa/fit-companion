"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

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
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch suggestions when name changes
  useEffect(() => {
    const controller = new AbortController()

    async function fetchSuggestions() {
      if (name.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `/api/food/search?q=${encodeURIComponent(name)}`,
          { signal: controller.signal }
        )
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions || [])
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching suggestions:", error)
        }
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 200)
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [name])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
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
  }

  async function handleEstimateCalories() {
    if (!name.trim()) {
      toast.error("Enter a food name first")
      return
    }

    setIsEstimating(true)
    try {
      const response = await fetch("/api/estimate-calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: name }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.calories > 0) {
          setCalories(data.calories.toString())
          if (data.protein != null) setProtein(data.protein.toString())
          if (data.carbs != null) setCarbs(data.carbs.toString())
          if (data.fat != null) setFat(data.fat.toString())
          if (data.fiber != null) setFiber(data.fiber.toString())
          if (data.sugar != null) setSugar(data.sugar.toString())
          toast.success(`Estimated ${data.calories} kcal + macros`)
        } else {
          toast.error("Could not estimate calories for this item")
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to estimate calories")
      }
    } catch (error) {
      console.error("Error estimating calories:", error)
      toast.error("An error occurred while estimating calories")
    } finally {
      setIsEstimating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Use "Pinned UTC" strategy: store local date/time as UTC to avoid timezone shifts
      const dateTimeStr = `${date}T${time}:00.000Z`
      const response = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          calories: parseFloat(calories),
          protein: protein ? parseFloat(protein) : null,
          carbs: carbs ? parseFloat(carbs) : null,
          fat: fat ? parseFloat(fat) : null,
          fiber: fiber ? parseFloat(fiber) : null,
          sugar: sugar ? parseFloat(sugar) : null,
          date: dateTimeStr,
        }),
      })

      if (response.ok) {
        setName("")
        setCalories("")
        setProtein("")
        setCarbs("")
        setFat("")
        setFiber("")
        setSugar("")
        setDate(getLocalDateString())
        setTime(getLocalTimeString())
        toast.success("Food entry created successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to create food entry")
      }
    } catch (error) {
      console.error("Error submitting food:", error)
      toast.error("An error occurred while creating the food entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Food Name</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="e.g., Grilled Chicken Breast, Apple, etc."
            required
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <span className="truncate">{suggestion.name}</span>
                  <span className="text-muted-foreground ml-2 shrink-0">
                    {Math.round(suggestion.calories)} kcal
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="calories">Calories</Label>
        <div className="flex gap-2">
          <Input
            id="calories"
            type="number"
            step="0.1"
            min="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Enter calories consumed"
            required
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleEstimateCalories}
            disabled={isEstimating || !name.trim()}
            title="Estimate calories with AI"
          >
            <Sparkles className={`h-4 w-4 ${isEstimating ? "animate-pulse" : ""}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter manually or click the AI button to estimate
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="space-y-1">
          <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            min="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            min="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
          <Input
            id="fat"
            type="number"
            step="0.1"
            min="0"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fiber" className="text-xs">Fiber (g)</Label>
          <Input
            id="fiber"
            type="number"
            step="0.1"
            min="0"
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            placeholder="0"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sugar" className="text-xs">Sugar (g)</Label>
          <Input
            id="sugar"
            type="number"
            step="0.1"
            min="0"
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            placeholder="0"
            className="h-9"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="min-w-0"
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="min-w-0"
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Food Entry"}
      </Button>
    </form>
  )
}

