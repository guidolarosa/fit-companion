import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult

    const body = await request.json()
    const { foodName } = body

    if (!foodName || typeof foodName !== "string" || foodName.trim().length === 0) {
      return NextResponse.json(
        { error: "Food name is required" },
        { status: 400 }
      )
    }

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a nutrition assistant. When given a food item description, estimate its calorie content.
Reply with ONLY a single integer number representing the estimated calories. No text, no units, no explanation.
If the description is unclear or not a food item, reply with 0.
Base your estimates on typical serving sizes unless specified otherwise.`
        },
        {
          role: "user",
          content: foodName.trim()
        }
      ],
      temperature: 0.3,
      max_tokens: 20,
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "0"
    const calories = parseInt(responseText, 10)

    if (isNaN(calories) || calories < 0) {
      return NextResponse.json({ calories: 0 }, { status: 200 })
    }

    return NextResponse.json({ calories }, { status: 200 })
  } catch (error) {
    console.error("Error estimating calories:", error)
    return NextResponse.json(
      { error: "Failed to estimate calories" },
      { status: 500 }
    )
  }
}
