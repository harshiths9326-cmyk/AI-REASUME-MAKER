"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, LogOut, User } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { logout } from "@/lib/auth"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
    const [user, setUser] = useState<SupabaseUser | null>(null)

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
            } catch (error) {
                console.warn("Failed to get user:", error)
                // Silently fail - user will see logged out state
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-bold inline-block">Professional Resume Maker</span>
                </Link>

                <div className="flex flex-1 items-center justify-end space-x-3">
                    <nav className="flex items-center space-x-3">
                        <Link href="/#features" passHref>
                            <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                                <span>Features</span>
                            </Button>
                        </Link>
                        
                        <Link href="/templates" passHref>
                            <Button asChild variant="ghost" size="sm">
                                <span>Templates</span>
                            </Button>
                        </Link>

                        {user ? (
                            <>
                                <Link href="/builder" passHref>
                                    <Button asChild variant="default" size="sm">
                                        <span>Build Resume</span>
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline-block truncate max-w-[150px]">
                                        {user.email}
                                    </span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => logout()}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline-block">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" passHref>
                                    <Button asChild variant="ghost" size="sm">
                                        <span>Sign In</span>
                                    </Button>
                                </Link>
                                <Link href="/signup" passHref>
                                    <Button asChild variant="default" size="sm">
                                        <span>Get Started</span>
                                    </Button>
                                </Link>
                            </>
                        )}
                        
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}
