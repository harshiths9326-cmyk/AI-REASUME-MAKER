"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { FileText, LogOut, UserPlus, LogIn } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    // Re-sync session whenever the route changes (handles post-login redirect)
    useEffect(() => {
        setMounted(true)
        const syncSession = async () => {
            // Priority 1: Check sessionStorage (the app's logic)
            let email = sessionStorage.getItem("ai_resume_user")
            let name = sessionStorage.getItem("ai_resume_name")
            let avatar = sessionStorage.getItem("ai_resume_avatar")

            // Priority 2: Check Supabase session (for fresh OAuth logins or refreshes)
            if (!email) {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    email = session.user.email || null
                    name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
                    avatar = session.user.user_metadata?.avatar_url || null

                    if (email) sessionStorage.setItem("ai_resume_user", email)
                    if (name) sessionStorage.setItem("ai_resume_name", name)
                    if (avatar) sessionStorage.setItem("ai_resume_avatar", avatar)
                    // Mark as returning since they have a session
                    localStorage.setItem("ai_resume_returning_user", "true")
                }
            }

            setUserEmail(email)
            setUserName(name)
            setUserAvatar(avatar)
        }

        syncSession()
    }, [pathname])


    const handleSignOut = () => {
        sessionStorage.removeItem("ai_resume_user")
        sessionStorage.removeItem("ai_resume_name")
        sessionStorage.removeItem("ai_resume_avatar")
        setUserEmail(null)
        setUserName(null)
        setUserAvatar(null)
        router.push("/")
    }


    // Show first letter of name or email as avatar
    const avatar = userName
        ? userName.charAt(0).toUpperCase()
        : userEmail
            ? userEmail.charAt(0).toUpperCase()
            : null

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-bold inline-block">AI Resume Maker</span>
                </Link>

                <div className="flex flex-1 items-center justify-end space-x-3">
                    <nav className="flex items-center space-x-3">
                        <Link href="/#features" passHref>
                            <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                                <span>Features</span>
                            </Button>
                        </Link>
                        {mounted && (
                            userEmail ? (
                                <>
                                    {/* Logged-in user badge */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm">
                                        {userAvatar ? (
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/30">
                                                <img
                                                    src={userAvatar}
                                                    alt={userName || "User"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                                {avatar}
                                            </div>
                                        )}
                                        <span className="text-primary font-medium hidden sm:block max-w-[140px] truncate">
                                            {userName || userEmail}
                                        </span>
                                    </div>

                                    {/* Templates shortcut */}
                                    <Link href="/templates" passHref>
                                        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                                            <span>Templates</span>
                                        </Button>
                                    </Link>

                                    {/* My Resumes shortcut */}
                                    <Link href="/builder" passHref>
                                        <Button asChild variant="outline" size="sm">
                                            <span>My Resume</span>
                                        </Button>
                                    </Link>

                                    {/* Sign Out */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSignOut}
                                        className="text-muted-foreground hover:text-destructive"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="ml-1 hidden sm:inline">Sign Out</span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Conditional Sign In vs Sign Up based on returning user flag */}
                                    {typeof window !== 'undefined' && localStorage.getItem("ai_resume_returning_user") === "true" ? (
                                        <Link href="/login" passHref>
                                            <Button asChild variant="ghost" size="sm">
                                                <span>Sign In</span>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/signup" passHref>
                                            <Button asChild variant="ghost" size="sm">
                                                <span>Sign Up</span>
                                            </Button>
                                        </Link>
                                    )}

                                    <Link href="/login" passHref>
                                        <Button asChild variant="default" size="sm">
                                            <span>Build Resume</span>
                                        </Button>
                                    </Link>
                                </>
                            )
                        )}
                        <ThemeToggle />
                    </nav>
                </div>

            </div>
        </header>
    )
}
