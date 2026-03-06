"use client"

import { useRef, useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeData } from "@/lib/types"

interface ResumePreviewProps {
    data: ResumeData
    template?: string
}

const ModernTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
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
                            <div key={exp.id} className="break-inside-avoid-page">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.position}</h3>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-primary/80 mb-2">
                                    {exp.company}
                                </div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap ml-4 list-disc list-outside break-words" style={{ display: "list-item" }}>
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
                            <div key={edu.id} className="break-inside-avoid-page">
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
                            <div key={proj.id} className="break-inside-avoid-page">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">
                                        {proj.title} {proj.link && <span className="font-normal text-sm text-blue-600 ml-2">({proj.link})</span>}
                                    </h3>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
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

            {certifications.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">Certifications</h2>
                    <div className="space-y-2">
                        {certifications.map(c => (
                            <div key={c.id} className="flex justify-between items-baseline break-inside-avoid-page">
                                <div>
                                    <span className="font-bold text-sm">{c.name}</span>
                                    {c.issuer && <span className="text-sm text-muted-foreground ml-2">— {c.issuer}</span>}
                                </div>
                                <span className="text-xs text-muted-foreground">{c.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {achievements.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">Achievements</h2>
                    <div className="space-y-2">
                        {achievements.map(a => (
                            <div key={a.id}>
                                <div className="font-bold text-sm">{a.title}</div>
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{a.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {languages.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">Languages</h2>
                    <div className="flex flex-wrap gap-3">
                        {languages.map(l => (
                            <span key={l.id} className="text-sm bg-muted px-3 py-1 rounded font-medium">
                                {l.language} <span className="text-muted-foreground font-normal">({l.proficiency})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {links.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3 text-primary tracking-wider">Links</h2>
                    <div className="flex flex-wrap gap-4">
                        {links.map(l => (
                            <a key={l.id} href={l.url} className="text-sm text-primary hover:underline font-medium">
                                {l.label}: {l.url}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CorporateTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
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
                    <p className="text-sm leading-relaxed text-black font-sans whitespace-pre-wrap text-justify mt-2 break-words">
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
                            <div key={exp.id} className="break-inside-avoid-page">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.company}</h3>
                                    <span className="text-sm font-sans font-medium text-black">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                </div>
                                <div className="text-sm font-sans italic text-black mb-2">
                                    {exp.position}
                                </div>
                                <div className="text-sm text-black font-sans leading-relaxed whitespace-pre-wrap ml-5 list-disc list-outside break-words" style={{ display: "list-item" }}>
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
                            <div key={edu.id} className="break-inside-avoid-page">
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
                                    <p className="text-sm text-black font-sans whitespace-pre-wrap break-words">
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
                            <div key={proj.id} className="break-inside-avoid-page">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">
                                        {proj.title} {proj.link && <span className="font-normal text-sm font-sans ml-2">({proj.link})</span>}
                                    </h3>
                                </div>
                                <p className="text-sm text-black font-sans leading-relaxed whitespace-pre-wrap ml-5 list-disc list-outside break-words" style={{ display: "list-item" }}>
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
                        Skills &amp; Expertise
                    </h2>
                    <div className="text-sm font-sans text-black leading-relaxed mt-2 text-center">
                        {skills.map((s) => s.name).join(" • ")}
                    </div>
                </div>
            )}

            {certifications.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">Certifications</h2>
                    <div className="space-y-1 mt-2">
                        {certifications.map(c => (
                            <div key={c.id} className="text-sm font-sans text-black flex justify-between">
                                <span className="font-bold">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span>
                                <span>{c.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {achievements.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">Achievements</h2>
                    <div className="space-y-2 mt-2">
                        {achievements.map(a => (
                            <div key={a.id} className="text-sm font-sans text-black">
                                <span className="font-bold">{a.title}</span>
                                {a.description && <p className="mt-1 whitespace-pre-wrap break-words">{a.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {languages.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">Languages</h2>
                    <div className="text-sm font-sans text-black text-center mt-2">
                        {languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
                    </div>
                </div>
            )}

            {links.length > 0 && (
                <div>
                    <h2 className="text-md font-bold uppercase mb-3 border-b border-gray-400 pb-1 tracking-wider text-center">Links</h2>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {links.map(l => (
                            <a key={l.id} href={l.url} className="text-sm text-black underline">{l.label}: {l.url}</a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CreativeTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
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

                {languages.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#38bdf8] border-b border-white/20 pb-1">Languages</h2>
                        <div className="text-xs text-white/80 space-y-1">
                            {languages.map(l => (
                                <div key={l.id}>{l.language} <span className="opacity-60">({l.proficiency})</span></div>
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
                                <div key={exp.id} className="relative pl-4 border-l-2 border-[#38bdf8]/30 break-inside-avoid-page">
                                    <div className="absolute w-2 h-2 bg-[#38bdf8] rounded-full -left-[5px] top-1"></div>
                                    <div className="mb-1">
                                        <h3 className="font-bold text-lg leading-tight">{exp.position}</h3>
                                        <div className="text-sm font-bold text-[#38bdf8] my-1">{exp.company}</div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                        </span>
                                    </div>
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap mt-2 list-disc list-outside space-y-1 break-words">
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
                                <div key={proj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 break-inside-avoid-page">
                                    <h3 className="font-bold text-base mb-1 text-[#1f2937]">
                                        {proj.title}
                                    </h3>
                                    {proj.link && <a href={proj.link} className="text-xs font-bold text-[#38bdf8] block mb-2">{proj.link}</a>}
                                    <p className="text-sm leading-relaxed mt-1 break-words whitespace-pre-wrap">
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {certifications.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-4 text-[#38bdf8]">Certifications</h2>
                        <div className="space-y-2">
                            {certifications.map(c => (
                                <div key={c.id} className="flex justify-between items-baseline text-sm">
                                    <span className="font-bold">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span>
                                    <span className="text-gray-500">{c.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {achievements.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-4 text-[#38bdf8]">Achievements</h2>
                        <div className="space-y-3">
                            {achievements.map(a => (
                                <div key={a.id} className="relative pl-4 border-l-2 border-[#38bdf8]/30">
                                    <div className="font-bold text-sm">{a.title}</div>
                                    <div className="text-sm whitespace-pre-wrap break-words">{a.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {links.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black uppercase mb-4 text-[#38bdf8]">Links</h2>
                        <div className="flex flex-wrap gap-3">
                            {links.map(l => (
                                <a key={l.id} href={l.url} className="text-sm font-bold text-[#38bdf8] hover:underline">
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── White Modern Business ──────────────────────────────────────────────────
const WhiteModernBusinessTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-col space-y-5 font-sans">
            <div className="pb-3 mb-1" style={{ borderBottom: '2px solid #2563eb' }}>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    {personalInfo.firstName || "FIRST"} <span className="text-blue-600">{personalInfo.lastName || "LAST"}</span>
                </h1>
                <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.address && <span>{personalInfo.address}</span>}
                </div>
            </div>
            {personalInfo.summary && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Profile</h2><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p></div>}
            {experience.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Experience</h2><div className="space-y-4">{experience.map(exp => (<div key={exp.id}><div className="flex justify-between"><span className="font-bold text-gray-900">{exp.position}</span><span className="text-xs text-gray-500">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span></div><div className="text-sm font-semibold text-blue-600">{exp.company}</div><div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{exp.description}</div></div>))}</div></div>}
            {education.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Education</h2><div className="space-y-3">{education.map(edu => (<div key={edu.id}><div className="flex justify-between"><span className="font-bold text-gray-900">{edu.school}</span><span className="text-xs text-gray-500">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span></div><div className="text-sm text-gray-700">{edu.degree}</div></div>))}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Skills</h2><div className="flex flex-wrap gap-2">{skills.map(s => (<span key={s.id} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{s.name}</span>))}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Projects</h2><div className="space-y-3">{projects.map(proj => (<div key={proj.id}><div className="font-bold text-gray-900">{proj.title}</div>{proj.link && <a href={proj.link} className="text-xs text-blue-600">{proj.link}</a>}<div className="text-sm text-gray-700 whitespace-pre-wrap">{proj.description}</div></div>))}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Certifications</h2><div className="space-y-1">{certifications.map(c => (<div key={c.id} className="flex justify-between text-sm"><span className="font-bold text-gray-900">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span><span className="text-gray-500">{c.date}</span></div>))}</div></div>}
            {achievements.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Achievements</h2><div className="space-y-2">{achievements.map(a => (<div key={a.id}><div className="font-bold text-gray-900 text-sm">{a.title}</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{a.description}</div></div>))}</div></div>}
            {languages.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Languages</h2><div className="flex flex-wrap gap-2">{languages.map(l => (<span key={l.id} className="text-sm bg-blue-50 px-3 py-1 rounded border border-blue-100">{l.language} ({l.proficiency})</span>))}</div></div>}
            {links.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Links</h2><div className="flex flex-wrap gap-3">{links.map(l => (<a key={l.id} href={l.url} className="text-sm text-blue-600 hover:underline">{l.label}: {l.url}</a>))}</div></div>}
        </div>
    );
};

// ── Gray & White Marketing ──────────────────────────────────────────────────
const GrayMarketingTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-row h-full font-sans">
            <div className="w-[36%] bg-gray-200 p-6 space-y-6 text-gray-800">
                <h1 className="text-2xl font-black uppercase text-gray-900 leading-tight">{personalInfo.firstName || 'FIRST'}<br />{personalInfo.lastName || 'LAST'}</h1>
                <div className="space-y-1"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 border-b border-gray-400 pb-1">Contact</h3><div className="text-xs space-y-1 text-gray-700">{personalInfo.email && <div>{personalInfo.email}</div>}{personalInfo.phone && <div>{personalInfo.phone}</div>}{personalInfo.address && <div>{personalInfo.address}</div>}</div></div>
                {skills.length > 0 && <div className="space-y-1"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 border-b border-gray-400 pb-1">Skills</h3><ul className="text-xs text-gray-700 space-y-1">{skills.map(s => <li key={s.id}>{s.name}</li>)}</ul></div>}
                {languages.length > 0 && <div className="space-y-1"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 border-b border-gray-400 pb-1">Languages</h3>{languages.map(l => <div key={l.id} className="text-xs text-gray-700">{l.language} ({l.proficiency})</div>)}</div>}
                {education.length > 0 && <div className="space-y-2"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 border-b border-gray-400 pb-1">Education</h3>{education.map(edu => (<div key={edu.id} className="text-xs text-gray-700"><div className="font-bold">{edu.school}</div><div>{edu.degree}</div><div className="opacity-70">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div></div>))}</div>}
                {links.length > 0 && <div className="space-y-1"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 border-b border-gray-400 pb-1">Links</h3>{links.map(l => (<a key={l.id} href={l.url} className="text-xs text-gray-700 block break-all">{l.label}</a>))}</div>}
            </div>
            <div className="w-[64%] bg-white p-8 space-y-6">
                {personalInfo.summary && <div><h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Summary</h2><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p></div>}
                {experience.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Experience</h2><div className="space-y-5">{experience.map(exp => (<div key={exp.id}><div className="font-bold text-gray-900 text-base">{exp.position}</div><div className="text-sm text-gray-600 font-semibold">{exp.company} <span className="font-normal opacity-60 ml-2">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span></div><div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{exp.description}</div></div>))}</div></div>}
                {projects.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Projects</h2><div className="space-y-3">{projects.map(proj => (<div key={proj.id}><div className="font-bold text-gray-900">{proj.title}</div>{proj.link && <div className="text-xs text-blue-600">{proj.link}</div>}<div className="text-sm text-gray-700 whitespace-pre-wrap">{proj.description}</div></div>))}</div></div>}
                {certifications.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Certifications</h2><div className="space-y-1">{certifications.map(c => (<div key={c.id} className="flex justify-between text-sm"><span className="font-bold">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span><span>{c.date}</span></div>))}</div></div>}
                {achievements.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Achievements</h2><div className="space-y-2">{achievements.map(a => (<div key={a.id}><div className="font-bold text-sm">{a.title}</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{a.description}</div></div>))}</div></div>}
            </div>
        </div>
    );
};

// ── Gray & White Clean ──────────────────────────────────────────────────────
const GrayCleanTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-col space-y-6 font-sans">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 tracking-wide">{personalInfo.firstName || 'FIRST'} {personalInfo.lastName || 'LAST'}</h1>
                <div className="flex justify-center gap-x-3 mt-2 text-xs text-gray-500">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>| {personalInfo.phone}</span>}{personalInfo.address && <span>| {personalInfo.address}</span>}</div>
            </div>
            {personalInfo.summary && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Profile</h2><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-2">{personalInfo.summary}</p></div>}
            {experience.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Experience</h2><div className="space-y-4 mt-2">{experience.map(exp => (<div key={exp.id}><div className="flex justify-between items-baseline"><span className="font-bold text-gray-900">{exp.position}</span><span className="text-xs text-gray-400">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span></div><div className="text-sm text-gray-600 font-medium">{exp.company}</div><div className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{exp.description}</div></div>))}</div></div>}
            {education.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Education</h2><div className="space-y-3 mt-2">{education.map(edu => (<div key={edu.id} className="flex justify-between items-baseline"><div><div className="font-bold text-gray-900 text-sm">{edu.school}</div><div className="text-sm text-gray-600">{edu.degree}</div></div><span className="text-xs text-gray-400">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span></div>))}</div></div>}
            {skills.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Skills</h2><div className="text-sm text-gray-700 mt-2">{skills.map(s => s.name).join(', ')}</div></div>}
            {projects.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Projects</h2><div className="space-y-3 mt-2">{projects.map(proj => (<div key={proj.id}><div className="font-bold text-gray-900 text-sm">{proj.title}{proj.link && <span className="font-normal text-xs text-blue-600 ml-1">({proj.link})</span>}</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{proj.description}</div></div>))}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Certifications</h2><div className="space-y-1 mt-2">{certifications.map(c => (<div key={c.id} className="flex justify-between text-sm"><span className="font-bold">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span><span className="text-gray-400">{c.date}</span></div>))}</div></div>}
            {achievements.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Achievements</h2><div className="space-y-2 mt-2">{achievements.map(a => (<div key={a.id}><div className="font-bold text-sm">{a.title}</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{a.description}</div></div>))}</div></div>}
            {languages.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Languages</h2><div className="text-sm text-gray-700 mt-2">{languages.map(l => `${l.language} (${l.proficiency})`).join(' | ')}</div></div>}
            {links.length > 0 && <div><h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1 pb-1" style={{ borderBottom: '1px solid #d1d5db' }}>Links</h2><div className="flex flex-wrap gap-3 mt-2">{links.map(l => (<a key={l.id} href={l.url} className="text-sm text-blue-600 hover:underline">{l.label}: {l.url}</a>))}</div></div>}
        </div>
    );
};

// ── Minimalist White & Grey ─────────────────────────────────────────────────
const MinimalistGreyTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-col space-y-8 font-sans">
            <div>
                <h1 className="text-5xl font-thin text-gray-300 uppercase tracking-[0.2em]">{personalInfo.firstName || 'FIRST'} {personalInfo.lastName || 'LAST'}</h1>
                <div className="flex gap-x-4 mt-3 text-xs text-gray-400">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>{personalInfo.phone}</span>}{personalInfo.address && <span>{personalInfo.address}</span>}</div>
            </div>
            {personalInfo.summary && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">About</div><p className="text-sm text-gray-500 leading-loose whitespace-pre-wrap border-l-2 border-gray-200 pl-4">{personalInfo.summary}</p></div>}
            {experience.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">Experience</div><div className="space-y-6">{experience.map(exp => (<div key={exp.id}><div className="text-sm font-semibold text-gray-700">{exp.position}</div><div className="text-xs text-gray-400 mt-0.5">{exp.company} · {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</div><div className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{exp.description}</div></div>))}</div></div>}
            {education.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">Education</div><div className="space-y-4">{education.map(edu => (<div key={edu.id}><div className="text-sm font-semibold text-gray-700">{edu.school}</div><div className="text-xs text-gray-400">{edu.degree} · {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div></div>))}</div></div>}
            {skills.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Skills</div><div className="flex flex-wrap gap-3">{skills.map(s => (<span key={s.id} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded">{s.name}</span>))}</div></div>}
            {projects.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">Projects</div><div className="space-y-4">{projects.map(proj => (<div key={proj.id}><div className="text-sm font-semibold text-gray-700">{proj.title}</div>{proj.link && <div className="text-xs text-gray-400">{proj.link}</div>}<div className="text-sm text-gray-500 whitespace-pre-wrap mt-1">{proj.description}</div></div>))}</div></div>}
            {certifications.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Certifications</div><div className="space-y-2">{certifications.map(c => (<div key={c.id} className="text-sm text-gray-500"><span className="font-semibold">{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? `, ${c.date}` : ''}</div>))}</div></div>}
            {achievements.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Achievements</div><div className="space-y-3">{achievements.map(a => (<div key={a.id}><div className="text-sm font-semibold text-gray-700">{a.title}</div><div className="text-sm text-gray-500 whitespace-pre-wrap">{a.description}</div></div>))}</div></div>}
            {languages.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Languages</div><div className="flex flex-wrap gap-3">{languages.map(l => (<span key={l.id} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded">{l.language} ({l.proficiency})</span>))}</div></div>}
            {links.length > 0 && <div><div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Links</div><div className="flex flex-wrap gap-3">{links.map(l => (<a key={l.id} href={l.url} className="text-xs text-gray-500 hover:text-gray-700">{l.label}: {l.url}</a>))}</div></div>}
        </div>
    );
};

// ── Blue Simple Professional ────────────────────────────────────────────────
const BlueCvTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-col font-sans">
            <div className="bg-blue-700 text-white px-8 py-6">
                <h1 className="text-3xl font-bold tracking-wide">{personalInfo.firstName || 'FIRST'} {personalInfo.lastName || 'LAST'}</h1>
                <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-blue-200">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>{personalInfo.phone}</span>}{personalInfo.address && <span>{personalInfo.address}</span>}</div>
            </div>
            <div className="flex flex-col space-y-5 px-8 py-6">
                {personalInfo.summary && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Profile</h2><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p></div>}
                {experience.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Experience</h2><div className="space-y-4">{experience.map(exp => (<div key={exp.id}><div className="flex justify-between"><span className="font-bold text-gray-900">{exp.position}</span><span className="text-xs text-gray-500">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span></div><div className="text-sm text-blue-600 font-semibold">{exp.company}</div><div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{exp.description}</div></div>))}</div></div>}
                {education.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Education</h2><div className="space-y-3">{education.map(edu => (<div key={edu.id} className="flex justify-between"><div><div className="font-bold text-gray-900 text-sm">{edu.school}</div><div className="text-sm text-gray-600">{edu.degree}</div></div><span className="text-xs text-gray-500">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span></div>))}</div></div>}
                {skills.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Skills</h2><div className="flex flex-wrap gap-2">{skills.map(s => (<span key={s.id} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded border border-blue-100">{s.name}</span>))}</div></div>}
                {projects.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Projects</h2><div className="space-y-3">{projects.map(proj => (<div key={proj.id}><div className="font-bold text-gray-900 text-sm">{proj.title}</div>{proj.link && <div className="text-xs text-blue-600">{proj.link}</div>}<div className="text-sm text-gray-700 whitespace-pre-wrap">{proj.description}</div></div>))}</div></div>}
                {certifications.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Certifications</h2><div className="space-y-1">{certifications.map(c => (<div key={c.id} className="flex justify-between text-sm"><span className="font-bold">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span><span className="text-gray-500">{c.date}</span></div>))}</div></div>}
                {achievements.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Achievements</h2><div className="space-y-2">{achievements.map(a => (<div key={a.id}><div className="font-bold text-sm">{a.title}</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{a.description}</div></div>))}</div></div>}
                {languages.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Languages</h2><div className="flex flex-wrap gap-2">{languages.map(l => (<span key={l.id} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded border border-blue-100">{l.language} ({l.proficiency})</span>))}</div></div>}
                {links.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-200 pb-1 mb-2">Links</h2><div className="flex flex-wrap gap-3">{links.map(l => (<a key={l.id} href={l.url} className="text-sm text-blue-600 hover:underline">{l.label}: {l.url}</a>))}</div></div>}
            </div>
        </div>
    );
};

// ── White Beige Minimalist ──────────────────────────────────────────────────
const BeigeMinimalTemplate = ({ data }: { data: ResumeData }) => {
    const { personalInfo, experience, education, skills, projects, certifications, achievements, languages, links } = data;
    return (
        <div className="flex flex-col space-y-6" style={{ fontFamily: 'Georgia, serif', color: '#3d3530', backgroundColor: '#faf8f5', padding: '40px' }}>
            <div className="text-center py-4" style={{ borderBottom: '1px solid #c8b8a2' }}>
                <h1 className="text-4xl font-bold uppercase" style={{ color: '#5c4a3a', letterSpacing: '0.12em' }}>{personalInfo.firstName || 'FIRST'} {personalInfo.lastName || 'LAST'}</h1>
                <div className="flex justify-center gap-x-3 mt-3 text-xs" style={{ color: '#9c8070' }}>{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>· {personalInfo.phone}</span>}{personalInfo.address && <span>· {personalInfo.address}</span>}</div>
            </div>
            {personalInfo.summary && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>About</h2><p className="text-sm leading-loose whitespace-pre-wrap" style={{ color: '#5c4a3a' }}>{personalInfo.summary}</p></div>}
            {experience.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Experience</h2><div className="space-y-5">{experience.map(exp => (<div key={exp.id}><div className="flex justify-between items-baseline"><span className="font-bold text-sm" style={{ color: '#3d3530' }}>{exp.position}</span><span className="text-xs" style={{ color: '#9c8070' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span></div><div className="text-sm italic mt-0.5" style={{ color: '#7a6355' }}>{exp.company}</div><div className="text-sm leading-relaxed whitespace-pre-wrap mt-1" style={{ color: '#5c4a3a' }}>{exp.description}</div></div>))}</div></div>}
            {education.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Education</h2><div className="space-y-4">{education.map(edu => (<div key={edu.id}><div className="flex justify-between items-baseline"><span className="font-bold text-sm" style={{ color: '#3d3530' }}>{edu.school}</span><span className="text-xs" style={{ color: '#9c8070' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span></div><div className="text-sm italic" style={{ color: '#7a6355' }}>{edu.degree}</div></div>))}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Skills</h2><div className="text-sm" style={{ color: '#5c4a3a' }}>{skills.map(s => s.name).join(' · ')}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Projects</h2><div className="space-y-4">{projects.map(proj => (<div key={proj.id}><div className="font-bold text-sm" style={{ color: '#3d3530' }}>{proj.title}</div>{proj.link && <div className="text-xs" style={{ color: '#9c8070' }}>{proj.link}</div>}<div className="text-sm whitespace-pre-wrap mt-1" style={{ color: '#5c4a3a' }}>{proj.description}</div></div>))}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Certifications</h2><div className="space-y-1">{certifications.map(c => (<div key={c.id} className="flex justify-between text-sm"><span className="font-bold" style={{ color: '#3d3530' }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span><span style={{ color: '#9c8070' }}>{c.date}</span></div>))}</div></div>}
            {achievements.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Achievements</h2><div className="space-y-2">{achievements.map(a => (<div key={a.id}><div className="font-bold text-sm" style={{ color: '#3d3530' }}>{a.title}</div><div className="text-sm whitespace-pre-wrap" style={{ color: '#5c4a3a' }}>{a.description}</div></div>))}</div></div>}
            {languages.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Languages</h2><div className="text-sm" style={{ color: '#5c4a3a' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</div></div>}
            {links.length > 0 && <div><h2 className="text-xs uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#9c8070', borderBottom: '1px solid #e0d5c8', paddingBottom: '4px' }}>Links</h2><div className="flex flex-wrap gap-3">{links.map(l => (<a key={l.id} href={l.url} className="text-sm hover:underline" style={{ color: '#7a6355' }}>{l.label}: {l.url}</a>))}</div></div>}
        </div>
    );
};


export function ResumePreview({ data, template = "modern" }: ResumePreviewProps) {

    const { personalInfo } = data
    const targetRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    const downloadPdf = async () => {
        if (!targetRef.current) return;
        setIsDownloading(true);

        try {
            let html2canvas;
            try {
                html2canvas = (await import("html2canvas")).default;
            } catch (e) {
                throw new Error("Failed to load html2canvas library.");
            }

            let jsPDF;
            try {
                const jspdfModule = await import("jspdf");
                // @ts-ignore
                jsPDF = jspdfModule.jsPDF || jspdfModule.default || jspdfModule;
            } catch (e) {
                throw new Error("Failed to load jspdf library.");
            }

            const element = targetRef.current;

            // Backup styles to ensure clean screenshot
            const prevBackground = element.style.backgroundColor;
            element.style.backgroundColor = "#ffffff";

            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
                onclone: (clonedDoc) => {
                    // 1. Aggressive Stylesheet Sanitization
                    // Iterate through all style tags and replace unsupported color functions via regex
                    const styleTags = clonedDoc.querySelectorAll("style");
                    styleTags.forEach((styleTag) => {
                        if (styleTag.textContent) {
                            // Regex to find lab(), oklch(), color-mix() and replace with rgb(0,0,0)
                            // This catch-all helps when html2canvas parses the stylesheets
                            const unsupportedColorRegex = /(lab|oklch|lch|color-mix|hwb)\([^)]+\)/g;
                            styleTag.textContent = styleTag.textContent.replace(unsupportedColorRegex, "rgb(0, 0, 0)");
                        }
                    });

                    // 2. Comprehensive Element Property Sanitization
                    const elements = clonedDoc.querySelectorAll("*");
                    elements.forEach((el) => {
                        if (el instanceof HTMLElement || el instanceof SVGElement) {
                            const style = window.getComputedStyle(el);

                            // Regex for detecting unsupported colors within property values
                            const unsupportedColorRegex = /(lab|oklch|lch|color-mix|hwb)\([^)]+\)/g;

                            // List of properties prone to containing colors
                            const colorProperties = [
                                "color", "backgroundColor", "borderColor", "borderTopColor",
                                "borderRightColor", "borderBottomColor", "borderLeftColor",
                                "fill", "stroke", "boxShadow", "textShadow", "outlineColor",
                                "stopColor", "floodColor", "lightingColor"
                            ];

                            colorProperties.forEach((prop) => {
                                // @ts-ignore - style[prop] is valid but TS is restrictive here
                                const val = style[prop];
                                if (val && typeof val === "string" && unsupportedColorRegex.test(val)) {
                                    const sanitizedVal = val.replace(unsupportedColorRegex, "rgb(0, 0, 0)");
                                    // Use setProperty with !important to ensure override
                                    const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
                                    el.style.setProperty(cssProp, sanitizedVal, "important");
                                }
                            });
                        }
                    });
                }
            });

            // Restore styles
            element.style.backgroundColor = prevBackground;

            const imgData = canvas.toDataURL("image/jpeg", 0.98);

            // Create standard A4 PDF (210mm x 297mm)
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate ratio to scale image down
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const imgRatio = imgWidth / imgHeight;

            let finalWidth = pdfWidth;
            let finalHeight = finalWidth / imgRatio;

            // OVERRIDE: If the scaled height is taller than 1 page, shrink it further!
            // This guarantees it prints on exactly ONE page.
            if (finalHeight > pdfHeight) {
                finalHeight = pdfHeight;
                finalWidth = finalHeight * imgRatio;
            }

            // Center image horizontally if it was squeezed
            const xOffset = (pdfWidth - finalWidth) / 2;

            pdf.addImage(imgData, "JPEG", xOffset, 0, finalWidth, finalHeight);

            const filename = `${personalInfo.firstName || "resume"}_${personalInfo.lastName || "document"}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error("PDF generation failed:", error);
            // @ts-ignore
            alert(`Download failed: ${error.message || error}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const renderTemplate = () => {
        switch (template) {
            case "corporate":
            case "professional":
                return <CorporateTemplate data={data} />;
            case "creative":
                return <CreativeTemplate data={data} />;
            case "white-modern-business":
                return <WhiteModernBusinessTemplate data={data} />;
            case "gray-marketing":
                return <GrayMarketingTemplate data={data} />;
            case "gray-clean":
                return <GrayCleanTemplate data={data} />;
            case "minimalist-grey":
                return <MinimalistGreyTemplate data={data} />;
            case "blue-cv":
                return <BlueCvTemplate data={data} />;
            case "beige-minimal":
                return <BeigeMinimalTemplate data={data} />;
            case "modern":
            default:
                return <ModernTemplate data={data} />;
        }
    }

    return (
        <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-900 border relative">
            <div className="absolute top-4 right-4 z-10 hidden lg:block">
                <Button onClick={downloadPdf} size="sm" className="shadow-md" disabled={isDownloading}>
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    {isDownloading ? "Generating PDF..." : "Download PDF"}
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
                <Button onClick={downloadPdf} className="w-full" disabled={isDownloading}>
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    {isDownloading ? "Generating PDF..." : "Download PDF"}
                </Button>
            </div>
        </div>
    )
}
