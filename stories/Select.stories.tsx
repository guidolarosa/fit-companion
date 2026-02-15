import type { Meta, StoryObj } from "@storybook/react"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
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
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select defaultValue="">
      <option value="" disabled>Select an option...</option>
      <option value="sedentary">Sedentary</option>
      <option value="moderate">Moderate</option>
      <option value="active">Active</option>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="lifestyle">Lifestyle</Label>
      <Select id="lifestyle" defaultValue="moderate">
        <option value="sedentary">Sedentary</option>
        <option value="moderate">Moderate</option>
        <option value="active">Active</option>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="moderate">
      <option value="moderate">Moderate</option>
    </Select>
  ),
}
