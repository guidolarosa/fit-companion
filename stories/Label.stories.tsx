import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: "Email address" },
}

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2" style={{ width: 320 }}>
      <Label htmlFor="weight">Current Weight (kg)</Label>
      <Input id="weight" type="number" placeholder="78.5" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="space-y-2" style={{ width: 320 }}>
      <Label htmlFor="name">
        Name <span className="text-destructive">*</span>
      </Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
  ),
}
