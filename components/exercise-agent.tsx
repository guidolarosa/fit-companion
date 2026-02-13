"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MarkdownContent } from "@/components/markdown-content"

export function ExerciseAgent() {
  const t = useTranslations("agent")
  const tc = useTranslations("common")
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/exercise-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()
      setResponse(data.response || tc("noResponse"))
    } catch (error) {
      console.error("Error getting AI response:", error)
      setResponse(tc("aiError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">{t("exerciseLabel")}</Label>
          <Textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("exercisePlaceholder")}
            rows={3}
          />
        </div>
        <Button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? tc("thinking") : tc("askAI")}
        </Button>
      </form>

      {response && (
        <Card className="overflow-hidden">
          <CardContent className="pt-6 overflow-hidden">
            <MarkdownContent content={response} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
