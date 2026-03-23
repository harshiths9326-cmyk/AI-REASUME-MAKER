import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
})

export async function POST(req: Request) {
    try {
        const { resumeText, jobDescription } = await req.json()

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ error: "Resume text and job description are required" }, { status: 400 })
        }

        const systemPrompt = `You are an ATS optimization expert. Compare the resume and job description and provide ATS compatibility analysis. 
        Return a JSON object with the following structure:
        {
            "score": number (0-100),
            "matchedKeywords": string[],
            "missingKeywords": string[],
            "suggestions": string[],
            "optimizedBulletRewrites": { "original": string, "optimized": string }[]
        }
        Provide 3-5 optimized bullet rewrites based on the job description requirements.`

        const userPrompt = `
        Resume Text: ${resumeText}
        Job Description: ${jobDescription}
        `

        const response = await openai.chat.completions.create({
            model: "openrouter/auto",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1, // Low temperature for consistent analysis
        })

        const result = JSON.parse(response.choices[0]?.message?.content || "{}")
        return NextResponse.json(result)
    } catch (error) {
        console.error("ATS Scanner API Error:", error)
        return NextResponse.json({ error: (error as Error).message || "Failed to analyze resume" }, { status: 500 })
    }
}
