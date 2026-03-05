"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Achievement } from "@/lib/types"

interface AchievementsProps {
    data: Achievement[]
    updateData: (data: Achievement[]) => void
}

export function Achievements({ data, updateData }: AchievementsProps) {
    const add = () => {
        updateData([...data, { id: crypto.randomUUID(), title: "", description: "" }])
    }
    const update = (id: string, field: keyof Achievement, value: string) => {
        updateData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }
    const remove = (id: string) => updateData(data.filter((item) => item.id !== id))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Achievements</h2>
                <Button onClick={add} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => remove(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm">Achievement #{index + 1}</h3>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input placeholder="Best Performer Award 2023" value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Recognized for delivering the XYZ project ahead of schedule..."
                                className="min-h-[80px]"
                                value={item.description}
                                onChange={(e) => update(item.id, "description", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No achievements added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
