import { NextResponse } from "next/server"
import { OpenAI } from "openai"

// Model fallback chain for ATS analysis (requires JSON output)
const ATS_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-2.0-pro-exp-02-05:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "meta-llama/llama-3-8b-instruct",
]

export async function POST(req: Request) {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json(
                { error: "OpenRouter API key not configured." },
                { status: 500 }
            )
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "AI Resume Builder",
            }
        })

        const { resumeData, jobDescription } = await req.json()

        if (!resumeData || !jobDescription) {
            return NextResponse.json(
                { error: "Resume data and job description are required" },
                { status: 400 }
            )
        }

        const systemMessage = `You are an expert ATS (Applicant Tracking System) analyzer. 
Analyze the provided resume against the job description. 
Return a JSON object with the following structure:
{
  "score": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestions": string[] (2-3 specific actionable tips)
}
Only return the JSON object, nothing else.`

        const prompt = `
Job Description:
${jobDescription}

Resume Data:
${JSON.stringify(resumeData)}
`

        let lastError: any = null

        for (const model of ATS_MODELS) {
            try {
                console.log(`[match-jd] Trying model: ${model}`)
                const response = await openai.chat.completions.create({
                    model,
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt },
                    ],
                    temperature: 0.1,
                    response_format: { type: "json_object" }
                })

                const resultText = response.choices[0]?.message?.content?.trim() || "{}"

                if (!resultText || resultText === "{}") {
                    console.warn(`[match-jd] Model ${model} returned empty content, trying next...`)
                    continue
                }

                const analysis = JSON.parse(resultText)
                console.log(`[match-jd] Success with model: ${model}`)
                return NextResponse.json(analysis)

            } catch (modelError: any) {
                console.warn(`[match-jd] Model ${model} failed: ${modelError?.message}`)
                lastError = modelError
            }
        }

        // All models failed
        console.error("[match-jd] All models failed. Last error:", lastError)
        return NextResponse.json(
            { error: lastError?.message || "All AI models are currently unavailable. Please try again in a moment." },
            { status: 503 }
        )

    } catch (error: any) {
        console.error("ATS Match Error:", error)
        return NextResponse.json(
            { error: "Failed to analyze resume against job description." },
            { status: 500 }
        )
    }
}
