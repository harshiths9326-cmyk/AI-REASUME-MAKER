"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Target, Loader2, X, Sparkles, ArrowRight } from "lucide-react"
import { ResumeData } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface JobDescriptionMatcherProps {
    resumeData: ResumeData
    updateData: (data: Partial<ResumeData>) => void
}

interface MatchAnalysis {
    matchPercentage: number
    matchedKeywords: string[]
    missingKeywords: string[]
    suggestedSkills: string[]
    suggestedImprovements: string[]
}

export function JobDescriptionMatcher({ resumeData, updateData }: JobDescriptionMatcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null)
    const [error, setError] = useState<string | null>(null)

    const analyzeMatch = async () => {
        if (!jobDescription.trim()) {
            setError("Please paste a job description first")
            return
        }

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
                    jobDescription,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to analyze match")
            }

            // Transform the analysis into match format
            setAnalysis({
                matchPercentage: result.analysis.keywordMatch || result.analysis.overallScore || 0,
                matchedKeywords: result.analysis.strengths || [],
                missingKeywords: result.analysis.missingKeywords || result.analysis.missingElements || [],
                suggestedSkills: result.analysis.missingKeywords || [],
                suggestedImprovements: result.analysis.suggestions || [],
            })
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const addMissingKeyword = (keyword: string) => {
        const newSkill = {
            id: crypto.randomUUID(),
            name: keyword,
        }
        updateData({
            skills: [...resumeData.skills, newSkill],
        })
    }

    const getMatchColor = (percentage: number) => {
        if (percentage >= 80) return "text-green-500"
        if (percentage >= 60) return "text-yellow-500"
        return "text-red-500"
    }

    const getMatchBg = (percentage: number) => {
        if (percentage >= 80) return "bg-green-500"
        if (percentage >= 60) return "bg-yellow-500"
        return "bg-red-500"
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-purple-500/50 hover:bg-purple-500/10"
            >
                <Target className="h-4 w-4" />
                Job Match
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
                                        <Target className="h-6 w-6 text-purple-500" />
                                        Job Description Matcher
                                    </CardTitle>
                                    <CardDescription>
                                        Paste a job description to see how well your resume matches and what to improve
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Job Description Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">
                                            Job Description *
                                        </label>
                                        <Textarea
                                            placeholder="Paste the full job description here..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="min-h-[200px]"
                                        />
                                    </div>

                                    {/* Analyze Button */}
                                    <Button
                                        onClick={analyzeMatch}
                                        disabled={loading}
                                        className="w-full gap-2"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Analyzing Match...
                                            </>
                                        ) : (
                                            <>
                                                <Target className="h-5 w-5" />
                                                Analyze Match
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
                                            {/* Match Score */}
                                            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                                                <CardContent className="pt-6">
                                                    <div className="text-center space-y-4">
                                                        <div className={`text-7xl font-bold ${getMatchColor(analysis.matchPercentage)}`}>
                                                            {analysis.matchPercentage}%
                                                        </div>
                                                        <p className="text-lg font-semibold">Match Score</p>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                            <div
                                                                className={`h-3 rounded-full ${getMatchBg(analysis.matchPercentage)} transition-all duration-500`}
                                                                style={{ width: `${analysis.matchPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Missing Keywords - Clickable */}
                                            {analysis.missingKeywords.length > 0 && (
                                                <Card className="border-orange-200 dark:border-orange-800">
                                                    <CardHeader>
                                                        <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                                                            <Target className="h-5 w-5" />
                                                            Missing Keywords (Click to Add)
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Click any keyword to instantly add it to your skills
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.missingKeywords.map((keyword, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    variant="outline"
                                                                    className="border-orange-500 cursor-pointer hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-1"
                                                                    onClick={() => addMissingKeyword(keyword)}
                                                                >
                                                                    + {keyword}
                                                                    <ArrowRight className="h-3 w-3" />
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Matched Keywords */}
                                            {analysis.matchedKeywords.length > 0 && (
                                                <Card className="border-green-200 dark:border-green-800">
                                                    <CardHeader>
                                                        <CardTitle className="text-base flex items-center gap-2 text-green-600">
                                                            ✓ Matched Keywords
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.matchedKeywords.map((keyword, i) => (
                                                                <Badge key={i} variant="secondary" className="bg-green-100 dark:bg-green-900">
                                                                    {keyword}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Suggestions */}
                                            {analysis.suggestedImprovements.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-base flex items-center gap-2">
                                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                                            Tailoring Suggestions
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-3">
                                                            {analysis.suggestedImprovements.map((suggestion, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                                    <div className="h-6 w-6 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                )}
            </AnimatePresence>
        </>
    )
}
