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
      },
      orderBy: { date: "desc" },
      take: 50,
    })

    // Deduplicate by name, keeping the most recent entry's calories
    const seen = new Map<string, { name: string; calories: number }>()
    for (const entry of entries) {
      const key = entry.name.toLowerCase()
      if (!seen.has(key)) {
        seen.set(key, { name: entry.name, calories: entry.calories })
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
