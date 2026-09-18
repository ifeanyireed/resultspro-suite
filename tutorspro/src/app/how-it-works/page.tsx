"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconSearch, IconCalendarEvent, IconVideo, IconTrendingUp } from '@tabler/icons-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1. Find Your Perfect Tutor",
      desc: "Browse our directory of vetted expert tutors. Filter by subject, academic level, availability, and hourly rate to find the exact match for your learning goals.",
      icon: IconSearch,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "2. Book & Schedule",
      desc: "Select a time slot that works for you from the tutor's live calendar. Securely pay for your session upfront through our integrated payment system.",
      icon: IconCalendarEvent,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "3. Join Live Classroom",
      desc: "At the scheduled time, hop into our interactive virtual classroom. Enjoy high-quality video, audio, and a collaborative whiteboard designed for effective learning.",
      icon: IconVideo,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "4. Track Your Progress",
      desc: "Review session notes, track your academic milestones, and leave feedback for your tutor to ensure you're always moving toward your goals.",
      icon: IconTrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How <span className="text-[var(--color-nets-red)]">TutorsPRO</span> Works
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your journey to academic excellence starts here. We've made it incredibly simple to connect with world-class educators and start learning immediately.
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10 transition-colors">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${step.bg} ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow ml-auto md:ml-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <a href="/tutors" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[var(--color-nets-red)] hover:bg-red-700 rounded-full shadow-lg transition-transform hover:scale-105">
            Find a Tutor Now
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
