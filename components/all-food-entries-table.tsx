"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditFoodDialog } from "@/components/edit-food-dialog"
import { CaloriePill } from "@/components/calorie-pill"
import { PaginationControls } from "@/components/pagination-controls"
import { useTranslations } from "next-intl"

interface FoodEntry {
  id: string
  name: string
  calories: number
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  fiber?: number | null
  sugar?: number | null
  date: Date | string
}

interface AllFoodEntriesTableProps {
  entries: FoodEntry[]
  currentPage: number
  totalPages: number
}

export function AllFoodEntriesTable({ entries, currentPage, totalPages }: AllFoodEntriesTableProps) {
  const router = useRouter()
  const t = useTranslations("food")
  const tc = useTranslations("common")
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
        toast.success(t("allDeletedSuccess"))
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || t("allDeleteFailedFallback"))
      }
    } catch (error) {
      console.error("Error deleting food entry:", error)
      toast.error(t("allDeleteError"))
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_repeat(6,minmax(0,1fr))_auto] gap-2 p-3 border-b font-semibold text-xs text-muted-foreground">
            <div>{t("tableNameHeader")}</div>
            <div>{t("tableDateHeader")}</div>
            <div className="text-right">{t("tableKcalHeader")}</div>
            <div className="text-right">{tc("protShort")}</div>
            <div className="text-right">{tc("carbsShort")}</div>
            <div className="text-right">{tc("fatShort")}</div>
            <div className="text-right">{tc("fiberShort")}</div>
            <div className="text-right">{tc("sugarShort")}</div>
            <div className="text-right w-20">{tc("actions")}</div>
          </div>

          {/* Mobile header */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b font-semibold text-sm text-muted-foreground sm:hidden">
            <div className="col-span-5">{t("tableNameHeader")}</div>
            <div className="col-span-3">{t("tableDateHeader")}</div>
            <div className="col-span-2 text-right">{t("tableKcalHeader")}</div>
            <div className="col-span-2 text-right">{tc("actions")}</div>
          </div>

          {/* Table rows */}
          {entries.map((entry) => (
            <div key={entry.id}>
              {/* Desktop row */}
              <div
                className="hidden sm:grid sm:grid-cols-[2fr_1fr_repeat(6,minmax(0,1fr))_auto] gap-2 p-3 border-b last:border-b-0 items-center hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" title={entry.name}>
                    {entry.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                  </p>
                </div>
                <div className="text-right">
                  <CaloriePill calories={entry.calories} />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {entry.protein != null ? `${Math.round(entry.protein)}g` : '-'}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {entry.carbs != null ? `${Math.round(entry.carbs)}g` : '-'}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {entry.fat != null ? `${Math.round(entry.fat)}g` : '-'}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {entry.fiber != null ? `${Math.round(entry.fiber)}g` : '-'}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {entry.sugar != null ? `${Math.round(entry.sugar)}g` : '-'}
                </div>
                <div className="flex items-center justify-end gap-1 w-20">
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

              {/* Mobile row */}
              <div
                className="grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted/50 transition-colors sm:hidden"
              >
                <div className="col-span-5 min-w-0">
                  <p className="font-semibold text-sm truncate" title={entry.name}>
                    {entry.name}
                  </p>
                  {(entry.protein != null || entry.carbs != null || entry.fat != null) && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {entry.protein != null && `${tc("protShort")}:${Math.round(entry.protein)}g `}
                      {entry.carbs != null && `${tc("carbsShort")}:${Math.round(entry.carbs)}g `}
                      {entry.fat != null && `${tc("fatShort")}:${Math.round(entry.fat)}g`}
                    </p>
                  )}
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <CaloriePill calories={entry.calories} />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
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
            </div>
          ))}
        </div>
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/food/all" />

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
        title={t("allDeleteDialogTitle")}
        description={t("allDeleteDialogDescription")}
        itemName={entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "MMM d, yyyy")}` : undefined}
      />
    </>
  )
}
