"use client"

import Link from "next/link";
import { ArrowRight, Bot, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("ai_resume_user");
    if (user) {
      router.replace("/templates");
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  const authHref = isLoggedIn ? "/templates" : "/login";

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
              <Link href={authHref}>
                <Button size="lg" className="px-8 h-14 rounded-none border border-primary bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_-3px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(0,243,255,0.8)]">
                  Initialize Builder <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-background relative">
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
                href: authHref,
                cta: "Execute AI",
              },
              {
                icon: FileText,
                title: "ATS-Bypass Protocols",
                desc: "Clean, structured data templates architected to pass Applicant Tracking Systems flawlessly.",
                href: "/templates",
                cta: "Access Schematics",
              },
              {
                icon: Download,
                title: "Instant Compilation",
                desc: "Compile and download your final resume matrix instantly as a perfectly formatted PDF.",
                href: authHref,
                cta: "Initiate Export",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Link href={feature.href} className="group block h-full">
                  <Card className="bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-[0_0_30px_-5px_rgba(0,243,255,0.3)] transition-all duration-500 h-full cursor-pointer relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10">
                      <feature.icon className="h-12 w-12 text-primary mb-4 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] group-hover:scale-110 transition-transform duration-500" />
                      <CardTitle className="font-bold tracking-wide uppercase">{feature.title}</CardTitle>
                      <CardDescription className="font-mono text-muted-foreground">{feature.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 mt-auto">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-primary tracking-widest uppercase group-hover:gap-4 transition-all duration-300">
                        {feature.cta} <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-card/10 relative border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl text-foreground">Operational Sequence</h2>
            <p className="mt-4 text-muted-foreground font-mono md:text-lg">Follow the protocol to generate your target artifact.</p>
          </motion.div>
          <motion.div
            className="grid gap-12 md:grid-cols-4 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Glowing connection line */}
            <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-[2px] bg-primary/20 -z-10 shadow-[0_0_10px_var(--primary)]" />

            {[
              { step: "01", title: "Input Data", desc: "Feed raw career endpoints into the system." },
              { step: "02", title: "AI Processing", desc: "Neural networks optimize and expand bullet points." },
              { step: "03", title: "Manual Override", desc: "Review and calibrate the generated matrix." },
              { step: "04", title: "Compile PDF", desc: "Export final ATS-compliant artifact." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-center text-center space-y-6 group">
                <div className="w-24 h-24 bg-background/80 backdrop-blur border border-primary/50 flex items-center justify-center text-3xl font-black text-primary shadow-[0_0_15px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] group-hover:border-primary transition-all duration-500 relative">
                  {/* Digital corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary"></div>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-mono text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
            <Link href={authHref}>
              <Button size="lg" className="px-10 h-16 rounded-none bg-primary text-primary-foreground font-black tracking-widest uppercase transition-all shadow-[0_0_20px_var(--primary)] hover:shadow-[0_0_40px_var(--primary)] hover:scale-105 border border-primary/50">
                Execute Compilation
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
