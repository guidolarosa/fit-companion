import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { weight, date } = body

    if (!weight || typeof weight !== "number" || weight <= 0) {
      return NextResponse.json(
        { error: "Valid weight is required" },
        { status: 400 }
      )
    }

    const entry = await prisma.weightEntry.create({
      data: {
        userId,
        weight,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error creating weight entry:", error)
    return NextResponse.json(
      { error: "Failed to create weight entry" },
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
    const { id, weight, date } = body

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      )
    }

    if (!weight || typeof weight !== "number" || weight <= 0) {
      return NextResponse.json(
        { error: "Valid weight is required" },
        { status: 400 }
      )
    }

    // Verify the entry belongs to the user
    const entry = await prisma.weightEntry.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const updatedEntry = await prisma.weightEntry.update({
      where: { id },
      data: {
        weight,
        date: date ? new Date(date) : entry.date,
      },
    })

    return NextResponse.json(updatedEntry, { status: 200 })
  } catch (error) {
    console.error("Error updating weight entry:", error)
    return NextResponse.json(
      { error: "Failed to update weight entry" },
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
    const entry = await prisma.weightEntry.findUnique({
      where: { id },
    })

    if (!entry || entry.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await prisma.weightEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting weight entry:", error)
    return NextResponse.json(
      { error: "Failed to delete weight entry" },
      { status: 500 }
    )
  }
}

