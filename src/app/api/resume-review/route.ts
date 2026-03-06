import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY

        if (!apiKey) {
            console.error("[resume-review] OPENROUTER_API_KEY is not configured")
            return NextResponse.json(
                { error: "OpenRouter API key not configured. Add OPENROUTER_API_KEY to .env.local" },
                { status: 500 }
            )
        }

        const { resumeData } = await req.json()

        if (!resumeData) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400 }
            )
        }

        const systemMessage = `You are a strict but constructive Hiring Manager and Resume Coach. 
Review the provided resume data and give an honest, detailed critique.

Structure your response as follows:
**Overall Score:** X/10

**Strengths:**
- List 2-3 genuine strengths

**Critical Weaknesses:**
- List specific issues (weak verbs, missing metrics, poor formatting decisions, clichés, etc.)

**Top 5 Actionable Improvements:**
1. Specific fix #1
2. Specific fix #2
3. Specific fix #3
4. Specific fix #4
5. Specific fix #5

Be direct, professional, and specific. Avoid generic advice.`

        const prompt = `Please review this resume data and provide detailed feedback:

${JSON.stringify({
            name: `${resumeData.personalInfo?.firstName || ""} ${resumeData.personalInfo?.lastName || ""}`.trim(),
            summary: resumeData.personalInfo?.summary,
            experience: resumeData.experience?.map((e: any) => ({
                position: e.position,
                company: e.company,
                description: e.description,
                startDate: e.startDate,
                endDate: e.endDate,
            })),
            education: resumeData.education?.map((e: any) => ({
                degree: e.degree,
                school: e.school,
            })),
            skills: resumeData.skills?.map((s: any) => s.name),
            projects: resumeData.projects?.map((p: any) => ({ title: p.title, description: p.description })),
        }, null, 2)}`

        console.log(`[resume-review] Sending request to OpenRouter with model: openai/gpt-4o-mini`)

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "AI Resume Builder",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: prompt },
                ],
                temperature: 0.3,
                max_tokens: 1500,
            }),
        })

        console.log(`[resume-review] OpenRouter response status: ${response.status}`)

        if (!response.ok) {
            const errorBody = await response.text()
            console.error(`[resume-review] OpenRouter error ${response.status}:`, errorBody)
            return NextResponse.json(
                { error: `OpenRouter API error (${response.status}): ${errorBody}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        const generatedText = data.choices?.[0]?.message?.content?.trim() || ""

        if (!generatedText) {
            return NextResponse.json(
                { error: "AI returned an empty response. Please try again." },
                { status: 500 }
            )
        }

        console.log(`[resume-review] Success! Used model: ${data.model}`)
        return NextResponse.json({ text: generatedText, model: data.model })

    } catch (error: any) {
        console.error("[resume-review] Unexpected error:", error)
        return NextResponse.json(
            { error: error?.message || "An unexpected error occurred. Please try again." },
            { status: 500 }
        )
    }
}
