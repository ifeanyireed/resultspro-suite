"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { IconBookOpen as BookOpen, IconBrainCircuit as BrainCircuit, IconLayers as Layers, IconSchool as School, IconTrendingUp as TrendingUp, IconShieldCheck as ShieldCheck, IconChevronRight as ChevronRight, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-green" />,
      title: "Class Notes",
      description: "Structured lessons organized by class, subject, term, and topic."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-blue" />,
      title: "Interactive Quizzes",
      description: "Topic-based practice and CBT-style assessments to track progress."
    },
    {
      icon: <Layers className="w-6 h-6 text-amber" />,
      title: "Smart Flashcards",
      description: "Memory-boosting cards for effective revision and active recall."
    },
    {
      icon: <School className="w-6 h-6 text-green" />,
      title: "School Portals",
      description: "Dedicated dashboards for school admins, teachers, and students."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue" />,
      title: "Performance Tracking",
      description: "Detailed analytics for students and class-wide reports for teachers."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber" />,
      title: "Offline Access",
      description: "Sync your learning content and study anywhere, even without internet."
    }
  ];

  return (
    <div className="min-h-screen bg-navy overflow-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-green text-sm font-semibold mb-6">
                Revolutionizing School Learning
              </span>
              <h1 className="text-4xl md:text-7xl font-bold font-display text-white mb-6 leading-tight">
                One Ecosystem for <br />
                <span className="text-green">Academic Excellence</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Empower your school with digital class notes, interactive quizzes, and 
                smart study tools designed for modern education.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-green hover:bg-green/90 text-navy font-bold h-14 px-8 text-lg">
                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 bg-navy/50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Core Features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to manage learning content and track student performance in one place.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-6 border border-white/10 group-hover:border-green/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto bg-blue/10 rounded-3xl p-8 md:p-16 border border-blue/20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Designed for Everyone</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green flex items-center justify-center mt-1">
                      <ChevronRight className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">For Students</h4>
                      <p className="text-muted-foreground">Access your school notes, practice quizzes, and study flashcards anytime.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue flex items-center justify-center mt-1">
                      <ChevronRight className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">For Teachers</h4>
                      <p className="text-muted-foreground">Create content, assign assessments, and monitor your class progress with ease.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber flex items-center justify-center mt-1">
                      <ChevronRight className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">For Schools</h4>
                      <p className="text-muted-foreground">Manage your entire curriculum and school data in a secure, unified platform.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-navy shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-green/20 to-blue/20 flex items-center justify-center">
                    <School className="w-24 h-24 text-white opacity-20" />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-8 leading-tight">Ready to Transform Your School?</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Join hundreds of schools already using ClassroomPRO to digitize their learning materials and engage students.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-green hover:bg-green/90 text-navy font-bold h-16 px-12 text-xl rounded-2xl">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
