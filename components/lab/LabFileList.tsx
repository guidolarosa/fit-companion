"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Upload, FileText, Trash2, Sparkles, Loader2,
  CheckCircle2, Clock, FlaskConical, Pencil, Check,
} from "lucide-react"
import type { LabFile } from "./useLabState"

interface LabFileListProps {
  files: LabFile[]
  selectedFileIds: Set<string>
  isUploading: boolean
  isAnalyzing: boolean
  editingFileId: string | null
  editingFileName: string
  setEditingFileName: (v: string) => void
  setEditingFileId: (v: string | null) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (id: string) => void
  onToggleSelection: (id: string) => void
  onStartRenaming: (file: LabFile) => void
  onRename: (id: string) => void
  onAnalyze: () => void
}

export function LabFileList({
  files, selectedFileIds, isUploading, isAnalyzing,
  editingFileId, editingFileName, setEditingFileName, setEditingFileId,
  fileInputRef, onUpload, onDelete, onToggleSelection,
  onStartRenaming, onRename, onAnalyze,
}: LabFileListProps) {
  const t = useTranslations("lab")

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FlaskConical className="h-3.5 w-3.5" />
              {t("filesTitle")} ({files.length})
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
                  {t("uploadButton")}
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
            onChange={onUpload}
          />

          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-xs text-zinc-500 mb-1">{t("emptyTitle")}</p>
              <p className="text-[10px] text-zinc-600 mb-4 max-w-[200px]">{t("emptyDescription")}</p>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3 w-3 mr-1.5" />
                {t("uploadFileButton")}
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
                      "flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all group border border-transparent",
                      isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-white/[0.03]"
                    )}
                    onClick={() => onToggleSelection(file.id)}
                  >
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors", isSelected ? "bg-primary/20" : "bg-white/[0.04]")}>
                      {isSelected ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-zinc-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingFileId === file.id ? (
                        <form
                          className="flex items-center gap-1"
                          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); onRename(file.id) }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Input
                            value={editingFileName}
                            onChange={(e) => setEditingFileName(e.target.value)}
                            className="h-6 text-xs px-1.5 py-0 bg-white/[0.06] border-white/10"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); setEditingFileId(null) } }}
                            onBlur={() => onRename(file.id)}
                          />
                          <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 text-primary hover:text-primary shrink-0">
                            <Check className="h-3 w-3" />
                          </Button>
                        </form>
                      ) : (
                        <p className="text-xs font-medium text-zinc-200 truncate">{file.name}</p>
                      )}
                      <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(file.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] shrink-0" onClick={(e) => { e.stopPropagation(); onStartRenaming(file) }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={(e) => { e.stopPropagation(); onDelete(file.id) }}>
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
              <Button className="w-full h-9 text-[10px] font-bold uppercase tracking-widest gap-2" onClick={onAnalyze} disabled={isAnalyzing || selectedFileIds.size === 0}>
                {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {t("analyzeButton")}{selectedFileIds.size > 0 ? ` (${selectedFileIds.size})` : ""}
              </Button>
              <p className="text-[10px] text-zinc-600 text-center mt-2">{t("analyzeHint")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
