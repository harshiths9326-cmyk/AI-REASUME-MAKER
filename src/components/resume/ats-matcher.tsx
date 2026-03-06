"use client"

import { useState } from "react"
import { Search, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ResumeData } from "@/lib/types"

interface ATSMatcherProps {
    resumeData: ResumeData
}

interface AnalysisResult {
    score: number
    matchedKeywords: string[]
    missingKeywords: string[]
    suggestions: string[]
}

export function ATSMatcher({ resumeData }: ATSMatcherProps) {
    const [jd, setJd] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const analyzeMatch = async () => {
        if (!jd.trim()) return

        try {
            setIsAnalyzing(true)
            const response = await fetch("/api/match-jd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeData,
                    jobDescription: jd,
                }),
            })

            const data = await response.json()
            if (response.ok) {
                setResult(data)
            } else {
                throw new Error(data.error || "Analysis failed")
            }
        } catch (error) {
            console.error("Match error:", error)
            alert("Failed to analyze matching. Please try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">ATS Matcher</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Paste the job description you're applying for to see how well your resume matches.
                </p>
                <Textarea
                    placeholder="Paste job description here..."
                    className="min-h-[150px] resize-none"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                />
                <Button
                    className="w-full"
                    onClick={analyzeMatch}
                    disabled={!jd.trim() || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Resume...
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Check ATS Match
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="p-4 border rounded-xl space-y-6 bg-accent/30 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
                            <div className="text-4xl font-black text-primary italic">
                                {result.score}%
                            </div>
                        </div>
                        <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center ${result.score >= 80 ? "border-green-500 text-green-500" :
                                result.score >= 50 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"
                            }`}>
                            {result.score >= 80 ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Matched Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matchedKeywords.map((kw, i) => (
                                    <Badge key={i} variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-none">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((kw, i) => (
                                    <Badge key={i} variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-none">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-bold">Suggestions to Improve</h4>
                            <ul className="text-sm space-y-2">
                                {result.suggestions.map((s, i) => (
                                    <li key={i} className="flex gap-2">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">
                                            {i + 1}
                                        </div>
                                        <span className="text-muted-foreground">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
