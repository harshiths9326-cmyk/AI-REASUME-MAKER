"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skill } from "@/lib/types"

interface SkillsProps {
    data: Skill[]
    updateData: (data: Skill[]) => void
}

export function Skills({ data, updateData }: SkillsProps) {
    const addSkill = () => {
        updateData([
            ...data,
            {
                id: crypto.randomUUID(),
                name: "",
            },
        ])
    }

    const updateSkill = (id: string, value: string) => {
        updateData(
            data.map((item) => (item.id === id ? { ...item, name: value } : item))
        )
    }

    const removeSkill = (id: string) => {
        updateData(data.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Skills</h2>
                <Button onClick={addSkill} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
            </div>

            <div className="flex flex-wrap gap-3">
                {data.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-2 bg-muted border rounded-full px-3 py-1"
                    >
                        <Input
                            className="border-none bg-transparent h-auto p-0 text-sm w-28 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="e.g. React"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, e.target.value)}
                        />
                        <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center w-full p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No skills added yet. Click &quot;Add Skill&quot; to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
