"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditWeightDialog } from "@/components/edit-weight-dialog"
import { PaginationControls } from "@/components/pagination-controls"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface AllWeightEntriesTableProps {
  entries: WeightEntry[]
  currentPage: number
  totalPages: number
}

export function AllWeightEntriesTable({ entries, currentPage, totalPages }: AllWeightEntriesTableProps) {
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
        toast.success(t("allDeletedSuccess"))
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("allDeleteFailedFallback"))
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error)
      toast.error(t("allDeleteError"))
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b font-semibold text-sm text-muted-foreground">
            <div className="col-span-5 sm:col-span-5">{t("tableWeightHeader")}</div>
            <div className="col-span-5 sm:col-span-5">{t("tableDateHeader")}</div>
            <div className="col-span-2 sm:col-span-2 text-right" />
          </div>

          {/* Table rows */}
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted/50 transition-colors"
            >
              <div className="col-span-5 sm:col-span-5 min-w-0">
                <p className="font-semibold truncate" title={`${entry.weight} ${tc("kg")}`}>
                  {entry.weight} {tc("kg")}
                </p>
              </div>
              <div className="col-span-5 sm:col-span-5">
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-2 flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEntryToEdit(entry)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit /> {tc("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      destructive
                      onClick={() => {
                        setEntryToDelete(entry)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 /> {tc("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/weight/all" />

      <EditWeightDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} entry={entryToEdit} />

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
          entryToDelete ? `${entryToDelete.weight} ${tc("kg")} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined
        }
      />
    </>
  )
}
