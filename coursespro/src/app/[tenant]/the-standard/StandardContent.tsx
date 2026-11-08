'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Code2, 
  Users2, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  ExternalLink, 
  GitBranch, 
  Terminal, 
  Layers, 
  Award,
  ChevronRight,
  Calculator,
  Compass,
  Cpu
} from 'lucide-react';
import { IconBrandGithub } from '@tabler/icons-react';
import { coursesApi } from '@/lib/api';

interface StandardContentProps {
  tenant: any;
  isPlatform?: boolean;
}

interface ShowcaseProject {
  id: string;
  title: string;
  student: string;
  studentRole: string;
  track: 'Engineering' | 'Design' | 'Data';
  description: string;
  stack: string[];
  demoUrl?: string;
  githubUrl?: string;
  mentorEndorsed: boolean;
}

const DEFAULT_PROJECTS: ShowcaseProject[] = [
  {
    id: 'proj-1',
    title: 'Multi-Tenant Logistics Dispatch Engine',
    student: 'Babatunde Adeleke',
    studentRole: 'Full Stack Engineering Cohort 04',
    track: 'Engineering',
    description: 'High-throughput real-time routing engine for last-mile interstate fleet logistics handling concurrent websocket telemetry.',
    stack: ['Go', 'PostgreSQL', 'Next.js 15', 'Redis', 'Docker'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mentorEndorsed: true
  },
  {
    id: 'proj-2',
    title: 'NIBSS Instant Payment Reconciliation System',
    student: 'Chiamaka Okonkwo',
    studentRole: 'Backend Systems Cohort 03',
    track: 'Engineering',
    description: 'Automated settlement and audit reconciliation microservice ingesting CSV/XML switch logs with 99.99% dispute resolution fidelity.',
    stack: ['Node.js', 'PostgreSQL', 'BullMQ', 'TailwindCSS'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mentorEndorsed: true
  },
  {
    id: 'proj-3',
    title: 'HealthPoint: Offline-First Clinic Records',
    student: 'Ibrahim Danjuma',
    studentRole: 'Product & Systems Design Cohort 02',
    track: 'Design',
    description: 'Complete UI/UX system and responsive design system tailored for sub-Saharan primary healthcare centers with intermittent bandwidth.',
    stack: ['Figma', 'Design Systems', 'React', 'IndexedDB'],
    demoUrl: 'https://github.com',
    mentorEndorsed: true
  },
  {
    id: 'proj-4',
    title: 'Credit Risk Scoring for FMCG Retailers',
    student: 'Ngozi Eze',
    studentRole: 'Data Intelligence Cohort 05',
    track: 'Data',
    description: 'Predictive creditworthiness model utilizing informal distributor transaction ledgers and mobile payment frequency.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'Streamlit'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mentorEndorsed: true
  }
];

export default function StandardContent({ tenant, isPlatform = false }: StandardContentProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<'All' | 'Engineering' | 'Design' | 'Data'>('All');
  const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseProject[]>(DEFAULT_PROJECTS);
  
  // Interactive ROI Calculator states
  const [currentIncome, setCurrentIncome] = useState<number>(350000); // ₦350k default
  const [targetTrack, setTargetTrack] = useState<'Full Stack Engineering' | 'Backend Systems' | 'Product Design' | 'Data Analytics'>('Full Stack Engineering');

  useEffect(() => {
    // Attempt to pull real published portfolios from backend showcase
    const fetchShowcase = async () => {
      try {
        const res = await coursesApi.get('/api/public/showcase', {
          headers: {
            'x-tenant': tenant?.id || 'default_platform'
          }
        });
        if (res.data?.showcase && Array.isArray(res.data.showcase) && res.data.showcase.length > 0) {
          const mapped: ShowcaseProject[] = res.data.showcase.map((p: any) => ({
            id: p.id,
            title: p.headline || `${p.full_name}'s Capstone Work`,
            student: p.full_name || p.username,
            studentRole: 'Alumni Fellow',
            track: 'Engineering',
            description: p.bio || 'Verified cohort project delivered and graded against production standards.',
            stack: p.skills_json ? JSON.parse(p.skills_json).slice(0, 5) : ['Full Stack', 'Cloud'],
            demoUrl: `/portfolio/${p.username}`,
            mentorEndorsed: !!p.mentor_endorsement
          }));
          setShowcaseProjects([...mapped, ...DEFAULT_PROJECTS]);
        }
      } catch (e) {
        // Fall back cleanly to curated projects
      }
    };
    fetchShowcase();
  }, [tenant]);

  // Stage definitions for Act 2 (Methodology)
  const stages = [
    {
      num: '01',
      title: 'Async Deep Work & Tactical Sprints',
      tagline: 'High-density curriculum without fluff',
      description: 'Learners tackle modular, real-world task blocks designed around real workplace requirements. No 40-hour passive video marathons. You read production code, solve architectural puzzles, and submit PRs.',
      deliverable: 'Tested modular code blocks submitted through the CoursesPRO student workspace',
      sla: 'Continuous automated syntax & lint checks',
      icon: Terminal,
      highlight: 'Forced Hands-on Friction'
    },
    {
      num: '02',
      title: 'Live Battle-Testing (Office Hours)',
      tagline: 'Interactive debugging with senior staff',
      description: 'Mentors do not deliver dry slideshows. Live sessions inside our Daily.co classroom are reserved for architectural teardowns, pair debugging, and cross-examining implementation decisions.',
      deliverable: 'Live code dissection and real-time architectural QA',
      sla: 'Twice-weekly scheduled mentor deep-dives',
      icon: Users2,
      highlight: 'No Slides, Only Terminals'
    },
    {
      num: '03',
      title: 'Mutual Peer Review Loops',
      tagline: 'You learn by reviewing other engineers',
      description: 'In modern engineering, 50% of your job is reviewing colleagues’ PRs. In CoursesPRO, a student must thoroughly review two peer submissions before their own stage checkpoint unlocks.',
      deliverable: '2 constructive peer code reviews with inline rubrics',
      sla: 'Compulsory peer-pairing matching mechanism',
      icon: Layers,
      highlight: 'Simulated Engineering Team'
    },
    {
      num: '04',
      title: 'Capstone Defense & Mentor SLA',
      tagline: 'Rigorous grading with a 48-Hour SLA',
      description: 'Final modules require deploying a live, production-grade application defended in an oral presentation. Mentors are bound by a strict SLA to return detailed, actionable feedback within 48 hours.',
      deliverable: 'Production deployment + public GitHub repository + live demo',
      sla: 'Guaranteed 48-hour mentor rubric feedback turnaround',
      icon: Award,
      highlight: 'Production Proof of Work'
    }
  ];

  const filteredProjects = selectedTrack === 'All' 
    ? showcaseProjects 
    : showcaseProjects.filter(p => p.track === selectedTrack);

  // Simple ROI estimation multiplier based on industry benchmarks
  const trackMultipliers: Record<string, number> = {
    'Full Stack Engineering': 2.9,
    'Backend Systems': 3.2,
    'Product Design': 2.4,
    'Data Analytics': 2.7
  };
  const projectedIncome = Math.round(currentIncome * (trackMultipliers[targetTrack] || 2.8));
  const upliftNaira = projectedIncome - currentIncome;

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <Navbar 
        tenantName={tenant?.name} 
        tenantLogo={tenant?.logo_url} 
        darkLogoUrl={tenant?.dark_logo_url} 
        flattenLogo={tenant?.flatten_logo}
        contactEmail={tenant?.contact_email} 
        contactPhone={tenant?.contact_phone} 
        contactLocation={tenant?.full_address} 
      />

      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden pb-20 lg:pb-28 bg-[#0B1021] text-white"
        style={{ marginTop: '-72px', paddingTop: 'calc(72px + 5rem)' }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/15 blur-[160px] pointer-events-none" />
        
        <div className="container-nets relative z-10 mx-auto px-4 max-w-6xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The {tenant?.name || 'CoursesPRO'} Standard</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mb-8">
            We Don’t Sell Video Playlists.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-400">
              We Engineer Practitioners.
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-2xl font-normal leading-relaxed max-w-3xl mb-12">
            A transparent breakdown of our anti-lecture manifesto, learning operating system, verifiable graduate outcomes, and public proof-of-work.
          </p>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <a href="#manifesto" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 transition-colors">
              <span className="text-blue-400">01</span>
              <span>The Manifesto</span>
            </a>
            <a href="#methodology" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 transition-colors">
              <span className="text-blue-400">02</span>
              <span>The Methodology</span>
            </a>
            <a href="#outcomes" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 transition-colors">
              <span className="text-blue-400">03</span>
              <span>Verified Outcomes</span>
            </a>
            <a href="#showcase" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 transition-colors">
              <span className="text-blue-400">04</span>
              <span>Proof-of-Work Showcase</span>
            </a>
          </div>
        </div>
      </section>

      {/* ACT 1: THE MANIFESTO */}
      <section id="manifesto" className="py-24 bg-white border-b border-slate-100">
        <div className="container-nets mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Act 01 · The Conviction</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              The Anti-Lecture Manifesto.
            </h2>
            <p className="text-slate-500 text-lg mt-4 leading-relaxed">
              Why the traditional online education industry fails 95% of its students, and the principles we refuse to compromise on.
            </p>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* The Broken MOOC Model */}
            <div className="rounded-3xl p-8 sm:p-10 bg-rose-50/50 border border-rose-100 relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The Broken Tutorial Trap</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Passive Video Consumption", desc: "Students binge 60 hours of recorded videos on 1.5x speed, developing the dangerous illusion of mastery without ever touching terminal errors." },
                  { title: "95% Industry Dropout Rate", desc: "No scheduled accountability, no real deadlines, and zero human friction mean self-paced students disappear by week 3." },
                  { title: "Multiple-Choice Quizzes", desc: "Clicking radio buttons on simplified multiple-choice questions tests shallow trivia, not the ability to debug asynchronous race conditions." },
                  { title: "Decorative PDF Certificates", desc: "Credentials that prove attendance rather than production capability, which technical hiring leads completely ignore." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-slate-700">
                    <span className="text-rose-500 font-bold shrink-0 mt-1">✕</span>
                    <div>
                      <strong className="block text-slate-900 font-semibold">{item.title}</strong>
                      <span className="text-sm text-slate-600">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* The CoursesPRO Cohort Standard */}
            <div className="rounded-3xl p-8 sm:p-10 bg-blue-50/60 border border-blue-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The {tenant?.name || 'CoursesPRO'} Standard</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Forced Hands-On Sprints", desc: "You do not graduate by watching. You submit real pull requests, configure databases, and build features that pass automated and human checks." },
                  { title: "Cohort Synchronicity & Accountability", desc: "You move with an active peer group. Strict weekly milestones and live standups ensure you remain engaged through the finish line." },
                  { title: "Mandatory Peer Code Reviews", desc: "Reviewing code is half of an engineer's job. You must thoroughly critique two classmates' PRs before submitting your own." },
                  { title: "Verifiable Public Proof-of-Work", desc: "Graduates walk away with live URLs, verifiable portfolio repositories, and mentor endorsements recognized by hiring partners." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-slate-800">
                    <span className="text-blue-600 font-bold shrink-0 mt-1">✓</span>
                    <div>
                      <strong className="block text-slate-900 font-semibold">{item.title}</strong>
                      <span className="text-sm text-slate-600">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3 Core Tenets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Tenet 01</span>
              <h4 className="text-xl font-bold text-slate-900 mt-2 mb-2">Friction Is Growth</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                If the task doesn't force you into documentation, error logs, and stack traces, it hasn't taught you anything durable.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Tenet 02</span>
              <h4 className="text-xl font-bold text-slate-900 mt-2 mb-2">Mentors Over Lecturers</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We hire active industry practitioners, not academics. They don't read slides; they review your PRs and challenge your logic.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Tenet 03</span>
              <h4 className="text-xl font-bold text-slate-900 mt-2 mb-2">Proof Over Promises</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                No recruiter cares what you studied. They care what you shipped, how you handled trade-offs, and how cleanly your code is tested.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 2: THE METHODOLOGY */}
      <section id="methodology" className="py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="container-nets mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Act 02 · The Learning Engine</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              The 4-Stage Learning Loop.
            </h2>
            <p className="text-slate-500 text-lg mt-4 leading-relaxed">
              How every week inside our cohorts is structured to guarantee mastery through repetitive cycles of shipping and feedback.
            </p>
          </div>

          {/* Interactive Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.num}
                  onClick={() => setActiveStage(idx)}
                  className={`p-5 rounded-2xl text-left border transition-all ${
                    isActive 
                      ? 'bg-white border-blue-600 shadow-md shadow-blue-500/5 ring-2 ring-blue-600/20' 
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {stage.num}
                    </span>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm leading-snug">{stage.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Phase {stages[activeStage].num}</span>
                <span>•</span>
                <span>{stages[activeStage].highlight}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                {stages[activeStage].title}
              </h3>
              <p className="text-blue-600 font-medium text-base mb-6">
                {stages[activeStage].tagline}
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {stages[activeStage].description}
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="font-semibold text-slate-900 min-w-[120px]">What You Submit:</div>
                  <div className="text-slate-600">{stages[activeStage].deliverable}</div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="font-semibold text-slate-900 min-w-[120px]">Quality Standard:</div>
                  <div className="text-slate-600">{stages[activeStage].sla}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B1021] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden font-mono text-xs">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-white/10 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[10px]">coursespro-engine-v2.sh</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className="text-emerald-400">$ coursespro test-rubric --stage={stages[activeStage].num}</p>
                <p className="text-slate-400">» Inspecting student submission...</p>
                <p className="text-blue-400">✓ Code linters & static analysis: PASSED</p>
                <p className="text-blue-400">✓ 2 Required Peer Reviews: CONFIRMED</p>
                <p className="text-purple-400">» Dispatching to Assigned Senior Mentor...</p>
                <p className="text-yellow-400">★ Mentor SLA Countdown: 48h 00m active</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 font-sans flex items-center justify-between">
                <span>Verified by CoursesPRO ERP</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 3: VERIFIED OUTCOMES */}
      <section id="outcomes" className="py-24 bg-white border-b border-slate-100">
        <div className="container-nets mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Act 03 · Verifiable Metrics</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              The Wall of Outcomes.
            </h2>
            <p className="text-slate-500 text-lg mt-4 leading-relaxed">
              We measure our curriculum by who gets hired, how fast work is graded, and real salary acceleration across the ecosystem.
            </p>
          </div>

          {/* 4 Big Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
              <div className="text-4xl sm:text-6xl font-extrabold text-blue-600 tracking-tight">88%</div>
              <div className="font-semibold text-slate-900 mt-2 text-base">Graduation Rate</div>
              <p className="text-xs text-slate-500 mt-1">vs. 5% industry average for self-paced courses</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
              <div className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">48h</div>
              <div className="font-semibold text-slate-900 mt-2 text-base">Mentor Feedback SLA</div>
              <p className="text-xs text-slate-500 mt-1">Guaranteed code review turnaround window</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
              <div className="text-4xl sm:text-6xl font-extrabold text-emerald-600 tracking-tight">3.2x</div>
              <div className="font-semibold text-slate-900 mt-2 text-base">Average Comp Uplift</div>
              <p className="text-xs text-slate-500 mt-1">Reported by alumni 6 months post-graduation</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
              <div className="text-4xl sm:text-6xl font-extrabold text-indigo-600 tracking-tight">140+</div>
              <div className="font-semibold text-slate-900 mt-2 text-base">Active Institutions</div>
              <p className="text-xs text-slate-500 mt-1">Training partners & hiring network orgs</p>
            </div>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden mb-16">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center space-x-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4" />
                <span>Interactive Career ROI Estimator</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Calculate Your Compensation Acceleration
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Based on historical alumni placements across West African and international technology teams.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Target Specialization Track
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Full Stack Engineering', 'Backend Systems', 'Product Design', 'Data Analytics'] as const).map(track => (
                      <button
                        key={track}
                        onClick={() => setTargetTrack(track)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                          targetTrack === track 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Current Monthly Earnings
                    </label>
                    <span className="text-blue-400 font-bold text-base">
                      ₦{currentIncome.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={1200000}
                    step={25000}
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>₦100k</span>
                    <span>₦500k</span>
                    <span>₦1.2M+</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center lg:text-left">
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1">
                  Estimated Post-Cohort Earnings
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight mb-2">
                  ₦{projectedIncome.toLocaleString()} <span className="text-sm font-normal text-slate-300">/ mo</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+₦{upliftNaira.toLocaleString()} Monthly Difference</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Most candidates recoup their cohort tuition within the first 45–60 days in their new placement.
                </p>
              </div>
            </div>
          </div>

          {/* Hiring Partners Logo Bar */}
          <div>
            <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
              Where Our Alumni & Fellows Shipped Production Systems
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-lg sm:text-xl">
              <span>Paystack</span>
              <span>Flutterwave</span>
              <span>Moniepoint</span>
              <span>Interswitch</span>
              <span>Piggyvest</span>
              <span>Kuda Bank</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 4: PROOF-OF-WORK SHOWCASE */}
      <section id="showcase" className="py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="container-nets mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Act 04 · Real Proof</div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Inspect What Students Shipped.
              </h2>
              <p className="text-slate-500 text-lg mt-3">
                No mockups or theoretical wireframes. Real repositories, live deployments, and mentor-vetted deliverables.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mt-6 md:mt-0 flex-wrap">
              {(['All', 'Engineering', 'Design', 'Data'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTrack(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedTrack === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Showcase Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                      {project.track}
                    </span>
                    {project.mentorEndorsed && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mentor Approved</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{project.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.stack.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[11px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{project.student}</div>
                      <div className="text-[11px] text-slate-400">{project.studentRole}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Repository"
                        >
                          <IconBrandGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CLIMAX CTA */}
      <section className="py-24 bg-[#0B1021] text-white text-center relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none" />
        <div className="container-nets mx-auto px-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-6">
            <span>The Choice Is Yours</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Stop Watching Tutorials.<br />Start Shipping Production Software.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Join the next synchronized cohort at {tenant?.name || 'CoursesPRO'}, or apply to lead upcoming sessions as a recognized industry mentor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/cohorts" 
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg shadow-blue-600/25 transition-all group"
            >
              <span>Explore Active Cohorts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/apply/mentor" 
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all"
            >
              <span>Become an Instructor</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer 
        tenantName={tenant?.name} 
        tenantLogo={tenant?.logo_url} 
        darkLogoUrl={tenant?.dark_logo_url} 
        flattenLogo={tenant?.flatten_logo}
        contactEmail={tenant?.contact_email} 
        contactPhone={tenant?.contact_phone} 
        contactLocation={tenant?.full_address} 
      />
    </div>
  );
}
