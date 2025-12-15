import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

export async function PUT(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { name, height, age, lifestyle, ifType, ifStartTime } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || null,
        height: height ? parseFloat(height) : null,
        age: age ? parseInt(age) : null,
        lifestyle: lifestyle || null,
        ifType: ifType || null,
        ifStartTime: ifType ? ifStartTime : null,
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

