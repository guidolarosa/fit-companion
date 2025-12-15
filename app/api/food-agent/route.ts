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

    const systemPrompt = `You are a helpful nutrition and diet expert. Provide practical, evidence-based food and nutrition recommendations for weight loss. 
Focus on:
- Healthy food options with calorie information
- Meal ideas and recipes
- Nutritional benefits of foods
- Portion control and meal planning
- Balanced nutrition for weight loss

Keep responses concise, well-structured, and actionable. Use the metric system (kg, g, ml). Include calorie estimates when relevant.
Always reference the user's specific food history, calorie consumption, and dietary goals when providing personalized recommendations.

Format your responses using markdown:
- Use **bold** for food names and important points
- Use bullet points (-) or numbered lists (1.) for structured information
- Use ## for section headings
- Use code formatting for calorie values and portion sizes`

    const response = await getAIResponse(question, systemPrompt, userContext)

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Error in food agent:", error)
    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    )
  }
}

