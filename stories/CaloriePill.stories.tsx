import type { Meta, StoryObj } from "@storybook/react"
import { CaloriePill } from "@/components/calorie-pill"

const meta: Meta<typeof CaloriePill> = {
  title: "Components/CaloriePill",
  component: CaloriePill,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CaloriePill>

export const Default: Story = {
  args: { calories: 520 },
}

export const LowCalorie: Story = {
  args: { calories: 85 },
}

export const HighCalorie: Story = {
  args: { calories: 2450 },
}

export const Fractional: Story = {
  args: { calories: 123.7 },
}

export const Zero: Story = {
  args: { calories: 0 },
}

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CaloriePill calories={120} />
      <CaloriePill calories={450} />
      <CaloriePill calories={890} />
      <CaloriePill calories={1500} />
    </div>
  ),
}
