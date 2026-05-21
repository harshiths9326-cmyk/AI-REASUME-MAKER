"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)
    const [hasValidSession, setHasValidSession] = useState(false)

    useEffect(() => {
        // Listen for auth state changes (handles recovery token from URL hash)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                if (session) {
                    setHasValidSession(true)
                    setCheckingSession(false)
                }
            }
        })

        // Also check if session already exists (in case token was already processed)
        const checkExistingSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setHasValidSession(true)
                setCheckingSession(false)
            }
        }

        checkExistingSession()

        // Timeout: if no session after 3 seconds, show invalid link
        const timeout = setTimeout(() => {
            setCheckingSession(false)
        }, 3000)

        return () => {
            authListener.subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please try again.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            })

            if (error) throw error

            // Sign out after password update so user must login with new password
            await supabase.auth.signOut()
            setSuccess(true)
        } catch (err) {
            const message = (err as Error).message
            if (message.includes("fetch") || message.includes("network")) {
                setError("Unable to connect. Please check your internet connection.")
            } else if (message.includes("expired") || message.includes("token")) {
                setError("This reset link has expired. Please request a new one.")
            } else {
                setError(message)
            }
        } finally {
            setLoading(false)
        }
    }

    // Loading state while checking session
    if (checkingSession) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">
                            Verifying your reset link...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Invalid or expired link
    if (!hasValidSession && !success) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Invalid or Expired Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Password reset links expire after 60 minutes. Please request a new one
                            to continue.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link href="/forgot-password">
                                <Button className="w-full">Request New Reset Link</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" className="w-full">Back to Sign In</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Success state
    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Password Updated!</CardTitle>
                        <CardDescription>
                            Your password has been successfully changed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            You can now sign in with your new password.
                        </p>
                        <Link href="/login">
                            <Button className="w-full">Go to Sign In</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Password update form
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
                    <CardDescription>
                        Enter your new password below to reset your account password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Updating Password..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
