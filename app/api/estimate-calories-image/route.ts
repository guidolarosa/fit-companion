import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { requireApiUser } from "@/lib/get-api-user"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB backstop; client already downsizes before upload

export async function POST(request: NextRequest) {
  try {
    const userResult = await requireApiUser()
    if (userResult instanceof NextResponse) return userResult

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const image = formData.get("image") as File | null
    const locale = (formData.get("locale") as string | null) || "en"

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (image.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 })
    }

    const buffer = Buffer.from(await image.arrayBuffer())
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${image.type};base64,${base64}`

    const languageName = locale === "es" ? "Spanish" : "English"

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a nutrition assistant. When given a photo of food, identify what it is and estimate its nutritional content.
If the photo shows multiple food items (e.g., a plate with several components), treat them as ONE combined entry: give it a single descriptive name covering the whole plate, and sum the macros across all visible components.
Reply with ONLY a JSON object with these keys: name (string, in ${languageName}), calories (integer), protein (float, grams), carbs (float, grams), fat (float, grams), fiber (float, grams), sugar (float, grams).
Example: {"name":"Grilled chicken with rice and vegetables","calories":550,"protein":40.0,"carbs":55.0,"fat":15.0,"fiber":5.0,"sugar":4.0}
If the photo does not clearly show food, reply with {"name":"","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0}.
Base your estimates on typical serving sizes visible in the photo.
Do NOT include any text, explanation, or markdown. Only the JSON object.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this food and estimate its nutritional content." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "{}"

    try {
      const parsed = JSON.parse(responseText)
      const result = {
        name: typeof parsed.name === "string" ? parsed.name.trim() : "",
        calories: Math.max(0, parseInt(parsed.calories, 10) || 0),
        protein: Math.max(0, parseFloat(parsed.protein) || 0),
        carbs: Math.max(0, parseFloat(parsed.carbs) || 0),
        fat: Math.max(0, parseFloat(parsed.fat) || 0),
        fiber: Math.max(0, parseFloat(parsed.fiber) || 0),
        sugar: Math.max(0, parseFloat(parsed.sugar) || 0),
      }
      return NextResponse.json(result, { status: 200 })
    } catch {
      return NextResponse.json(
        { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error estimating calories from image:", error)
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    )
  }
}
