"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { FileText, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    // Re-read session whenever the route changes (handles post-login redirect)
    useEffect(() => {
        setMounted(true)
        const email = sessionStorage.getItem("ai_resume_user")
        const name = sessionStorage.getItem("ai_resume_name")
        setUserEmail(email)
        setUserName(name)
    }, [pathname])


    const handleSignOut = () => {
        sessionStorage.removeItem("ai_resume_user")
        sessionStorage.removeItem("ai_resume_name")
        setUserEmail(null)
        setUserName(null)
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
                        {mounted && (
                            userEmail ? (
                                <>
                                    {/* Logged-in user badge */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                            {avatar}
                                        </div>
                                        <span className="text-primary font-medium hidden sm:block max-w-[140px] truncate">
                                            {userName || userEmail}
                                        </span>
                                    </div>

                                    {/* My Resumes shortcut */}
                                    <Link href="/builder">
                                        <Button variant="outline" size="sm">
                                            My Resume
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
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="default" size="sm">
                                            Build Resume
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
