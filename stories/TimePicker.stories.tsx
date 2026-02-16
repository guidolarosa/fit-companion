import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { TimePicker } from "@/components/ui/time-picker"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof TimePicker> = {
  title: "UI/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: () => {
    const [time, setTime] = useState("")
    return <TimePicker value={time} onChange={setTime} />
  },
}

export const WithLabel: Story = {
  render: () => {
    const [time, setTime] = useState("")
    return (
      <div className="space-y-2">
        <Label>Start time</Label>
        <TimePicker value={time} onChange={setTime} placeholder="Select time..." />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [time, setTime] = useState("08:30")
    return <TimePicker value={time} onChange={setTime} />
  },
}

export const OneMinuteStep: Story = {
  render: () => {
    const [time, setTime] = useState("12:00")
    return (
      <div className="space-y-2">
        <Label>Precise time (1-min step)</Label>
        <TimePicker value={time} onChange={setTime} minuteStep={1} />
      </div>
    )
  },
}

export const FifteenMinuteStep: Story = {
  render: () => {
    const [time, setTime] = useState("09:00")
    return (
      <div className="space-y-2">
        <Label>Quarter hours (15-min step)</Label>
        <TimePicker value={time} onChange={setTime} minuteStep={15} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    return <TimePicker value="10:30" disabled />
  },
}
