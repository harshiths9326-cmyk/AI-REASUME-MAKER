"use client"

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
    return (
        <div className="flex flex-col h-full bg-background relative">
            <div className="p-4 border-b font-semibold bg-muted/50 sticky top-0 z-10 shadow-sm flex justify-between items-center">
                <span>Resume Details</span>
            </div>


            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-24">
                <PersonalInfo
                    data={data.personalInfo}
                    updateData={(info: ResumeData["personalInfo"]) => updateData({ personalInfo: info })}
                />
                <hr className="my-8" />

                <Experience
                    data={data.experience}
                    updateData={(exp: ResumeData["experience"]) => updateData({ experience: exp })}
                />
                <hr className="my-8" />

                <Education
                    data={data.education}
                    updateData={(edu: ResumeData["education"]) => updateData({ education: edu })}
                />
                <hr className="my-8" />

                <Skills
                    data={data.skills}
                    updateData={(skills: ResumeData["skills"]) => updateData({ skills })}
                />
                <hr className="my-8" />

                <Projects
                    data={data.projects}
                    updateData={(projects: ResumeData["projects"]) => updateData({ projects })}
                />
                <hr className="my-8" />

                <Certifications
                    data={data.certifications}
                    updateData={(certifications: ResumeData["certifications"]) => updateData({ certifications })}
                />
                <hr className="my-8" />

                <Achievements
                    data={data.achievements}
                    updateData={(achievements: ResumeData["achievements"]) => updateData({ achievements })}
                />
                <hr className="my-8" />

                <Languages
                    data={data.languages}
                    updateData={(languages: ResumeData["languages"]) => updateData({ languages })}
                />
                <hr className="my-8" />

                <Links
                    data={data.links}
                    updateData={(links: ResumeData["links"]) => updateData({ links })}
                />
            </div>
        </div>
    )
}
