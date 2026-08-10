export const DASHBOARD_WIDGET_IDS = [
  "weight",
  "if",
  "bmi",
  "netCalories",
  "consumption",
  "trend",
  "weeklyProgress",
  "weeklyCalories",
  "water",
] as const

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number]

export interface DashboardWidgetLayout {
  id: DashboardWidgetId
  visible: boolean
}

// Translation key (dashboard namespace) used as the display name in the manage-widgets checklist
export const WIDGET_LABEL_KEYS: Record<DashboardWidgetId, string> = {
  weight: "weightTitle",
  if: "ifTitle",
  bmi: "bmiTitle",
  netCalories: "netCalories",
  consumption: "consumptionTitle",
  trend: "trend",
  weeklyProgress: "weeklyTitle",
  weeklyCalories: "chartTitle",
  water: "waterTitle",
}

export const DEFAULT_DASHBOARD_LAYOUT: DashboardWidgetLayout[] = DASHBOARD_WIDGET_IDS.map((id) => ({
  id,
  visible: true,
}))

function isWidgetId(value: unknown): value is DashboardWidgetId {
  return typeof value === "string" && (DASHBOARD_WIDGET_IDS as readonly string[]).includes(value)
}

/**
 * Merges a saved layout (from User.dashboardLayout, arbitrary/untrusted JSON) with the
 * known widget set: drops unknown ids, appends any widget missing from the saved data
 * (e.g. one added after the user last customized) as visible, at the end.
 */
export function normalizeDashboardLayout(saved: unknown): DashboardWidgetLayout[] {
  if (!saved || typeof saved !== "object" || !Array.isArray((saved as { widgets?: unknown }).widgets)) {
    return DEFAULT_DASHBOARD_LAYOUT
  }

  const rawWidgets = (saved as { widgets: unknown[] }).widgets
  const seen = new Set<DashboardWidgetId>()
  const result: DashboardWidgetLayout[] = []

  for (const entry of rawWidgets) {
    if (
      entry &&
      typeof entry === "object" &&
      isWidgetId((entry as { id?: unknown }).id) &&
      typeof (entry as { visible?: unknown }).visible === "boolean"
    ) {
      const id = (entry as { id: DashboardWidgetId }).id
      if (!seen.has(id)) {
        seen.add(id)
        result.push({ id, visible: (entry as { visible: boolean }).visible })
      }
    }
  }

  for (const id of DASHBOARD_WIDGET_IDS) {
    if (!seen.has(id)) {
      result.push({ id, visible: true })
    }
  }

  return result
}
