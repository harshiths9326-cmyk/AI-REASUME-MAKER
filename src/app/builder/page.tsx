"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ProfileProgressBar } from "@/components/resume/progress-bar"
import { ResumePreview } from "@/components/resume/resume-preview"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { TemplateSwitcher } from "@/components/resume/template-switcher"

function BuilderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get("template") || "modern"
    const [data, setData] = useState<ResumeData>(initialResumeData)

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Form Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm">
                    <div className="p-4 border-b flex flex-wrap gap-2 justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold">Resume Editor</h2>
                            <TemplateSwitcher currentTemplate={templateId} onSelect={handleTemplateSelect} />
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
            </div>
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
