import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Client-side auth guard using sessionStorage.
 * Redirects to /login if the user is not logged in.
 * Returns { isAuthed } — render nothing until isAuthed is true.
 */
export function useAuthGuard() {
    const router = useRouter()
    const [isAuthed, setIsAuthed] = useState(false)

    useEffect(() => {
        const user = sessionStorage.getItem("ai_resume_user")
        if (!user) {
            router.replace("/signup")
        } else {
            setIsAuthed(true)
        }
    }, [router])

    return { isAuthed }
}
