import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { name, calories, duration, date } = body

    if (!name || !calories || typeof calories !== "number" || calories <= 0) {
      return NextResponse.json(
        { error: "Valid name and calories are required" },
        { status: 400 }
      )
    }

    const exercise = await prisma.exercise.create({
      data: {
        userId,
        name,
        calories,
        duration: duration ? parseInt(duration) : null,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(exercise, { status: 201 })
  } catch (error) {
    console.error("Error creating exercise:", error)
    return NextResponse.json(
      { error: "Failed to create exercise" },
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
    const { id, name, calories, duration, date } = body

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
    const entry = await prisma.exercise.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        calories,
        duration: duration ? parseInt(duration) : null,
        date: date ? new Date(date) : entry.date,
      },
    })

    return NextResponse.json(updatedExercise, { status: 200 })
  } catch (error) {
    console.error("Error updating exercise:", error)
    return NextResponse.json(
      { error: "Failed to update exercise" },
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
    const entry = await prisma.exercise.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await prisma.exercise.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting exercise:", error)
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    )
  }
}

