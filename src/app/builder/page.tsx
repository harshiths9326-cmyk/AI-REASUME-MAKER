"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ResumePreview } from "@/components/resume/resume-preview"
import { ATSMatcher } from "@/components/resume/ats-matcher"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

function BuilderContent() {
    const searchParams = useSearchParams()
    const templateId = searchParams.get("template") || "modern"
    const [data, setData] = useState<ResumeData>(initialResumeData)
    const [showATS, setShowATS] = useState(false)

    const updateData = (newData: Partial<ResumeData>) => {
        setData((prev) => ({ ...prev, ...newData }))
    }

    return (
        <div className="relative h-full">
            <div className={`grid grid-cols-1 ${showATS ? 'lg:grid-cols-[1fr_1fr_400px]' : 'lg:grid-cols-2'} gap-6 h-full transition-all duration-300`}>
                {/* Form Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm">
                    <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                        <h2 className="font-bold">Resume Editor</h2>
                        <Button
                            variant={showATS ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setShowATS(!showATS)}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            {showATS ? "Hide ATS Matcher" : "AI ATS Matcher"}
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ResumeForm data={data} updateData={updateData} />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <ResumePreview data={data} template={templateId} />
                </div>

                {/* ATS Matcher Section - Desktop Sidebar */}
                {showATS && (
                    <div className="hidden lg:flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm animate-in slide-in-from-right-4 duration-300">
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                            <h2 className="font-bold">ATS Analysis</h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowATS(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <ATSMatcher resumeData={data} />
                        </div>
                    </div>
                )}
            </div>

            {/* ATS Matcher - Mobile/Tablet Overlay (Simplified for context) */}
            {showATS && (
                <div className="lg:hidden fixed inset-0 z-50 bg-background p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">ATS Analysis</h2>
                        <Button variant="ghost" size="icon" onClick={() => setShowATS(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <ATSMatcher resumeData={data} />
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

