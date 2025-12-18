"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditFoodDialog } from "@/components/edit-food-dialog"
import { CaloriePill } from "@/components/calorie-pill"

interface FoodEntry {
  id: string
  name: string
  calories: number
  date: Date | string
}

interface FoodEntryListProps {
  entries: FoodEntry[]
  showViewAll?: boolean
}

export function FoodEntryList({ entries, showViewAll = false }: FoodEntryListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<FoodEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<FoodEntry | null>(null)

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/food?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Food entry deleted successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete food entry")
      }
    } catch (error) {
      console.error("Error deleting food entry:", error)
      toast.error("An error occurred while deleting the food entry")
    }
  }

  return (
    <>
      <div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between border p-3 gap-2 rounded-none first:rounded-t-lg last:rounded-b-lg border-b-0 last:border-b flex-wrap sm:flex-nowrap"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate" title={entry.name}>
                {entry.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {format(entry.date, "MMM d, yyyy 'at' HH:mm")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <CaloriePill calories={entry.calories} />
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
          </div>
        ))}
      </div>
      {showViewAll && (
        <div className="mt-4 flex justify-center">
          <Link href="/food/all">
            <Button variant="outline" className="w-full">
              View all
            </Button>
          </Link>
        </div>
      )}

      <EditFoodDialog
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
        title="Delete Food Entry"
        description="Are you sure you want to delete this food entry? This action cannot be undone."
        itemName={entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined}
      />
    </>
  )
}

