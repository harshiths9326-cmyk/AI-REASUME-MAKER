"use client"

import { useState } from "react"
import { Save, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PersonalInfo } from "./personal-info"
import { Experience } from "./experience"
import { Education } from "./education"
import { Skills } from "./skills"
import { Projects } from "./projects"
import { Certifications } from "./certifications"
import { Achievements } from "./achievements"
import { Languages } from "./languages"
import { Links } from "./links"
import { ResumeData } from "@/lib/types"

interface ResumeFormProps {
    data: ResumeData
    updateData: (newData: Partial<ResumeData>) => void
}

export function ResumeForm({ data, updateData }: ResumeFormProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [savedStatus, setSavedStatus] = useState<"idle" | "saved" | string>("idle")

    const handleSave = async () => {
        try {
            setIsSaving(true)
            setSavedStatus("idle")

            const resumeId = data.personalInfo.firstName
                ? `${data.personalInfo.firstName.toLowerCase()}-${data.personalInfo.lastName.toLowerCase()}`
                : "draft-resume"

            const response = await fetch("/api/save-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: resumeId, data }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setSavedStatus("saved")
                setTimeout(() => setSavedStatus("idle"), 3000)
            } else {
                setSavedStatus(result.error || "error")
                console.error("Save error:", result.error)
            }
        } catch (error: any) {
            console.error("Error saving resume:", error)
            setSavedStatus(error?.message || "error")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-background relative">
            <div className="p-4 border-b font-semibold bg-muted/50 sticky top-0 z-10 shadow-sm flex justify-between items-center">
                <span>Resume Details</span>
                <Button
                    variant={savedStatus === "saved" ? "default" : "outline"}
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={savedStatus === "saved" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : savedStatus === "saved" ? (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {savedStatus === "saved" ? "Saved!" : "Save Progress"}
                </Button>
            </div>

            {savedStatus !== "idle" && savedStatus !== "saved" && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm text-center border-b font-medium">
                    {`Error: ${savedStatus}`}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-24">
                <PersonalInfo
                    data={data.personalInfo}
                    updateData={(info: any) => updateData({ personalInfo: info })}
                />
                <hr className="my-8" />

                <Experience
                    data={data.experience}
                    updateData={(exp: any) => updateData({ experience: exp })}
                />
                <hr className="my-8" />

                <Education
                    data={data.education}
                    updateData={(edu: any) => updateData({ education: edu })}
                />
                <hr className="my-8" />

                <Skills
                    data={data.skills}
                    updateData={(skills: any) => updateData({ skills })}
                />
                <hr className="my-8" />

                <Projects
                    data={data.projects}
                    updateData={(projects: any) => updateData({ projects })}
                />
                <hr className="my-8" />

                <Certifications
                    data={data.certifications}
                    updateData={(certifications: any) => updateData({ certifications })}
                />
                <hr className="my-8" />

                <Achievements
                    data={data.achievements}
                    updateData={(achievements: any) => updateData({ achievements })}
                />
                <hr className="my-8" />

                <Languages
                    data={data.languages}
                    updateData={(languages: any) => updateData({ languages })}
                />
                <hr className="my-8" />

                <Links
                    data={data.links}
                    updateData={(links: any) => updateData({ links })}
                />
            </div>
        </div>
    )
}
