import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { requireApiUser } from "@/lib/get-api-user"

export const maxDuration = 300 // allow up to 5 minutes

export async function POST() {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    // Find all food entries missing macro data
    const entries = await prisma.foodEntry.findMany({
      where: {
        userId,
        OR: [
          { carbs: null },
          { fat: null },
          { fiber: null },
          { sugar: null },
        ],
      },
      orderBy: { date: "desc" },
    })

    if (entries.length === 0) {
      return NextResponse.json({ message: "All entries already have macro data", updated: 0 })
    }

    let updated = 0
    let failed = 0
    const errors: string[] = []

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize)

      const results = await Promise.allSettled(
        batch.map(async (entry) => {
          try {
            const completion = await openai!.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: `You are a nutrition assistant. Given a food item and its known calorie count, estimate the macronutrient breakdown.
Reply with ONLY a JSON object: {"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0}
All values in grams (float). Use the calorie count as a guide for proportions.
Do NOT include any text, explanation, or markdown. Only the JSON object.`,
                },
                {
                  role: "user",
                  content: `Food: ${entry.name} (${Math.round(entry.calories)} kcal)`,
                },
              ],
              temperature: 0.3,
              max_tokens: 80,
            })

            const text = completion.choices[0]?.message?.content?.trim() || "{}"
            const parsed = JSON.parse(text)

            await prisma.foodEntry.update({
              where: { id: entry.id },
              data: {
                protein: entry.protein ?? (Math.max(0, parseFloat(parsed.protein) || 0)),
                carbs: entry.carbs ?? (Math.max(0, parseFloat(parsed.carbs) || 0)),
                fat: entry.fat ?? (Math.max(0, parseFloat(parsed.fat) || 0)),
                fiber: entry.fiber ?? (Math.max(0, parseFloat(parsed.fiber) || 0)),
                sugar: entry.sugar ?? (Math.max(0, parseFloat(parsed.sugar) || 0)),
              },
            })

            return entry.name
          } catch (err) {
            throw new Error(`${entry.name}: ${(err as Error).message}`)
          }
        })
      )

      for (const r of results) {
        if (r.status === "fulfilled") {
          updated++
        } else {
          failed++
          errors.push(r.reason?.message || "Unknown error")
        }
      }

      // Small delay between batches to respect rate limits
      if (i + batchSize < entries.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json({
      message: `Backfill complete`,
      total: entries.length,
      updated,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    })
  } catch (error) {
    console.error("Error in backfill-macros:", error)
    return NextResponse.json(
      { error: "Failed to backfill macros" },
      { status: 500 }
    )
  }
}
