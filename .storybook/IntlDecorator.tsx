import React from "react"
import { NextIntlClientProvider } from "next-intl"

// Minimal messages for Storybook stories
const messages = {
  common: {
    brandFit: "Fit",
    brandCompanion: "Companion",
    kcal: "kcal",
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    fiber: "Fiber",
    sugar: "Sugar",
    pageOf: "Page {current} of {total}",
  },
  nav: {
    back: "Back",
    dashboard: "Dashboard",
    weight: "Weight",
    food: "Food",
    exercise: "Exercise",
    settings: "Settings",
    report: "Report",
    lab: "Lab",
    agent: "Agent",
  },
}

export function IntlDecorator(Story: React.ComponentType) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Story />
    </NextIntlClientProvider>
  )
}
