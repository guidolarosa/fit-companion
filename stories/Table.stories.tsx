import type { Meta, StoryObj } from "@storybook/react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"
import { CaloriePill } from "@/components/calorie-pill"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Table>

const foodEntries = [
  { id: "1", name: "Grilled Chicken Salad", date: "Jan 28, 2026", calories: 520, protein: 42, carbs: 18, fat: 28 },
  { id: "2", name: "Oatmeal with Berries", date: "Jan 28, 2026", calories: 310, protein: 12, carbs: 52, fat: 8 },
  { id: "3", name: "Salmon with Vegetables", date: "Jan 27, 2026", calories: 480, protein: 38, carbs: 15, fat: 30 },
  { id: "4", name: "Protein Shake", date: "Jan 27, 2026", calories: 220, protein: 30, carbs: 12, fat: 4 },
  { id: "5", name: "Greek Yogurt & Granola", date: "Jan 26, 2026", calories: 380, protein: 20, carbs: 45, fat: 14 },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Calories</TableHead>
          <TableHead className="text-right">Prot</TableHead>
          <TableHead className="text-right">Carbs</TableHead>
          <TableHead className="text-right">Fat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell className="text-muted-foreground">{entry.date}</TableCell>
            <TableCell className="text-right"><CaloriePill calories={entry.calories} /></TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.protein}g</TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.carbs}g</TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.fat}g</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithKebabActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Calories</TableHead>
          <TableHead className="text-right">Prot</TableHead>
          <TableHead className="text-right">Carbs</TableHead>
          <TableHead className="text-right">Fat</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell className="text-muted-foreground">{entry.date}</TableCell>
            <TableCell className="text-right"><CaloriePill calories={entry.calories} /></TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.protein}g</TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.carbs}g</TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.fat}g</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => console.log("Edit", entry.id)}>
                    <Edit /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Duplicate", entry.id)}>
                    <Copy /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onClick={() => console.log("Delete", entry.id)}>
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Your recent food entries</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Calories</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodEntries.slice(0, 3).map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell className="text-muted-foreground">{entry.date}</TableCell>
            <TableCell className="text-right"><CaloriePill calories={entry.calories} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

const exerciseEntries = [
  { id: "1", name: "Morning Run", date: "Jan 28, 2026", calories: 320, duration: 30 },
  { id: "2", name: "Weight Training", date: "Jan 27, 2026", calories: 250, duration: 45 },
  { id: "3", name: "Cycling", date: "Jan 26, 2026", calories: 410, duration: 60 },
  { id: "4", name: "HIIT Session", date: "Jan 25, 2026", calories: 380, duration: 25 },
]

export const ExerciseTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Calories</TableHead>
          <TableHead className="text-right">Minutes</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {exerciseEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell className="text-muted-foreground">{entry.date}</TableCell>
            <TableCell className="text-right"><CaloriePill calories={entry.calories} /></TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.duration} min</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit /> Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive><Trash2 /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead className="text-right">Calories</TableHead>
          <TableHead className="text-right">Protein</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodEntries.slice(0, 3).map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell className="text-right">{entry.calories}</TableCell>
            <TableCell className="text-right text-muted-foreground">{entry.protein}g</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold">Total</TableCell>
          <TableCell className="text-right font-semibold">1,310</TableCell>
          <TableCell className="text-right font-semibold text-muted-foreground">92g</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Calories</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No entries found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
