"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WeightForm() {
  const router = useRouter()
  const t = useTranslations("weight")
  const tc = useTranslations("common")
  const getLocalDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(getLocalDateString())
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dateTimeStr = `${date}T00:00:00.000Z`
      const response = await fetch("/api/weight", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: parseFloat(weight), date: dateTimeStr }),
      })
      if (response.ok) {
        setWeight(""); setDate(getLocalDateString())
        toast.success(t("createdSuccess")); router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("createFailedFallback"))
      }
    } catch (error) {
      console.error("Error submitting weight:", error)
      toast.error(t("createError"))
    } finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">{t("weightLabel")}</Label>
        <Input id="weight" type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={t("weightPlaceholder")} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">{tc("date")}</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? tc("submitting") : t("addEntry")}
      </Button>
    </form>
  )
}
