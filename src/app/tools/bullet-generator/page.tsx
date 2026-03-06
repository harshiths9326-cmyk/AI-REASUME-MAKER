"use client"

import { useState } from "react"
import { Bot, Loader2, Sparkles, Copy, Check, ArrowLeft, Briefcase, Building2, Terminal, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function BulletGenerator() {
    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        responsibilities: "",
        technologies: "",
        achievements: ""
    })
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<string[]>([])
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>("")

    const generateBullets = async () => {
        if (!formData.jobTitle || !formData.responsibilities) return

        try {
            setIsGenerating(true)
            setErrorMsg("")
            const prompt = `
            Job Title: ${formData.jobTitle}
            Company: ${formData.company}
            Responsibilities: ${formData.responsibilities}
            Technologies: ${formData.technologies}
            Achievements: ${formData.achievements}
            `

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt,
                    type: "bullet-points"
                })
            })

            let data: any
            try {
                data = await response.json()
            } catch (e) {
                throw new Error("Server returned an invalid response. Please try again.")
            }

            if (response.ok && data.text) {
                // Split by newline and clean up bullet points
                const bullets = data.text
                    .split("\n")
                    .filter((line: string) => line.trim().length > 0)
                    .map((line: string) => line.replace(/^[•\-\*\d\.]\s*/, "").trim())
                    .filter((line: string) => line.length > 5)
                    .slice(0, 4)

                if (bullets.length === 0) {
                    throw new Error("AI returned no usable bullet points. Please try again with more details.")
                }
                setResult(bullets)
            } else {
                throw new Error(data?.error || "Failed to generate bullet points. Please check your API key.")
            }
        } catch (error: any) {
            console.error("Failed to generate bullets:", error)
            setErrorMsg(error?.message || "An unexpected error occurred. Please try again.")
        } finally {
            setIsGenerating(false)
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
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tighter uppercase">AI Bullet Generator</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-12 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    {/* Input Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter uppercase">Neural Network Content</h1>
                            <p className="text-muted-foreground font-mono text-sm">Convert raw experience into high-impact bullet points.</p>
                        </div>

                        <Card className="border-primary/20 bg-card/40 backdrop-blur-sm shadow-xl">
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Briefcase className="h-3 w-3" /> Job Title
                                        </label>
                                        <Input
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                            className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Building2 className="h-3 w-3" /> Company
                                        </label>
                                        <Input
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Terminal className="h-3 w-3" /> Responsibilities
                                    </label>
                                    <Textarea
                                        value={formData.responsibilities}
                                        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                        className="min-h-[120px] bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Bot className="h-3 w-3" /> Technologies
                                        </label>
                                        <Input
                                            value={formData.technologies}
                                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                            className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Trophy className="h-3 w-3" /> Key Achievements
                                        </label>
                                        <Input
                                            value={formData.achievements}
                                            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                            className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                </div>

                                {/* Error message */}
                                {errorMsg && (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 font-mono">
                                        <p className="font-bold mb-1">⚠ Error</p>
                                        <p>{errorMsg}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={generateBullets}
                                    disabled={!formData.jobTitle || !formData.responsibilities || isGenerating}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating Matrix...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate Resume Points
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Sidebar */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold tracking-tight uppercase">Generated Output</h2>
                            <p className="text-muted-foreground font-mono text-xs">Copy these into your resume builder.</p>
                        </div>

                        {result.length > 0 ? (
                            <div className="space-y-4">
                                {result.map((bullet, i) => (
                                    <Card key={i} className="border-primary/10 bg-card/60 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300">
                                        <CardContent className="p-4 flex gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                                            <p className="text-sm leading-relaxed flex-1">{bullet}</p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => copyToClipboard(bullet, i)}
                                            >
                                                {copiedIndex === i ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                <p className="text-[10px] text-center text-muted-foreground font-mono mt-4">
                                    OPTIMIZED BY NEURAL NETWORK v2.4
                                </p>
                            </div>
                        ) : (
                            <div className="h-[400px] border border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-card/40 backdrop-blur-sm">
                                <Bot className="h-12 w-12 text-primary/20 mb-4" />
                                <p className="text-muted-foreground text-sm font-mono">
                                    Input job details and click generate to see AI-optimized bullet points here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
