import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

// GET today's water entry
export async function GET() {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    // Get today's date as UTC midnight
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    const todayDate = new Date(`${todayStr}T00:00:00.000Z`)

    const entry = await prisma.waterEntry.findFirst({
      where: {
        userId,
        date: todayDate,
      },
    })

    return NextResponse.json({ glasses: entry?.glasses ?? 0 })
  } catch (error) {
    console.error("Error fetching water entry:", error)
    return NextResponse.json({ error: "Failed to fetch water entry" }, { status: 500 })
  }
}

// POST/PUT update today's water count
export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { glasses } = body

    if (typeof glasses !== "number" || glasses < 0) {
      return NextResponse.json({ error: "Valid glasses count required" }, { status: 400 })
    }

    // Get today's date as UTC midnight
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    const todayDate = new Date(`${todayStr}T00:00:00.000Z`)

    const entry = await prisma.waterEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
      update: { glasses },
      create: {
        userId,
        glasses,
        date: todayDate,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error updating water entry:", error)
    return NextResponse.json({ error: "Failed to update water entry" }, { status: 500 })
  }
}
