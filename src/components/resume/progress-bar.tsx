"use client"

import { useEffect, useState } from "react"

import { ResumeData } from "@/lib/types"

interface ProgressBarProps {
    data: ResumeData
}

export function ProfileProgressBar({ data }: ProgressBarProps) {
    const [score, setScore] = useState(0)

    useEffect(() => {
        let currentScore = 0

        // 1. Basic Info (20%)
        if (data.personalInfo.firstName && data.personalInfo.lastName) currentScore += 10
        if (data.personalInfo.email && data.personalInfo.phone) currentScore += 10

        // 2. Summary (15%)
        if (data.personalInfo.summary && data.personalInfo.summary.length > 20) currentScore += 15

        // 3. Experience (25%)
        if (data.experience.length > 0) {
            currentScore += 15
            // High quality experience check
            if (data.experience[0].description && data.experience[0].description.length > 50) {
                currentScore += 10
            }
        }

        // 4. Education (15%)
        if (data.education.length > 0) currentScore += 15

        // 5. Skills (15%)
        if (data.skills.length >= 3) currentScore += 15
        else if (data.skills.length > 0) currentScore += 5

        // 6. Projects or Extra (10%)
        if (data.projects.length > 0) currentScore += 10

        setScore(Math.min(currentScore, 100))
    }, [data])

    let colorClass = "bg-red-500"
    if (score >= 80) colorClass = "bg-green-500"
    else if (score >= 50) colorClass = "bg-yellow-500"

    return (
        <div className="w-full space-y-2 p-4 bg-muted/10 border-b">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted-foreground flex items-center gap-2">
                    Profile Strength
                    {score === 100 && " 🎉"}
                </span>
                <span className={`font-bold ${score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                    {score}%
                </span>
            </div>
            {/* Custom progress bar mapping the color class directly to standard shadcn progress structure is complex, 
                so we'll just build a simple clean animated div bar for better color control */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${colorClass}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    )
}
