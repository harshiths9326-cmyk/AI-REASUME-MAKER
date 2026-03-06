"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    // If already logged in, redirect to templates
    useEffect(() => {
        const user = sessionStorage.getItem("ai_resume_user");
        if (user) {
            router.replace("/templates");
        }

        // Force clear fields after a delay to thwart aggressive browser pre-fill
        const timer = setTimeout(() => {
            setName("");
            setEmail("");
            setPassword("");
        }, 500);

        return () => clearTimeout(timer);
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        let hasError = false;
        const newFieldErrors: { name?: string; email?: string; password?: string } = {};

        if (!name) {
            newFieldErrors.name = "Full Name is required";
            hasError = true;
        }

        if (!email) {
            newFieldErrors.email = "Email is required";
            hasError = true;
        }

        if (!password) {
            newFieldErrors.password = "Password is required";
            hasError = true;
        } else if (password.length < 6) {
            newFieldErrors.password = "Password must be at least 6 characters";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) throw authError;

            if (data.user) {
                // Save session
                sessionStorage.setItem("ai_resume_user", data.user.email || email);
                if (name) sessionStorage.setItem("ai_resume_name", name);

                // Mark as returning user
                localStorage.setItem("ai_resume_returning_user", "true");

                router.push("/templates");
            }
        } catch (err: any) {
            const message = err?.message || "Failed to sign up. Please try again.";
            setError(message);
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        setIsLoading(true);
        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (authError) throw authError;
        } catch (err: any) {
            const msg = err?.message || "";
            if (msg.toLowerCase().includes("provider is not enabled")) {
                setError("Google Sign-In is not yet enabled in your Supabase project. Please enable it in the Supabase Dashboard -> Authentication -> Providers.");
            } else {
                setError(msg || "Failed to initiate Google signup.");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-secondary">
                <CardHeader className="space-y-2 text-center pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
                    <CardDescription className="text-base">
                        Get started building your AI-powered resume today.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    className={cn("pl-9", fieldErrors.name && "border-destructive focus-visible:ring-destructive")}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    autoComplete="off"
                                />
                                {fieldErrors.name && (
                                    <p className="text-[10px] font-mono font-bold text-destructive mt-1 uppercase tracking-tighter">
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    className={cn("pl-9", fieldErrors.email && "border-destructive focus-visible:ring-destructive")}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    autoComplete="one-time-code"
                                />
                                {fieldErrors.email && (
                                    <p className="text-[10px] font-mono font-bold text-destructive mt-1 uppercase tracking-tighter">
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none flex items-center justify-between" htmlFor="password">
                                Password
                                <span className="text-[10px] text-muted-foreground font-normal italic">
                                    (Min. 6 characters)
                                </span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className={cn("pl-9", fieldErrors.password && "border-destructive focus-visible:ring-destructive")}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                                    }}
                                    autoComplete="new-password"
                                />
                                {fieldErrors.password && (
                                    <p className="text-[10px] font-mono font-bold text-destructive mt-1 uppercase tracking-tighter">
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" variant="secondary" className="w-full font-bold h-11 mt-2 text-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up <UserPlus className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full font-bold h-11"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                            )}
                            {isLoading ? "Connecting..." : "Sign Up with Google"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center border-t p-6 mt-2">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
