import type { Meta, StoryObj } from "@storybook/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  UtensilsCrossed,
  Activity,
  Weight,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
} from "lucide-react"

// ─── Presentational entry list item ────────────────────────────────
interface EntryListItemProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  value: string
  valueColor?: string
  unit: string
  isFirst?: boolean
  isLast?: boolean
}

function EntryListItem({
  icon,
  iconBg,
  title,
  subtitle,
  value,
  valueColor = "text-white",
  unit,
  isFirst,
  isLast,
}: EntryListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center border border-white/5 p-3 sm:p-4 gap-3",
        "transition-all duration-200 ease-out",
        "hover:bg-white/[0.02] hover:border-white/10",
        "group cursor-default",
        isFirst && "rounded-t-lg",
        isLast && "rounded-b-lg",
        !isLast && "border-b-0"
      )}
    >
      <div className={cn("flex w-8 h-8 rounded-lg items-center justify-center shrink-0", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-white truncate">{title}</p>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <div className="text-right">
          <span className={cn("text-sm font-bold", valueColor)}>{value}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 ml-1">
            {unit}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Edit /> Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive><Trash2 /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── Meta ──────────────────────────────────────────────────────────
const meta: Meta = {
  title: "Components/EntryList",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

// ─── Food Entries ──────────────────────────────────────────────────
const foodEntries = [
  { name: "200 mil de chocolatada la serenissima con proteina", date: "dom, 15 feb", cal: 84, macros: "Prot:9g  Carbs:11g  Fat:0g  Fibra:1g  Azúcar:10g" },
  { name: "Vaso de leche descremada con un scoop (30gr de whey)", date: "dom, 15 feb", cal: 210, macros: "Prot:36g  Carbs:9g  Fat:2g  Fibra:0g  Azúcar:6g" },
  { name: "Sandwich Stacker Onion XL doble, Muzarella Sticks x6", date: "dom, 15 feb", cal: 1200, macros: "Prot:30g  Carbs:150g  Fat:60g  Fibra:8g  Azúcar:5g" },
]

export const FoodList: Story = {
  render: () => (
    <div className="rounded-lg overflow-hidden">
      {foodEntries.map((entry, i) => (
        <EntryListItem
          key={i}
          icon={<UtensilsCrossed className="w-4 h-4 text-orange-400" />}
          iconBg="bg-orange-400/10"
          title={entry.name}
          subtitle={`${entry.date}  |  ${entry.macros}`}
          value={entry.cal.toLocaleString()}
          unit="KCAL"
          isFirst={i === 0}
          isLast={i === foodEntries.length - 1}
        />
      ))}
    </div>
  ),
}

// ─── Exercise Entries ──────────────────────────────────────────────
const exerciseEntries = [
  { name: "Morning Run", date: "dom, 15 feb", duration: "30 min", cal: 320 },
  { name: "Weight Training - Upper Body", date: "sáb, 14 feb", duration: "45 min", cal: 250 },
  { name: "HIIT Session", date: "vie, 13 feb", duration: "25 min", cal: 380 },
]

export const ExerciseList: Story = {
  render: () => (
    <div className="rounded-lg overflow-hidden">
      {exerciseEntries.map((entry, i) => (
        <EntryListItem
          key={i}
          icon={<Activity className="w-4 h-4 text-green-400" />}
          iconBg="bg-green-400/10"
          title={entry.name}
          subtitle={`${entry.date}  ·  ${entry.duration}`}
          value={`-${entry.cal.toLocaleString()}`}
          valueColor="text-green-400"
          unit="KCAL"
          isFirst={i === 0}
          isLast={i === exerciseEntries.length - 1}
        />
      ))}
    </div>
  ),
}

// ─── Weight Entries ────────────────────────────────────────────────
const weightEntries = [
  { weight: 78.2, date: "dom, 15 feb" },
  { weight: 78.5, date: "sáb, 14 feb" },
  { weight: 79.0, date: "jue, 12 feb" },
  { weight: 79.3, date: "mar, 10 feb" },
]

export const WeightList: Story = {
  render: () => (
    <div className="rounded-lg overflow-hidden">
      {weightEntries.map((entry, i) => (
        <EntryListItem
          key={i}
          icon={<Weight className="w-4 h-4 text-orange-500" />}
          iconBg="bg-orange-500/10"
          title={`${entry.weight} kg`}
          subtitle={entry.date}
          value=""
          unit=""
          isFirst={i === 0}
          isLast={i === weightEntries.length - 1}
        />
      ))}
    </div>
  ),
}

// ─── Single Item ───────────────────────────────────────────────────
export const SingleItem: Story = {
  render: () => (
    <div className="rounded-lg overflow-hidden">
      <EntryListItem
        icon={<UtensilsCrossed className="w-4 h-4 text-orange-400" />}
        iconBg="bg-orange-400/10"
        title="Grilled Chicken Salad"
        subtitle="dom, 15 feb  |  Prot:42g  Carbs:18g  Fat:28g"
        value="520"
        unit="KCAL"
        isFirst
        isLast
      />
    </div>
  ),
}

// ─── Empty State ───────────────────────────────────────────────────
export const EmptyState: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center py-10 text-center rounded-lg border border-white/5">
      <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center">
        <UtensilsCrossed className="w-6 h-6 text-zinc-600" />
      </div>
      <h3 className="text-sm font-medium text-zinc-300 mb-1">No entries yet</h3>
      <p className="text-xs text-zinc-500 max-w-[200px]">
        Start tracking your meals to see them here.
      </p>
    </div>
  ),
}
