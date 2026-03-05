"use client"

import { useState } from "react"
import { Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PersonalInfo as PersonalInfoType } from "@/lib/types"

interface PersonalInfoProps {
    data: PersonalInfoType
    updateData: (data: PersonalInfoType) => void
}

export function PersonalInfo({ data, updateData }: PersonalInfoProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({ ...data, [e.target.name]: e.target.value })
    }

    const generateSummary = async () => {
        const promptContext = `
            Name: ${data.firstName} ${data.lastName}
            Current Role/Target: ${data.summary || "Professional"}
            Background: ${data.summary}
        `

        try {
            setIsGenerating(true)
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: promptContext,
                    type: "summary",
                }),
            })

            const result = await response.json()

            if (response.ok && result.text) {
                updateData({ ...data, summary: result.text })
            } else {
                throw new Error(result.error || "Failed to generate summary")
            }
        } catch (error) {
            console.error("Error generating summary:", error)
            alert("Failed to generate summary using AI. Please ensure you have configured your OPENAI_API_KEY.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={data.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={data.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={data.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={data.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="address">Address (City, State)</Label>
                    <Input
                        id="address"
                        name="address"
                        placeholder="San Francisco, CA"
                        value={data.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        name="linkedin"
                        placeholder="linkedin.com/in/johndoe"
                        value={data.linkedin}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website / Portfolio URL</Label>
                    <Input
                        id="website"
                        name="website"
                        placeholder="johndoe.com"
                        value={data.website}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={generateSummary}
                            disabled={isGenerating}
                            type="button"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Bot className="h-4 w-4 mr-2" />
                            )}
                            Generate with AI
                        </Button>
                    </div>
                    <Textarea
                        id="summary"
                        name="summary"
                        placeholder="Experienced software engineer with a passion for building scalable web applications. You can write brief notes and use 'Generate with AI'."
                        className="min-h-[100px]"
                        value={data.summary}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}
