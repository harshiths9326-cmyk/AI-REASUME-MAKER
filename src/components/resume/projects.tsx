"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Project as ProjectType } from "@/lib/types"

interface ProjectsProps {
    data: ProjectType[]
    updateData: (data: ProjectType[]) => void
}

export function Projects({ data, updateData }: ProjectsProps) {
    const addProject = () => {
        updateData([
            ...data,
            {
                id: crypto.randomUUID(),
                title: "",
                link: "",
                description: "",
            },
        ])
    }

    const updateProject = (id: string, field: keyof ProjectType, value: string) => {
        updateData(
            data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        )
    }

    const removeProject = (id: string) => {
        updateData(data.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Projects</h2>
                <Button onClick={addProject} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Project
                </Button>
            </div>

            <div className="space-y-6">
                {data.map((project, index) => (
                    <div key={project.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => removeProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                        </div>

                        <h3 className="font-semibold text-sm">Project #{index + 1}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex justify-between">
                                    <span>Project Title</span>
                                    <span className={`text-[10px] ${project.title.length > 100 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                        {project.title.length}/100
                                    </span>
                                </Label>
                                <Input
                                    placeholder="portfolio-website"
                                    value={project.title}
                                    onChange={(e) => {
                                        let val = e.target.value.toLowerCase();

                                        // Length limit
                                        if (val.length > 100) val = val.substring(0, 100);

                                        // Character validation: allow letters, digits, '.', '_', '-'
                                        // Note: We don't block typing yet, but we can show an error or filter
                                        // The user said "can include...", implying others should be excluded.
                                        // Let's filter out characters that are NOT allowed.
                                        val = val.replace(/[^a-z0-9._-]/g, "");

                                        // Cannot contain '---'
                                        while (val.includes("---")) {
                                            val = val.replace("---", "--"); // Reduce triple dashes to double
                                        }

                                        updateProject(project.id, "title", val);
                                    }}
                                    className={project.title.length >= 100 ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                    Lowercase, max 100 chars. Allowed: a-z, 0-9, ., _, -. No "---".
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Project Link / URL (Optional)</Label>
                                <Input
                                    placeholder="github.com/johndoe/project"
                                    value={project.link}
                                    onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Built a full-stack application using..."
                                    className="min-h-[100px]"
                                    value={project.description}
                                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No projects added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
