"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { MarkdownContent } from "@/components/markdown-content"
import { Sparkles, Send, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AgentChat() {
  const t = useTranslations("agent")
  const tc = useTranslations("common")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "0"
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = Math.min(scrollHeight, 160) + "px"
  }, [input])

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Add an empty assistant message that we'll stream into
    const assistantId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ])

    try {
      const res = await fetch("/api/fitty-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: data.error || tc("aiError") }
              : m
          )
        )
        return
      }

      // Stream the response
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && !m.content
            ? { ...m, content: tc("connectionError") }
            : m
        )
      )
    } finally {
      setIsLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSuggestionClick(text: string) {
    setInput(text)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* ═══ Messages area ═══ */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {isEmpty ? (
          <EmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) =>
              // Hide the empty assistant bubble while streaming hasn't started
              message.role === "assistant" && !message.content ? null : (
                <ChatBubble key={message.id} message={message} />
              )
            )}

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <TypingIndicator />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ═══ Input area ═══ */}
      <div className="shrink-0 border-t border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto px-4 py-4"
        >
          <div className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 focus-within:border-primary/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chatPlaceholder")}
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none !outline-none !ring-0 !ring-offset-0 !border-none !shadow-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 min-h-[24px] max-h-[160px] leading-6"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="shrink-0 h-8 w-8 min-h-0 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:bg-zinc-700 transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-zinc-600 text-center mt-2">
            {t("chatDisclaimer")}
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Empty state (no messages yet) ─────────────────────────────────
function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const t = useTranslations("agent")

  const suggestions = [
    { key: "s1", text: t("suggestion1") },
    { key: "s2", text: t("suggestion2") },
    { key: "s3", text: t("suggestion3") },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="max-w-md text-center">
        {/* Fitty avatar */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>

        <h2 className="text-xl font-heading font-bold text-white mb-2">
          {t("chatWelcomeTitle")}
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          {t("chatWelcomeDesc")}
        </p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mx-auto">
          {suggestions.map((s) => (
            <button
              key={s.key}
              type="button"
              className="text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-zinc-400 hover:text-zinc-200 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all h-full"
              onClick={() => onSuggestionClick(s.text)}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Chat bubble ───────────────────────────────────────────────────
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-br-md"
            : "bg-white/[0.03] border border-white/[0.06] text-zinc-200 rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} />
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-zinc-400" />
        </div>
      )}
    </div>
  )
}

// ─── Typing indicator ──────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
