"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Education as EducationType } from "@/lib/types"

interface EducationProps {
    data: EducationType[]
    updateData: (data: EducationType[]) => void
}

export function Education({ data, updateData }: EducationProps) {
    const addEducation = () => {
        updateData([
            ...data,
            {
                id: crypto.randomUUID(),
                institutionName: "",
                institutionAddress: "",
                course: "",
                degree: "",
                marks: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ])
    }

    const updateEducation = (id: string, field: keyof EducationType, value: string) => {
        updateData(
            data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        )
    }

    const removeEducation = (id: string) => {
        updateData(data.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Education</h2>
                <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
            </div>

            <div className="space-y-6">
                {data.map((edu, index) => (
                    <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-4 w-4" />
                        </div>

                        <h3 className="font-semibold text-sm">Education #{index + 1}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Institution Name</Label>
                                <Input
                                    placeholder="e.g., Sri Bhagawan Mahaveer Jain College"
                                    value={edu.institutionName}
                                    onChange={(e) => updateEducation(edu.id, "institutionName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Institution Address</Label>
                                <Input
                                    placeholder="Bengaluru, Karnataka"
                                    value={edu.institutionAddress}
                                    onChange={(e) => updateEducation(edu.id, "institutionAddress", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Qualification Level</Label>
                                <Input
                                    placeholder="e.g., SSLC, PUC, B.Tech, B.Sc"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Course / Stream</Label>
                                <Input
                                    placeholder="e.g., Science (PCMB), Commerce, Computer Science"
                                    value={edu.course}
                                    onChange={(e) => updateEducation(edu.id, "course", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Marks / Percentage</Label>
                                <Input
                                    placeholder="e.g., 92%, 8.5 CGPA"
                                    value={edu.marks}
                                    onChange={(e) => updateEducation(edu.id, "marks", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    placeholder="Jun 2018"
                                    value={edu.startDate}
                                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date / Passed Out Year</Label>
                                <Input
                                    placeholder="May 2022"
                                    value={edu.endDate}
                                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Additional Info (Optional)</Label>
                                <Textarea
                                    placeholder="Achievements, extracurricular activities..."
                                    className="min-h-[80px]"
                                    value={edu.description}
                                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No education added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
