import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
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
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "Enter text..." },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="user@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
}

export const WithValue: Story = {
  args: { defaultValue: "John Doe" },
}

export const NumberInput: Story = {
  args: { type: "number", placeholder: "0", min: 0, step: 0.1 },
}

export const DateInput: Story = {
  args: { type: "date" },
}

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password" },
}
