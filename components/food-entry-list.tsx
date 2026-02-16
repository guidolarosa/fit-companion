"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit, UtensilsCrossed, MoreVertical, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditFoodDialog } from "@/components/edit-food-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
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

interface FoodEntryListProps {
  entries: FoodEntry[]
  showViewAll?: boolean
}

export function FoodEntryList({ entries, showViewAll = false }: FoodEntryListProps) {
  const router = useRouter()
  const t = useTranslations("food")
  const tc = useTranslations("common")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<FoodEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<FoodEntry | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [recentlyDeleted, setRecentlyDeleted] = useState<FoodEntry | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/food?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Success feedback per guidelines - with undo option
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-deficit/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-deficit" />
            </div>
            <div>
              <p className="font-medium">{t("deletedTitle")}</p>
              <p className="text-sm text-zinc-400">{t("deletedDescription")}</p>
            </div>
          </div>
        )
        router.refresh()
      } else {
        const errorData = await response.json()
        // Error message per guidelines - calm, solution-focused
        toast.error(errorData.error || t("deleteFailedFallback"))
      }
    } catch (error) {
      console.error("Error deleting food entry:", error)
      toast.error(t("deleteError"))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div 
        className="w-full overflow-hidden rounded-lg"
        role="list"
        aria-label={t("listAria")}
      >
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            role="listitem"
            className={cn(
              "flex items-center border border-white/5 p-3 sm:p-4 gap-3",
              "transition-all duration-200 ease-out",
              "hover:bg-white/[0.02] hover:border-white/10",
              "focus-within:bg-white/[0.02] focus-within:border-white/10",
              "group cursor-default",
              index === 0 && "rounded-t-lg",
              index === entries.length - 1 && "rounded-b-lg",
              index !== entries.length - 1 && "border-b-0",
              deletingId === entry.id && "opacity-50 pointer-events-none"
            )}
          >
            {/* Icon indicator */}
            <div className="hidden sm:flex w-8 h-8 rounded-lg bg-surplus/10 items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-surplus" aria-hidden="true" />
            </div>
            
            {/* Entry content */}
            <div className="min-w-0 flex-1">
              <p 
                className="font-semibold text-sm sm:text-base text-white truncate" 
                title={entry.name}
              >
                {entry.name}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-zinc-500">
                  {new Date(entry.date).toLocaleDateString('es-ES', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric', 
                    timeZone: 'UTC' 
                  })}
                </p>
                {(entry.protein != null || entry.carbs != null || entry.fat != null) && (
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <span className="text-zinc-600">|</span>
                    {entry.protein != null && <span>{tc("protShort")}:{Math.round(entry.protein)}g</span>}
                    {entry.carbs != null && <span>{tc("carbsShort")}:{Math.round(entry.carbs)}g</span>}
                    {entry.fat != null && <span>{tc("fatShort")}:{Math.round(entry.fat)}g</span>}
                    {entry.fiber != null && <span>{tc("fiberShort")}:{Math.round(entry.fiber)}g</span>}
                    {entry.sugar != null && <span>{tc("sugarShort")}:{Math.round(entry.sugar)}g</span>}
                  </div>
                )}
              </div>
            </div>
            
            {/* Calories display - value large, unit small per guidelines */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              <div className="text-right">
                <span className="text-sm sm:text-base font-bold text-white">
                  {Math.round(entry.calories).toLocaleString()}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 ml-1">
                  {tc("kcal")}
                </span>
              </div>
              
              {/* Kebab action menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-white shrink-0"
                    aria-label={`${tc("actions")} ${entry.name}`}
                  >
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
      
      {showViewAll && (
        <Link href="/food/all">
          <Button
            variant="ghost"
            className="w-full mt-2 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
          >
            {tc("viewAll")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
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
        title={t("deleteDialogTitle")}
        description={t("deleteDialogDescription")}
        itemName={entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "d MMM yyyy")}` : undefined}
      />
    </>
  )
}
