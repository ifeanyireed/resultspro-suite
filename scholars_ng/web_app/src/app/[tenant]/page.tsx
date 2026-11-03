'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useTenant } from '@/components/TenantProvider';
import { IconBook, IconBrain, IconTrophy, IconUserPlus, IconSchool, IconCheck, IconArrowRight, IconShieldCheck, IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';

export default function TenantPublicSchoolPage() {
  const { tenant } = useTenant();

  const schoolName = tenant?.name || 'Our Academy';
  const schoolMotto = (tenant as any)?.motto || 'Nurturing Academic Excellence and Moral Character';

  const academicPrograms = [
    { 
      title: 'Primary Foundation', 
      grade: 'Years 1 - 6', 
      desc: 'Early literacy, numeracy, critical inquiry, and creative foundations.',
      icon: IconBook 
    },
    { 
      title: 'Junior Secondary', 
      grade: 'JSS 1 - 3', 
      desc: 'Core NERDC curriculum, introductory sciences, arts, and foundational technology.',
      icon: IconBrain 
    },
    { 
      title: 'Senior Secondary', 
      grade: 'SSS 1 - 3', 
      desc: 'Advanced Science, Arts, and Commercial streams prepared for WAEC, NECO & JAMB.',
      icon: IconTrophy 
    },
    { 
      title: 'Digital & Future Skills', 
      grade: 'All Levels', 
      desc: 'Computer literacy, PuzzlePRO algorithmic coding, and digital research tools.',
      icon: IconUserPlus 
    },
  ];

  const highlights = [
    { title: 'Academic Excellence', subtitle: 'Consistent top-tier WAEC & NECO passes with individualized tutoring support.' },
    { title: 'Character & Discipline', subtitle: 'Grooming responsible citizens rooted in integrity, leadership, and community service.' },
    { title: 'Modern Facilities', subtitle: 'Digital smart classrooms, STEM laboratories, libraries, and secure recreational grounds.' },
    { title: 'Real-Time Parent Portal', subtitle: 'Instant continuous assessment, terminal broadsheets, and fee visibility via ResultsPRO.' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <Hero />

      {/* Academic Programs Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container-nets max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Academics at {schoolName}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              A comprehensive educational pathway.
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              From foundational early education to senior secondary diploma certificates, our curriculum prepares every student for global success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicPrograms.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={i} 
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{cat.grade}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">{cat.desc}</p>
                  </div>
                  <Link 
                    href="#admissions" 
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Admission guidelines &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us & School Pride */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="container-nets max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Why Choose {schoolName}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                {schoolMotto}
              </h2>
              <p className="text-slate-600 mt-4 text-base leading-relaxed">
                We believe that every child has unique gifts waiting to be discovered. Our dedicated faculty combines modern pedagogical technology with traditional character mentorship to produce well-rounded scholars.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                {highlights.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                      <IconCheck className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{item.subtitle}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link 
                  href="#admissions" 
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                >
                  Apply for Admission
                </Link>
                <Link 
                  href="/login" 
                  className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm transition-all"
                >
                  Portal Login
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/3]">
                <img 
                  src="/images/Students2.jpeg" 
                  alt={`${schoolName} Students in Classroom`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="text-xs uppercase tracking-widest font-semibold text-blue-300">Empowering The Next Generation</div>
                  <div className="text-xl font-bold mt-1">Admissions Open for 2026/2027 Academic Session</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Application Form Drive */}
      <section id="admissions" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
        <div className="container-nets max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
            <IconSchool className="w-4 h-4" /> Admissions Drive Now Open
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Secure Your Child's Future at {schoolName}
          </h2>
          <p className="text-slate-300 mt-4 text-base max-w-2xl mx-auto">
            Take the first step toward academic excellence. Begin your admission application online today, or visit our administration office.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 sm:p-10 mt-10 text-left shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Request Admission Information</h3>
            <p className="text-xs text-slate-300 mb-6">Our admissions team will reach out with the entrance examination schedule and fee prospectus.</p>

            <form onSubmit={(e) => { e.preventDefault(); alert("Application inquiry submitted! The admissions registrar will contact you shortly."); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parent / Guardian Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Chief & Mrs. O. Adeleke"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (WhatsApp preferred)</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+234 803 000 0000"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Class Level</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="primary">Primary (Years 1 - 6)</option>
                  <option value="jss">Junior Secondary (JSS 1 - 3)</option>
                  <option value="sss">Senior Secondary (SSS 1 - 3)</option>
                </select>
              </div>

              <div className="sm:col-span-2 mt-4">
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  Submit Admission Inquiry <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
