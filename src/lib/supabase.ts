import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder-project.supabase.co"

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            'x-application-name': 'resume-builder'
        }
    },
    // Add timeout to prevent hanging requests
    db: {
        schema: "public"
    }
})

// Test connection on initialization (non-blocking)
if (process.env.NODE_ENV === "development") {
    supabase.auth.getSession().catch((err) => {
        console.warn("Supabase connection warning:", err.message)
        console.warn("Please verify your Supabase URL and ANON_KEY in .env.local")
    })
}

