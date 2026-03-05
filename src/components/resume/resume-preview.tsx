"use client"

import { useRef } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeData } from "@/lib/types"
import generatePDF, { Resolution, Margin } from "react-to-pdf"

interface ResumePreviewProps {
    data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
    const { personalInfo, experience, education, skills, projects } = data
    const targetRef = useRef<HTMLDivElement>(null)

    const downloadPdf = () => {
        generatePDF(targetRef, {
            method: "save",
            filename: `${personalInfo.firstName || "resume"}_${personalInfo.lastName || "document"}.pdf`,
            resolution: Resolution.HIGH,
            page: {
                margin: Margin.NONE,
                format: "a4",
            },
        })
    }

    return (
        <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-900 border relative">
            <div className="absolute top-4 right-4 z-10 hidden lg:block">
                <Button onClick={downloadPdf} size="sm" className="shadow-md">
                    <Download className="h-4 w-4 mr-2" /> Download Document
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center custom-scrollbar">
                {/* Resume Document Wrapper (A4 aspect ratio approx 1:1.414) */}
                <div
                    ref={targetRef}
                    className="w-full max-w-[800px] bg-white text-black shadow-xl overflow-hidden print-styles"
                    style={{ minHeight: "1131px", padding: "40px" }}
                >
                    {/* Document Content */}
                    <div className="flex flex-col space-y-6 font-serif">

                        {/* Header */}
                        <div className="text-center border-b-[2px] border-black pb-4">
                            <h1 className="text-4xl font-bold uppercase tracking-wide text-black pb-1">
                                {personalInfo.firstName || "FIRST"} {personalInfo.lastName || "LAST"}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-x-3 mt-1 text-sm font-sans tracking-wide">
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                                {personalInfo.address && <span>• {personalInfo.address}</span>}
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-3 mt-1 text-sm font-sans tracking-wide">
                                {personalInfo.linkedin && (
                                    <a href={personalInfo.linkedin} className="text-blue-700 hover:text-blue-900">{personalInfo.linkedin}</a>
                                )}
                                {personalInfo.website && (
                                    <>
                                        <span>•</span>
                                        <a href={personalInfo.website} className="text-blue-700 hover:text-blue-900">{personalInfo.website}</a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Professional Summary */}
                        {personalInfo.summary && (
                            <div>
                                <h2 className="text-lg font-bold uppercase mb-2 border-b border-gray-300 pb-1 tracking-wider">
                                    Professional Summary
                                </h2>
                                <p className="text-sm leading-relaxed text-gray-800 font-sans whitespace-pre-wrap">
                                    {personalInfo.summary}
                                </p>
                            </div>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300 pb-1 tracking-wider">
                                    Experience
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-base">{exp.position}</h3>
                                                <span className="text-sm font-sans font-medium text-gray-600">
                                                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold font-sans text-gray-700 mb-2 italic">
                                                {exp.company}
                                            </div>
                                            <div className="text-sm text-gray-800 font-sans leading-relaxed whitespace-pre-wrap ml-4 list-disc list-outside"
                                                style={{ display: "list-item" }}>
                                                {exp.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300 pb-1 tracking-wider">
                                    Education
                                </h2>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-base">{edu.school}</h3>
                                                <span className="text-sm font-sans font-medium text-gray-600">
                                                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                                                </span>
                                            </div>
                                            <div className="text-sm font-sans font-medium text-gray-800 mb-1">
                                                {edu.degree}
                                            </div>
                                            {edu.description && (
                                                <p className="text-sm text-gray-700 font-sans whitespace-pre-wrap">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {projects.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300 pb-1 tracking-wider">
                                    Projects
                                </h2>
                                <div className="space-y-3">
                                    {projects.map((proj) => (
                                        <div key={proj.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-base">
                                                    {proj.title} {proj.link && <span className="font-normal text-sm font-sans text-blue-700 ml-2">({proj.link})</span>}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-800 font-sans leading-relaxed whitespace-pre-wrap">
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300 pb-1 tracking-wider">
                                    Skills
                                </h2>
                                <div className="text-sm font-sans text-gray-800 leading-relaxed">
                                    <span className="font-bold mr-2">Core Competencies:</span>
                                    {skills.map((s) => s.name).join(", ")}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <div className="lg:hidden p-4 border-t bg-background">
                <Button onClick={downloadPdf} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download Document
                </Button>
            </div>

        </div>
    )
}
