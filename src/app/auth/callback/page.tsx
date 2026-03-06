"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error("Error during auth callback:", error.message)
                router.push("/login?error=" + encodeURIComponent(error.message))
                return
            }

            if (session?.user) {
                // Sync to sessionStorage for the app's existing auth logic
                sessionStorage.setItem("ai_resume_user", session.user.email || "")
                const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name
                const avatarUrl = session.user.user_metadata?.avatar_url

                if (fullName) {
                    sessionStorage.setItem("ai_resume_name", fullName)
                }
                if (avatarUrl) {
                    sessionStorage.setItem("ai_resume_avatar", avatarUrl)
                }

                // Mark as returning user
                localStorage.setItem("ai_resume_returning_user", "true")

                // Redirect to templates
                router.replace("/templates")
            } else {
                // No session found, back to login
                router.replace("/login")
            }
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
            <div className="space-y-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <h2 className="text-2xl font-bold tracking-tight">Authenticating...</h2>
                <p className="text-muted-foreground font-mono">Finalizing secure connection to neural link.</p>
            </div>
        </div>
    )
}
