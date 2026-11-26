import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MobileAppSection from '@/components/MobileAppSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { 
  IconChartBar, 
  IconBook2, 
  IconUsers, 
  IconPuzzle, 
  IconBuildingCommunity,
  IconCheck, 
  IconSchool, 
  IconShieldCheck, 
  IconCertificate, 
  IconBolt 
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  const specialistApps = [
    {
      id: 'campuspro',
      title: 'CampusPRO',
      badge: 'System of Record ERP',
      icon: IconBuildingCommunity,
      desc: '20-module institutional ERP owning Multi-Campus Setup, Sessions/Terms, Classes, Manage Teachers, Manage Students, Manage Parents, Attendance, Bursary & All Messaging.',
      features: ['Single System of Record for rosters & classes', 'Bursary invoicing, HR payroll & biometric gates', 'Unified school messaging, notices & circulars'],
      href: '/admin/campus-os'
    },
    {
      id: 'classroompro',
      title: 'ClassroomPRO',
      badge: 'NERDC Learning Hub',
      icon: IconBook2,
      desc: 'Offline-first NERDC Markdown lesson notes, AI storybooks, linked YouTube video lessons, SRS flashcards, CBT quizzes, and traceable CA score sync to CampusPRO.',
      features: ['Markdown notes, AI stories & YouTube lessons', 'Spaced-repetition (SRS) flashcards & CBT quizzes', 'Teacher-approved CA score sync to CampusPRO'],
      href: '/classroom'
    },
    {
      id: 'resultspro',
      title: 'ResultsPRO',
      badge: 'AI Result Intelligence',
      icon: IconChartBar,
      desc: 'AI handwritten marksheet OCR & voice score entry, pre-publication AI result auditing, deterministic broadsheets, AI report card comments, and the AI Results Officer.',
      features: ['Handwritten marksheet OCR & roster matching', 'Pre-publication AI Result Auditor & AI Officer', 'Parent AI Interpreter → ClassroomPRO remedial loop'],
      href: '/results'
    },
    {
      id: 'tutorspro',
      title: 'TutorsPRO',
      badge: '1-on-1 Mentorship',
      icon: IconUsers,
      desc: 'Vetted 1-on-1 educator discovery, calendar availability & session booking, live video classroom with interactive digital whiteboard, and automated tutor payouts.',
      features: ['Vetted NERDC, WAEC & IGCSE subject mentors', 'Live video classroom & collaborative whiteboard', 'Session progress tracking & tutor payouts'],
      href: '/tutors'
    },
    {
      id: 'puzzlepro',
      title: 'PuzzlePRO',
      badge: '636 Coding Quests',
      icon: IconPuzzle,
      desc: '636 progressive coding & robotics adventures across 6 worlds in Blockly, HTML, CSS, JavaScript & Python—consuming CampusPRO class cohorts read-only.',
      features: ['636 progressive coding quests (Worlds 1–6)', 'One-click World assignment to CampusPRO classes', 'Algorithmic badges & school XP leaderboards'],
      href: '/future-skills'
    }
  ];

  const whyFeatures = [
    {
      title: 'Zero-Config Subdomains',
      desc: 'Deploy instantly under your school name (e.g. greenwood.scholars.ng) or bring your own custom domain.',
      icon: IconSchool,
    },
    {
      title: 'Unified Student Identity',
      desc: 'A single credentials set gives students, parents, and teachers synchronized access across all five applications.',
      icon: IconCertificate,
    },
    {
      title: 'Cryptographic Auditing',
      desc: 'Batch generation and cryptographic encryption of scratch cards prevents grade alteration and tampering.',
      icon: IconShieldCheck,
    },
    {
      title: 'Paystack Settlement',
      desc: 'Automated tuition, scratch card PIN, and excursion payments settled directly into the institution’s bank account.',
      icon: IconBolt,
    },
  ];

  const roleWorkspaces = [
    {
      role: 'School Owners & Principals',
      badge: 'Multi-Campus Command',
      desc: 'Centralized ERP governance in CampusPRO paired with ResultsPRO multi-campus performance intelligence and the AI Results-Processing Officer.',
      bullets: [
        'Multi-campus isolation (e.g. Ikeja, Lekki, Abuja)',
        'AI Results-Processing Officer & conversational queries',
        'NERDC curriculum coverage & content moderation',
        'Bursary invoicing, HR payroll & unified messaging'
      ]
    },
    {
      role: 'Classroom Teachers',
      badge: 'AI-Assisted Teaching',
      desc: 'Author NERDC lessons, link YouTube video lectures, approve CA score pushes to CampusPRO, and digitize handwritten marksheets with AI OCR.',
      bullets: [
        'Handwritten marksheet OCR & voice score entry',
        'Pre-submission AI Result Auditor & 4-tone AI remarks',
        'NERDC Markdown notes, AI stories & YouTube links',
        'Traceable CA score approval sync to CampusPRO'
      ]
    },
    {
      role: 'Parents & Guardians',
      badge: 'Home-School Loop',
      desc: 'Receive plain-language AI result interpretations, trigger 1-click ClassroomPRO remedial packs, and manage all fees and teacher chats in CampusPRO.',
      bullets: [
        'AI Result Interpreter with plain-language guidance',
        '1-click ClassroomPRO remedial revision packs',
        'Unified teacher messaging & bursary in CampusPRO',
        '1-on-1 TutorsPRO bookings & PuzzlePRO coding tracker'
      ]
    },
    {
      role: 'Learners & Students',
      badge: 'Multi-Modal Mastery',
      desc: 'An inspiring digital campus equipped with offline Markdown notes, linked YouTube video lessons, SRS flashcards, practice quizzes, and 636 coding quests.',
      bullets: [
        'NERDC Markdown notes, AI stories & YouTube lessons',
        'Spaced-repetition (SRS) flashcards & practice CBT',
        'Targeted remedial revision loops from ResultsPRO',
        '636 PuzzlePRO coding quests across 6 worlds'
      ]
    }
  ];

  return (
    <main>
      <Navbar />
      <Hero />

      {/* ── Specialist Applications (The Engine) ── */}
      <section id="apps" className="section-py bg-light">
        <div className="container-nets">
          <MotionRise style={{ marginBottom: '4rem', maxWidth: '720px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>The Engine</div>
            <h2 className="text-d4 fw-400">Five Independent Powerhouses. One Cohesive Workspace.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Unlike rigid all-in-one monoliths, ScholarsNG orchestrates five dedicated, industry-leading applications—ResultsPRO, ClassroomPRO, TutorsPRO, PuzzlePRO, and CampusPRO—into a unified lateral experience under your school’s own domain.
            </p>
          </MotionRise>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {specialistApps.map((app, appIdx) => {
              const Icon = app.icon;
              return (
                <MotionRise key={app.id} delay={appIdx * 0.08} className="card p-8 flex flex-col justify-between">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                      </div>
                      <span style={{ 
                        fontSize: '0.6875rem', 
                        fontWeight: 700, 
                        letterSpacing: '0.06em', 
                        textTransform: 'uppercase', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '2px', 
                        background: 'rgba(251, 188, 4, 0.12)', 
                        color: '#0D1060' 
                      }}>
                        {app.badge}
                      </span>
                    </div>

                    <h3 className="text-xl fw-600 mb-2">{app.title}</h3>
                    <p className="text-muted text-sm mb-6 leading-relaxed">{app.desc}</p>

                    <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-6">
                      {app.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                          <IconCheck className="w-4 h-4 text-green-600 shrink-0" strokeWidth={2.5} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={app.href} className="nav-link text-navy fw-600" style={{ color: 'var(--color-nets-navy)' }}>
                    Explore {app.title} &rarr;
                  </Link>
                </MotionRise>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why ScholarsNG (Institutional Governance) ── */}
      <section id="why-us" className="section-py bg-white border-y border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionRise>
              <div className="overline" style={{ marginBottom: '1rem' }}>Institutional Power</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Institutional Excellence.</h2>
              <p className="text-body-lg text-muted mb-8 leading-relaxed">
                ScholarsNG provides the single command center for Nigerian schools, colleges, and academies. Unify examination processing, curriculum handouts, remedial tutoring, and student identity under zero-maintenance cloud infrastructure.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {whyFeatures.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <MotionRise key={i} delay={i * 0.08} className="flex gap-4">
                      <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                      </div>
                      <div>
                        <h4 className="fw-600 mb-1">{item.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </MotionRise>
                  );
                })}
              </div>

              <Link href="#pricing" className="btn btn-navy">Deploy Your School Portal</Link>
            </MotionRise>
            
            <MotionRise delay={0.15} className="relative">
              <img 
                src="/photo05.jpeg" 
                alt="Students learning in computer lab" 
                className="rounded-sm shadow-card-lg" 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </MotionRise>
          </div>
        </div>
      </section>

      {/* ── Role Workspaces ── */}
      <section id="roles" className="section-py bg-light">
        <div className="container-nets">
          <MotionRise style={{ marginBottom: '4rem', maxWidth: '700px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Role Workspaces</div>
            <h2 className="text-d4 fw-400">Tailored Experiences for Every Stakeholder.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Each role experiences a focused, distraction-free horizontal subtabs interface configured specifically for their daily tasks.
            </p>
          </MotionRise>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleWorkspaces.map((rw, idx) => (
              <MotionRise key={idx} delay={idx * 0.08} className="card p-8 flex flex-col justify-between">
                <div>
                  <span style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: 700, 
                    letterSpacing: '0.06em', 
                    textTransform: 'uppercase', 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '2px', 
                    background: 'rgba(26, 31, 168, 0.08)', 
                    color: 'var(--color-nets-navy)',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    {rw.badge}
                  </span>

                  <h3 className="text-lg fw-600 mb-2">{rw.role}</h3>
                  <p className="text-muted text-xs mb-6 leading-relaxed">{rw.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    {rw.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-muted">
                        <IconCheck className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <Link href="/school/login" className="nav-link text-navy text-xs fw-600" style={{ color: 'var(--color-nets-navy)' }}>
                    Access Workspace &rarr;
                  </Link>
                </div>
              </MotionRise>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assigned Campus Mobile App ── */}
      <MobileAppSection />

      {/* ── Term-Aligned Pricing & Bursary ROI Calculator ── */}
      <PricingSection />

      {/* ── CTA Banner ── */}
      <section className="section-py bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <MotionRise className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Accelerate Your Institution Today</h2>
          <p className="text-body-lg text-muted-light mb-10 leading-relaxed">
            Deploy your school&apos;s digital campus in under 5 minutes with zero technical overhead. Connect your administrators, teachers, parents, and students on a unified platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#pricing" className="btn btn-red btn-lg">Deploy School Portal</Link>
            <Link href="/school/login" className="btn btn-outline-white btn-lg">Sign In to Portal</Link>
          </div>
        </MotionRise>
      </section>

      <Footer />
    </main>
  );
}
