import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: "Components/DeleteConfirmDialog",
  component: DeleteConfirmDialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DeleteConfirmDialog>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Entry
        </Button>
        <DeleteConfirmDialog
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => console.log("Confirmed delete")}
          title="Delete Food Entry"
          description="Are you sure you want to delete this food entry? This action cannot be undone."
        />
      </>
    )
  },
}

export const WithItemName: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Entry
        </Button>
        <DeleteConfirmDialog
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => console.log("Confirmed delete")}
          title="Delete Food Entry"
          description="Are you sure you want to delete this food entry?"
          itemName="Grilled Chicken Salad - Jan 25, 2026"
        />
      </>
    )
  },
}

export const AlwaysOpen: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: "Delete Weight Entry",
    description: "This will permanently remove the weight entry from your history.",
    itemName: "78.2 kg - Jan 20, 2026",
  },
}
