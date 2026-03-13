import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { error: "Resume ID is required" },
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
            .eq('id', id)
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
