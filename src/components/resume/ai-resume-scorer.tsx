"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react"
import { ResumeData } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface AIResumeScorerProps {
    resumeData: ResumeData
}

interface AnalysisResult {
    overallScore?: number
    atsScore?: number
    keywordMatch?: number
    missingKeywords?: string[]
    missingElements?: string[]
    suggestions?: string[]
    strengths?: string[]
    atsCompatible?: boolean
}

export function AIResumeScorer({ resumeData }: AIResumeScorerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const analyzeResume = async () => {
        setLoading(true)
        setError(null)
        setAnalysis(null)

        try {
            const response = await fetch("/api/ai-score-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: {
                        personalInfo: resumeData.personalInfo,
                        experience: resumeData.experience,
                        skills: resumeData.skills,
                        education: resumeData.education,
                    },
                    jobDescription: jobDescription || undefined,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to analyze resume")
            }

            setAnalysis(result.analysis)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500"
        if (score >= 60) return "text-yellow-500"
        return "text-red-500"
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-500"
        if (score >= 60) return "bg-yellow-500"
        return "bg-red-500"
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-primary/50 hover:bg-primary/10"
            >
                <Sparkles className="h-4 w-4" />
                AI Score
            </Button>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="bg-background border-2 border-primary/20">
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
                                <Sparkles className="h-6 w-6 text-primary" />
                                AI Resume Analyzer
                            </CardTitle>
                            <CardDescription>
                                Get instant ATS compatibility score and expert improvement suggestions
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Job Description Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">
                                    Job Description (Optional)
                                </label>
                                <Textarea
                                    placeholder="Paste the job description here to get a targeted analysis..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {jobDescription
                                        ? "✅ Will analyze resume match for this specific job"
                                        : "ℹ️ Leaving empty will give general resume quality score"}
                                </p>
                            </div>

                            {/* Analyze Button */}
                            <Button
                                onClick={analyzeResume}
                                disabled={loading}
                                className="w-full gap-2"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Analyzing Resume...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        {jobDescription ? "Analyze Job Match" : "Score My Resume"}
                                    </>
                                )}
                            </Button>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Analysis Results */}
                            {analysis && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Score Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore || 0)}`}>
                                                        {analysis.overallScore || 0}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className={`text-5xl font-bold ${getScoreColor(analysis.atsScore || analysis.keywordMatch || 0)}`}>
                                                        {analysis.atsScore || analysis.keywordMatch || 0}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        {jobDescription ? "Keyword Match" : "ATS Score"}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* ATS Compatible Badge */}
                                    {analysis.atsCompatible !== undefined && (
                                        <div className="flex justify-center">
                                            <Badge
                                                variant={analysis.atsCompatible ? "default" : "destructive"}
                                                className="text-sm px-4 py-2"
                                            >
                                                {analysis.atsCompatible ? (
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                )}
                                                {analysis.atsCompatible ? "ATS Compatible" : "Needs Improvement"}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Strengths */}
                                    {analysis.strengths && analysis.strengths.length > 0 && (
                                        <Card className="border-green-200 dark:border-green-800">
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2 text-green-600">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    Strengths
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {analysis.strengths.map((strength, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span>{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Missing Keywords/Elements */}
                                    {(analysis.missingKeywords || analysis.missingElements) && (
                                        <Card className="border-yellow-200 dark:border-yellow-800">
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
                                                    <AlertCircle className="h-5 w-5" />
                                                    {jobDescription ? "Missing Keywords" : "Missing Elements"}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {(analysis.missingKeywords || analysis.missingElements)?.map(
                                                        (item, i) => (
                                                            <Badge key={i} variant="outline" className="border-yellow-500">
                                                                {item}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Suggestions */}
                                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Sparkles className="h-5 w-5 text-primary" />
                                                    Improvement Suggestions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {analysis.suggestions.map((suggestion, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                {i + 1}
                                                            </div>
                                                            <span>{suggestion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
