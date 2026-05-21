import { NextResponse } from "next/server"
import { z } from "zod"

const scorerSchema = z.object({
    resumeData: z.object({
        personalInfo: z.object({
            summary: z.string(),
            jobTitle: z.string(),
        }),
        experience: z.array(z.any()),
        skills: z.array(z.any()),
        education: z.array(z.any()),
    }),
    jobDescription: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validationResult = scorerSchema.safeParse(body)
        
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid resume data", details: validationResult.error.issues },
                { status: 400 }
            )
        }

        const { resumeData, jobDescription } = validationResult.data

        const openRouterKey = process.env.OPENROUTER_API_KEY
        if (!openRouterKey) {
            return NextResponse.json(
                { error: "AI service not configured" },
                { status: 503 }
            )
        }

        const prompt = jobDescription
            ? `Analyze this resume against the job description and provide:
1. Overall ATS score (0-100)
2. Keyword match percentage
3. Missing critical keywords
4. Specific improvement suggestions
5. Strengths of the resume

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Return as JSON with format:
{
  "overallScore": number,
  "keywordMatch": number,
  "missingKeywords": string[],
  "suggestions": string[],
  "strengths": string[],
  "atsCompatible": boolean
}`
            : `Analyze this resume and provide:
1. Overall quality score (0-100)
2. ATS compatibility score
3. Missing essential elements
4. Specific improvement suggestions
5. Top 3 strengths

Resume:
${JSON.stringify(resumeData, null, 2)}

Return as JSON with format:
{
  "overallScore": number,
  "atsScore": number,
  "missingElements": string[],
  "suggestions": string[],
  "strengths": string[],
  "atsCompatible": boolean
}`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "Resume Builder AI Scorer"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert ATS (Applicant Tracking System) analyzer and career coach. Provide concise, actionable feedback in valid JSON format only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        })

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`)
        }

        const data = await response.json()
        const analysisText = data.choices[0].message.content

        // Parse the JSON response from AI
        let analysis
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = analysisText.match(/```json\n?([\s\S]*?)\n?```/) || analysisText.match(/\{[\s\S]*\}/)
            const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : analysisText
            analysis = JSON.parse(jsonString)
        } catch {
            throw new Error("Failed to parse AI analysis")
        }

        return NextResponse.json({ success: true, analysis })
    } catch (error) {
        console.error("AI Scorer Error:", error)
        return NextResponse.json(
            { error: "Failed to analyze resume. Please try again." },
            { status: 500 }
        )
    }
}
