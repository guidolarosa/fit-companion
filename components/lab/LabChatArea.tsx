"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarkdownContent } from "@/components/markdown-content"
import { cn } from "@/lib/utils"
import {
  FileText, Sparkles, Send, Loader2,
  Paperclip, X, CheckCircle2, FlaskConical,
} from "lucide-react"
import type { LabFile, ChatMessage } from "./useLabState"

interface LabChatAreaProps {
  files: LabFile[]
  messages: ChatMessage[]
  isAnalyzing: boolean
  isSending: boolean
  chatInput: string
  setChatInput: (v: string) => void
  attachedFiles: LabFile[]
  attachedFileIds: Set<string>
  selectedFileIds: Set<string>
  showFilePicker: boolean
  setShowFilePicker: (v: boolean) => void
  chatEndRef: React.RefObject<HTMLDivElement | null>
  pickerRef: React.RefObject<HTMLDivElement | null>
  onToggleAttachedFile: (id: string) => void
  onChat: (e: React.FormEvent) => void
}

export function LabChatArea({
  files, messages, isAnalyzing, isSending,
  chatInput, setChatInput,
  attachedFiles, attachedFileIds, selectedFileIds,
  showFilePicker, setShowFilePicker,
  chatEndRef, pickerRef,
  onToggleAttachedFile, onChat,
}: LabChatAreaProps) {
  const t = useTranslations("lab")

  return (
    <Card className="glass-card flex flex-col min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-180px)]">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("chatTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pt-0 pb-0 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300 mb-1">{t("chatEmptyTitle")}</h3>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">{t("chatEmptyDescription")}</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-lg px-4 py-3", msg.role === "user" ? "bg-primary/10 border border-primary/20" : "bg-white/[0.03] border border-white/[0.05]")}>
                {msg.fileNames && msg.fileNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {msg.fileNames.map((name, j) => (
                      <span key={j} className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400">
                        <Paperclip className="h-2 w-2" />
                        {name}
                      </span>
                    ))}
                  </div>
                )}
                {msg.role === "assistant" ? <MarkdownContent content={msg.content} /> : <p className="text-sm text-zinc-200">{msg.content}</p>}
              </div>
            </div>
          ))
        )}
        {(isAnalyzing || isSending) && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t("analyzing")}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </CardContent>

      <div className="shrink-0 p-4 border-t border-white/[0.04]">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {attachedFiles.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <FileText className="h-2.5 w-2.5" />
                {f.name}
                <button onClick={() => onToggleAttachedFile(f.id)} className="hover:text-white transition-colors">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={onChat} className="flex items-center gap-2">
          <div className="relative" ref={pickerRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9 shrink-0", attachedFileIds.size > 0 ? "text-primary" : "text-zinc-500")}
              onClick={() => setShowFilePicker(!showFilePicker)}
              title={t("attachTitle")}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {showFilePicker && files.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-white/[0.06] rounded-md shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                <p className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">{t("attachLabel")}</p>
                {files.map((f) => {
                  const isAttached = attachedFileIds.has(f.id)
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={cn("w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/[0.04] transition-colors", isAttached && "text-primary")}
                      onClick={() => onToggleAttachedFile(f.id)}
                    >
                      {isAttached ? <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> : <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0" />}
                      <span className="truncate">{f.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="flex-1 h-9 bg-white/[0.02] border-white/[0.05] text-sm placeholder:text-zinc-600"
            disabled={isSending || isAnalyzing}
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isSending || isAnalyzing || !chatInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {attachedFileIds.size === 0 && selectedFileIds.size === 0 && (
          <p className="text-[10px] text-zinc-600 mt-2">
            Usa <Paperclip className="h-2.5 w-2.5 inline" /> para adjuntar archivos o seleccionalos en la lista
          </p>
        )}
      </div>
    </Card>
  )
}
