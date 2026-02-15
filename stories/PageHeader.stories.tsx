import type { Meta, StoryObj } from "@storybook/react"
import { PageHeader } from "@/components/page-header"

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    // PageHeader uses useRouter so we need Next.js context
    nextjs: { appDirectory: true },
  },
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: "Dashboard",
    showFittyButton: false,
  },
}

export const WithDescription: Story = {
  args: {
    title: "Food Tracker",
    description: "Log and track your daily food intake.",
    showFittyButton: false,
  },
}

export const WithBackButton: Story = {
  args: {
    title: "All Entries",
    description: "Complete history of your food entries.",
    showBackButton: true,
    showFittyButton: false,
  },
}

export const TitleOnly: Story = {
  args: {
    title: "Settings",
    showFittyButton: false,
  },
}
