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

    const systemPrompt = `You are a helpful fitness and exercise expert. Provide practical, evidence-based exercise recommendations for weight loss. 
Focus on:
- Specific exercises with calorie burn estimates
- Workout routines and schedules
- Exercise modifications for different fitness levels
- Safety tips and proper form
- How to progress over time

Keep responses concise, well-structured, and actionable. Use the metric system (kg, cm, km).
Always reference the user's specific exercise history, current fitness level, and goals when providing personalized recommendations.

Format your responses using markdown:
- Use **bold** for exercise names and important points
- Use bullet points (-) or numbered lists (1.) for structured information
- Use ## for section headings
- Use code formatting for calorie values and metrics`

    const response = await getAIResponse(question, systemPrompt, userContext)

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Error in exercise agent:", error)
    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    )
  }
}

