"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarkdownContent } from "@/components/markdown-content"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Send,
  Loader2,
  Paperclip,
  X,
  CheckCircle2,
  Clock,
  FlaskConical,
  Pencil,
  Check,
} from "lucide-react"

interface LabFile {
  id: string
  name: string
  mimeType: string
  createdAt: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  fileNames?: string[]
}

export default function LabPage() {
  const [files, setFiles] = useState<LabFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set())
  const [attachedFileIds, setAttachedFileIds] = useState<Set<string>>(new Set())
  const [showFilePicker, setShowFilePicker] = useState(false)
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editingFileName, setEditingFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Fetch files on mount
  useEffect(() => {
    fetchFiles()
  }, [])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowFilePicker(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function fetchFiles() {
    try {
      const res = await fetch("/api/lab")
      if (res.ok) {
        const data = await res.json()
        setFiles(data)
      }
    } catch (err) {
      console.error("Error fetching files:", err)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/lab", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`"${data.name}" subido correctamente`)
        fetchFiles()
      } else {
        toast.error(data.error || "Error al subir archivo")
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Error de conexión al subir")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/lab?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id))
        setSelectedFileIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        setAttachedFileIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        toast.success("Archivo eliminado")
      }
    } catch (err) {
      toast.error("Error al eliminar")
    }
  }

  function startRenaming(file: LabFile) {
    setEditingFileId(file.id)
    setEditingFileName(file.name)
  }

  async function handleRename(id: string) {
    const trimmed = editingFileName.trim()
    if (!trimmed) {
      setEditingFileId(null)
      return
    }

    try {
      const res = await fetch("/api/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: trimmed }),
      })

      if (res.ok) {
        const updated = await res.json()
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: updated.name } : f)))
        toast.success("Nombre actualizado")
      } else {
        toast.error("Error al renombrar")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setEditingFileId(null)
    }
  }

  function toggleFileSelection(id: string) {
    setSelectedFileIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAttachedFile(id: string) {
    setAttachedFileIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function streamResponse(
    body: Record<string, unknown>,
    setLoading: (v: boolean) => void
  ) {
    setLoading(true)

    // Add a placeholder assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/lab/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Error desconocido" }))
        toast.error(errData.error || "Error en el análisis")
        // Remove the empty placeholder
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        toast.error("No se pudo leer la respuesta")
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        accumulated += decoder.decode(value, { stream: true })

        // Update the last message (the assistant placeholder) with accumulated text
        const current = accumulated
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: current }
          return updated
        })
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze() {
    if (selectedFileIds.size === 0) {
      toast.error("Selecciona al menos un archivo para analizar")
      return
    }

    const fileNames = files
      .filter((f) => selectedFileIds.has(f.id))
      .map((f) => f.name)

    setMessages((prev) => [
      ...prev,
      { role: "user", content: "Analizar resultados de laboratorio", fileNames },
    ])

    await streamResponse(
      { fileIds: Array.from(selectedFileIds), mode: "analyze" },
      setIsAnalyzing
    )
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    const prompt = chatInput.trim()
    if (!prompt) return

    const idsToSend = attachedFileIds.size > 0 ? attachedFileIds : selectedFileIds
    if (idsToSend.size === 0) {
      toast.error("Adjunta o selecciona al menos un archivo como referencia")
      return
    }

    const fileNames = files
      .filter((f) => idsToSend.has(f.id))
      .map((f) => f.name)

    setMessages((prev) => [...prev, { role: "user", content: prompt, fileNames }])
    setChatInput("")

    await streamResponse(
      { prompt, fileIds: Array.from(idsToSend), mode: "chat" },
      setIsSending
    )
  }

  const attachedFiles = files.filter((f) => attachedFileIds.has(f.id))

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Laboratorio"
            description="Sube tus análisis y obtené insights con IA"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            {/* ═══ LEFT COLUMN — File list ═══ */}
            <div className="space-y-4">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FlaskConical className="h-3.5 w-3.5" />
                      Archivos ({files.length})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] uppercase tracking-widest"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-3 w-3 mr-1.5" />
                          Subir
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv"
                    onChange={handleUpload}
                  />

                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-zinc-600" />
                      </div>
                      <p className="text-xs text-zinc-500 mb-1">Sin archivos aún</p>
                      <p className="text-[10px] text-zinc-600 mb-4 max-w-[200px]">
                        Sube PDFs, imágenes o archivos de texto con tus resultados de laboratorio
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1.5" />
                        Subir archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {files.map((file) => {
                        const isSelected = selectedFileIds.has(file.id)
                        return (
                          <div
                            key={file.id}
                            className={cn(
                              "flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all group",
                              "border border-transparent",
                              isSelected
                                ? "bg-primary/10 border-primary/20"
                                : "hover:bg-white/[0.03]"
                            )}
                            onClick={() => toggleFileSelection(file.id)}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors",
                                isSelected ? "bg-primary/20" : "bg-white/[0.04]"
                              )}
                            >
                              {isSelected ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4 text-zinc-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {editingFileId === file.id ? (
                                <form
                                  className="flex items-center gap-1"
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleRename(file.id)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    value={editingFileName}
                                    onChange={(e) => setEditingFileName(e.target.value)}
                                    className="h-6 text-xs px-1.5 py-0 bg-white/[0.06] border-white/10"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Escape") {
                                        e.stopPropagation()
                                        setEditingFileId(null)
                                      }
                                    }}
                                    onBlur={() => handleRename(file.id)}
                                  />
                                  <Button
                                    type="submit"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-primary hover:text-primary shrink-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                </form>
                              ) : (
                                <p className="text-xs font-medium text-zinc-200 truncate">
                                  {file.name}
                                </p>
                              )}
                              <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {new Date(file.createdAt).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startRenaming(file)
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(file.id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/[0.04]">
                      <Button
                        className="w-full h-9 text-[10px] font-bold uppercase tracking-widest gap-2"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || selectedFileIds.size === 0}
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        Analizar{selectedFileIds.size > 0 ? ` (${selectedFileIds.size})` : ""}
                      </Button>
                      <p className="text-[10px] text-zinc-600 text-center mt-2">
                        Selecciona archivos y presiona para analizar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ═══ RIGHT COLUMN — AI Chat ═══ */}
            <Card className="glass-card flex flex-col min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-180px)]">
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Análisis e Insights
                </CardTitle>
              </CardHeader>

              {/* Chat messages */}
              <CardContent className="flex-1 overflow-y-auto pt-0 pb-0 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <FlaskConical className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-300 mb-1">
                      Análisis de laboratorio
                    </h3>
                    <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
                      Sube tus resultados, seleccionalos y presiona &ldquo;Analizar&rdquo; para obtener
                      insights. También podes hacer preguntas específicas.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg px-4 py-3",
                          msg.role === "user"
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-white/[0.03] border border-white/[0.05]"
                        )}
                      >
                        {msg.fileNames && msg.fileNames.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {msg.fileNames.map((name, j) => (
                              <span
                                key={j}
                                className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400"
                              >
                                <Paperclip className="h-2 w-2" />
                                {name}
                              </span>
                            ))}
                          </div>
                        )}
                        {msg.role === "assistant" ? (
                          <MarkdownContent content={msg.content} />
                        ) : (
                          <p className="text-sm text-zinc-200">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {(isAnalyzing || isSending) && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analizando...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </CardContent>

              {/* Input area */}
              <div className="shrink-0 p-4 border-t border-white/[0.04]">
                {/* Attached files chips */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {attachedFiles.map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                      >
                        <FileText className="h-2.5 w-2.5" />
                        {f.name}
                        <button
                          onClick={() => toggleAttachedFile(f.id)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <form onSubmit={handleChat} className="flex items-center gap-2">
                  {/* Attach file button */}
                  <div className="relative" ref={pickerRef}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 shrink-0",
                        attachedFileIds.size > 0 ? "text-primary" : "text-zinc-500"
                      )}
                      onClick={() => setShowFilePicker(!showFilePicker)}
                      title="Adjuntar archivo como referencia"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* File picker dropdown */}
                    {showFilePicker && files.length > 0 && (
                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-white/[0.06] rounded-md shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                        <p className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                          Adjuntar como referencia
                        </p>
                        {files.map((f) => {
                          const isAttached = attachedFileIds.has(f.id)
                          return (
                            <button
                              key={f.id}
                              type="button"
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/[0.04] transition-colors",
                                isAttached && "text-primary"
                              )}
                              onClick={() => {
                                toggleAttachedFile(f.id)
                              }}
                            >
                              {isAttached ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              )}
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
                    placeholder="Preguntá sobre tus resultados..."
                    className="flex-1 h-9 bg-white/[0.02] border-white/[0.05] text-sm placeholder:text-zinc-600"
                    disabled={isSending || isAnalyzing}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    disabled={isSending || isAnalyzing || !chatInput.trim()}
                  >
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
          </div>
        </div>
      </main>
    </div>
  )
}
