import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireApiUser } from "@/lib/get-api-user"

// GET - list all lab files
export async function GET() {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const files = await prisma.labFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        mimeType: true,
        createdAt: true,
      },
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error("Error listing lab files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

// POST - upload a new lab file
export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    let textContent = ""

    if (file.type === "application/pdf") {
      // Use GPT-4o-mini to extract text from PDF via base64
      const { openai: oai } = await import("@/lib/openai")
      if (!oai) {
        return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 })
      }

      // Try pdf-parse first, fall back to AI extraction
      try {
        const pdf = require("pdf-parse")
        const buffer = Buffer.from(await file.arrayBuffer())
        const pdfData = await pdf(buffer)
        textContent = pdfData.text
      } catch {
        // Fallback: send as base64 to GPT vision
        const buffer = Buffer.from(await file.arrayBuffer())
        const base64 = buffer.toString("base64")
        const completion = await oai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract ALL text from this PDF document. Transcribe every value, test name, reference range, and unit exactly as shown. Output the raw text content only, no commentary.",
                },
                {
                  type: "image_url",
                  image_url: { url: `data:application/pdf;base64,${base64}` },
                },
              ],
            },
          ],
          max_tokens: 4000,
        })
        textContent = completion.choices[0]?.message?.content || ""
      }
    } else if (file.type.startsWith("image/")) {
      // For images, we'll use GPT-4o vision to extract text
      const { openai } = await import("@/lib/openai")
      if (!openai) {
        return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract ALL text from this lab result image. Transcribe every value, test name, reference range, and unit exactly as shown. Output the raw text content only, no commentary.",
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 4000,
      })

      textContent = completion.choices[0]?.message?.content || ""
    } else if (
      file.type === "text/plain" ||
      file.type === "text/csv" ||
      file.type.includes("spreadsheet")
    ) {
      const buffer = Buffer.from(await file.arrayBuffer())
      textContent = buffer.toString("utf-8")
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, image, or text files." },
        { status: 400 }
      )
    }

    if (!textContent.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the file" },
        { status: 400 }
      )
    }

    const labFile = await prisma.labFile.create({
      data: {
        userId,
        name: file.name,
        content: textContent,
        mimeType: file.type,
      },
    })

    return NextResponse.json(
      { id: labFile.id, name: labFile.name, mimeType: labFile.mimeType, createdAt: labFile.createdAt },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error uploading lab file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

// PATCH - rename a lab file
export async function PATCH(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const body = await request.json()
    const { id, name } = body as { id?: string; name?: string }

    if (!id || !name?.trim()) {
      return NextResponse.json({ error: "File ID and name are required" }, { status: 400 })
    }

    const file = await prisma.labFile.findUnique({ where: { id } })
    if (!file || file.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.labFile.update({
      where: { id },
      data: { name: name.trim() },
      select: { id: true, name: true, mimeType: true, createdAt: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error renaming lab file:", error)
    return NextResponse.json({ error: "Failed to rename file" }, { status: 500 })
  }
}

// DELETE - remove a lab file
export async function DELETE(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 })
    }

    const file = await prisma.labFile.findUnique({ where: { id } })
    if (!file || file.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.labFile.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lab file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
