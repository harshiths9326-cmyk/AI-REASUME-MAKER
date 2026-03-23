import { NextResponse } from "next/server"
import { ResumeData } from "@/lib/types"

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
            name: `${(resumeData as ResumeData).personalInfo?.firstName || ""} ${(resumeData as ResumeData).personalInfo?.lastName || ""}`.trim(),
            summary: (resumeData as ResumeData).personalInfo?.summary,
            experience: (resumeData as ResumeData).experience?.map((e) => ({
                position: e.position,
                company: e.company,
                description: e.description,
                startDate: e.startDate,
                endDate: e.endDate,
            })),
            education: (resumeData as ResumeData).education?.map((e) => ({
                degree: e.degree,
                school: e.school,
            })),
            skills: (resumeData as ResumeData).skills?.map((s) => s.name),
            projects: (resumeData as ResumeData).projects?.map((p) => ({ title: p.title, description: p.description })),
        }, null, 2)}`

        console.log(`[resume-review] Sending request to OpenRouter with model: openrouter/auto`)

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "AI Resume Builder",
            },
            body: JSON.stringify({
                model: "openrouter/auto",
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

        // OpenRouter failed or no key
        console.warn("[resume-review] API failed or not configured. Triggering Local Fallback.")
        return NextResponse.json({ 
            text: getMockReviewFallback(resumeData), 
            model: "local-reviewer-v1",
            isMock: true
        })

    } catch (error) {
        console.error("[resume-review] Unexpected error:", error)
        return NextResponse.json({ 
            text: getMockReviewFallback({}), 
            model: "local-reviewer-v1-error",
            isMock: true
        })
    }
}

function getMockReviewFallback(resumeData: unknown): string {
    return `**Overall Score: 7.5/10 (Local Strategy Analysis)**

**Strengths:**
- Structured layout with clear sections for Experience and Education.
- Good variety of skills listed.

**Critical Weaknesses:**
- Bullet points lack strong action verbs (e.g., use "Orchestrated" instead of "Worked on").
- Missing quantitative data. Most recruiters look for numbers like "Increased efficiency by 15%".
- Professional summary could be more punchy and objective-oriented.

**Top 5 Actionable Improvements:**
1. **Quantify Results:** Add at least one metric to every job experience.
2. **Action Verb Audit:** Replace passive language with executive action verbs.
3. **Keyword Optimization:** Ensure your skills section matches the job description exactly.
4. **Impact Summary:** Rewrite your summary to focus on your "Unique Value Proposition".
5. **Formatting Consistency:** Ensure all dates and locations follow the exact same format.`
}
