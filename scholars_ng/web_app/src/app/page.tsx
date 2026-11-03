'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  IconSchool, 
  IconChartBar, 
  IconBookOpen, 
  IconUsers, 
  IconPuzzle, 
  IconCheck, 
  IconArrowRight, 
  IconSearch, 
  IconShieldCheck, 
  IconDeviceLaptop,
  IconCertificate,
  IconBolt,
  IconSparkles,
  IconBuilding
} from '@tabler/icons-react';

export default function ScholarsNgCommercialLandingPage() {
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'parent' | 'student'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const sampleSchools = [
    { name: 'Greenwood High', slug: 'greenwood-high', lga: 'Owerri, Imo State' },
    { name: 'Skill Up Academy', slug: 'skillupacademy', lga: 'Lagos Island, Lagos State' },
    { name: 'Mock School Academy', slug: 'mock-school', lga: 'Abuja FCT' },
  ];

  const filteredSchools = sampleSchools.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const specialistApps = [
    {
      id: 'resultspro',
      title: 'ResultsPRO',
      badge: 'Academic Records',
      color: 'from-blue-600 to-indigo-700',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: IconChartBar,
      desc: 'Complete examination results processing, continuous assessment, broadsheets, and cryptographic scratch cards.',
      features: ['Automated CA1/CA2 computation', 'Tamper-proof scratch card PINs', 'Instant PDF report card batch export']
    },
    {
      id: 'classroompro',
      title: 'ClassroomPRO',
      badge: 'Curriculum & LMS',
      color: 'from-emerald-600 to-teal-700',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: IconBookOpen,
      desc: 'NERDC curriculum-aligned offline lesson handouts, interactive quizzes, and spaced-repetition (SRS) flashcards.',
      features: ['Full Nigerian secondary syllabus', 'Spaced repetition flashcards (SRS)', 'Offline-capable student mobile app']
    },
    {
      id: 'tutorspro',
      title: 'TutorsPRO',
      badge: '1-on-1 Mentorship',
      color: 'from-violet-600 to-purple-700',
      tagColor: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: IconUsers,
      desc: 'Direct-to-school tutoring marketplace connecting vetted subject educators with learners for targeted remedial classes.',
      features: ['Curriculum-matched vetted educators', 'Interactive virtual whiteboard room', 'Parent post-session progress notes']
    },
    {
      id: 'puzzlepro',
      title: 'PuzzlePRO',
      badge: 'Gamified Coding',
      color: 'from-amber-500 to-orange-600',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: IconPuzzle,
      desc: '636 gamified coding adventures teaching HTML, CSS, JavaScript, and Python logic through algorithmic puzzles.',
      features: ['636 progressive coding quests', 'Drag-and-drop Blockly IDE', 'Classroom leaderboards and badges']
    }
  ];

  const rolePreviews = {
    admin: {
      title: 'School Owners & Principals',
      subtitle: 'Complete institutional oversight across exams, teachers, fees, and admissions.',
      bullets: [
        'Real-time enrollment, class size, and revenue telemetry',
        'Batch generation and encryption of parent scratch card access codes',
        'Custom domain setup (e.g. portal.yourschool.edu.ng) with zero server maintenance',
        'Granular RBAC role assignment across teachers, bursars, and mentors'
      ],
      tagline: 'Run your entire school ecosystem from a single command center.'
    },
    teacher: {
      title: 'Classroom Teachers',
      subtitle: 'Frictionless mark entry, continuous assessment, and lesson handouts.',
      bullets: [
        'Rapid score sheets and automatic position ranking computation',
        'Curriculum-aligned lesson handouts ready for classroom projection',
        'Automated formative quizzes with instant grading feedback',
        'Form master remark generator and psychomotor domain rating grids'
      ],
      tagline: 'Cut administrative grading time by 80% and focus on teaching.'
    },
    parent: {
      title: 'Parents & Guardians',
      subtitle: 'Instant academic transparency, attendance alerts, and tuition settlement.',
      bullets: [
        'Instant terminal report card lookup with single scratch card PIN',
        'Subject mastery analytics and term-over-term progress trajectories',
        'Direct messaging with class teachers and curriculum mentors',
        'Secure school fees and activity payments via Paystack'
      ],
      tagline: 'Stay intimately connected with your child’s academic journey.'
    },
    student: {
      title: 'Learners & Students',
      subtitle: 'Personalized study hub, digital handouts, and coding adventures.',
      bullets: [
        'Access 24/7 digital lesson notes and practice quizzes offline',
        'Spaced repetition flashcards that reinforce weak subjects',
        'Solve 636 coding adventures in PuzzlePRO to unlock skill badges',
        'Check examination results and achievements safely'
      ],
      tagline: 'Transform everyday study into an engaging adventure.'
    }
  };

  const pricingTiers = [
    {
      name: 'FREE',
      price: '₦0',
      period: '/month',
      desc: 'Essential result checking for small schools and tutoring centres.',
      students: 'Up to 50 active students',
      features: [
        'Basic ResultsPRO gradebook',
        'Standard scratch card checker',
        'Subdomain (school.scholars.ng)',
        'Community email support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'STARTER',
      price: '₦15,000',
      period: '/month',
      desc: 'Perfect for growing primary and junior secondary academies.',
      students: 'Up to 250 active students',
      features: [
        'ResultsPRO automated CA & broadsheets',
        'Basic ClassroomPRO curriculum notes',
        'Custom school crest & brand theme',
        'Teacher & parent SMS notifications',
        'Priority email & ticket support'
      ],
      cta: 'Deploy Starter Portal',
      popular: false
    },
    {
      name: 'PRO',
      price: '₦35,000',
      period: '/month',
      desc: 'The complete institutional powerhouse for modern secondary schools.',
      students: 'Up to 1,000 active students',
      features: [
        'All 4 Specialist Apps enabled',
        'ResultsPRO + ClassroomPRO + TutorsPRO + PuzzlePRO',
        'Custom domain support (portal.school.com)',
        'Batch PDF report card export & signatures',
        '24/7 WhatsApp and phone priority support'
      ],
      cta: 'Deploy Pro Campus',
      popular: true
    },
    {
      name: 'ENTERPRISE',
      price: '₦80,000',
      period: '/month',
      desc: 'Multi-campus institutions, diocese networks, and state councils.',
      students: 'Unlimited students & campuses',
      features: [
        'Multi-campus central governance',
        'White-label mobile application (iOS & Android)',
        'Dedicated server compute and custom SLA',
        'Full historical data migration assistance',
        'Dedicated technical account manager'
      ],
      cta: 'Contact Enterprise Team',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* ── Top Navigation Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <IconSchool className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">Scholars<span className="text-indigo-400">NG</span></span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Digital Campus OS
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#apps" className="hover:text-white transition-colors">Specialist Apps</a>
            <a href="#roles" className="hover:text-white transition-colors">Portals</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
            >
              <IconSearch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Find School Portal</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              <IconSearch className="w-5 h-5" />
            </button>
            <Link 
              href="#pricing"
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Deploy School Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Search School Modal ── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <IconSearch className="w-5 h-5 text-indigo-400" /> Find Your School's Portal
              </h3>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                ESC
              </button>
            </div>

            <div className="mt-4">
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type your school name or subdomain (e.g. Greenwood)..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {filteredSchools.map((school, i) => (
                <a 
                  key={i}
                  href={`https://${school.slug}.scholars.ng`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 transition-colors group"
                >
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                      {school.name}
                    </div>
                    <div className="text-xs text-slate-400">{school.lga} &bull; {school.slug}.scholars.ng</div>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </a>
              ))}
              {filteredSchools.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No institution found for "{searchQuery}". Try another keyword or deploy a new portal.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8">
          <IconSparkles className="w-4 h-4 text-indigo-400" />
          The Unified African School Infrastructure
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          The Digital Campus <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            Operating System
          </span> for Schools & Families.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          ScholarsNG integrates the 4 specialist education powerhouses—<strong className="text-white">ResultsPRO</strong>, <strong className="text-white">ClassroomPRO</strong>, <strong className="text-white">TutorsPRO</strong>, and <strong className="text-white">PuzzlePRO</strong>—into a single white-labeled institutional workspace under your school’s own domain.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link 
            href="#pricing"
            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            Deploy School Portal <IconArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <IconSearch className="w-4 h-4 text-indigo-400" /> Find Your School Portal
          </button>
        </div>

        {/* ── Key Metrics ── */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800 pt-10 text-left">
          <div>
            <div className="text-3xl font-black text-white">99.8%</div>
            <div className="text-xs text-slate-400 mt-1">Computation Broadsheet Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">4-in-1</div>
            <div className="text-xs text-slate-400 mt-1">Specialist Apps in Single Login</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">636</div>
            <div className="text-xs text-slate-400 mt-1">Gamified Coding Adventures</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">0 DNS</div>
            <div className="text-xs text-slate-400 mt-1">Zero-Config Instant Subdomains</div>
          </div>
        </div>
      </section>

      {/* ── The 4 Specialist Applications Showcase ── */}
      <section id="apps" className="py-24 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              The Engine
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              Four Independent Powerhouses. One Cohesive Workspace.
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Unlike rigid all-in-one monoliths, ScholarsNG orchestrates four dedicated, industry-leading applications into a unified lateral experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialistApps.map((app) => {
              const Icon = app.icon;
              return (
                <div 
                  key={app.id} 
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-7 h-7 stroke-[2]" />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${app.tagColor}`}>
                        {app.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white tracking-tight">{app.title}</h3>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{app.desc}</p>

                    <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-6">
                      {app.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                          <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                      Included with Scholars Workspace <IconArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Role Previews (The Horizontal Subtabs Feel) ── */}
      <section id="roles" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Role Workspaces
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              Tailored Experiences for Every Stakeholder
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Each user type experiences a focused, distraction-free horizontal subtabs interface configured specifically for their day-to-day responsibilities.
            </p>
          </div>

          {/* Role Navigation Bar */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-950 p-1.5 rounded-full border border-slate-800 flex space-x-1 overflow-x-auto max-w-full">
              {(['admin', 'teacher', 'parent', 'student'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    activeRole === role 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'admin' ? 'School Owners' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Role Card Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Portal View</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">{rolePreviews[activeRole].title}</h3>
                <p className="text-slate-400 text-sm mt-1">{rolePreviews[activeRole].subtitle}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Single Sidebar + Horizontal Subtabs
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {rolePreviews[activeRole].bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed font-medium">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{rolePreviews[activeRole].tagline}</span>
              <Link href="#pricing" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                Explore Demo &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Section ── */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              Predictable Investment for Your Institution
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Transparent per-school subscription tiers powered by Paystack. Scale seamlessly as student enrollment expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.popular 
                    ? 'bg-gradient-to-b from-indigo-900/50 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 -translate-y-2' 
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{tier.name}</div>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400">{tier.period}</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-400 mb-2">{tier.students}</div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{tier.desc}</p>

                  <div className="space-y-3 border-t border-slate-800/80 pt-6">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <button 
                    onClick={() => alert(`Starting enrollment for ${tier.name} tier. Proceeding to institutional deployment.`)}
                    className={`w-full py-3 rounded-full text-xs font-bold transition-all ${
                      tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-slate-850 py-16 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-4">
              <IconSchool className="w-5 h-5 text-indigo-400" /> ScholarsNG
            </div>
            <p className="leading-relaxed text-slate-500">
              The Digital Campus Operating System for modern African schools, educators, families, and learners.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Specialist Apps</h4>
            <ul className="space-y-2">
              <li><Link href="https://resultspro.ng" className="hover:text-white transition-colors">ResultsPRO Examination Portal</Link></li>
              <li><Link href="https://classroompro.ng" className="hover:text-white transition-colors">ClassroomPRO Curriculum LMS</Link></li>
              <li><Link href="https://tutorspro.ng" className="hover:text-white transition-colors">TutorsPRO 1-on-1 Mentorship</Link></li>
              <li><Link href="https://puzzlepro.ng" className="hover:text-white transition-colors">PuzzlePRO Coding Adventures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#apps" className="hover:text-white transition-colors">Architecture Overview</a></li>
              <li><a href="#roles" className="hover:text-white transition-colors">Role Dashboards</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Subscription Plans</a></li>
              <li><button onClick={() => setIsSearchOpen(true)} className="hover:text-white transition-colors text-left">Find School Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Governance & Security</h4>
            <p className="text-slate-500 leading-relaxed mb-4">
              Wildcard TLS SSL encryption on all subdomains. Automated daily database backups via Neon Postgres.
            </p>
            <div className="text-[11px] text-slate-600">
              &copy; {new Date().getFullYear()} ScholarsNG by ResultsPro Suite. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
