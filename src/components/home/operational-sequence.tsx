"use client"

import { motion } from "framer-motion"
import { ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Step {
    step: string
    title: string
    desc: string
    href: string
}

const steps: Step[] = [
    { step: "01", title: "Input Data", desc: "Feed raw career endpoints into the system.", href: "/builder" },
    { step: "02", title: "AI Processing", desc: "Neural networks optimize and expand bullet points.", href: "/tools/bullet-generator" },
    { step: "03", title: "Manual Override", desc: "Review and calibrate the generated matrix.", href: "/builder" },
    { step: "04", title: "Compile PDF", desc: "Export final ATS-compliant artifact.", href: "/builder" }
]

export function OperationalSequence() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const user = sessionStorage.getItem("ai_resume_user")
        setIsLoggedIn(!!user)
    }, [])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    return (
        <section className="w-full py-24 bg-card/10 relative border-t border-border/50 overflow-hidden">
            {/* Background HUD Accents */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.8 }}
                    variants={fadeIn}
                >
                    <div className="inline-block mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
                        System Protocol v4.0
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl text-foreground">Operational Sequence</h2>
                    <p className="mt-4 text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
                        Execute the following sequence to synchronize your professional data with our neural optimization engine.
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-12 md:grid-cols-4 relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {/* Glowing connection line (Desktop) */}
                    <div className="hidden md:block absolute top-[48px] left-[12.5%] w-[75%] h-[2px] bg-primary/10 -z-10 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                        <motion.div
                            className="absolute inset-0 bg-primary shadow-[0_0_20px_var(--primary)]"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Glowing connection line (Mobile) */}
                    <div className="md:hidden absolute top-[48px] left-[48px] w-[2px] h-[calc(100%-96px)] bg-primary/10 -z-10">
                        <motion.div
                            className="absolute inset-0 bg-primary shadow-[0_0_20px_var(--primary)]"
                            initial={{ height: "0%" }}
                            whileInView={{ height: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {steps.map((item, i) => {
                        const cardHref = !isLoggedIn ? "/login" : item.href
                        return (
                            <motion.div key={i} variants={fadeIn} className="relative">
                                <Link
                                    href={cardHref}
                                    className="flex flex-col items-center md:items-center text-center group cursor-pointer"
                                >
                                    <div className="relative mb-6">
                                        {/* Outer Pulse */}
                                        <div className="absolute inset-0 rounded-lg bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                                        {/* Box */}
                                        <div className="w-24 h-24 bg-background/80 backdrop-blur-md border border-primary/40 flex items-center justify-center text-3xl font-black text-primary shadow-[0_0_20px_rgba(0,243,255,0.15)] group-hover:shadow-[0_0_35px_rgba(0,243,255,0.5)] group-hover:border-primary transition-all duration-500 relative z-10 overflow-hidden">
                                            {/* Corner Accents */}
                                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60 group-hover:border-primary transition-colors"></div>
                                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60 group-hover:border-primary transition-colors"></div>
                                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60 group-hover:border-primary transition-colors"></div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60 group-hover:border-primary transition-colors"></div>

                                            {/* Scanline Effect */}
                                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,243,255,0.05)_50%)] bg-[size:100%_4px] pointer-events-none"></div>

                                            {item.step}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold uppercase tracking-widest group-hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2">
                                            {item.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </h3>
                                        <p className="text-muted-foreground font-mono text-xs leading-relaxed max-w-[200px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Link Indicator */}
                                    <div className="mt-4 overflow-hidden h-px w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 opacity-50"></div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Mobile Unlock Indicator */}
                {!isLoggedIn && (
                    <motion.div
                        className="mt-16 flex justify-center md:hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/login" className="flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 rounded font-mono text-[10px] uppercase tracking-widest text-primary animate-pulse">
                            <Lock className="h-3 w-3" /> System Restricted - Authentication Required
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
