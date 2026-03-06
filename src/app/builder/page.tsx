"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ProfileProgressBar } from "@/components/resume/progress-bar"
import { ResumePreview } from "@/components/resume/resume-preview"
import { ATSMatcher } from "@/components/resume/ats-matcher"
import { CoverLetter } from "@/components/resume/cover-letter"
import { InterviewPrep } from "@/components/resume/interview-prep"
import { ResumeReviewer } from "@/components/resume/resume-reviewer"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { Button } from "@/components/ui/button"
import { TemplateSwitcher } from "@/components/resume/template-switcher"
import { Sparkles, FileText, X, MessageSquareIcon, Flame, Layout } from "lucide-react"

type ActiveTool = "none" | "ats" | "cover-letter" | "interview-prep" | "resume-review"

function BuilderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get("template") || "modern"
    const [data, setData] = useState<ResumeData>(initialResumeData)
    const [activeTool, setActiveTool] = useState<ActiveTool>("none")

    // Load data from sessionStorage on mount
    useEffect(() => {
        const savedData = sessionStorage.getItem("resume_builder_data")
        if (savedData) {
            try {
                setData(JSON.parse(savedData))
            } catch (e) {
                console.error("Failed to load saved resume data:", e)
            }
        }
    }, [])

    // Save data to sessionStorage on change
    useEffect(() => {
        if (data !== initialResumeData) {
            sessionStorage.setItem("resume_builder_data", JSON.stringify(data))
        }
    }, [data])

    const updateData = (newData: Partial<ResumeData>) => {
        setData((prev: ResumeData) => ({ ...prev, ...newData }))
    }

    const handleTemplateSelect = (id: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("template", id)
        router.push(`/builder?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="relative h-full">
            <div className={`grid grid-cols-1 ${activeTool !== "none" ? 'lg:grid-cols-[1fr_1fr_400px]' : 'lg:grid-cols-2'} gap-6 h-full transition-all duration-300`}>
                {/* Form Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm">
                    <div className="p-4 border-b flex flex-wrap gap-2 justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold">Resume Editor</h2>
                            <TemplateSwitcher currentTemplate={templateId} onSelect={handleTemplateSelect} />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={activeTool === "ats" ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setActiveTool(activeTool === "ats" ? "none" : "ats")}
                                className="gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                {activeTool === "ats" ? "Hide ATS" : "ATS Matcher"}
                            </Button>
                            <Button
                                variant={activeTool === "cover-letter" ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setActiveTool(activeTool === "cover-letter" ? "none" : "cover-letter")}
                                className="gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                {activeTool === "cover-letter" ? "Hide Cover" : "Cover Letter"}
                            </Button>
                            <Button
                                variant={activeTool === "interview-prep" ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setActiveTool(activeTool === "interview-prep" ? "none" : "interview-prep")}
                                className="gap-2"
                            >
                                <MessageSquareIcon className="h-4 w-4" />
                                {activeTool === "interview-prep" ? "Hide Prep" : "Interview Prep"}
                            </Button>
                            <Button
                                variant={activeTool === "resume-review" ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setActiveTool(activeTool === "resume-review" ? "none" : "resume-review")}
                                className="gap-2"
                            >
                                <Flame className="h-4 w-4" />
                                {activeTool === "resume-review" ? "Hide Review" : "AI Review"}
                            </Button>
                        </div>
                    </div>
                    <ProfileProgressBar data={data} />
                    <div className="flex-1 overflow-y-auto">
                        <ResumeForm data={data} updateData={updateData} />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <ResumePreview data={data} template={templateId} updateData={updateData} />
                </div>

                {/* Side Tool Section - Desktop Sidebar */}
                {activeTool !== "none" && (
                    <div className="hidden lg:flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm animate-in slide-in-from-right-4 duration-300">
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                            <h2 className="font-bold">
                                {activeTool === "ats" && "ATS Analysis"}
                                {activeTool === "cover-letter" && "AI Cover Letter"}
                                {activeTool === "interview-prep" && "Interview Prep"}
                                {activeTool === "resume-review" && "AI Resume Reviewer"}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveTool("none")}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTool === "ats" && <ATSMatcher resumeData={data} updateData={updateData} />}
                            {activeTool === "cover-letter" && <CoverLetter resumeData={data} />}
                            {activeTool === "interview-prep" && <InterviewPrep resumeData={data} />}
                            {activeTool === "resume-review" && <ResumeReviewer resumeData={data} />}
                        </div>
                    </div>
                )}
            </div>

            {/* Side Tool - Mobile/Tablet Overlay (Simplified for context) */}
            {activeTool !== "none" && (
                <div className="lg:hidden fixed inset-0 z-50 bg-background p-4 overflow-y-auto pt-16">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">
                            {activeTool === "ats" && "ATS Analysis"}
                            {activeTool === "cover-letter" && "AI Cover Letter"}
                            {activeTool === "interview-prep" && "Interview Prep"}
                            {activeTool === "resume-review" && "AI Resume Reviewer"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setActiveTool("none")}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    {activeTool === "ats" && <ATSMatcher resumeData={data} updateData={updateData} />}
                    {activeTool === "cover-letter" && <CoverLetter resumeData={data} />}
                    {activeTool === "interview-prep" && <InterviewPrep resumeData={data} />}
                    {activeTool === "resume-review" && <ResumeReviewer resumeData={data} />}
                </div>
            )}
        </div>
    )
}

export default function BuilderPage() {
    const { isAuthed } = useAuthGuard()

    if (!isAuthed) {
        return <div className="flex justify-center items-center h-[calc(100vh-4rem)]">Checking authentication...</div>
    }

    return (
        <div className="container mx-auto max-w-[1600px] h-[calc(100vh-4rem)] p-4 relative z-0">
            <Suspense fallback={<div className="flex justify-center items-center h-full">Loading builder...</div>}>
                <BuilderContent />
            </Suspense>
        </div>
    )
}

