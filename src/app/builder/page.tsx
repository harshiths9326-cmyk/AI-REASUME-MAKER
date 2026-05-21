"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ProfileProgressBar } from "@/components/resume/progress-bar"
import { ResumePreview } from "@/components/resume/resume-preview"
import { TemplateSwitcher } from "@/components/resume/template-switcher"
import { AIResumeScorer } from "@/components/resume/ai-resume-scorer"
import { JobDescriptionMatcher } from "@/components/resume/job-description-matcher"
import { CoverLetterGenerator } from "@/components/resume/cover-letter-generator"
import { AIResumeGenerator } from "@/components/resume/ai-resume-generator"

function BuilderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get("template") || "modern"
    const isInitialLoad = useRef(true)
    
    // Always start with default data for SSR compatibility
    // Client will hydrate from sessionStorage in useEffect
    const [data, setData] = useState<ResumeData>(initialResumeData)

    // Load saved data from sessionStorage on client mount
    useEffect(() => {
        try {
            const savedData = sessionStorage.getItem("resume_builder_data")
            if (savedData) {
                const parsed = JSON.parse(savedData)
                // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate hydration from external store
                setData(parsed)
            }
        } catch (e) {
            console.error("Failed to load saved resume data:", e)
        }
        isInitialLoad.current = false
    }, [])

    // Save data to sessionStorage on change (skip initial load to avoid overwriting)
    useEffect(() => {
        if (isInitialLoad.current) return
        sessionStorage.setItem("resume_builder_data", JSON.stringify(data))
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Form Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm">
                    <div className="p-4 border-b flex flex-wrap gap-2 justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold">Resume Editor</h2>
                            <TemplateSwitcher currentTemplate={templateId} onSelect={handleTemplateSelect} />
                        </div>
                        <div className="flex gap-2">
                            <AIResumeGenerator updateData={updateData} />
                            <AIResumeScorer resumeData={data} />
                            <JobDescriptionMatcher resumeData={data} updateData={updateData} />
                            <CoverLetterGenerator resumeData={data} />
                        </div>
                    </div>
                    <ProfileProgressBar data={data} />
                    <div className="flex-1 overflow-y-auto">
                        <ResumeForm data={data} updateData={updateData} />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <ResumePreview data={data} template={templateId} />
                </div>
            </div>
        </div>
    )
}

export default function BuilderPage() {
    return (
        <div className="container mx-auto max-w-[1600px] h-[calc(100vh-4rem)] p-4 relative z-0">
            <Suspense fallback={<div className="flex justify-center items-center h-full">Loading builder...</div>}>
                <BuilderContent />
            </Suspense>
        </div>
    )
}
