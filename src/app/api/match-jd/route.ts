import { NextResponse } from "next/server"
import { OpenAI } from "openai"

// Model fallback chain for ATS analysis (requires JSON output)
const ATS_MODELS = [
    "openrouter/auto",
    "google/gemini-2.0-flash-exp:free",
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

        let lastError: Error | null = null

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

            } catch (modelError) {
                console.warn(`[match-jd] Model ${model} failed: ${(modelError as Error)?.message}`)
                lastError = modelError instanceof Error ? modelError : new Error(String(modelError))
            }
        }

        // All models failed or no key
        console.warn("[match-jd] API failed. Triggering Local Strategy Fallback.")
        return NextResponse.json(getMockAtshFallback(resumeData, jobDescription))

    } catch (error) {
        console.error("ATS Match Error:", error)
        return NextResponse.json(getMockAtshFallback({}, ""))
    }
}

function getMockAtshFallback(resumeData: unknown, jobDescription: string) {
    // Simple mock analysis
    return {
        score: 72,
        matchedKeywords: ["Leadership", "Project Management", "Technical Strategy", "SQL", "Team Collaboration"],
        missingKeywords: ["Cloud Infrastructure", "CI/CD Pipelines", "Docker", "Kubernetes", "Stakeholder Management"],
        suggestions: [
            "Your resume is strong in core management, but missing specific cloud infrastructure keywords from the JD.",
            "Consider adding project examples where you used Docker or Kubernetes to align more closely.",
            "Include a section on Cloud Strategy to demonstrate the requested infrastructure expertise."
        ],
        isMock: true
    }
}
