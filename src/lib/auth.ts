import { supabase } from "@/lib/supabase"

export async function logout() {
    try {
        await supabase.auth.signOut()
        sessionStorage.removeItem("ai_resume_user")
        window.location.href = "/login"
    } catch (error) {
        console.error("Logout error:", error)
    }
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
