import type { Meta, StoryObj } from "@storybook/react"
import Aurora from "@/components/aurora"

const meta: Meta<typeof Aurora> = {
  title: "Components/Aurora",
  component: Aurora,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 300, position: "relative", borderRadius: 12, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    amplitude: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    blend: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
  },
}

export default meta
type Story = StoryObj<typeof Aurora>

export const Default: Story = {
  args: {
    colorStops: ["#EA580C", "#F59E0B", "#FACC15"],
    speed: 0.5,
    amplitude: 1.2,
    blend: 0.7,
  },
}

export const CoolBlue: Story = {
  args: {
    colorStops: ["#3B82F6", "#8B5CF6", "#06B6D4"],
    speed: 0.8,
    amplitude: 1.0,
    blend: 0.5,
  },
}

export const NeonGreen: Story = {
  args: {
    colorStops: ["#22C55E", "#10B981", "#34D399"],
    speed: 0.3,
    amplitude: 1.5,
    blend: 0.6,
  },
}

export const Slow: Story = {
  args: {
    colorStops: ["#EA580C", "#F59E0B", "#FACC15"],
    speed: 0.1,
    amplitude: 0.5,
    blend: 0.8,
  },
}

export const Fast: Story = {
  args: {
    colorStops: ["#F43F5E", "#E11D48", "#FB7185"],
    speed: 2.0,
    amplitude: 2.0,
    blend: 0.4,
  },
}
