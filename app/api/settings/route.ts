import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function GET() {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        height: true,
        age: true,
        lifestyle: true,
        ifType: true,
        ifStartTime: true,
        targetWeightMin: true,
        targetWeightMax: true,
        milestoneStep: true,
        sustainabilityMode: true,
        locale: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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
    const {
      name,
      height,
      age,
      lifestyle,
      ifType,
      ifStartTime,
      targetWeightMin,
      targetWeightMax,
      milestoneStep,
      sustainabilityMode,
      locale,
    } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || null,
        height: height ? parseFloat(height) : null,
        age: age ? parseInt(age) : null,
        lifestyle: lifestyle || null,
        ifType: ifType || null,
        ifStartTime: ifType ? ifStartTime : null,
        targetWeightMin: targetWeightMin ? parseFloat(targetWeightMin) : null,
        targetWeightMax: targetWeightMax ? parseFloat(targetWeightMax) : null,
        milestoneStep: milestoneStep ? parseFloat(milestoneStep) : null,
        sustainabilityMode: sustainabilityMode || null,
        ...(locale && { locale }),
      },
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

