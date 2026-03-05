"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const templates = [
    {
        id: "modern",
        name: "Modern AI",
        description: "Clean, ATS-friendly design perfect for tech and creative roles.",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
        popular: true,
    },
    {
        id: "professional",
        name: "Corporate Standard",
        description: "Traditional layout optimized for finance, law, and corporate fields.",
        image: "https://images.unsplash.com/photo-1626125345510-4603468eed2a?w=800&q=80",
        popular: false,
    },
    {
        id: "creative",
        name: "Portfolio Creative",
        description: "Stand out with bold typography and a unique two-column structure.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        popular: false,
    }
];

export default function TemplatesPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl min-h-[calc(100vh-4rem)]">
            <div className="text-center mb-16 space-y-4">
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Choose Your Template
                </motion.h1>
                <motion.p
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Select a starting design for your resume. You can easily export this design to PDF once your content is generated.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {templates.map((template) => (
                    <motion.div key={template.id} variants={item} className="h-full">
                        <Card className="h-full flex flex-col overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl group relative">
                            {template.popular && (
                                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="relative aspect-[1/1.2] overflow-hidden bg-muted p-4">
                                {/* Template Preview Image Placeholder using Unsplash */}
                                <div className="w-full h-full bg-background rounded shadow-md overflow-hidden relative border">
                                    <img
                                        src={template.image}
                                        alt={`${template.name} preview`}
                                        className="object-cover w-full h-full opacity-90 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Hover UI overlay */}
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                    <div className="text-center space-y-4">
                                        <h3 className="text-2xl font-bold tracking-tight">{template.name}</h3>
                                        <Link href={`/builder?template=${template.id}`}>
                                            <Button size="lg" className="w-full mt-4 rounded-full shadow-lg">
                                                Use Template <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="flex-none pt-6 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    {template.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">
                                    {template.description}
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> ATS Optimized</li>
                                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> AI Writing Support</li>
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-4 border-t bg-muted/20">
                                <Link href={`/builder?template=${template.id}`} className="w-full">
                                    <Button variant="outline" className="w-full font-bold">
                                        Select & Continue
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
