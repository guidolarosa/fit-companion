import type { Meta, StoryObj } from "@storybook/react"
import { MarkdownContent } from "@/components/markdown-content"

const meta: Meta<typeof MarkdownContent> = {
  title: "Components/MarkdownContent",
  component: MarkdownContent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MarkdownContent>

export const Headings: Story = {
  args: {
    content: `# Heading 1
## Heading 2
### Heading 3

Regular paragraph text.`,
  },
}

export const Lists: Story = {
  args: {
    content: `### Unordered List
- Item one
- Item two
- Item three

### Ordered List
1. First step
2. Second step
3. Third step`,
  },
}

export const RichContent: Story = {
  args: {
    content: `## Lab Analysis Results

Your blood work shows **good overall health**. Here are the key findings:

### Key Metrics
- **Hemoglobin**: 14.2 g/dL (normal range)
- **Glucose**: 95 mg/dL (optimal)
- **Cholesterol**: 185 mg/dL (desirable)

### Recommendations
1. Continue your current diet plan
2. Increase fiber intake to 25g/day
3. Schedule a follow-up in 6 months

> Note: These results are within normal parameters. Keep up the good work!

For more info, visit [our resources](https://example.com).`,
  },
}

export const CodeBlocks: Story = {
  args: {
    content: `Here is an inline \`code\` example.

\`\`\`
// Block code example
const tdee = bmr * activityMultiplier
const deficit = tdee - caloriesConsumed
\`\`\``,
  },
}

export const Blockquote: Story = {
  args: {
    content: `> "Consistency is more important than perfection. Small daily improvements lead to lasting results."

This is the key insight from your weight loss journey analysis.`,
  },
}
