"use client"

import { useState } from "react"
import { Search, Loader2, Sparkles, AlertCircle, CheckCircle2, Copy, Check, ArrowLeft, FileText, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ScanResult {
    score: number
    matchedKeywords: string[]
    missingKeywords: string[]
    suggestions: string[]
    optimizedBulletRewrites: { original: string, optimized: string }[]
}

export default function ATSScanner() {
    const [resumeText, setResumeText] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<ScanResult | null>(null)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const analyzeResume = async () => {
        if (!resumeText || !jobDescription) return

        try {
            setIsAnalyzing(true)
            const response = await fetch("/api/ats-scanner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, jobDescription })
            })

            const data = await response.json()
            if (response.ok) {
                setResult(data)
            }
        } catch (error) {
            console.error("Failed to analyze resume:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Area */}
            <div className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-mono text-sm tracking-widest uppercase">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tighter uppercase">ATS Bypass Protocol</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8">
                    {/* Input Area */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter uppercase">ATS-Bypass Protocols</h1>
                            <p className="text-muted-foreground font-mono text-sm">Scan and optimize your resume against any job description.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-primary/10 bg-card/40 backdrop-blur-sm">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" /> Resume Text
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        className="min-h-[400px] bg-background/50 border-primary/10 transition-all focus-visible:ring-primary/40 resize-none font-mono text-xs"
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-secondary/10 bg-card/40 backdrop-blur-sm">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <Target className="h-4 w-4 text-secondary" /> Job Description
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        className="min-h-[400px] bg-background/50 border-secondary/10 transition-all focus-visible:ring-secondary/40 resize-none font-mono text-xs"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <Button
                            onClick={analyzeResume}
                            disabled={!resumeText || !jobDescription || isAnalyzing}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-[1.01]"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Executing Analysis Sequence...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-5 w-5" />
                                    Initiate ATS Scan
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Results Area */}
                    <div className="space-y-6">
                        {result ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                                {/* Score Card */}
                                <Card className="border-primary/20 bg-primary/5 backdrop-blur-md overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Target className="h-24 w-24" />
                                    </div>
                                    <CardContent className="pt-6 flex flex-col items-center">
                                        <div className="relative h-32 w-32 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                                                <circle
                                                    className={`${result.score >= 80 ? "text-green-500" : result.score >= 50 ? "text-yellow-500" : "text-red-500"} stroke-current transition-all duration-1000 ease-out`}
                                                    strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black italic tracking-tighter">{result.score}%</span>
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Match</span>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            <h3 className="text-lg font-bold uppercase">ATS Compatibility Result</h3>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">
                                                {result.score >= 80 ? "EXCELLENT MATCH: PROCEED" : result.score >= 50 ? "WARNING: OPTIMIZATION REQUIRED" : "CRITICAL FAILURE: COMPLETE REWRITE NEEDED"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Keyword Lists */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="border-green-500/20 bg-green-500/5">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Matched</span>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {result.matchedKeywords.map((kw, i) => (
                                                    <Badge key={i} variant="outline" className="text-[9px] bg-green-500/10 text-green-400 border-green-500/30">
                                                        {kw}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-red-500/20 bg-red-500/5">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Missing</span>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {result.missingKeywords.map((kw, i) => (
                                                    <Badge key={i} variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/30">
                                                        {kw}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Optimized Rewrites */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" /> Optimized Rewrites
                                    </h3>
                                    {result.optimizedBulletRewrites.map((rewrite, i) => (
                                        <Card key={i} className="border-primary/10 bg-card/60 backdrop-blur-sm text-xs p-4 space-y-3 group hover:border-primary/30 transition-all">
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground italic font-mono opacity-50">Original:</p>
                                                <p className="line-through decoration-red-500/50">{rewrite.original}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-primary font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                                        <Zap className="h-3 w-3" /> AI Optimized:
                                                    </p>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(rewrite.optimized, i)}>
                                                        {copiedIndex === i ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                                <p className="text-foreground font-medium leading-relaxed bg-primary/5 p-2 rounded border border-primary/20">
                                                    {rewrite.optimized}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Card className="border-dashed border-primary/20 bg-primary/5 rounded-xl h-full flex flex-col items-center justify-center p-12 text-center opacity-60">
                                <Zap className="h-16 w-16 text-primary/30 mb-6" />
                                <h3 className="text-xl font-bold uppercase tracking-widest">Awaiting Transmission</h3>
                                <p className="text-muted-foreground font-mono text-sm max-w-xs mx-auto mt-2">
                                    Input your credentials and the target coordinates to initiate the ATS scan sequence.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
