"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { IconShieldCheck, IconTarget, IconUsers, IconBook, IconBrain, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />

      {/* Navy Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: "var(--color-nets-navy-dark)", paddingTop: "10rem", paddingBottom: "6rem", marginTop: "-72px" }}
      >
        <div aria-hidden className="absolute inset-0 z-0 opacity-20">
          <img src="/photo07.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,16,96,0.96) 0%, rgba(13,16,96,0.82) 55%, rgba(13,16,96,0.6) 100%)",
          }}
        />
        <div className="container-nets relative z-10">
          <MotionRise className="max-w-3xl">
            <div className="overline-dark" style={{ marginBottom: "1.25rem" }}>Our Mission &amp; Story</div>
            <h1 className="fw-300 text-white" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Empowering Modern <br />
              <span style={{ fontWeight: 700, color: "var(--color-nets-red)" }}>African Classrooms.</span>
            </h1>
            <p className="text-body-lg" style={{ color: "rgba(255,255,255,0.78)" }}>
              ClassroomPRO is a school-focused learning management platform built to bridge the gap between traditional classroom instruction and modern digital tools—online and offline.
            </p>
          </MotionRise>
        </div>
      </section>

      {/* White Section: Vision & Story Split */}
      <section className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionRise>
              <div className="overline" style={{ marginBottom: "1rem" }}>Built for Resilience</div>
              <h2 className="text-d3 fw-300 text-navy mb-6">
                Bridging the Digital Divide <strong className="fw-700">Permanently.</strong>
              </h2>
              <p className="text-body-lg text-muted mb-8 leading-relaxed">
                Our mission is to empower schools, teachers, and students with structured curriculum notes, interactive quizzes, and smart flashcards that work seamlessly across every device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { title: "Curriculum Aligned", desc: "NERDC, WAEC, NECO & IGCSE structured modules", icon: IconBook },
                  { title: "Offline-First Sync", desc: "Download notes & practice without internet", icon: IconBrain },
                  { title: "Automated Mastery", desc: "Instant grading and spaced-repetition flashcards", icon: IconTrophy },
                  { title: "School-Wide Visibility", desc: "Connected portals for Principals, Teachers & Parents", icon: IconUsers },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-nets-light border border-gray-200 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6" style={{ color: "var(--color-nets-red)" }} />
                    </div>
                    <div>
                      <h4 className="fw-600 text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/pricing" className="btn btn-navy">View School Plans</Link>
                <Link href="/contact" className="btn btn-red">Book a School Demo</Link>
              </div>
            </MotionRise>

            <MotionRise delay={0.12} className="relative">
              <img
                src="/photo05.jpeg"
                alt="Students learning in ClassroomPRO digital lab"
                className="rounded-sm shadow-card-lg w-full h-auto object-cover"
              />
            </MotionRise>
          </div>
        </div>
      </section>

      {/* Light Gray Section: Core Pillars with 3D Pixar Cards */}
      <section className="section-py bg-light border-b border-gray-200">
        <div className="container-nets">
          <MotionRise className="text-center max-w-2xl mx-auto mb-16">
            <div className="overline justify-center" style={{ marginBottom: "0.75rem" }}>Core Principles</div>
            <h2 className="text-d4 fw-400 text-gray-900 mb-4">Why Schools Trust ClassroomPRO</h2>
            <p className="text-muted text-body-lg">
              Designed alongside Nigerian principals, department heads, and classroom teachers.
            </p>
          </MotionRise>

          <MotionStagger className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Vision",
                desc: "We envision a world where every student has access to organized, high-quality learning materials that help them master their curriculum and excel academically.",
                image: "/photo06.jpeg",
                icon: IconTarget,
                badge: "Academic Excellence",
              },
              {
                title: "Our Mission",
                desc: "To provide a seamless, integrated ecosystem for content creation, study, and assessment that works reliably for both online and offline environments.",
                image: "/photo13.jpeg",
                icon: IconShieldCheck,
                badge: "Universal Access",
              },
              {
                title: "Our Community",
                desc: "Connecting teachers, students, and parents with real-time progress insights so no learner ever falls behind during the academic term.",
                image: "/photo02.jpeg",
                icon: IconUsers,
                badge: "Connected Campus",
              },
            ].map((card, idx) => (
              <MotionRise key={idx} delay={idx * 0.08} className="card bg-white overflow-hidden flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(13, 16, 96, 0.9)",
                      color: "var(--color-nets-red)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "2px",
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl fw-600 text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </MotionRise>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Navy CTA Banner */}
      <section className="section-py bg-navy text-white text-center" style={{ background: "var(--color-nets-navy-dark)" }}>
        <MotionRise className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Ready to transform your classrooms?</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Join hundreds of forward-thinking schools managing their curriculum, notes, and assessments on ClassroomPRO.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-red btn-lg">Request a Demo</Link>
            <Link href="/pricing" className="btn btn-outline-white btn-lg">Explore Pricing</Link>
          </div>
        </MotionRise>
      </section>

      <Footer />
    </main>
  );
}
