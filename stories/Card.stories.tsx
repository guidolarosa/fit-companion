import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
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
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400">This is the card content area.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400">Content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
}

export const GlassCard: Story = {
  render: () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Glass Card</CardTitle>
        <CardDescription>With the glass-card utility class.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400">Frosted glass effect.</p>
      </CardContent>
    </Card>
  ),
}

export const MetricCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-400">78.2 kg</p>
        <p className="text-xs text-zinc-500 mt-1">↓ 4.6 kg from start</p>
      </CardContent>
    </Card>
  ),
}
