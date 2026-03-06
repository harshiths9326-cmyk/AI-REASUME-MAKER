"use client"

import { useState } from "react"
import { Check, Layout, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const templates = [
    {
        id: "modern",
        name: "Modern AI",
        image: "/templates/modern.png",
    },
    {
        id: "corporate",
        name: "Corporate Standard",
        image: "/templates/corporate.png",
    },
    {
        id: "creative",
        name: "Portfolio Creative",
        image: "/templates/creative.png",
    },
    {
        id: "minimalist-grey",
        name: "Black White Minimalist",
        image: "/templates/minimalist.png",
    },
    {
        id: "white-modern-business",
        name: "Business Graduate",
        image: "/templates/business.png",
    },
    {
        id: "gray-clean",
        name: "Science & Engineering",
        image: "/templates/science.png",
    },
    {
        id: "blue-cv",
        name: "Simple Professional",
        image: "/templates/professional.png",
    },
    {
        id: "gray-marketing",
        name: "Gray & White Clean",
        image: "/templates/gray.png",
    },
    {
        id: "beige-minimal",
        name: "Business Real Estate",
        image: "/templates/beige.png",
    }
];

interface TemplateSwitcherProps {
    currentTemplate: string;
    onSelect: (id: string) => void;
}

export function TemplateSwitcher({ currentTemplate, onSelect }: TemplateSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsOpen(true)}>
                <Layout className="h-4 w-4" />
                Change Template
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="relative w-full max-w-[400px] h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="text-xl font-bold">Switch Template</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select a new look. Your content is safe.
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
                            <div className="grid grid-cols-1 gap-6">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className={cn(
                                            "group relative cursor-pointer rounded-xl border-2 p-1.5 transition-all duration-300",
                                            currentTemplate === template.id
                                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                : "border-border hover:border-primary/50"
                                        )}
                                        onClick={() => {
                                            onSelect(template.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        <div className="aspect-[1.414/2] overflow-hidden rounded-lg bg-muted relative">
                                            <img
                                                src={template.image}
                                                alt={template.name}
                                                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {currentTemplate === template.id && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-xl ring-4 ring-white/20">
                                                        <Check className="h-6 w-6 stroke-[3px]" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3 flex items-center justify-between px-2">
                                            <span className={cn(
                                                "text-sm font-bold truncate",
                                                currentTemplate === template.id ? "text-primary" : "text-foreground"
                                            )}>
                                                {template.name}
                                            </span>
                                            {currentTemplate === template.id && (
                                                <span className="text-[10px] uppercase font-black text-primary tracking-tighter">Current</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
