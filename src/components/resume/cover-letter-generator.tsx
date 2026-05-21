"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, X, Download, Copy } from "lucide-react"
import { ResumeData } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface CoverLetterGeneratorProps {
    resumeData: ResumeData
}

export function CoverLetterGenerator({ resumeData }: CoverLetterGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [tone, setTone] = useState<"professional" | "casual" | "startup" | "creative">("professional")
    const [loading, setLoading] = useState(false)
    const [coverLetter, setCoverLetter] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const generateCoverLetter = async () => {
        // Validate that we have minimum required data
        if (!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName) {
            setError("Please fill in your name in the Personal Details section first.")
            return
        }

        if (!resumeData.personalInfo.jobTitle) {
            setError("Please add your job title in the Personal Details section.")
            return
        }

        setLoading(true)
        setError(null)
        setCoverLetter(null)

        try {
            console.log("Generating cover letter with data:", {
                name: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`,
                jobTitle: resumeData.personalInfo.jobTitle,
                hasSummary: !!resumeData.personalInfo.summary,
                hasExperience: resumeData.experience.length,
                hasSkills: resumeData.skills.length,
            })

            const response = await fetch("/api/generate-cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData,
                    jobDescription: jobDescription || undefined,
                    companyName: companyName || undefined,
                    tone,
                }),
            })

            const result = await response.json()
            console.log("API Response:", result)

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate cover letter")
            }

            if (!result.coverLetter || result.coverLetter.trim() === '') {
                throw new Error("AI returned an empty cover letter. Please try again.")
            }

            setCoverLetter(result.coverLetter)
        } catch (err) {
            console.error("Cover letter generation error:", err)
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (coverLetter) {
            navigator.clipboard.writeText(coverLetter)
        }
    }

    const downloadAsText = () => {
        if (!coverLetter) return
        
        const blob = new Blob([coverLetter], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cover-letter-${companyName || "general"}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-green-500/50 hover:bg-green-500/10"
            >
                <FileText className="h-4 w-4" />
                Cover Letter
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 20, scale: 0.95 }}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="bg-background border-2 border-green-500/30">
                                <CardHeader className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-4 top-4"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <FileText className="h-6 w-6 text-green-500" />
                                        AI Cover Letter Generator
                                    </CardTitle>
                                    <CardDescription>
                                        Generate a personalized cover letter based on your resume
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Input Form */}
                                    {!coverLetter && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="company">Company Name (Optional)</Label>
                                                    <Input
                                                        id="company"
                                                        placeholder="e.g. Google"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="tone">Tone</Label>
                                                    <select
                                                        id="tone"
                                                        value={tone}
                                                        onChange={(e) => setTone(e.target.value as "professional" | "casual" | "startup" | "creative")}
                                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                                    >
                                                        <option value="professional">Professional</option>
                                                        <option value="casual">Casual</option>
                                                        <option value="startup">Startup</option>
                                                        <option value="creative">Creative</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jobDesc">Job Description (Optional)</Label>
                                                <Textarea
                                                    id="jobDesc"
                                                    placeholder="Paste the job description for a tailored cover letter..."
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    className="min-h-[120px]"
                                                />
                                            </div>

                                            <Button
                                                onClick={generateCoverLetter}
                                                disabled={loading}
                                                className="w-full gap-2"
                                                size="lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="h-5 w-5" />
                                                        Generate Cover Letter
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                                            {error}
                                        </div>
                                    )}

                                    {/* Cover Letter Result */}
                                    {coverLetter && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={copyToClipboard}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 gap-2"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    Copy
                                                </Button>
                                                <Button
                                                    onClick={downloadAsText}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setCoverLetter(null)
                                                        generateCoverLetter()
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Regenerate
                                                </Button>
                                            </div>

                                            {/* Cover Letter Content */}
                                            <Card className="bg-white dark:bg-gray-900 border-2">
                                                <CardContent className="pt-6">
                                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed break-words text-gray-900 dark:text-gray-100">
                                                        {coverLetter}
                                                    </pre>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
