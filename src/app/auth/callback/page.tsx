"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, AlertCircle } from "lucide-react"

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Check for OAuth error from searchParams
                const error = searchParams.get("error")
                const errorDescription = searchParams.get("error_description")

                if (error || errorDescription) {
                    const msg = errorDescription || error || "Failed to authenticate"
                    console.error("OAuth Error:", msg)
                    setErrorMsg(msg)
                    setTimeout(() => router.push("/login?error=" + encodeURIComponent(msg)), 3000)
                    return
                }

                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.error("Error during auth callback:", sessionError.message)
                    setErrorMsg(sessionError.message)
                    setTimeout(() => router.push("/login?error=" + encodeURIComponent(sessionError.message)), 3000)
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
                    // No session found, wait a moment and then back to login
                    setTimeout(() => {
                        router.replace("/login")
                    }, 500)
                }
            } catch (err) {
                console.error("Unexpected error in auth callback", err)
                setErrorMsg((err as Error).message || "An unexpected error occurred")
                setTimeout(() => router.push("/login"), 3000)
            }
        }

        handleAuthCallback()
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
            <div className="space-y-4 text-center max-w-md p-6">
                {errorMsg ? (
                    <>
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                        <h2 className="text-2xl font-bold tracking-tight text-destructive">Authentication Failed</h2>
                        <p className="text-muted-foreground">{errorMsg}</p>
                        <p className="text-sm text-muted-foreground mt-4 animate-pulse">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-2" />
                        <h2 className="text-2xl font-bold tracking-tight">Authenticating...</h2>
                        <p className="text-muted-foreground font-mono">Finalizing secure connection...</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    )
}
