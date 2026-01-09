"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditExerciseDialog } from "@/components/edit-exercise-dialog"
import { CaloriePill } from "@/components/calorie-pill"

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
  const searchParams = useSearchParams()
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
        toast.success("Exercise entry deleted successfully!")
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete exercise entry")
      }
    } catch (error) {
      console.error("Error deleting exercise entry:", error)
      toast.error("An error occurred while deleting the exercise entry")
    }
  }

  function createPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `/exercise/all?${params.toString()}`
  }

  function getPageNumbers() {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b font-semibold text-sm text-muted-foreground">
            <div className="col-span-4 sm:col-span-4">Exercise</div>
            <div className="col-span-3 sm:col-span-3">Date</div>
            <div className="col-span-3 sm:col-span-2 text-right">Calories</div>
            <div className="hidden sm:block sm:col-span-1 text-right">Mins</div>
            <div className="col-span-2 sm:col-span-2 text-right">Actions</div>
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
                <p className="text-sm text-muted-foreground">{format(entry.date, "MMM d, yyyy")}</p>
                <p className="text-xs text-muted-foreground sm:hidden">{format(entry.date, "HH:mm")}</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Link href={createPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" disabled={currentPage === 1} className="h-9 w-9 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  )
                }
                const pageNum = page as number
                return (
                  <Link key={pageNum} href={createPageUrl(pageNum)}>
                    <Button
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <Link href={createPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} className="h-9 w-9 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

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
        title="Delete Exercise Entry"
        description="Are you sure you want to delete this exercise entry? This action cannot be undone."
        itemName={
          entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined
        }
      />
    </>
  )
}



