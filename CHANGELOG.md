# Changelog

## Unreleased

### Added

- **Food photo recognition (AI)**: On the Food page, a new camera button sits next to the existing "Estimate calories with AI" button. Tapping it opens the device's native camera/photo picker (`<input type="file" accept="image/*" capture="environment">`); once a photo is selected, it's downscaled and re-encoded to JPEG client-side (max 1024px long edge) and sent to a new `POST /api/estimate-calories-image` endpoint.
  - The endpoint sends the image to `gpt-4o-mini` (vision) and returns a single combined food name and estimated calories/protein/carbs/fat/fiber/sugar — multi-item plates (e.g. a full meal) are summarized as one entry, matching the single-entry shape of the existing food form.
  - The AI response is generated in the user's current app locale (English/Spanish).
  - Results populate the food form exactly like the existing text-based AI estimate does (switches to review mode, fields become editable). If no food is recognized, the form is left untouched and an error toast is shown.
  - The photo itself is never stored — it's used only for the single analysis request and then discarded. No new database fields were added.
  - The two AI buttons (text-based and photo-based) are mutually exclusive while either is in flight, since both write to the same shared form state.

- **Quick-add from dashboard widgets**: The Weight and Calories dashboard cards (`WeightGaugeCard`, `DailyTargetRingCard`) now have a "+" button in the card header, in both their empty and populated states, that opens a modal with the full `WeightForm` / `FoodForm` — no navigation away from the dashboard needed.
  - The empty-state CTA buttons ("Record weight" / "Record food") now open the same modal instead of linking to the `/weight` or `/food` page.
  - `WeightForm` and `FoodForm` gained an optional `onSuccess` callback (no-op by default) so the dashboard modals can auto-close after a successful submit; the standalone `/food` and `/weight` pages are unaffected.
  - The food modal reuses `FoodForm` as-is, so the AI text-estimate and AI photo-recognition buttons are available from the dashboard too.
  - The Mobile Quick Actions row was left unchanged (still navigates to the full pages).

- **Customizable dashboard widgets**: The 9 compact stat-card widgets (Weight, Intermittent Fasting, BMI, Net Calories, Today's Intake, Trend, Weekly Progress, Weekly Calories, Water — formerly split across `MetricsGrid`/`WeeklyOverview`) are now merged into one grid (`components/dashboard/WidgetGrid.tsx`) with per-user show/hide and drag-to-reorder, persisted server-side on `User.dashboardLayout` (new nullable `Json` column) via a debounced `PATCH /api/dashboard-layout`.
  - A "Customize" toggle switches the dashboard into edit mode, revealing a small grab handle on each card (top-left) for drag-and-drop reordering — built on `@dnd-kit/core` + `@dnd-kit/sortable`, with pointer, touch, and keyboard sensors so it works on mobile and is keyboard-accessible.
  - While in edit mode, a separate "Manage widgets" popover (kept independent of the drag interaction, since popovers close on outside click/drag) lists a checkbox per widget plus a "Reset to default" action.
  - Hiding all widgets is allowed; shows an empty-state message with a shortcut back into edit mode.
  - `MetricsGrid.tsx` and `WeeklyOverview.tsx` were removed; the two cards that were previously inline JSX ("Net Calories", "Trend") were extracted into standalone components (`net-calories-card.tsx`, `trend-card.tsx`) so every widget is independently addressable.
  - `ChartsSection` and `RecentEntries` (charts, calendars, daily register, recent entries lists) are unchanged and not customizable in this version.
