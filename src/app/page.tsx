"use client"

import Link from "next/link";
import { ArrowRight, Bot, FileText, Download, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { OperationalSequence } from "@/components/home/operational-sequence";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [returningUser, setReturningUser] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("ai_resume_user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (typeof window !== 'undefined') {
      const isReturning = localStorage.getItem("ai_resume_returning_user") === "true";
      setReturningUser(isReturning);
    }
  }, []);

  const authHref = isLoggedIn ? "/templates" : "/signup";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };


  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background relative overflow-hidden flex items-center justify-center border-b border-primary/20">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-glow" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[100px] -z-10 animate-glow" style={{ animationDelay: '1s' }} />

        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block mb-4 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                Next-Gen Resume AI
              </div>
              <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                ENGINEER YOUR <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                  FUTURISTIC RESUME
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-mono">
                Leverage advanced AI algorithms to generate ATS-optimized, high-converting resumes in milliseconds.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Link href={authHref} passHref>
                <Button asChild size="lg" className="px-8 h-14 rounded-none border border-primary bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_-3px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(0,243,255,0.8)]">
                  <span>Initialize Builder <ArrowRight className="ml-2 h-5 w-5" /></span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl md:text-5xl text-foreground">System Capabilities</h2>
            <div className="h-1 w-24 bg-primary mx-auto mt-6 rounded shadow-[0_0_10px_var(--primary)]"></div>
          </motion.div>
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Bot,
                title: "Neural Network Content",
                desc: "Generate highly optimized professional bullet points based on minimal raw input data.",
                href: "/tools/bullet-generator",
                cta: "Execute AI",
              },
              {
                icon: FileText,
                title: "ATS-Bypass Protocols",
                desc: "Clean, structured data templates architected to pass Applicant Tracking Systems flawlessly.",
                href: "/tools/ats-scanner",
                cta: "Access Schematics",
              },
              {
                icon: Download,
                title: "Instant Compilation",
                desc: "Compile and download your final resume matrix instantly as a perfectly formatted PDF.",
                href: "/builder",
                cta: "Initiate Export",
              },
            ].map((feature, idx) => {
              const isLocked = !isLoggedIn;
              const cardHref = isLocked ? "/signup" : feature.href;

              return (
                <motion.div key={idx} variants={fadeIn}>
                  <Link href={cardHref} className="group block h-full">
                    <Card className={cn(
                      "bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 shadow-lg transition-all duration-500 h-full cursor-pointer relative overflow-hidden group",
                      !isLocked && "hover:shadow-[0_0_30px_-5px_rgba(0,243,255,0.3)]",
                      isLocked && "grayscale-[0.5] opacity-80"
                    )}>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {isLocked && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-2 rounded-full shadow-lg">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}

                      <CardHeader className="relative z-10">
                        <feature.icon className={cn(
                          "h-12 w-12 text-primary mb-4 transition-transform duration-500",
                          !isLocked && "drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] group-hover:scale-110"
                        )} />
                        <CardTitle className="font-bold tracking-wide uppercase flex items-center gap-2">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="font-mono text-muted-foreground">{feature.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10 mt-auto">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary tracking-widest uppercase group-hover:gap-4 transition-all duration-300">
                          {isLocked ? (returningUser ? "Sign In to Access" : "Sign Up to Access") : feature.cta} <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {!isLoggedIn && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/signup">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 h-auto text-lg font-bold tracking-widest uppercase">
                  {returningUser ? "Sign In to Unlock Pro Tools" : "Sign Up to Unlock Pro Tools"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Operational Sequence Section */}
      <OperationalSequence />

      {/* CTA Section */}
      <section className="w-full py-24 bg-background relative border-t border-primary/30 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 blur-[80px] -z-10 animate-glow" />

        <motion.div
          className="container mx-auto px-4 md:px-6 max-w-4xl text-center space-y-8 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">System Ready for Initialization</h2>
          <p className="text-muted-foreground font-mono md:text-xl max-w-2xl mx-auto">
            Join thousands of optimized candidates who bypassed the ATS filters using our platform.
          </p>
          <div className="pt-4">
            <Link href={authHref} passHref>
              <Button asChild size="lg" className="px-10 h-16 rounded-none bg-primary text-primary-foreground font-black tracking-widest uppercase transition-all shadow-[0_0_20px_var(--primary)] hover:shadow-[0_0_40px_var(--primary)] hover:scale-105 border border-primary/50">
                <span>Execute Compilation</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
