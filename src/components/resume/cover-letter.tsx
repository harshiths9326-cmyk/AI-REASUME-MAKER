"use client"

import { useState } from "react"
import { Sparkles, Loader2, FileText, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeData } from "@/lib/types"

interface CoverLetterProps {
    resumeData: ResumeData
}

export function CoverLetter({ resumeData }: CoverLetterProps) {
    const [jd, setJd] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<string>("")
    const [copied, setCopied] = useState(false)

    const generateCoverLetter = async () => {
        if (!jd.trim()) return

        try {
            setIsGenerating(true)

            // Build a prompt that includes the JSON representation of the resume
            const prompt = `
Job Description:
${jd}

My Resume Data:
${JSON.stringify({
                summary: resumeData.personalInfo.summary,
                experience: resumeData.experience,
                education: resumeData.education,
                skills: resumeData.skills.map(s => s.name),
                projects: resumeData.projects.map(p => ({ title: p.title, desc: p.description }))
            }, null, 2)}
`
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    type: "cover-letter",
                }),
            })

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error("Invalid server response. Please ensure your AI API key is configured correctly.");
            }

            if (response.ok && data.text) {
                setResult(data.text);
            } else {
                throw new Error(data.error || "AI generation protocol failed. Please verify your connection or try again later.");
            }
        } catch (error) {
            console.error("Cover Letter error:", error)
            alert("Failed to generate cover letter. Please try again.")
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
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">AI Cover Letter</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Paste the job description you're applying for, and our AI will write a highly tailored cover letter based on your resume data.
                </p>
                <Textarea
                    placeholder="Paste job description here..."
                    className="min-h-[150px] resize-none focus-visible:ring-1"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                />
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={generateCoverLetter}
                    disabled={!jd.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Drafting Cover Letter...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Cover Letter
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">Generated Result</h4>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 group">
                            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors" />}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                    <Textarea
                        className="min-h-[400px] text-sm leading-relaxed p-4 bg-accent/30 focus-visible:ring-1"
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                    />
                </div>
            )}
        </div>
    )
}
