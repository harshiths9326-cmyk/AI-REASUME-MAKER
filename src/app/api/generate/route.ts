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
            systemMessage += " Write a compelling, results-oriented professional summary (3-4 sentences). Highlight key accomplishments, unique value propositions, and career achievements based on the context. Use action verbs and maintain a professional tone."
        } else if (type === "project") {
            systemMessage += " Enhance the provided project description into 2-3 professional, technical, and action-oriented bullet points suitable for a resume. Highlight technologies used, your specific contributions, and the outcome or impact of the project."
        } else if (type === "cover-letter") {
            systemMessage += " Write a professional, tailored cover letter for the provided job description using the supplied resume data. Keep it to 3-4 paragraphs, highlight the most relevant skills/experience, and use a confident but professional tone."
        } else if (type === "interview-prep") {
            systemMessage += " Act as a Senior Technical Recruiter and Hiring Manager. Based on the provided Resume Data and Job Description, generate 5-7 highly specific, challenging interview questions the candidate is likely to face. For each question, provide a brief 'Suggested Talking Point' based on their resume strengths."
        } else if (type === "resume-review") {
            systemMessage += " Act as a strict, constructive Hiring Manager. Review this resume layout and content. Provide a bulleted critique of its weaknesses (e.g. overused verbs, missing metrics, formatting flow) and 3-5 highly actionable suggestions to improve it. Be direct but professional."
        } else if (type === "bullet-points") {
            systemMessage += " You are a professional resume writer. Convert raw job descriptions into strong resume bullet points. Use action verbs, include measurable impact, and keep each bullet under 18 words. Return exactly 4 optimized bullet points."
        } else if (type === "resume-optimizer") {
            systemMessage += " You are a professional resume editor. Fix grammar, improve clarity, add action verbs, and maintain a professional tone. You MUST return a valid JSON object that matches the exact structure of the provided ResumeData. Do not add any text outside the JSON object."
        } else {
            systemMessage += " Please rewrite the provided content to be professional and suitable for a resume."
        }

        const isComplexTask = ["resume-optimizer", "resume-review", "cover-letter", "interview-prep"].includes(type)
        const model = isComplexTask
            ? "google/gemini-2.0-pro-exp-02-05:free"
            : "meta-llama/llama-3-8b-instruct"

        const response = await openai.chat.completions.create({
            model: model,
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
            response_format: type === "resume-optimizer" ? { type: "json_object" } : undefined,
            temperature: 0.3,
            max_tokens: isComplexTask ? 2000 : 800,
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
