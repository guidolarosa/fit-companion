import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { requireApiUser } from "@/lib/get-api-user"

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult.id

    if (!openai) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { prompt, fileIds, mode } = body as {
      prompt?: string
      fileIds: string[]
      mode: "analyze" | "chat"
    }

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json({ error: "At least one file is required" }, { status: 400 })
    }

    // Fetch selected files
    const files = await prisma.labFile.findMany({
      where: {
        id: { in: fileIds },
        userId,
      },
    })

    if (files.length === 0) {
      return NextResponse.json({ error: "No valid files found" }, { status: 404 })
    }

    // Build context from file contents
    const fileContexts = files
      .map((f) => `--- ${f.name} (${f.createdAt.toLocaleDateString("es-ES")}) ---\n${f.content}`)
      .join("\n\n")

    // Get user info for context
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const latestWeight = await prisma.weightEntry.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    })

    const userInfo = [
      user?.age ? `Age: ${user.age}` : null,
      user?.height ? `Height: ${user.height}cm` : null,
      latestWeight ? `Current weight: ${latestWeight.weight}kg` : null,
      user?.lifestyle ? `Activity level: ${user.lifestyle}` : null,
    ]
      .filter(Boolean)
      .join(", ")

    const systemPrompt =
      mode === "analyze"
        ? `You are a medical lab results analyst assistant. You help users understand their lab results in a clear, friendly way.

When analyzing lab results:
1. List each test with its value, reference range (if available), and whether it's normal, high, or low
2. Highlight any values outside reference ranges with clear explanations of what they may indicate
3. Group related tests together (e.g., lipid panel, blood count, metabolic panel)
4. Provide a general summary with key takeaways
5. Suggest lifestyle or dietary adjustments where relevant
6. Always recommend consulting a healthcare professional for medical decisions

User info: ${userInfo || "Not available"}

IMPORTANT: Be informative but not alarming. Use clear language. Respond in Spanish.`
        : `You are a friendly health assistant that helps users understand their lab results. You have access to the user's lab files.
Answer questions about the lab data accurately. If you're unsure, say so.
Be informative, not alarmist. Always suggest consulting a professional for medical concerns.

User info: ${userInfo || "Not available"}

Respond in Spanish.`

    const userMessage =
      mode === "analyze"
        ? `Please analyze the following lab results and provide comprehensive insights:\n\n${fileContexts}`
        : `Lab results for context:\n\n${fileContexts}\n\nUser question: ${prompt || "Summarize my results"}`

    // Stream the response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error analyzing lab results:", error)
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 })
  }
}
