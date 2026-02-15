"use client"

import { useTranslations } from "next-intl"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { PageHeader } from "@/components/page-header"
import { useLabState } from "@/components/lab/useLabState"
import { LabFileList } from "@/components/lab/LabFileList"
import { LabChatArea } from "@/components/lab/LabChatArea"

export default function LabPage() {
  const t = useTranslations("lab")
  const lab = useLabState()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title={t("title")} description={t("description")} />

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <LabFileList
              files={lab.files}
              selectedFileIds={lab.selectedFileIds}
              isUploading={lab.isUploading}
              isAnalyzing={lab.isAnalyzing}
              editingFileId={lab.editingFileId}
              editingFileName={lab.editingFileName}
              setEditingFileName={lab.setEditingFileName}
              setEditingFileId={lab.setEditingFileId}
              fileInputRef={lab.fileInputRef}
              onUpload={lab.handleUpload}
              onDelete={lab.handleDelete}
              onToggleSelection={lab.toggleFileSelection}
              onStartRenaming={lab.startRenaming}
              onRename={lab.handleRename}
              onAnalyze={lab.handleAnalyze}
            />

            <LabChatArea
              files={lab.files}
              messages={lab.messages}
              isAnalyzing={lab.isAnalyzing}
              isSending={lab.isSending}
              chatInput={lab.chatInput}
              setChatInput={lab.setChatInput}
              attachedFiles={lab.attachedFiles}
              attachedFileIds={lab.attachedFileIds}
              selectedFileIds={lab.selectedFileIds}
              showFilePicker={lab.showFilePicker}
              setShowFilePicker={lab.setShowFilePicker}
              chatEndRef={lab.chatEndRef}
              pickerRef={lab.pickerRef}
              onToggleAttachedFile={lab.toggleAttachedFile}
              onChat={lab.handleChat}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
