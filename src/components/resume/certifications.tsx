"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Certification } from "@/lib/types"

interface CertificationsProps {
    data: Certification[]
    updateData: (data: Certification[]) => void
}

export function Certifications({ data, updateData }: CertificationsProps) {
    const add = () => {
        updateData([...data, { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" }])
    }
    const update = (id: string, field: keyof Certification, value: string) => {
        updateData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }
    const remove = (id: string) => updateData(data.filter((item) => item.id !== id))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Certifications</h2>
                <Button onClick={add} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <div className="space-y-4">
                {data.map((cert, index) => (
                    <div key={cert.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => remove(cert.id)}>
                            <Trash2 className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm">Certification #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Certification Name</Label>
                                <Input placeholder="AWS Cloud Practitioner" value={cert.name} onChange={(e) => update(cert.id, "name", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Issuing Organization</Label>
                                <Input placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => update(cert.id, "issuer", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Date Issued</Label>
                                <Input placeholder="Jan 2024" value={cert.date} onChange={(e) => update(cert.id, "date", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Credential URL (Optional)</Label>
                                <Input placeholder="https://credential.net/..." value={cert.url} onChange={(e) => update(cert.id, "url", e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded text-muted-foreground text-sm">
                        No certifications added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
