"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Language } from "@/lib/types"

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Intermediate", "Basic"]

interface LanguagesProps {
    data: Language[]
    updateData: (data: Language[]) => void
}

export function Languages({ data, updateData }: LanguagesProps) {
    const add = () => {
        updateData([...data, { id: crypto.randomUUID(), language: "", proficiency: "Fluent" }])
    }
    const update = (id: string, field: keyof Language, value: string) => {
        updateData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }
    const remove = (id: string) => updateData(data.filter((item) => item.id !== id))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Languages</h2>
                <Button onClick={add} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Language</Label>
                            <Input
                                placeholder="English"
                                value={item.language}
                                onChange={(e) => update(item.id, "language", e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Proficiency</Label>
                            <select
                                className="w-full h-8 px-2 border rounded-md text-sm bg-background"
                                value={item.proficiency}
                                onChange={(e) => update(item.id, "proficiency", e.target.value)}
                            >
                                {PROFICIENCY_LEVELS.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => remove(item.id)}
                            className="mt-5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No languages added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
