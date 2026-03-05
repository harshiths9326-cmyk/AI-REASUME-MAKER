"use client"

import { useState } from "react"
import { initialResumeData, ResumeData } from "@/lib/types"
import { ResumeForm } from "@/components/resume/resume-form"
import { ResumePreview } from "@/components/resume/resume-preview"

export default function BuilderPage() {
    const [data, setData] = useState<ResumeData>(initialResumeData)

    const updateData = (newData: Partial<ResumeData>) => {
        setData((prev) => ({ ...prev, ...newData }))
    }

    return (
        <div className="container mx-auto max-w-[1600px] h-[calc(100vh-4rem)] p-4 relative z-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Form Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-card shadow-sm">
                    <ResumeForm data={data} updateData={updateData} />
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full overflow-hidden border rounded-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <ResumePreview data={data} />
                </div>
            </div>
        </div>
    )
}
