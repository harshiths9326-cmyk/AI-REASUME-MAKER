"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setIsSent(true);
        } catch (err: any) {
            const message = err?.message || "Failed to send reset email. Please try again.";
            if (message.toLowerCase().includes("rate limit exceeded")) {
                setError("Too many requests. Please wait a few minutes.");
            } else {
                setError(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-2 text-center pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-base">
                        {isSent
                            ? "Check your email for a reset link."
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSent ? (
                        <form onSubmit={handleResetRequest} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full font-bold h-11 mt-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                <Send className="h-6 w-6" />
                            </div>
                            <p className="text-muted-foreground">
                                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsSent(false)}
                            >
                                Try another email
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t p-6 mt-2">
                    <Link href="/login" className="flex items-center text-sm font-medium text-primary hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
