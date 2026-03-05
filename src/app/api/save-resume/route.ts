import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
    try {
        const { id, data } = await req.json()

        if (!id || !data) {
            return NextResponse.json(
                { error: "Resume ID and Data are required" },
                { status: 400 }
            )
        }

        const { data: result, error } = await supabase
            .from('resumes')
            .upsert({ id, data, updated_at: new Date() })
            .select()

        if (error) {
            console.error("Supabase error:", error)
            return NextResponse.json(
                { error: "Failed to save to database" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, resume: result[0] })
    } catch (error) {
        console.error("Save Resume Error:", error)
        return NextResponse.json(
            { error: "Failed to save resume. Please try again." },
            { status: 500 }
        )
    }
}
