import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"
import { DASHBOARD_WIDGET_IDS, type DashboardWidgetLayout } from "@/lib/dashboard-layout"

function isValidWidgets(value: unknown): value is DashboardWidgetLayout[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      typeof (entry as { id?: unknown }).id === "string" &&
      (DASHBOARD_WIDGET_IDS as readonly string[]).includes((entry as { id: string }).id) &&
      typeof (entry as { visible?: unknown }).visible === "boolean"
  )
}

export async function PATCH(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()

    if (body?.reset === true) {
      await prisma.user.update({
        where: { id: userId },
        data: { dashboardLayout: Prisma.DbNull },
      })
      return NextResponse.json({ success: true })
    }

    if (!isValidWidgets(body?.widgets)) {
      return NextResponse.json({ error: "Invalid widgets payload" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { dashboardLayout: { widgets: body.widgets } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving dashboard layout:", error)
    return NextResponse.json({ error: "Failed to save dashboard layout" }, { status: 500 })
  }
}
