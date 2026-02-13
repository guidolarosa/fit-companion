import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { name, calories, date, protein, carbs, fat, fiber, sugar } = body

    if (!name || !calories || typeof calories !== "number" || calories <= 0) {
      return NextResponse.json(
        { error: "Valid name and calories are required" },
        { status: 400 }
      )
    }

    const food = await prisma.foodEntry.create({
      data: {
        userId,
        name,
        calories,
        protein: typeof protein === "number" ? protein : null,
        carbs: typeof carbs === "number" ? carbs : null,
        fat: typeof fat === "number" ? fat : null,
        fiber: typeof fiber === "number" ? fiber : null,
        sugar: typeof sugar === "number" ? sugar : null,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(food, { status: 201 })
  } catch (error) {
    console.error("Error creating food entry:", error)
    return NextResponse.json(
      { error: "Failed to create food entry" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { id, name, calories, date, protein, carbs, fat, fiber, sugar } = body

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      )
    }

    if (!name || !calories || typeof calories !== "number" || calories <= 0) {
      return NextResponse.json(
        { error: "Valid name and calories are required" },
        { status: 400 }
      )
    }

    // Verify the entry belongs to the user
    const entry = await prisma.foodEntry.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const updatedFood = await prisma.foodEntry.update({
      where: { id },
      data: {
        name,
        calories,
        protein: typeof protein === "number" ? protein : null,
        carbs: typeof carbs === "number" ? carbs : null,
        fat: typeof fat === "number" ? fat : null,
        fiber: typeof fiber === "number" ? fiber : null,
        sugar: typeof sugar === "number" ? sugar : null,
        date: date ? new Date(date) : entry.date,
      },
    })

    return NextResponse.json(updatedFood, { status: 200 })
  } catch (error) {
    console.error("Error updating food entry:", error)
    return NextResponse.json(
      { error: "Failed to update food entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      )
    }

    // Verify the entry belongs to the user
    const entry = await prisma.foodEntry.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await prisma.foodEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting food entry:", error)
    return NextResponse.json(
      { error: "Failed to delete food entry" },
      { status: 500 }
    )
  }
}

