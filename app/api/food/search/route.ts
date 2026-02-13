import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function GET(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim() || ""

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] }, { status: 200 })
    }

    // Find distinct food entries matching the query
    const entries = await prisma.foodEntry.findMany({
      where: {
        userId,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        fiber: true,
        sugar: true,
      },
      orderBy: { date: "desc" },
      take: 50,
    })

    // Deduplicate by name, keeping the most recent entry's values
    const seen = new Map<string, { name: string; calories: number; protein: number | null; carbs: number | null; fat: number | null; fiber: number | null; sugar: number | null }>()
    for (const entry of entries) {
      const key = entry.name.toLowerCase()
      if (!seen.has(key)) {
        seen.set(key, {
          name: entry.name,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          fiber: entry.fiber,
          sugar: entry.sugar,
        })
      }
    }

    const suggestions = Array.from(seen.values()).slice(0, 8)

    return NextResponse.json({ suggestions }, { status: 200 })
  } catch (error) {
    console.error("Error searching food entries:", error)
    return NextResponse.json(
      { error: "Failed to search food entries" },
      { status: 500 }
    )
  }
}
