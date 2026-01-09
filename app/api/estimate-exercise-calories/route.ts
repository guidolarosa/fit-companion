import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult

    const body = await request.json()
    const { exerciseName, duration, intensity } = body

    if (!exerciseName || typeof exerciseName !== "string" || exerciseName.trim().length === 0) {
      return NextResponse.json(
        { error: "Exercise name is required" },
        { status: 400 }
      )
    }

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    const durationText = duration ? `for ${duration} minutes` : ""
    const intensityText = intensity ? `at ${intensity} intensity` : ""

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a fitness assistant. When given an exercise description, estimate the calories burnt.
Reply with ONLY a single integer number representing the estimated calories burnt. No text, no units, no explanation.
If the description is unclear or not an exercise, reply with 0.
Consider the duration and intensity if provided. If no duration is given, assume 30 minutes.
Intensity levels: light (easy pace), moderate (comfortable but challenging), high (very challenging), extreme (maximum effort).`
        },
        {
          role: "user",
          content: `${exerciseName.trim()} ${durationText} ${intensityText}`.trim()
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
    console.error("Error estimating exercise calories:", error)
    return NextResponse.json(
      { error: "Failed to estimate calories" },
      { status: 500 }
    )
  }
}
