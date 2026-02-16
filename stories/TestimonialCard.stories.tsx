import type { Meta, StoryObj } from "@storybook/react"
import { TestimonialCard } from "@/components/landing/TestimonialCard"

const meta: Meta<typeof TestimonialCard> = {
  title: "Landing/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TestimonialCard>

export const BlueVariant: Story = {
  args: {
    quote: "I lost 8 kg in 3 months without even trying hard. Just seeing my data every day kept me motivated and accountable.",
    name: "Martín R.",
    role: "Lost 8 kg in 3 months",
    initials: "MR",
    accentColor: "text-blue-400",
    starColor: "text-blue-400",
    gradient: "linear-gradient(135deg, rgba(96, 165, 250, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
  },
}

export const EmeraldVariant: Story = {
  args: {
    quote: "The AI calorie estimation is a game changer. I just type what I ate and it logs everything. No more tedious manual tracking.",
    name: "Camila S.",
    role: "Nutritionist & user",
    initials: "CS",
    accentColor: "text-emerald-400",
    starColor: "text-emerald-400",
    gradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
  },
}

export const PurpleVariant: Story = {
  args: {
    quote: "Finally an app that doesn't try to sell me a premium plan. It's simple, beautiful, and does exactly what I need. Love it.",
    name: "Lucas P.",
    role: "Using it since day 1",
    initials: "LP",
    accentColor: "text-purple-400",
    starColor: "text-purple-400",
    gradient: "linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
  },
}
