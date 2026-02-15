"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export interface LabFile {
  id: string
  name: string
  mimeType: string
  createdAt: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  fileNames?: string[]
}

export function useLabState() {
  const t = useTranslations("lab")
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

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

      const res = await fetch("/api/lab", { method: "POST", body: formData })
      const data = await res.json()

      if (res.ok) {
        toast.success(t("uploadSuccess", { name: data.name }))
        fetchFiles()
      } else {
        toast.error(data.error || t("uploadError"))
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error(t("uploadConnectionError"))
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
        setSelectedFileIds((prev) => { const next = new Set(prev); next.delete(id); return next })
        setAttachedFileIds((prev) => { const next = new Set(prev); next.delete(id); return next })
        toast.success(t("deleteSuccess"))
      }
    } catch {
      toast.error(t("deleteError"))
    }
  }

  function startRenaming(file: LabFile) {
    setEditingFileId(file.id)
    setEditingFileName(file.name)
  }

  async function handleRename(id: string) {
    const trimmed = editingFileName.trim()
    if (!trimmed) { setEditingFileId(null); return }

    try {
      const res = await fetch("/api/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: trimmed }),
      })

      if (res.ok) {
        const updated = await res.json()
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: updated.name } : f)))
        toast.success(t("renameSuccess"))
      } else {
        toast.error(t("renameError"))
      }
    } catch {
      toast.error(t("connectionError"))
    } finally {
      setEditingFileId(null)
    }
  }

  function toggleFileSelection(id: string) {
    setSelectedFileIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function toggleAttachedFile(id: string) {
    setAttachedFileIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  async function streamResponse(body: Record<string, unknown>, setLoading: (v: boolean) => void) {
    setLoading(true)
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/lab/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t("unknownError") }))
        toast.error(errData.error || t("analysisError"))
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      const reader = res.body?.getReader()
      if (!reader) { toast.error(t("readError")); return }

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const current = accumulated
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: current }
          return updated
        })
      }
    } catch {
      toast.error(t("connectionError"))
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze() {
    if (selectedFileIds.size === 0) { toast.error(t("selectFileError")); return }
    const fileNames = files.filter((f) => selectedFileIds.has(f.id)).map((f) => f.name)
    setMessages((prev) => [...prev, { role: "user", content: t("analyzeUserMessage"), fileNames }])
    await streamResponse({ fileIds: Array.from(selectedFileIds), mode: "analyze" }, setIsAnalyzing)
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    const prompt = chatInput.trim()
    if (!prompt) return

    const idsToSend = attachedFileIds.size > 0 ? attachedFileIds : selectedFileIds
    if (idsToSend.size === 0) { toast.error(t("attachOrSelectError")); return }

    const fileNames = files.filter((f) => idsToSend.has(f.id)).map((f) => f.name)
    setMessages((prev) => [...prev, { role: "user", content: prompt, fileNames }])
    setChatInput("")
    await streamResponse({ prompt, fileIds: Array.from(idsToSend), mode: "chat" }, setIsSending)
  }

  const attachedFiles = files.filter((f) => attachedFileIds.has(f.id))

  return {
    files, isUploading, isAnalyzing, isSending, messages,
    chatInput, setChatInput,
    selectedFileIds, attachedFileIds, attachedFiles,
    showFilePicker, setShowFilePicker,
    editingFileId, setEditingFileId, editingFileName, setEditingFileName,
    fileInputRef, chatEndRef, pickerRef,
    handleUpload, handleDelete, startRenaming, handleRename,
    toggleFileSelection, toggleAttachedFile,
    handleAnalyze, handleChat,
  }
}
