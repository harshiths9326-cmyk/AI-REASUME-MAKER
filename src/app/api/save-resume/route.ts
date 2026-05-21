import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

// Validation schema
const saveResumeSchema = z.object({
    id: z.string().min(1, "Resume ID is required"),
    data: z.object({
        personalInfo: z.object({
            firstName: z.string(),
            lastName: z.string(),
            jobTitle: z.string(),
            email: z.string(),
            phone: z.string(),
            address: z.string(),
            linkedin: z.string(),
            website: z.string(),
            summary: z.string(),
        }),
        experience: z.array(z.any()).optional(),
        education: z.array(z.any()).optional(),
        skills: z.array(z.any()).optional(),
        projects: z.array(z.any()).optional(),
        certifications: z.array(z.any()).optional(),
        achievements: z.array(z.any()).optional(),
        languages: z.array(z.any()).optional(),
        links: z.array(z.any()).optional(),
    }),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        
        // Validate request body
        const validationResult = saveResumeSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid resume data", details: validationResult.error.issues },
                { status: 400 }
            )
        }

        const { id, data } = validationResult.data

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Authentication required to save resumes" },
                { status: 401 }
            )
        }

        const { data: result, error } = await supabase
            .from('resumes')
            .upsert({
                id,
                user_id: user.id,
                data,
                updated_at: new Date()
            })
            .select()

        if (error) {
            console.error("Supabase error:", error)
            return NextResponse.json(
                { error: `Database error: ${error.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, resume: result?.[0] })
    } catch (error) {
        console.error("Save Resume Error:", error)
        return NextResponse.json(
            { error: "Failed to save resume. Please try again." },
            { status: 500 }
        )
    }
}
