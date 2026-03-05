"use client"

import Link from "next/link";
import { ArrowRight, Bot, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center space-y-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Build a professional resume with <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">AI precision</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create ATS-friendly, tailored resumes in minutes. Let our AI handle the writing while you focus on landing the job.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/builder">
                <Button size="lg" className="px-8 h-12 rounded-full font-semibold transition-transform hover:scale-105">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-muted/50 border-y">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Why choose ProResume AI?</h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Everything you need to create a standout resume, powered by cutting-edge artificial intelligence.
            </p>
          </motion.div>
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              { icon: Bot, title: "AI-Powered Writing", desc: "Generate professional bullet points and summaries based on your raw input." },
              { icon: FileText, title: "ATS-Friendly Designs", desc: "Clean, modern templates designed to pass Applicant Tracking Systems flawlessly." },
              { icon: Download, title: "One-Click PDF Export", desc: "Download your polished resume instantly as a perfectly formatted PDF." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="bg-background/60 backdrop-blur border-none shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">Four simple steps to your next job opportunity.</p>
          </motion.div>
          <motion.div
            className="grid gap-8 sm:gap-12 md:grid-cols-4 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-muted-foreground/20 -z-10" />

            {[
              { step: "1", title: "Fill Details", desc: "Enter your basic info, education, and raw experience." },
              { step: "2", title: "Let AI Enhance", desc: "Our AI generates professional bullet points for your experience." },
              { step: "3", title: "Review & Edit", desc: "Review the generated content and make any final tweaks." },
              { step: "4", title: "Export PDF", desc: "Download your ATS-ready resume and start applying!" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-2xl font-bold text-primary shadow-lg transition-transform hover:scale-110">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-primary text-primary-foreground">
        <motion.div
          className="container mx-auto px-4 md:px-6 max-w-4xl text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Ready to build your resume?</h2>
          <p className="text-primary-foreground/80 md:text-xl">
            Join thousands of job seekers who landed their dream jobs using ProResume AI.
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary" className="px-8 h-12 rounded-full font-bold text-primary transition-transform hover:scale-105 hover:bg-secondary/90">
              Create My Resume Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
