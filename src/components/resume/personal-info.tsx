"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PersonalInfo as PersonalInfoType, ResumeData } from "@/lib/types"

interface PersonalInfoProps {
    data: PersonalInfoType
    fullData?: ResumeData
    updateData: (data: PersonalInfoType) => void
}

export function PersonalInfo({ data, fullData, updateData }: PersonalInfoProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({ ...data, [e.target.name]: e.target.value })
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
                <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="jobTitle">Job Title / Role</Label>
                    <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="e.g. Senior Software Engineer"
                        value={data.jobTitle || ""}
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
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                        id="summary"
                        name="summary"
                        placeholder="Experienced software engineer with a passion for building scalable web applications."
                        className="min-h-[100px]"
                        value={data.summary}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}
