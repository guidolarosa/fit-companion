import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Loader2, Trash2 } from "lucide-react"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "success"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: "Button" },
}

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
}

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
}

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
}

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
}

export const Link: Story = {
  args: { children: "Link", variant: "link" },
}

export const Success: Story = {
  args: { children: "Goal achieved!", variant: "success" },
}

export const Small: Story = {
  args: { children: "Small", size: "sm" },
}

export const Large: Story = {
  args: { children: "Large", size: "lg" },
}

export const Icon: Story = {
  args: { children: <Trash2 className="h-4 w-4" />, size: "icon", variant: "outline" },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Next step
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    ),
  },
}

export const Loading: Story = {
  args: { children: "Saving...", loading: true },
}

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
}

export const AsChildLink: Story = {
  render: () => (
    <Button asChild>
      <a href="https://example.com">
        Visit site
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </Button>
  ),
}

export const AsChildVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <a href="#">Default link</a>
      </Button>
      <Button asChild variant="outline">
        <a href="#">Outline link</a>
      </Button>
      <Button asChild variant="ghost">
        <a href="#">Ghost link</a>
      </Button>
      <Button asChild variant="link">
        <a href="#">Text link</a>
      </Button>
      <Button asChild variant="secondary">
        <a href="#">Secondary link</a>
      </Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
}
