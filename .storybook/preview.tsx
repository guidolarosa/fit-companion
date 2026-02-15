import type { Preview } from "@storybook/react"
import { IntlDecorator } from "./IntlDecorator"
import "../app/globals.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "hsl(240 10% 4%)" },
        { name: "light", value: "#ffffff" },
      ],
    },
    layout: "centered",
  },
  decorators: [
    IntlDecorator,
    (Story) => (
      <div style={{ color: "hsl(0 0% 98%)", fontFamily: "var(--font-sans)" }}>
        <Story />
      </div>
    ),
  ],
}

export default preview
