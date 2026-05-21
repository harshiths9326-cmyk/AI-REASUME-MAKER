"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, X, Download, Edit3, Eye, Zap } from "lucide-react"
import { ResumeData } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { ResumePreview } from "./resume-preview"

interface AIResumeGeneratorProps {
    updateData: (data: Partial<ResumeData>) => void
}

interface GeneratedResume {
    id: string
    title: string
    description: string
    data: ResumeData
}

export function AIResumeGenerator({ updateData }: AIResumeGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [experienceLevel, setExperienceLevel] = useState<"fresher" | "entry" | "mid" | "senior">("fresher")
    const [tone, setTone] = useState<"professional" | "creative" | "technical">("professional")
    const [loading, setLoading] = useState(false)
    const [generatedResumes, setGeneratedResumes] = useState<GeneratedResume[]>([])
    const [selectedResume, setSelectedResume] = useState<GeneratedResume | null>(null)
    const [error, setError] = useState<string | null>(null)

    const generateResumes = async () => {
        if (jobDescription.trim().length < 10) {
            setError("Please provide a more detailed job description (at least 10 characters)")
            return
        }

        if (jobDescription.length > 10000) {
            setError("Job description is too long (max 10,000 characters)")
            return
        }

        setLoading(true)
        setError(null)
        setGeneratedResumes([])
        setSelectedResume(null)

        try {
            const response = await fetch("/api/ai-generate-resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobDescription,
                    experienceLevel,
                    tone,
                }),
            })

            const result = await response.json()
            console.log("API Response:", result)

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate resumes")
            }

            if (!result.resumes || result.resumes.length === 0) {
                throw new Error("No resumes were generated. Please try again.")
            }

            console.log("Generated resumes:", result.resumes.length)
            setGeneratedResumes(result.resumes)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const selectAndEdit = (resume: GeneratedResume) => {
        updateData(resume.data)
        setIsOpen(false)
    }

    const downloadResume = async (resume: GeneratedResume) => {
        // Create a temporary preview component to generate PDF
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        // You would implement PDF generation here similar to the existing ResumePreview
        alert("PDF download feature will use the same export as the builder")
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-purple-500/50 hover:bg-purple-500/10"
            >
                <Sparkles className="h-4 w-4" />
                AI Generate
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
                            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="bg-background border-2 border-purple-500/30">
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
                                        <Sparkles className="h-6 w-6 text-purple-500" />
                                        AI Resume Generator
                                    </CardTitle>
                                    <CardDescription>
                                        Paste a job description and AI will create 3 tailored resume variations for you
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Input Form */}
                                    {!selectedResume && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold">
                                                    Job Description *
                                                </label>
                                                <Textarea
                                                    placeholder="Paste the complete job description here..."
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    className="min-h-[200px]"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {jobDescription.length}/10,000 characters
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold">
                                                        Experience Level
                                                    </label>
                                                    <select
                                                        value={experienceLevel}
                                                        onChange={(e) => setExperienceLevel(e.target.value as "fresher" | "entry" | "mid" | "senior")}
                                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                                    >
                                                        <option value="fresher">Fresher (0 years)</option>
                                                        <option value="entry">Entry Level (0-2 years)</option>
                                                        <option value="mid">Mid Level (3-7 years)</option>
                                                        <option value="senior">Senior Level (8+ years)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold">
                                                        Style
                                                    </label>
                                                    <select
                                                        value={tone}
                                                        onChange={(e) => setTone(e.target.value as "professional" | "creative" | "technical")}
                                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                                    >
                                                        <option value="professional">Professional</option>
                                                        <option value="creative">Creative</option>
                                                        <option value="technical">Technical</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={generateResumes}
                                                disabled={loading}
                                                className="w-full gap-2"
                                                size="lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        AI is crafting your resumes... (30-60s)
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="h-5 w-5" />
                                                        Generate 3 Resume Variations
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

                                    {/* Generated Resumes */}
                                    {generatedResumes.length > 0 && !selectedResume && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center">
                                                <h3 className="text-lg font-bold">Choose Your Resume Style</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Click &quot;Select &amp; Edit&quot; to customize in the builder, or &quot;Preview&quot; to see full details
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {generatedResumes.map((resume, index) => (
                                                    <motion.div
                                                        key={resume.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <Card className="h-full flex flex-col hover:border-purple-500 transition-colors">
                                                            <CardHeader>
                                                                <Badge variant="secondary" className="w-fit mb-2">
                                                                    Variation {index + 1}
                                                                </Badge>
                                                                <CardTitle className="text-lg">{resume.title}</CardTitle>
                                                                <CardDescription>{resume.description}</CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="flex-1 flex flex-col gap-3">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        onClick={() => selectAndEdit(resume)}
                                                                        className="flex-1 gap-2"
                                                                        size="sm"
                                                                    >
                                                                        <Edit3 className="h-4 w-4" />
                                                                        Select & Edit
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => setSelectedResume(resume)}
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <Button
                                                                    onClick={() => downloadResume(resume)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    Download PDF
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <Button
                                                onClick={generateResumes}
                                                variant="outline"
                                                className="w-full gap-2"
                                            >
                                                <Sparkles className="h-4 w-4" />
                                                Regenerate New Variations
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Preview Selected Resume */}
                                    {selectedResume && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => selectAndEdit(selectedResume)}
                                                    className="flex-1 gap-2"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                    Select & Edit This Resume
                                                </Button>
                                                <Button
                                                    onClick={() => setSelectedResume(null)}
                                                    variant="outline"
                                                >
                                                    Back to Options
                                                </Button>
                                            </div>

                                            <Card className="bg-white dark:bg-gray-900 max-h-[600px] overflow-y-auto">
                                                <CardContent className="pt-6">
                                                    <ResumePreview data={selectedResume.data} template="modern" />
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
