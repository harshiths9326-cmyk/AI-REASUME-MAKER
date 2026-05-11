"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Experience as ExperienceType } from "@/lib/types"

interface ExperienceProps {
    data: ExperienceType[]
    updateData: (data: ExperienceType[]) => void
}

export function Experience({ data, updateData }: ExperienceProps) {

    const addExperience = () => {
        updateData([
            ...data,
            {
                id: crypto.randomUUID(),
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ])
    }

    const updateExperience = (id: string, field: keyof ExperienceType, value: string) => {
        updateData(
            data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        )
    }

    const removeExperience = (id: string) => {
        updateData(data.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Experience</h2>
                <Button onClick={addExperience} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
            </div>

            <div className="space-y-6">
                {data.map((exp, index) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="h-4 w-4" />
                        </div>

                        <h3 className="font-semibold text-sm">Experience #{index + 1}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    placeholder="Acme Corp"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Input
                                    placeholder="Software Engineer"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    placeholder="Jan 2020"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    placeholder="Present"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Describe your responsibilities and achievements."
                                    className="min-h-[100px]"
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No work experience added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
