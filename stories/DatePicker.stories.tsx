import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
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
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return <DatePicker value={date} onChange={setDate} />
  },
}

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
      <div className="space-y-2">
        <Label>Entry date</Label>
        <DatePicker value={date} onChange={setDate} placeholder="Select a date..." />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <DatePicker value={date} onChange={setDate} />
  },
}

export const Disabled: Story = {
  render: () => {
    return <DatePicker value={new Date()} disabled />
  },
}

export const Spanish: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <DatePicker value={date} onChange={setDate} locale="es" />
  },
}

export const English: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <DatePicker value={date} onChange={setDate} locale="en" />
  },
}
