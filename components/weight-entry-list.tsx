"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit, MoreVertical, Weight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditWeightDialog } from "@/components/edit-weight-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface WeightEntry {
  id: string
  weight: number
  date: Date | string
}

interface WeightEntryListProps {
  entries: WeightEntry[]
  limit?: number
  showAllHref?: string
}

export function WeightEntryList({ entries, limit, showAllHref }: WeightEntryListProps) {
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
      <div
        className="w-full overflow-hidden rounded-lg"
        role="list"
        aria-label={t("listAria")}
      >
        {entries
          .slice()
          .reverse()
          .slice(0, limit)
          .map((entry, index, arr) => (
            <div
              key={entry.id}
              role="listitem"
              className={cn(
                "flex items-center border border-white/5 p-3 sm:p-4 gap-3",
                "transition-all duration-200 ease-out",
                "hover:bg-white/[0.02] hover:border-white/10",
                "group cursor-default",
                index === 0 && "rounded-t-lg",
                index === arr.length - 1 && !showAllHref && "rounded-b-lg",
                index !== arr.length - 1 && "border-b-0",
              )}
            >
              {/* Icon indicator */}
              <div className="hidden sm:flex w-8 h-8 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                <Weight className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>

              {/* Entry content */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm sm:text-base text-white truncate" title={`${entry.weight} ${tc("kg")}`}>
                  {entry.weight} {tc("kg")}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(entry.date).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                  })}
                </p>
              </div>

              {/* Kebab action menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-white shrink-0"
                    aria-label={`${tc("actions")} ${entry.weight} ${tc("kg")}`}
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
          ))}
      </div>

      {showAllHref && (
        <Link href={showAllHref}>
          <Button
            variant="ghost"
            className="w-full mt-2 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
          >
            {t("showAll")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      )}

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
