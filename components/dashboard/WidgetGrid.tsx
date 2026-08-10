"use client"

import { useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Check, Settings2, RotateCcw, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DASHBOARD_WIDGET_IDS,
  DEFAULT_DASHBOARD_LAYOUT,
  WIDGET_LABEL_KEYS,
  type DashboardWidgetId,
  type DashboardWidgetLayout,
} from "@/lib/dashboard-layout"
import { WeightGaugeCard } from "@/components/weight-gauge-card"
import { IFCard } from "@/components/if-card"
import { BMICard } from "@/components/bmi-card"
import { NetCaloriesCard } from "@/components/net-calories-card"
import { DailyTargetRingCard } from "@/components/daily-target-ring-card"
import { TrendCard } from "@/components/trend-card"
import { WeeklyProgressCard } from "@/components/weekly-progress-card"
import { WeeklyCaloriesChart } from "@/components/weekly-calories-chart"
import { WaterCard } from "@/components/water-card"
import type { DashboardData } from "@/lib/dashboard-data"

interface WidgetGridProps {
  data: DashboardData
  initialLayout: DashboardWidgetLayout[]
}

function renderWidget(id: DashboardWidgetId, data: DashboardData) {
  switch (id) {
    case "weight":
      return (
        <WeightGaugeCard
          currentWeight={data.latestWeight?.weight || null}
          targetWeightMin={data.targetWeightMin}
          targetWeightMax={data.targetWeightMax}
          milestoneStep={data.milestoneStep}
          weightDate={data.latestWeight?.date || null}
        />
      )
    case "if":
      return <IFCard ifType={data.user?.ifType || null} ifStartTime={data.user?.ifStartTime || null} />
    case "bmi":
      return <BMICard bmi={data.bmi} currentWeight={data.latestWeight?.weight || null} height={data.user?.height || null} />
    case "netCalories":
      return (
        <NetCaloriesCard
          netCalories={data.netCalories}
          daysCount={data.dailyData.length}
          totalCaloriesConsumed={data.totalCaloriesConsumed}
          totalTdee={data.totalTdee}
        />
      )
    case "consumption":
      return (
        <DailyTargetRingCard
          date={data.dailyData[0]?.date ?? null}
          caloriesConsumed={data.dailyData[0]?.caloriesConsumed ?? null}
          dailyTarget={data.dailyData[0]?.tdee ?? null}
          netCalories={data.dailyData[0]?.netCalories ?? null}
          protein={data.dailyData[0]?.protein ?? 0}
          carbs={data.dailyData[0]?.carbs ?? 0}
          fiber={data.dailyData[0]?.fiber ?? 0}
          currentWeight={data.latestWeight?.weight ?? null}
        />
      )
    case "trend":
      return (
        <TrendCard
          avgDeficit={data.trendInsights.avgDeficit}
          projectedKgPerWeek={data.trendInsights.projectedKgPerWeek}
          warningKey={data.warnings[0] ?? null}
        />
      )
    case "weeklyProgress":
      return <WeeklyProgressCard weekData={data.weekDayData} />
    case "weeklyCalories":
      return <WeeklyCaloriesChart weekData={data.weekDayData} />
    case "water":
      return <WaterCard targetGlasses={data.waterTargetGlasses} />
  }
}

function SortableWidget({
  id,
  editMode,
  dragLabel,
  children,
}: {
  id: string
  editMode: boolean
  dragLabel: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-60")}
    >
      {editMode && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          style={{ touchAction: "none" }}
          aria-label={dragLabel}
          className="absolute -top-2 -left-2 z-20 flex h-6 w-6 cursor-grab items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-400 shadow-md hover:text-white active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}
      {children}
    </div>
  )
}

export function WidgetGrid({ data, initialLayout }: WidgetGridProps) {
  const t = useTranslations("dashboard")
  const [layout, setLayout] = useState<DashboardWidgetLayout[]>(initialLayout)
  const [editMode, setEditMode] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visible = layout.filter((w) => w.visible)
  const visibleIds = visible.map((w) => w.id)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function scheduleSave(next: DashboardWidgetLayout[]) {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/dashboard-layout", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ widgets: next }),
        })
        if (!response.ok) toast.error(t("layoutSaveError"))
      } catch (error) {
        console.error("Error saving dashboard layout:", error)
        toast.error(t("layoutSaveError"))
      }
    }, 500)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = visibleIds.indexOf(active.id as DashboardWidgetId)
    const newIndex = visibleIds.indexOf(over.id as DashboardWidgetId)
    if (oldIndex === -1 || newIndex === -1) return

    const reorderedVisible = arrayMove(visible, oldIndex, newIndex)
    const hidden = layout.filter((w) => !w.visible)
    const next = [...reorderedVisible, ...hidden]
    setLayout(next)
    scheduleSave(next)
  }

  function toggleWidget(id: DashboardWidgetId) {
    const next = layout.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    setLayout(next)
    scheduleSave(next)
  }

  async function handleReset() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    setLayout(DEFAULT_DASHBOARD_LAYOUT)
    try {
      const response = await fetch("/api/dashboard-layout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      })
      if (!response.ok) toast.error(t("layoutSaveError"))
    } catch (error) {
      console.error("Error resetting dashboard layout:", error)
      toast.error(t("layoutSaveError"))
    }
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        {editMode && (
          <Popover open={manageOpen} onOpenChange={setManageOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                {t("manageWidgets")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <p className="text-xs font-medium text-zinc-300 mb-1">{t("manageWidgetsTitle")}</p>
              <p className="text-[11px] text-zinc-500 mb-3">{t("manageWidgetsDesc")}</p>
              <div className="space-y-2 mb-3">
                {DASHBOARD_WIDGET_IDS.map((id) => {
                  const widget = layout.find((w) => w.id === id)
                  return (
                    <label key={id} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <Checkbox checked={widget?.visible ?? true} onCheckedChange={() => toggleWidget(id)} />
                      {t(WIDGET_LABEL_KEYS[id] as any)}
                    </label>
                  )
                })}
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-full text-xs gap-1.5 text-zinc-400" onClick={handleReset}>
                <RotateCcw className="h-3 w-3" />
                {t("resetToDefault")}
              </Button>
            </PopoverContent>
          </Popover>
        )}
        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => {
            setEditMode((v) => !v)
            if (editMode) setManageOpen(false)
          }}
        >
          {editMode ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          {editMode ? t("customizeDone") : t("customizeButton")}
        </Button>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 py-12 text-center">
          <LayoutGrid className="w-8 h-8 mb-2 text-zinc-600" />
          <p className="text-sm text-zinc-300 mb-1">{t("widgetsEmptyTitle")}</p>
          <p className="text-xs text-zinc-500 mb-4 max-w-[240px]">{t("widgetsEmptyDesc")}</p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => {
              setEditMode(true)
              setManageOpen(true)
            }}
          >
            {t("manageWidgets")}
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((widget) => (
                <SortableWidget key={widget.id} id={widget.id} editMode={editMode} dragLabel={t("dragHandleLabel")}>
                  {renderWidget(widget.id, data)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
