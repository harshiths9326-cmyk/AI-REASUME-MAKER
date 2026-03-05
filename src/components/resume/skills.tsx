"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skill as SkillType } from "@/lib/types"

interface SkillsProps {
    data: SkillType[]
    updateData: (data: SkillType[]) => void
}

export function Skills({ data, updateData }: SkillsProps) {
    const [newSkill, setNewSkill] = useState("")

    const addSkill = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkill.trim()) return

        updateData([
            ...data,
            {
                id: crypto.randomUUID(),
                name: newSkill.trim(),
            },
        ])
        setNewSkill("")
    }

    const removeSkill = (id: string) => {
        updateData(data.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Skills</h2>

            <form onSubmit={addSkill} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="skill">Add a skill</Label>
                    <Input
                        id="skill"
                        placeholder="e.g. React, Python, Project Management"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="secondary">
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
                {data.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                    >
                        {skill.name}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-sm text-muted-foreground w-full py-2">
                        No skills added. Add some skills above!
                    </div>
                )}
            </div>
        </div>
    )
}
