"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
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

                        <Link href="/builder" passHref>
                            <Button asChild variant="default" size="sm">
                                <span>Build Resume</span>
                            </Button>
                        </Link>
                        
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}
