"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditWeightDialog } from "@/components/edit-weight-dialog"
import { useTranslations } from "next-intl"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface WeightEntryListProps {
  entries: WeightEntry[]
}

export function WeightEntryList({ entries }: WeightEntryListProps) {
  const router = useRouter()
  const t = useTranslations("weight")
  const tc = useTranslations("common")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<WeightEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null)

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/weight?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success(t("deletedSuccess"))
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("deleteFailedFallback"))
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error)
      toast.error(t("deleteError"))
    }
  }

  return (
    <>
      <div className="w-full overflow-hidden">
        {entries
          .slice()
          .reverse()
          .map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between border p-2 sm:p-3 gap-2 rounded-none first:rounded-t-lg last:rounded-b-lg border-b-0 last:border-b w-full overflow-hidden"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate" title={`${entry.weight} ${tc("kg")}`}>
                  {entry.weight} {tc("kg")}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEntryToEdit(entry)
                    setEditDialogOpen(true)
                  }}
                  className="hover:bg-muted"
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
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>

      <EditWeightDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        entry={entryToEdit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (entryToDelete) {
            handleDelete(entryToDelete.id)
            setEntryToDelete(null)
          }
        }}
        title={t("deleteDialogTitle")}
        description={t("deleteDialogDescription")}
        itemName={entryToDelete ? `${entryToDelete.weight} ${tc("kg")} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined}
      />
    </>
  )
}
