"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditExerciseDialog } from "@/components/edit-exercise-dialog"
import { CaloriePill } from "@/components/calorie-pill"
import { PaginationControls } from "@/components/pagination-controls"
import { useTranslations } from "next-intl"

interface ExerciseEntry {
  id: string
  name: string
  calories: number
  duration: number | null
  date: Date | string
}

interface AllExerciseEntriesTableProps {
  entries: ExerciseEntry[]
  currentPage: number
  totalPages: number
}

export function AllExerciseEntriesTable({ entries, currentPage, totalPages }: AllExerciseEntriesTableProps) {
  const router = useRouter()
  const t = useTranslations("exercise")
  const tc = useTranslations("common")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<ExerciseEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<ExerciseEntry | null>(null)

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/exercise?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success(t("allDeletedSuccess"))
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("allDeleteFailedFallback"))
      }
    } catch (error) {
      console.error("Error deleting exercise entry:", error)
      toast.error(t("allDeleteError"))
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b font-semibold text-sm text-muted-foreground">
            <div className="col-span-4 sm:col-span-4">{t("tableExerciseHeader")}</div>
            <div className="col-span-3 sm:col-span-3">{t("tableDateHeader")}</div>
            <div className="col-span-3 sm:col-span-2 text-right">{t("tableCaloriesHeader")}</div>
            <div className="hidden sm:block sm:col-span-1 text-right">{t("tableMinsHeader")}</div>
            <div className="col-span-2 sm:col-span-2 text-right">{tc("actions")}</div>
          </div>

          {/* Table rows */}
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted/50 transition-colors"
            >
              <div className="col-span-4 sm:col-span-4 min-w-0">
                <p className="font-semibold truncate" title={entry.name}>
                  {entry.name}
                </p>
              </div>
              <div className="col-span-3 sm:col-span-3">
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </p>
                <p className="text-xs text-muted-foreground sm:hidden">
                  {new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })}
                </p>
              </div>
              <div className="col-span-3 sm:col-span-2 text-right">
                <CaloriePill calories={entry.calories} />
              </div>
              <div className="hidden sm:block sm:col-span-1 text-right">
                <p className="text-sm text-muted-foreground">{entry.duration ?? "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEntryToEdit(entry)
                    setEditDialogOpen(true)
                  }}
                  className="hover:bg-muted h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEntryToDelete(entry)
                    setDeleteDialogOpen(true)
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/exercise/all" />

      <EditExerciseDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} entry={entryToEdit} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (entryToDelete) {
            handleDelete(entryToDelete.id)
            setEntryToDelete(null)
          }
        }}
        title={t("allDeleteDialogTitle")}
        description={t("allDeleteDialogDescription")}
        itemName={
          entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined
        }
      />
    </>
  )
}
