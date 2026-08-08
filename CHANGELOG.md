# Changelog

## Unreleased

### Added

- **Food photo recognition (AI)**: On the Food page, a new camera button sits next to the existing "Estimate calories with AI" button. Tapping it opens the device's native camera/photo picker (`<input type="file" accept="image/*" capture="environment">`); once a photo is selected, it's downscaled and re-encoded to JPEG client-side (max 1024px long edge) and sent to a new `POST /api/estimate-calories-image` endpoint.
  - The endpoint sends the image to `gpt-4o-mini` (vision) and returns a single combined food name and estimated calories/protein/carbs/fat/fiber/sugar — multi-item plates (e.g. a full meal) are summarized as one entry, matching the single-entry shape of the existing food form.
  - The AI response is generated in the user's current app locale (English/Spanish).
  - Results populate the food form exactly like the existing text-based AI estimate does (switches to review mode, fields become editable). If no food is recognized, the form is left untouched and an error toast is shown.
  - The photo itself is never stored — it's used only for the single analysis request and then discarded. No new database fields were added.
  - The two AI buttons (text-based and photo-based) are mutually exclusive while either is in flight, since both write to the same shared form state.
