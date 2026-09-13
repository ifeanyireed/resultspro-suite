"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconShieldCheck as ShieldCheck, IconUsers as Users, IconTarget as Target, IconCircleCheck as CheckCircle2, IconAward as Award, IconBolt as Zap } from '@tabler/icons-react';

export default function AboutPage() {
  const values = [
    {
      title: "Vetted Excellence",
      desc: "Every tutor undergoes a rigorous 5-step vetting process, including background checks and mock teaching sessions.",
      icon: ShieldCheck,
      color: "var(--primary)",
      bg: "bg-nets-light"
    },
    {
      title: "Student-First",
      desc: "We prioritize learning outcomes over profit. Our platform is designed to make education accessible and effective.",
      icon: Target,
      color: "var(--color-blue)",
      bg: "bg-nets-light"
    },
    {
      title: "Collaborative Community",
      desc: "Building a global network where tutors, students, and parents work together for academic success.",
      icon: Users,
      color: "var(--color-amber)",
      bg: "bg-nets-light"
    }
  ];

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl mx-auto">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Mission</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Empowering the Next <br /><span style={{ fontWeight: 700, color: 'var(--primary)' }}>Generation of Leaders.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              TutorsPro is more than just a marketplace. We are a technology-driven education platform dedicated to connecting students with the world&apos;s most talented educators.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="overline" style={{ marginBottom: '1rem' }}>How It Works</div>
              <h2 className="text-d4 fw-400 text-navy mb-12">The TutorsPro <span style={{ fontWeight: 700 }}>Process</span></h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Find Your Match", text: "Browse our directory of verified experts based on subject, level, and rating." },
                  { step: "02", title: "Book & Pay", text: "Schedule a session at your convenience with secure automated payments." },
                  { step: "03", title: "Learn & Grow", text: "Join the live interactive classroom with whiteboard, video, and resource sharing." },
                  { step: "04", title: "Track Progress", text: "Receive detailed performance reports and feedback after every lesson." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-3xl fw-700 text-muted group-hover:text-navy transition-colors">{item.step}</div>
                    <div>
                      <h3 className="text-xl fw-700 text-navy mb-2">{item.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="p-8 md:p-12 rounded-sm bg-light border border-nets-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                   <Award size={240} className="text-navy" />
                </div>
                <h3 className="text-2xl fw-700 text-navy mb-6">Vetting Standards</h3>
                <p className="text-muted mb-8 leading-relaxed">
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
                    <li key={i} className="flex items-center gap-3 text-sm text-navy fw-500">
                      <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-py bg-light border-b border-nets-border">
        <div className="container-nets">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="overline" style={{ marginBottom: '1rem' }}>Core Values</div>
            <h2 className="text-d4 fw-400 text-navy mb-4">The principles that <span style={{ fontWeight: 700 }}>drive us.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="p-8 rounded-sm bg-white border border-nets-border shadow-sm hover:shadow-card-lg transition-all">
                <div className="mb-6">
                  <value.icon size={48} style={{ color: value.color }} />
                </div>
                <h3 className="text-2xl fw-700 text-navy mb-3">{value.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
