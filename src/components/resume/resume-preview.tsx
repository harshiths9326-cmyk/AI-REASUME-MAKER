"use client"

import { useRef } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeData } from "@/lib/types"
import generatePDF, { Resolution, Margin } from "react-to-pdf"

interface ResumePreviewProps {
    data: ResumeData
    template?: string
}

const ModernTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div className="flex flex-col space-y-6 font-sans">
            <div className="border-b-[2px] border-primary pb-4">
                <h1 className="text-4xl font-bold uppercase tracking-wide text-primary pb-1">
                    {personalInfo.firstName || "FIRST"} {personalInfo.lastName || "LAST"}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 mt-2 text-sm text-muted-foreground">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.address && <span>• {personalInfo.address}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 mt-1 text-sm text-primary">
                    {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin} className="hover:underline">{personalInfo.linkedin}</a>
                    )}
                    {personalInfo.website && (
                        <>
                            <span>•</span>
                            <a href={personalInfo.website} className="hover:underline">{personalInfo.website}</a>
                        </>
                    )}
                </div>
            </div>

            {personalInfo.summary && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-2 text-primary tracking-wider">
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {personalInfo.summary}
                    </p>
                </div>
            )}

            {experience.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.position}</h3>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-primary/80 mb-2">
                                    {exp.company}
                                </div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap ml-4 list-disc list-outside" style={{ display: "list-item" }}>
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {education.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{edu.school}</h3>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-medium mb-1">
                                    {edu.degree}
                                </div>
                                {edu.description && (
                                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {projects.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">
                                        {proj.title} {proj.link && <span className="font-normal text-sm text-blue-600 ml-2">({proj.link})</span>}
                                    </h3>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {skills.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">
                        Skills
                    </h2>
                    <div className="text-sm leading-relaxed flex flex-wrap gap-2">
                        {skills.map((s) => (
                            <span key={s.id} className="bg-muted px-2 py-1 rounded text-muted-foreground font-medium">
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CorporateTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div className="flex flex-col space-y-6 font-serif">
            <div className="text-center border-b-[1px] border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-black pb-2">
                    {personalInfo.firstName || "FIRST"} {personalInfo.lastName || "LAST"}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-2 mt-1 text-sm font-sans tracking-wide">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>| {personalInfo.phone}</span>}
                    {personalInfo.address && <span>| {personalInfo.address}</span>}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-2 mt-1 text-sm font-sans tracking-wide">
                    {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin}>{personalInfo.linkedin}</a>
                    )}
                    {personalInfo.website && (
                        <>
                            <span>|</span>
                            <a href={personalInfo.website}>{personalInfo.website}</a>
                        </>
                    )}
                </div>
            </div>

            {personalInfo.summary && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-2 border-b border-gray-400 pb-1 tracking-wider text-center">
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-black font-sans whitespace-pre-wrap text-justify mt-2">
                        {personalInfo.summary}
                    </p>
                </div>
            )}

            {experience.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">
                        Professional Experience
                    </h2>
                    <div className="space-y-5 mt-3">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.company}</h3>
                                    <span className="text-sm font-sans font-medium text-black">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-sans italic text-black mb-2">
                                    {exp.position}
                                </div>
                                <div className="text-sm text-black font-sans leading-relaxed whitespace-pre-wrap ml-5 list-disc list-outside" style={{ display: "list-item" }}>
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {education.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">
                        Education
                    </h2>
                    <div className="space-y-4 mt-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{edu.school}</h3>
                                    <span className="text-sm font-sans font-medium text-black">
                                        {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-sans text-black mb-1 italic">
                                    {edu.degree}
                                </div>
                                {edu.description && (
                                    <p className="text-sm text-black font-sans whitespace-pre-wrap">
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {projects.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">
                        Key Projects
                    </h2>
                    <div className="space-y-3 mt-3">
                        {projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">
                                        {proj.title} {proj.link && <span className="font-normal text-sm font-sans ml-2">({proj.link})</span>}
                                    </h3>
                                </div>
                                <p className="text-sm text-black font-sans leading-relaxed whitespace-pre-wrap ml-5 list-disc list-outside" style={{ display: "list-item" }}>
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {skills.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">
                        Skills & Expertise
                    </h2>
                    <div className="text-sm font-sans text-black leading-relaxed mt-2 text-center">
                        {skills.map((s) => s.name).join(" • ")}
                    </div>
                </div>
            )}
        </div>
    );
};

const CreativeTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div className="flex flex-row h-full font-sans">
            {/* Sidebar Column */}
            <div className="w-1/3 min-w-[200px] bg-[#2a303c] text-white p-6 rounded-l-lg space-y-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2 text-[#38bdf8]">
                        {personalInfo.firstName || "FIRST"} <br />
                        <span className="text-white">{personalInfo.lastName || "LAST"}</span>
                    </h1>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#38bdf8] border-b border-white/20 pb-1">
                        Contact
                    </h2>
                    <div className="flex flex-col space-y-2 text-xs text-white/80">
                        {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.address && <span>{personalInfo.address}</span>}
                        {personalInfo.linkedin && (
                            <a href={personalInfo.linkedin} className="hover:text-white break-all">{personalInfo.linkedin}</a>
                        )}
                        {personalInfo.website && (
                            <a href={personalInfo.website} className="hover:text-white break-all">{personalInfo.website}</a>
                        )}
                    </div>
                </div>

                {skills.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#38bdf8] border-b border-white/20 pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-col gap-2 text-xs font-semibold text-white/90">
                            {skills.map((s) => (
                                <span key={s.id} className="border border-white/20 rounded-full px-3 py-1 text-center">
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#38bdf8] border-b border-white/20 pb-1">
                            Education
                        </h2>
                        <div className="space-y-4 text-white/80">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="text-xs font-bold text-white mb-1">{edu.school}</div>
                                    <div className="text-xs mb-1 italic">{edu.degree}</div>
                                    <div className="text-[10px] opacity-70">
                                        {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Column */}
            <div className="w-2/3 p-8 space-y-8 bg-white text-[#1f2937]">
                {personalInfo.summary && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-3 text-[#38bdf8]">
                            About Me
                        </h2>
                        <p className="text-sm leading-relaxed font-medium">
                            {personalInfo.summary}
                        </p>
                    </div>
                )}

                {experience.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-4 text-[#38bdf8]">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="relative pl-4 border-l-2 border-[#38bdf8]/30">
                                    <div className="absolute w-2 h-2 bg-[#38bdf8] rounded-full -left-[5px] top-1"></div>
                                    <div className="mb-1">
                                        <h3 className="font-bold text-lg leading-tight">{exp.position}</h3>
                                        <div className="text-sm font-bold text-[#38bdf8] my-1">{exp.company}</div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                        </span>
                                    </div>
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap mt-2 list-disc list-outside space-y-1">
                                        {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-4 text-[#38bdf8]">
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.map((proj) => (
                                <div key={proj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h3 className="font-bold text-base mb-1 text-[#1f2937]">
                                        {proj.title}
                                    </h3>
                                    {proj.link && <a href={proj.link} className="text-xs font-bold text-[#38bdf8] block mb-2">{proj.link}</a>}
                                    <p className="text-sm leading-relaxed mt-1">
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export function ResumePreview({ data, template = "modern" }: ResumePreviewProps) {
    const { personalInfo } = data
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

    const renderTemplate = () => {
        switch (template) {
            case "corporate":
            case "professional": // Match the ID used in templates array
                return <CorporateTemplate data={data} />;
            case "creative":
                return <CreativeTemplate data={data} />;
            case "modern":
            default:
                return <ModernTemplate data={data} />;
        }
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
                    style={{ minHeight: "1131px", padding: template === "creative" ? "0px" : "40px" }}
                >
                    {/* Render Selected Template Component */}
                    {renderTemplate()}
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
