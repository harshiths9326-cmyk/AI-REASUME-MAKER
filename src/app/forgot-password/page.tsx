"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Use production URL for email reset link
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${siteUrl}/update-password`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err) {
            const message = (err as Error).message
            if (message.includes("fetch") || message.includes("network")) {
                setError("Unable to connect. Please check your internet connection.")
            } else if (message.includes("User not found")) {
                setError("No account found with this email address.")
            } else {
                setError(message)
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a password reset link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Click the link in the email to reset your password. 
                            The link will expire in 60 minutes.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Didn&apos;t receive the email? Check your spam folder or{" "}
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-primary hover:underline"
                            >
                                try again
                            </button>
                        </p>
                        <Link href="/login" className="text-sm text-primary hover:underline block">
                            ← Back to Sign In
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/login" className="text-muted-foreground hover:text-primary">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetRequest} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending Reset Link..." : "Send Reset Link"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
