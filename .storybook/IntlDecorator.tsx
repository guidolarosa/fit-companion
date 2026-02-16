import React from "react"
import { NextIntlClientProvider } from "next-intl"

import messages from "../messages/en.json"

export function IntlDecorator(Story: React.ComponentType) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Story />
    </NextIntlClientProvider>
  )
}
