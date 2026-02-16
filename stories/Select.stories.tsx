import type { Meta, StoryObj } from "@storybook/react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const meta: Meta = {
  title: "UI/Select",
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
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sedentary">Sedentary</SelectItem>
        <SelectItem value="moderate">Moderate</SelectItem>
        <SelectItem value="active">Active</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Lifestyle</Label>
      <Select defaultValue="moderate">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sedentary">Sedentary</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="active">Active</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="moderate" disabled>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="moderate">Moderate</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fasting window..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Common</SelectLabel>
          <SelectItem value="16:8">16:8 (16h fast / 8h eat)</SelectItem>
          <SelectItem value="18:6">18:6 (18h fast / 6h eat)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Advanced</SelectLabel>
          <SelectItem value="20:4">20:4 (20h fast / 4h eat)</SelectItem>
          <SelectItem value="OMAD">OMAD (One Meal a Day)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Language: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Language</Label>
      <Select defaultValue="es">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Sustainability: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Sustainability Mode</Label>
      <Select defaultValue="sustainable">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="strict">Strict — Aggressive deficit</SelectItem>
          <SelectItem value="sustainable">Sustainable — Moderate deficit</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Controls how aggressively your calorie target is calculated.
      </p>
    </div>
  ),
}
