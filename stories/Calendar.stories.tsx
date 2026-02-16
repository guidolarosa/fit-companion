import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="rounded-lg border border-white/[0.08]">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    )
  },
}

export const Spanish: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="rounded-lg border border-white/[0.08]">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
      </div>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    })
    return (
      <div className="rounded-lg border border-white/[0.08]">
        <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
      </div>
    )
  },
}

export const DisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="rounded-lg border border-white/[0.08]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(d) => d > new Date()}
        />
      </div>
    )
  },
}
