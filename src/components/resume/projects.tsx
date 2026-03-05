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
                                <Label>Project Title</Label>
                                <Input
                                    placeholder="Portfolio Website"
                                    value={project.title}
                                    onChange={(e) => updateProject(project.id, "title", e.target.value)}
                                />
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
