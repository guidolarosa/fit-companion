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
          content: `You are a nutrition assistant. When given a food item description, estimate its nutritional content.
Reply with ONLY a JSON object with these keys: calories (integer), protein (float, grams), carbs (float, grams), fat (float, grams), fiber (float, grams), sugar (float, grams).
Example: {"calories":350,"protein":25.0,"carbs":40.0,"fat":8.0,"fiber":3.0,"sugar":5.0}
If the description is unclear or not a food item, reply with all zeros.
Base your estimates on typical serving sizes unless specified otherwise.
Do NOT include any text, explanation, or markdown. Only the JSON object.`
        },
        {
          role: "user",
          content: foodName.trim()
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "{}"
    
    try {
      const parsed = JSON.parse(responseText)
      const result = {
        calories: Math.max(0, parseInt(parsed.calories, 10) || 0),
        protein: Math.max(0, parseFloat(parsed.protein) || 0),
        carbs: Math.max(0, parseFloat(parsed.carbs) || 0),
        fat: Math.max(0, parseFloat(parsed.fat) || 0),
        fiber: Math.max(0, parseFloat(parsed.fiber) || 0),
        sugar: Math.max(0, parseFloat(parsed.sugar) || 0),
      }
      return NextResponse.json(result, { status: 200 })
    } catch {
      // Fallback: try to parse as a plain number (backward compat)
      const calories = parseInt(responseText, 10)
      if (!isNaN(calories) && calories > 0) {
        return NextResponse.json({ calories, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }, { status: 200 })
      }
      return NextResponse.json({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }, { status: 200 })
    }
  } catch (error) {
    console.error("Error estimating calories:", error)
    return NextResponse.json(
      { error: "Failed to estimate calories" },
      { status: 500 }
    )
  }
}
