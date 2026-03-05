"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/lib/types"

const LINK_LABELS = ["GitHub", "LinkedIn", "Portfolio", "Twitter/X", "Behance", "Dribbble", "Other"]

interface LinksProps {
    data: Link[]
    updateData: (data: Link[]) => void
}

export function Links({ data, updateData }: LinksProps) {
    const add = () => {
        updateData([...data, { id: crypto.randomUUID(), label: "GitHub", url: "" }])
    }
    const update = (id: string, field: keyof Link, value: string) => {
        updateData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }
    const remove = (id: string) => updateData(data.filter((item) => item.id !== id))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Links</h2>
                <Button onClick={add} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                        <div className="w-36 space-y-1">
                            <Label className="text-xs text-muted-foreground">Platform</Label>
                            <select
                                className="w-full h-8 px-2 border rounded-md text-sm bg-background"
                                value={item.label}
                                onChange={(e) => update(item.id, "label", e.target.value)}
                            >
                                {LINK_LABELS.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">URL</Label>
                            <Input
                                placeholder="https://github.com/username"
                                value={item.url}
                                onChange={(e) => update(item.id, "url", e.target.value)}
                                className="h-8"
                            />
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
                        No links added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
