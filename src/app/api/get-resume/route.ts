import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

// Validation schema
const getResumeSchema = z.object({
    id: z.string().min(1, "Resume ID is required"),
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        // Validate request parameters
        const validationResult = getResumeSchema.safeParse({ id })
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid resume ID", details: validationResult.error.issues },
                { status: 400 }
            )
        }

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Authentication required to view resumes" },
                { status: 401 }
            )
        }

        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', validationResult.data.id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            console.error("Supabase fetch error:", error)
            return NextResponse.json(
                { error: "Resume not found or access denied" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, resume: data })
    } catch (error) {
        console.error("Get Resume Error:", error)
        return NextResponse.json(
            { error: "Failed to load resume. Please try again." },
            { status: 500 }
        )
    }
}
