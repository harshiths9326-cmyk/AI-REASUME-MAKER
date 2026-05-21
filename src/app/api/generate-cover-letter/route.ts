import { NextResponse } from "next/server"
import { z } from "zod"

const coverLetterSchema = z.object({
    resumeData: z.object({
        personalInfo: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            jobTitle: z.string(),
            summary: z.string(),
        }),
        experience: z.array(z.any()),
        education: z.array(z.any()),
        skills: z.array(z.any()),
    }),
    jobDescription: z.string().optional(),
    companyName: z.string().optional(),
    tone: z.enum(["professional", "casual", "startup", "creative"]).default("professional"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validationResult = coverLetterSchema.safeParse(body)
        
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid data", details: validationResult.error.issues },
                { status: 400 }
            )
        }

        const { resumeData, jobDescription, companyName, tone } = validationResult.data

        const openRouterKey = process.env.OPENROUTER_API_KEY
        if (!openRouterKey) {
            return NextResponse.json(
                { error: "AI service not configured" },
                { status: 503 }
            )
        }

        const toneInstructions = {
            professional: "Formal, traditional business letter style",
            casual: "Friendly, conversational but still professional",
            startup: "Energetic, passionate, modern tech culture",
            creative: "Unique, storytelling approach with personality"
        }

        const prompt = `Write a compelling cover letter for ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} applying for the ${resumeData.personalInfo.jobTitle} position${companyName ? ` at ${companyName}` : ""}.

Resume Summary:
${resumeData.personalInfo.summary}

Key Experience:
${resumeData.experience.slice(0, 3).map(exp => `- ${exp.position} at ${exp.company}: ${exp.description}`).join('\n')}

Education:
${resumeData.education.slice(0, 2).map(edu => `- ${edu.degree} from ${edu.school}`).join('\n')}

Top Skills:
${resumeData.skills.slice(0, 8).map(skill => skill.name).join(', ')}

${jobDescription ? `Job Description:\n${jobDescription}\n\nTailor the cover letter to match this specific job requirements and keywords.` : ''}

Tone: ${toneInstructions[tone]}

Requirements:
- Use modern business letter format
- Include specific achievements and metrics from experience
- Show enthusiasm and cultural fit
- Keep it concise (300-400 words)
- End with a strong call to action
- Do NOT include placeholder text like [Your Name] - use the actual names provided

Return ONLY the cover letter text, no JSON, no explanations.`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "Resume Builder Cover Letter Generator"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert career coach and professional writer. Write compelling, personalized cover letters that get interviews."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        })

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`)
        }

        const data = await response.json()
        const coverLetter = data.choices[0].message.content

        console.log("Cover letter generated successfully")

        return NextResponse.json({ success: true, coverLetter })
    } catch (error) {
        console.error("Cover Letter Generator Error:", error)
        return NextResponse.json(
            { error: "Failed to generate cover letter. Please try again." },
            { status: 500 }
        )
    }
}
