import OpenAI from "openai"

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn("OPENAI_API_KEY is not set in environment variables")
}

export const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null

export async function getAIResponse(
  prompt: string,
  systemPrompt: string,
  userContext?: string
): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file.")
  }

  try {
    // Combine user context with the prompt if provided
    const fullPrompt = userContext
      ? `${userContext}\n\nUSER QUESTION: ${prompt}\n\nPlease provide personalized advice based on the user's data above.`
      : prompt

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500, // Increased to accommodate context
    })

    return completion.choices[0]?.message?.content || "No response generated"
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw error
  }
}

/**
 * Returns an OpenAI streaming response (async iterable of chunks).
 */
export function getAIStreamResponse(
  prompt: string,
  systemPrompt: string,
  userContext?: string
) {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file.")
  }

  const fullPrompt = userContext
    ? `${userContext}\n\nUSER QUESTION: ${prompt}\n\nPlease provide personalized advice based on the user's data above.`
    : prompt

  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: fullPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    stream: true,
  })
}

