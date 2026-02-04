"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Trash2, Edit, Activity, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { EditExerciseDialog } from "@/components/edit-exercise-dialog"
import { cn } from "@/lib/utils"

interface ExerciseEntry {
  id: string
  name: string
  calories: number
  duration: number | null
  date: Date | string
}

interface ExerciseEntryListProps {
  entries: ExerciseEntry[]
  showViewAll?: boolean
}

export function ExerciseEntryList({ entries, showViewAll = false }: ExerciseEntryListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<ExerciseEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<ExerciseEntry | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/exercise?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Success feedback per guidelines
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-deficit/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-deficit" />
            </div>
            <div>
              <p className="font-medium">Entrada eliminada</p>
              <p className="text-sm text-zinc-400">Registro de ejercicio borrado</p>
            </div>
          </div>
        )
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "No se pudo eliminar. Intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error deleting exercise:", error)
      toast.error("Error de conexión. Verifica tu red.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div 
        className="w-full overflow-hidden rounded-lg"
        role="list"
        aria-label="Lista de ejercicios registrados"
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
            {/* Icon indicator - green for exercise (burning calories) */}
            <div className="hidden sm:flex w-8 h-8 rounded-lg bg-deficit/10 items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-deficit" aria-hidden="true" />
            </div>
            
            {/* Entry content */}
            <div className="min-w-0 flex-1">
              <p 
                className="font-semibold text-sm sm:text-base text-white truncate" 
                title={entry.name}
              >
                {entry.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>
                  {new Date(entry.date).toLocaleDateString('es-ES', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric', 
                    timeZone: 'UTC' 
                  })}
                </span>
                {entry.duration && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {entry.duration}min
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Calories display - with negative indicator since exercise burns calories */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              <div className="text-right">
                <span className="text-sm sm:text-base font-bold text-deficit">
                  -{Math.round(entry.calories).toLocaleString()}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 ml-1">
                  kcal
                </span>
              </div>
              
              {/* Action buttons with proper touch targets */}
              <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEntryToEdit(entry)
                    setEditDialogOpen(true)
                  }}
                  className="h-9 w-9 hover:bg-white/10 text-zinc-400 hover:text-white"
                  aria-label={`Editar ${entry.name}`}
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
                  className="h-9 w-9 text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Eliminar ${entry.name}`}
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
          <Link href="/exercise/all">
            <Button variant="outline" className="w-full">
              Ver todo
            </Button>
          </Link>
        </div>
      )}

      <EditExerciseDialog
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
        title="Eliminar entrada de ejercicio"
        description="¿Eliminar este registro? Esta acción no se puede deshacer."
        itemName={entryToDelete ? `${entryToDelete.name} - ${format(new Date(entryToDelete.date), "d MMM yyyy")}` : undefined}
      />
    </>
  )
}

