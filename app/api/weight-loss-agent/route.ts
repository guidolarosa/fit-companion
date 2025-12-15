import { NextRequest, NextResponse } from "next/server"
import { getAIResponse } from "@/lib/openai"
import { getUserContext } from "@/lib/user-context"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { question } = body

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      )
    }

    // Get user context
    const userContext = await getUserContext(userId)

    const systemPrompt = `You are a helpful weight loss and health coach. Provide practical, evidence-based advice about weight loss, nutrition, exercise, and healthy living.
Focus on:
- Sustainable weight loss strategies
- Creating realistic goals and plans
- Overcoming plateaus and challenges
- Motivation and mindset
- Balancing nutrition and exercise
- Lifestyle factors (sleep, stress, etc.)

Keep responses empathetic, encouraging, and actionable. Use the metric system (kg, cm, km). Emphasize sustainable, healthy approaches over quick fixes.
Always reference the user's specific data when providing personalized advice.

Format your responses using markdown:
- Use **bold** for emphasis
- Use bullet points (-) or numbered lists (1.) for structured information
- Use ## for section headings
- Use code formatting for specific values or metrics`

    const response = await getAIResponse(question, systemPrompt, userContext)

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Error in weight loss agent:", error)
    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    )
  }
}

