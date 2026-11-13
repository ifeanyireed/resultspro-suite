'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useTenant } from '@/components/TenantProvider';
import { useLandingConfig } from '@/lib/landingConfig';
import {
  IconBrain,
  IconTrophy,
  IconSchool,
  IconArrowRight,
  IconBellRinging,
  IconCalendarEvent,
  IconPin,
  IconDeviceLaptop,
  IconHeartHandshake,
  IconUsers,
  IconCheck,
  IconClock,
  IconMapPin,
  IconLockAccess
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  const { tenant } = useTenant();
  const { config } = useLandingConfig();
  const schoolName = tenant?.name || config.schoolName || 'Greenwood High Academy';
  const [noticeFilter, setNoticeFilter] = useState<'all' | 'academic' | 'admissions' | 'events'>('all');

  const notices = config.notices;
  const filteredNotices = noticeFilter === 'all' ? notices : notices.filter(n => n.category === noticeFilter);
  const facilities = config.facilities;
  const admissionSteps = config.admissionSteps;
  const newsAndEvents = config.newsAndEvents;
  const leadershipTeam = config.leadershipTeam;

  const dashboardPortals = [
    {
      role: 'Student Dashboard',
      badge: 'Learners',
      href: '/login?role=student',
      directHref: '/student/dashboard',
      desc: 'Access lesson handouts, practice CBT exams, coding quests, homework submissions, and terminal report cards.',
      features: ['Digital lesson notes & flashcards', 'Mock CBT practice & analytics', 'Term results & ranking']
    },
    {
      role: 'Parent Portal',
      badge: 'Families & Guardians',
      href: '/login?role=parent',
      directHref: '/parent/dashboard',
      desc: 'Real-time visibility into your child’s continuous assessment, attendance, fee invoices, and tutor bookings.',
      features: ['Instant terminal report cards', 'Online tuition & fee receipts', 'Direct teacher messaging']
    },
    {
      role: 'Teacher Workspace',
      badge: 'Faculty & Mentors',
      href: '/login?role=teacher',
      directHref: '/teacher/dashboard',
      desc: 'Streamlined marksheet entry, automated CA calculation, lesson plan publishing, and class attendance.',
      features: ['Automated CA1/CA2 gradebook', 'Lesson handout & quiz dispatch', 'Class performance insights']
    },
    {
      role: 'Admin & Principal Hub',
      badge: 'School Leadership',
      href: '/login?role=admin',
      directHref: '/admin/pulse',
      desc: '360° command center for school pulse, admissions CRM pipeline, fee reconciliation, timetable, and operations.',
      features: ['School Pulse & KPI telemetry', 'Admissions CRM & funnel', 'Bursary, hostel & transport ops']
    }
  ];

  return (
    <main>
      <Navbar />
      <Hero />

      {/* ── Official Notice Board (#notices) ── */}
      <section id="notices" className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div style={{ maxWidth: '640px' }}>
              <div className="overline" style={{ marginBottom: '0.75rem' }}>
                <IconBellRinging size={15} /> Official Notice Board
              </div>
              <h2 className="text-d4 fw-400">Campus Announcements &amp; Circulars</h2>
              <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
                Stay updated with official circulars, examination timetables, PTA schedules, and term calendar milestones from the Principal’s Office.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                { id: 'all', label: 'All Notices' },
                { id: 'admissions', label: 'Admissions' },
                { id: 'academic', label: 'Academic' },
                { id: 'events', label: 'PTA & Events' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNoticeFilter(tab.id)}
                  className={noticeFilter === tab.id ? 'btn btn-navy btn-sm' : 'btn btn-sm'}
                  style={
                    noticeFilter !== tab.id
                      ? { background: 'var(--color-nets-light)', color: 'var(--color-nets-text)', border: '1px solid var(--color-nets-border)' }
                      : {}
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="card p-6 sm:p-8 flex flex-col justify-between"
                style={notice.pinned ? { borderLeft: '4px solid var(--color-nets-red)' } : {}}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '2px',
                        background: notice.pinned ? 'rgba(251, 188, 4, 0.15)' : 'rgba(26, 31, 168, 0.08)',
                        color: '#0D1060',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {notice.pinned && <IconPin size={12} />}
                      {notice.tag}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <IconClock size={14} /> {notice.date}
                    </span>
                  </div>

                  <h3 className="text-lg fw-600 mb-2">{notice.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">{notice.summary}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-muted">Ref: {notice.id}</span>
                  <Link href="/notices" className="fw-600 text-navy" style={{ color: 'var(--color-nets-navy)', textDecoration: 'none' }}>
                    Read Full Circular &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About & Lower Feature Split with /photo05.jpeg (#about) ── */}
      <section id="about" className="section-py bg-light border-b border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>{config.aboutOverline} · {schoolName}</div>
              <h2 className="text-d3 fw-300 mb-6">{config.aboutTitle}</h2>
              <p className="text-body-lg text-muted mb-8 leading-relaxed">
                {config.aboutDescription}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[ 
                  { title: '98% Distinction Rate', reward: 'Consistent A1–B2 grades in WAEC, NECO & IGCSE', icon: IconTrophy },
                  { title: 'Digital Smart Campus', reward: 'Real-time ResultsPRO & ClassroomPRO access', icon: IconDeviceLaptop },
                  { title: '1-on-1 Remedial Support', reward: 'Personalized mentorship for every child', icon: IconBrain },
                  { title: 'Safe & Secure Grounds', reward: 'Biometric access & 24/7 campus security', icon: IconHeartHandshake },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-red shrink-0">
                      <item.icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                    </div>
                    <div>
                      <h4 className="fw-600 mb-1">{item.title}</h4>
                      <p className="text-sm text-muted leading-relaxed">{item.reward}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="#admissions" className="btn btn-navy">Apply for Admission</Link>
                <Link href="/login" className="btn btn-red">Access Campus Portal</Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={config.aboutImage || '/photo05.jpeg'} 
                alt={`${schoolName} Students in Classroom`} 
                className="rounded-sm shadow-card-lg" 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Campus Facilities Showcase (#facilities) ── */}
      <section id="facilities" className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div style={{ maxWidth: '680px' }}>
              <div className="overline" style={{ marginBottom: '0.75rem' }}>World-Class Infrastructure</div>
              <h2 className="text-d4 fw-400">Campus Facilities Built for Discovery.</h2>
              <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
                Every space on our campus is purpose-engineered to inspire scientific inquiry, digital creativity, athletic vitality, and student safety.
              </p>
            </div>
            <Link href="#admissions" className="btn btn-navy btn-sm">
              Book a Physical Campus Tour &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac, idx) => (
              <div key={idx} className="card flex flex-col justify-between overflow-hidden">
                <div>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={fac.image}
                      alt={fac.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(13, 16, 96, 0.9)',
                        color: 'var(--color-nets-red)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '2px'
                      }}
                    >
                      {fac.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl fw-600 mb-2">{fac.title}</h3>
                    <p className="text-muted text-sm mb-5 leading-relaxed">{fac.desc}</p>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      {fac.specs.map((sp, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs text-muted">
                          <IconCheck className="w-4 h-4 text-green-600 shrink-0" strokeWidth={2.5} />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News & Upcoming Events (#news) ── */}
      <section id="news" className="section-py bg-light border-b border-gray-200">
        <div className="container-nets">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div style={{ maxWidth: '650px' }}>
              <div className="overline" style={{ marginBottom: '0.75rem' }}>
                <IconCalendarEvent size={15} /> News &amp; Events
              </div>
              <h2 className="text-d4 fw-400">Life &amp; Achievements at {schoolName}.</h2>
              <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
                Celebrate our students’ academic victories, sporting championships, cultural festivals, and upcoming term events.
              </p>
            </div>
            <Link href="/news" className="btn btn-navy btn-sm">
              View Full School Calendar &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsAndEvents.map((item, i) => (
              <div key={i} className="card flex flex-col justify-between overflow-hidden">
                <div>
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'var(--color-nets-red)',
                        color: '#0D1060',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '2px'
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="text-xs text-muted mb-2 flex items-center gap-2">
                      <IconClock size={14} /> {item.date}
                    </div>
                    <h3 className="text-lg fw-600 mb-3 leading-snug">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-4">{item.excerpt}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <IconMapPin size={14} /> {item.location}
                  </span>
                  <Link href="/news" className="fw-600 text-navy" style={{ color: 'var(--color-nets-navy)', textDecoration: 'none' }}>
                    Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership & Faculty Team (#team) ── */}
      <section id="team" className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div style={{ marginBottom: '3.5rem', maxWidth: '680px' }}>
            <div className="overline" style={{ marginBottom: '0.75rem' }}>
              <IconUsers size={15} /> School Leadership &amp; Faculty
            </div>
            <h2 className="text-d4 fw-400">Guided by Experienced Educators.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
              Our leadership and teaching faculty bring decades of experience in Nigerian and international secondary education, STEM mentorship, and pastoral care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-nets-red)' }}
                    />
                    <div>
                      <h3 className="text-base fw-600 leading-tight">{member.name}</h3>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginTop: '0.2rem' }}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs fw-600 text-muted mb-2">{member.qualification}</div>
                  <p className="text-xs text-muted leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Admissions Process & Application Form (#admissions) ── */}
      <section id="admissions" className="section-py bg-light border-b border-gray-200">
        <div className="container-nets">
          <div style={{ marginBottom: '3.5rem', maxWidth: '680px' }}>
            <div className="overline" style={{ marginBottom: '0.75rem' }}>
              <IconSchool size={15} /> {config.academicSession} Admissions
            </div>
            <h2 className="text-d4 fw-400">How to Join {schoolName}.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
              Applications are open for Primary, Junior Secondary (JSS 1–2), and Senior Secondary (SSS 1) streams. Follow our 4-step enrollment pathway below.
            </p>
          </div>

          {/* 4-Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {admissionSteps.map((st, idx) => (
              <div key={idx} className="card p-6">
                <div className="step-number mb-3" style={{ fontSize: '2.75rem', color: 'var(--color-nets-navy)' }}>
                  {st.step}
                </div>
                <h3 className="text-lg fw-600 mb-2">{st.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Application Form Card */}
          <div className="card p-8 sm:p-12 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <span className="overline" style={{ marginBottom: '0.75rem' }}>Online Admission Desk</span>
                <h3 className="text-2xl fw-600 mb-3">Start Your Child&apos;s Application</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Complete this inquiry form to receive the official fee schedule, entrance CBT exam pass, and campus tour invitation from our Admissions Registrar.
                </p>
                <div className="space-y-3 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Instant CBT Entrance Exam scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Sibling tuition discount &amp; scholarship eligibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Day &amp; Boarding options available</span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Admission application inquiry submitted! Our Admissions Registrar will contact you with your Entrance CBT Exam pass.');
                }}
                className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <div>
                  <label className="field-label">Student Full Name</label>
                  <input type="text" required placeholder="e.g. Chidinma Adeleke" className="input" />
                </div>
                <div>
                  <label className="field-label">Parent / Guardian Name</label>
                  <input type="text" required placeholder="e.g. Chief & Mrs. O. Adeleke" className="input" />
                </div>
                <div>
                  <label className="field-label">Parent Email Address</label>
                  <input type="email" required placeholder="parent@example.com" className="input" />
                </div>
                <div>
                  <label className="field-label">Phone Number (WhatsApp)</label>
                  <input type="tel" required placeholder="+234 803 000 0000" className="input" />
                </div>
                <div>
                  <label className="field-label">Entry Class Level</label>
                  <select className="input">
                    <option value="jss1">JSS 1 (Junior Secondary Entry)</option>
                    <option value="jss2">JSS 2 (Transfer)</option>
                    <option value="sss1">SSS 1 (Science / Arts / Commercial)</option>
                    <option value="primary">Primary Foundation (Years 1 - 6)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Boarding Preference</label>
                  <select className="input">
                    <option value="day">Day Scholar</option>
                    <option value="boarding">Full Boarding House</option>
                  </select>
                </div>
                <div className="sm:col-span-2 mt-2">
                  <button type="submit" className="btn btn-navy w-full" style={{ width: '100%' }}>
                    Submit Admission Application Inquiry <IconArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Dashboard Portals (#portals) ── */}
      <section id="portals" className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div style={{ marginBottom: '3.5rem', maxWidth: '680px' }}>
            <div className="overline" style={{ marginBottom: '0.75rem' }}>
              <IconLockAccess size={15} /> Digital Campus Portals
            </div>
            <h2 className="text-d4 fw-400">Role-Based Dashboards for Every Member.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.5rem' }}>
              Select your role below to sign in to your personalized dashboard or launch your portal workspace directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardPortals.map((p, idx) => (
              <div key={idx} className="card p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span
                    style={{
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
                    }}
                  >
                    {p.badge}
                  </span>
                  <h3 className="text-xl fw-600 mb-2">{p.role}</h3>
                  <p className="text-muted text-xs leading-relaxed mb-5">{p.desc}</p>

                  <div className="space-y-2 pt-4 border-t border-gray-100 mb-6">
                    {p.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-muted">
                        <IconCheck className="w-4 h-4 text-green-600 shrink-0" strokeWidth={2.5} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <Link href={p.href} className="btn btn-navy btn-sm w-full" style={{ width: '100%' }}>
                    Sign In ({p.badge.split(' ')[0]})
                  </Link>
                  <Link href={p.directHref} className="text-center text-xs fw-600 text-navy py-1" style={{ color: 'var(--color-nets-navy)', textDecoration: 'none' }}>
                    Preview Dashboard &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-py bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Give Your Child a World-Class Education</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Join {schoolName} for the {config.academicSession} academic session or sign in to your student, parent, teacher, or administrator portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#admissions" className="btn btn-red btn-lg">Apply for Admission</Link>
            <Link href="/login" className="btn btn-outline-white btn-lg">Campus Portal Login</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
