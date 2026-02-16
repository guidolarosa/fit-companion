import type { Meta, StoryObj } from "@storybook/react"
import { LandingTestimonials } from "@/components/landing/LandingTestimonials"

const meta: Meta<typeof LandingTestimonials> = {
  title: "Landing/LandingTestimonials",
  component: LandingTestimonials,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof LandingTestimonials>

export const Default: Story = {}
