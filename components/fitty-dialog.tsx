"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MarkdownContent } from "@/components/markdown-content"
import { Sparkles } from "lucide-react"

interface FittyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FittyDialog({ open, onOpenChange }: FittyDialogProps) {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Focus textarea when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure dialog is rendered
      setTimeout(() => {
        const textarea = document.getElementById("fitty-question")
        textarea?.focus()
      }, 100)
    } else {
      // Clear form when dialog closes
      setQuestion("")
      setResponse("")
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/fitty-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()
      if (res.ok) {
        setResponse(data.response || "No response received")
      } else {
        setResponse(`Error: ${data.error || "Could not get AI response. Please try again."}`)
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      setResponse("Error: Could not get AI response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Talk with Fitty
          </DialogTitle>
          <DialogDescription>
            Your AI fitness companion. Ask me anything about your weight loss journey, exercise, nutrition, or fitness goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fitty-question">Your question</Label>
              <Textarea
                id="fitty-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How can I improve my weight loss progress? What exercises should I do? How many calories should I eat?"
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Close
              </Button>
              <Button type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? "Thinking..." : "Ask Fitty"}
              </Button>
            </div>
          </form>

          {response && (
            <div className="space-y-2">
              <Label>Fitty&apos;s response</Label>
              <div className="rounded-lg border p-4 bg-muted/50">
                <MarkdownContent content={response} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

