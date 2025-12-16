"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditWeightDialog } from "@/components/edit-weight-dialog"

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
        toast.success("Weight entry deleted successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete weight entry")
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error)
      toast.error("An error occurred while deleting the weight entry")
    }
  }

  return (
    <>
      <div>
        {entries
          .slice()
          .reverse()
          .map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between  border p-3 gap-2 rounded-none first:rounded-t-lg last:rounded-b-lg border-b-0 last:border-b"
            >
              <div>
                <p className="font-semibold">{entry.weight} kg</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(entry.date), "MMM d, yyyy 'at' HH:mm")}
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
        title="Delete Weight Entry"
        description="Are you sure you want to delete this weight entry? This action cannot be undone."
        itemName={entryToDelete ? `${entryToDelete.weight} kg - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined}
      />
    </>
  )
}

