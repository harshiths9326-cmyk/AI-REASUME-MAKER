import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

/**
 * Client-side auth guard using Supabase authentication.
 * Redirects to /login if the user is not logged in.
 * Returns { isAuthed, user } — render nothing until isAuthed is true.
 */
export function useAuthGuard() {
    const router = useRouter()
    const [isAuthed, setIsAuthed] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                
                if (!user) {
                    router.replace("/login")
                } else {
                    setUser(user)
                    setIsAuthed(true)
                    // Sync to sessionStorage for backward compatibility
                    sessionStorage.setItem("ai_resume_user", JSON.stringify({
                        id: user.id,
                        email: user.email
                    }))
                }
            } catch (error) {
                console.warn("Auth check failed:", error)
                // Don't redirect on network errors, let user see the page
                setIsAuthed(true)
            }
        }

        checkAuth()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.replace("/login")
                setIsAuthed(false)
            } else {
                setIsAuthed(true)
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    return { isAuthed, user }
}
