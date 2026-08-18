"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Users, Target, CheckCircle2, Award, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Vetted Excellence",
      desc: "Every tutor undergoes a rigorous 5-step vetting process, including background checks and mock teaching sessions.",
      icon: ShieldCheck,
      color: "text-green",
      bg: "bg-green/10"
    },
    {
      title: "Student-First",
      desc: "We prioritize learning outcomes over profit. Our platform is designed to make education accessible and effective.",
      icon: Target,
      color: "text-blue",
      bg: "bg-blue/10"
    },
    {
      title: "Collaborative Community",
      desc: "Building a global network where tutors, students, and parents work together for academic success.",
      icon: Users,
      color: "text-amber",
      bg: "bg-amber/10"
    }
  ];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green/10 via-navy to-navy pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-[10px] font-black text-green mb-6 uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 fill-current" />
                Our Mission
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-8">
                Empowering the Next <br />
                <span className="text-green">Generation of Leaders</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-10">
                TutorsPro is more than just a marketplace. We are a technology-driven education platform dedicated to connecting students with the world&apos;s most talented educators.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-black text-white">How It Works</h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Find Your Match", text: "Browse our directory of verified experts based on subject, level, and rating." },
                  { step: "02", title: "Book & Pay", text: "Schedule a session at your convenience with secure automated payments." },
                  { step: "03", title: "Learn & Grow", text: "Join the live interactive classroom with whiteboard, video, and resource sharing." },
                  { step: "04", title: "Track Progress", text: "Receive detailed performance reports and feedback after every lesson." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-3xl font-display font-black text-white/10 group-hover:text-green/40 transition-colors">{item.step}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-10 bg-green/20 blur-[100px] rounded-full opacity-30 -z-10" />
              <div className="p-8 md:p-12 rounded-[48px] bg-white/[0.03] border border-white/[0.1] border-t-white/[0.15] backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                   <Award className="w-64 h-64 text-green" />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-6">Vetting Standards</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  We maintain the highest standards in the industry. Less than 5% of applicants are approved to teach on TutorsPro.
                </p>
                <ul className="space-y-4">
                  {[
                    "Identity & Criminal Record Verification",
                    "Academic Credential Validation",
                    "Subject Matter Competency Exams",
                    "Professional Pedagogy Assessment",
                    "Continuous Performance Monitoring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-white/[0.01] border-y border-white/5 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">Core Values</h2>
              <p className="text-gray-500">The principles that drive every decision we make.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6`}>
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
