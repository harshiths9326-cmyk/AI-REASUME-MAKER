import { NextResponse } from "next/server"
import { OpenAI } from "openai"

// OpenRouter model fallback chain.
// "openrouter/auto" is the smart router that picks the best available free model automatically.
// The remaining models are fallbacks ordered by reliability and quality.
const COMPLEX_MODELS = [
    "openrouter/auto",                            // Auto-picks best available free model
    "meta-llama/llama-3.3-70b-instruct:free",     // Top-tier free model, GPT-4 quality
    "deepseek/deepseek-chat-v3-0324:free",        // Very capable, frequently available
    "google/gemini-2.0-flash-exp:free",            // Fast & capable
    "mistralai/mistral-7b-instruct:free",          // Reliable lightweight model
    "meta-llama/llama-3.1-8b-instruct:free",       // Good fallback
]

const SIMPLE_MODELS = [
    "openrouter/auto",
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3-8b-instruct",
]

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
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "AI Resume Builder",
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
        const modelChain = isComplexTask ? COMPLEX_MODELS : SIMPLE_MODELS
        const maxTokens = isComplexTask ? 2000 : 800

        let lastError: any = null

        // Try each model in the chain until one succeeds
        for (const model of modelChain) {
            try {
                console.log(`[generate] Trying model: ${model} for type: ${type}`)
                const response = await openai.chat.completions.create({
                    model,
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt },
                    ],
                    // Only use json_object for types that specifically need structured JSON output
                    response_format: type === "resume-optimizer" ? { type: "json_object" } : undefined,
                    temperature: 0.3,
                    max_tokens: maxTokens,
                })

                const generatedText = response.choices[0]?.message?.content?.trim() || ""

                if (!generatedText) {
                    console.warn(`[generate] Model ${model} returned empty content, trying next...`)
                    continue
                }

                console.log(`[generate] Success with model: ${model}`)
                return NextResponse.json({ text: generatedText, model })

            } catch (modelError: any) {
                const errMsg = modelError?.message || String(modelError)
                console.warn(`[generate] Model ${model} failed: ${errMsg}`)
                lastError = modelError
                // Continue to next model in chain
            }
        }

        // All models exhausted
        const errDetail = lastError?.message || "All AI models are currently rate-limited or unavailable."
        console.error("[generate] All models failed. Last error:", lastError)
        return NextResponse.json(
            { error: `AI Unavailable: ${errDetail}. Please wait a moment and try again, or check your OpenRouter API key.` },
            { status: 503 }
        )

    } catch (error: any) {
        console.error("OpenAI/OpenRouter Error:", error)
        return NextResponse.json(
            { error: error?.message || "Failed to generate content. Please try again." },
            { status: 500 }
        )
    }
}
