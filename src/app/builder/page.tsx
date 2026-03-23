"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ProfileProgressBar } from "@/components/resume/progress-bar"
import { ResumePreview } from "@/components/resume/resume-preview"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { TemplateSwitcher } from "@/components/resume/template-switcher"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeReviewer } from "@/components/resume/resume-reviewer"
import { ATSMatcher } from "@/components/resume/ats-matcher"
import { CoverLetter } from "@/components/resume/cover-letter"
import { InterviewPrep } from "@/components/resume/interview-prep"
import { Sparkles, X, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function BuilderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get("template") || "modern"
    const [data, setData] = useState<ResumeData>(initialResumeData)
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)

    // Load data from sessionStorage on mount
    useEffect(() => {
        const savedData = sessionStorage.getItem("resume_builder_data")
        if (savedData) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
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
                        <ResumeForm data={data} updateData={updateData} onAiClick={() => setIsAiSidebarOpen(true)} />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <ResumePreview data={data} template={templateId} updateData={updateData} />
                    
                    {/* AI Sidebar Toggle */}
                    <button
                        onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                        className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-2 rounded-l-xl shadow-lg transition-transform hover:scale-110",
                            isAiSidebarOpen && "translate-x-full"
                        )}
                        title="Magic AI Tools"
                    >
                        {isAiSidebarOpen ? <ChevronRight className="h-6 w-6" /> : <Sparkles className="h-6 w-6 animate-pulse" />}
                    </button>
                </div>
            </div>

            {/* AI Magic Sidebar */}
            <div className={cn(
                "fixed inset-y-0 right-0 w-full sm:w-[450px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col",
                !isAiSidebarOpen && "translate-x-full"
            )}>
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h2 className="font-bold uppercase tracking-wider">Magic AI Tools</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsAiSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <Tabs defaultValue="review" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="review" className="text-[10px] uppercase font-bold">Review</TabsTrigger>
                            <TabsTrigger value="ats" className="text-[10px] uppercase font-bold">ATS</TabsTrigger>
                            <TabsTrigger value="cover" className="text-[10px] uppercase font-bold">Letter</TabsTrigger>
                            <TabsTrigger value="prep" className="text-[10px] uppercase font-bold">Prep</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="review" className="mt-0">
                            <ResumeReviewer resumeData={data} />
                        </TabsContent>
                        
                        <TabsContent value="ats" className="mt-0">
                            <ATSMatcher resumeData={data} updateData={updateData} />
                        </TabsContent>
                        
                        <TabsContent value="cover" className="mt-0">
                            <CoverLetter resumeData={data} />
                        </TabsContent>
                        
                        <TabsContent value="prep" className="mt-0">
                            <InterviewPrep resumeData={data} />
                        </TabsContent>
                    </Tabs>
                </div>
                
                <div className="p-4 border-t bg-muted/10 text-[10px] text-center text-muted-foreground font-mono">
                    AI STRATEGIST ENGINE v2.0 READY
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
