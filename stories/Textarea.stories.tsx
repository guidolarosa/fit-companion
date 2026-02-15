import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: "Type your message..." },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" placeholder="Add any notes about this entry..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: "Disabled textarea", disabled: true },
}

export const WithContent: Story = {
  args: {
    defaultValue: "Today I had a great workout session. Feeling energized and motivated to continue with the meal plan.",
    rows: 4,
  },
}
