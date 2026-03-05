import { NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(req: Request) {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json(
                { error: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env.local file." },
                { status: 500 }
            )
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter for ranking
                "X-Title": "AI Resume Builder", // Optional title
            }
        })

        const { prompt, type } = await req.json()

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            )
        }

        let systemMessage = "You are an expert resume writer and career coach."

        if (type === "experience") {
            systemMessage += " Enhance the provided work experience into 3-4 professional, impactful, and action-oriented bullet points suitable for a resume. Focus on achievements and metrics where applicable."
        } else if (type === "summary") {
            systemMessage += " Write a professional, concise summary for a resume based on the provided details (limit to 3-4 sentences). Focus on key strengths and career trajectory."
        } else {
            systemMessage += " Please rewrite the provided content to be professional and suitable for a resume."
        }

        const response = await openai.chat.completions.create({
            model: "meta-llama/llama-3-8b-instruct", // Standard Llama 3 is highly available
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 250,
        })

        const generatedText = response.choices[0]?.message?.content?.trim() || ""

        return NextResponse.json({ text: generatedText })
    } catch (error: any) {
        // Detailed error logging for debugging
        console.error("OpenAI/OpenRouter Error:", error)
        if (error.response) {
            console.error("Response data:", error.response.data)
        }

        return NextResponse.json(
            { error: error?.message || "Failed to generate content. Please try again." },
            { status: 500 }
        )
    }
}
