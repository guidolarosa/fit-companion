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

    const systemPrompt = `You are Fitty, a friendly and knowledgeable AI fitness companion. You help users with all aspects of their weight loss and fitness journey.

You can assist with:
- Weight loss strategies and tips
- Exercise recommendations and workout plans
- Nutrition advice and meal planning
- Tracking progress and setting goals
- Motivation and encouragement
- Answering questions about their fitness data
- General health and wellness questions

Always reference the user's specific data (weight history, exercise, food intake, BMI, etc.) when providing personalized recommendations. Be encouraging, supportive, and provide evidence-based advice.

Keep responses concise, well-structured, and actionable. Use the metric system (kg, g, ml). Include specific numbers and data when relevant.

Format your responses using markdown:
- Use **bold** for important points and key terms
- Use bullet points (-) or numbered lists (1.) for structured information
- Use ## for section headings
- Use code formatting for numbers, dates, and measurements`

    const response = await getAIResponse(question, systemPrompt, userContext)

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Error in Fitty agent:", error)
    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    )
  }
}

