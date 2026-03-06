"use client"

import { useState } from "react"
import { Sparkles, Loader2, Flame, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeData } from "@/lib/types"

interface ResumeReviewerProps {
    resumeData: ResumeData
}

export function ResumeReviewer({ resumeData }: ResumeReviewerProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<string>("")
    const [copied, setCopied] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>("")

    const generateReview = async () => {
        try {
            setIsGenerating(true)
            setErrorMsg("")
            setResult("")

            console.log("[ResumeReviewer] Calling /api/resume-review...")

            const response = await fetch("/api/resume-review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ resumeData }),
            })

            let data: any
            try {
                data = await response.json()
            } catch (e) {
                throw new Error("Server returned an invalid response. Please try again.")
            }

            if (response.ok && data.text) {
                console.log("[ResumeReviewer] Success! Model used:", data.model)
                setResult(data.text)
            } else {
                throw new Error(data.error || "AI generation failed. Please check your API key and try again.")
            }
        } catch (error: any) {
            console.error("[ResumeReviewer] Error:", error)
            setErrorMsg(error?.message || "An unexpected error occurred. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = () => {
        if (!result) return
        navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-bold">AI Resume Reviewer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Get an instant, brutally honest critique from our AI Hiring Manager. It will hunt down weak verbs, missing metrics, and layout issues in your current draft.
                </p>
                <div className="pt-4">
                    <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={generateReview}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Reviewing Resume...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Analyze My Resume
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 font-mono">
                    <p className="font-bold mb-1">⚠ Error</p>
                    <p>{errorMsg}</p>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">Feedback Report</h4>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 group">
                            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors" />}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                    <Textarea
                        className="min-h-[400px] text-sm leading-relaxed p-4 bg-accent/30 focus-visible:ring-1 font-mono"
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                    />
                </div>
            )}
        </div>
    )
}
