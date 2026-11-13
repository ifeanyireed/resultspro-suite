"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IconBus,
  IconSocial,
  IconMessages,
  IconBellRinging,
  IconCalendarTime,
  IconReportAnalytics,
  IconDeviceMobile,
  IconCheck,
  IconShieldCheck,
  IconQrcode,
  IconAlertTriangle
} from '@tabler/icons-react';

type StakeholderRole = 'parent' | 'teacher' | 'driver' | 'admin';

const MOBILE_FEATURES = [
  {
    id: 'bus-tracking',
    title: 'School Bus Tracking',
    badge: 'Live GPS Telemetry',
    icon: IconBus,
    desc: 'Real-time map tracking of every school bus route, student boarding & drop-off QR scans, and live ETA updates from pickup stop to campus gates.',
    bullets: [
      'Live route map & driver speed telemetry',
      'Student boarding & alighting QR check-in',
      'Automated 5-minute approaching-stop alert'
    ]
  },
  {
    id: 'social-feeds',
    title: 'Campus Social Feeds',
    badge: 'Private School Timeline',
    icon: IconSocial,
    desc: 'A verified, school-only social timeline celebrating classroom projects, STEM & coding exhibitions, inter-house sports, and principal circulars.',
    bullets: [
      'Role-moderated campus photo & video feed',
      'Class-specific and house-specific channels',
      'Zero external ads or public exposure'
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging & Direct Chat',
    badge: '2-Way Encrypted Threads',
    icon: IconMessages,
    desc: 'Instant, role-scoped two-way messaging connecting parents directly with form teachers, subject tutors, the bursary desk, and school principals.',
    bullets: [
      'Direct parent-to-teacher & HOD threads',
      'Voice notes, PDF attachments & read receipts',
      'Synced with CampusPRO web inbox'
    ]
  },
  {
    id: 'push-notifications',
    title: 'Attendance, Bus, Chat & SOS Push Alerts',
    badge: 'Instant Mobile Push',
    icon: IconBellRinging,
    desc: 'Mission-critical push notifications the moment a student clocks in at the gate, a bus arrives, a teacher replies, or an emergency SOS is triggered.',
    bullets: [
      'Biometric/QR morning gate attendance alerts',
      'Bus arrival, route delay & chat notifications',
      '1-tap Driver & Campus Security SOS broadcast'
    ]
  },
  {
    id: 'smart-reminders',
    title: 'Payment, Events, Class & Custom Reminders',
    badge: 'Automated Smart Schedules',
    icon: IconCalendarTime,
    desc: 'Proactive mobile reminders for tuition installments, PTA meetings, teacher class periods, examination timetables, and custom personal alerts.',
    bullets: [
      'Paystack fee due-date & receipt reminders',
      'Live period bell & class session alerts for staff',
      'Custom parent, student & excursion reminders'
    ]
  },
  {
    id: 'results-checker',
    title: 'Instant Results Checker',
    badge: 'Cryptographic Grade Lookup',
    icon: IconReportAnalytics,
    desc: 'One-tap terminal result verification powered by encrypted scratch card PINs, downloadable signed PDF report cards, and mastery charts.',
    bullets: [
      'Instant CA1, CA2 & Terminal broadsheet view',
      'Tamper-proof scratch card PIN validation',
      'Term-over-term subject trajectory charts'
    ]
  }
];

const ROLE_PREVIEWS: Record<
  StakeholderRole,
  {
    label: string;
    appId: string;
    campus: string;
    userTitle: string;
    statusBadge: string;
    feedItems: {
      tag: string;
      time: string;
      title: string;
      detail: string;
      accent: string;
    }[];
  }
> = {
  parent: {
    label: 'Parent App View',
    appId: 'MOB-PRN-88412',
    campus: 'Main Campus · Lekki Phase 1',
    userTitle: 'Chief & Mrs. O. Adeleke (2 Wards Linked)',
    statusBadge: 'Ward Checked In · 07:42 AM',
    feedItems: [
      {
        tag: 'BUS ARRIVAL PUSH',
        time: '07:18 AM',
        title: 'Coaster Bus #04 is 4 mins away from Admiralty Stop',
        detail: 'Driver Mr. S. Olatunji · Live GPS speed 34 km/h · Tomiwa & Kemi',
        accent: '#4ade80'
      },
      {
        tag: 'ATTENDANCE PUSH',
        time: '07:42 AM',
        title: 'Tomiwa Adeleke (SS 2 Science) clocked in at Main Gate',
        detail: 'Verified via Campus Smart ID · Morning Assembly in progress',
        accent: '#60a5fa'
      },
      {
        tag: 'RESULTS CHECKER',
        time: '1st Term',
        title: 'Mid-Term Continuous Assessment (CA1 + CA2) Published',
        detail: 'GPA: 91.4% (2nd in SS 2 Science) · Tap to view signed PDF broadsheet',
        accent: '#FBBC04'
      },
      {
        tag: 'PAYMENT REMINDER',
        time: 'Due in 5d',
        title: 'STEM Robotics Excursion Fee (₦25,000)',
        detail: '1-tap instant settlement via Paystack · Receipt auto-synced to Bursary',
        accent: '#c084fc'
      }
    ]
  },
  teacher: {
    label: 'Teacher App View',
    appId: 'MOB-TCH-30914',
    campus: 'Main Campus · Lekki Phase 1',
    userTitle: 'Mr. David Jenkins · HOD Mathematics',
    statusBadge: 'Next Class: SS 1 Sci (08:00 AM)',
    feedItems: [
      {
        tag: 'CLASS SESSION REMINDER',
        time: 'In 10 mins',
        title: 'Period 1: Further Mathematics · SS 1 Science (Room Sci-S1)',
        detail: '30 students enrolled · Digital attendance & lesson handout ready',
        accent: '#FBBC04'
      },
      {
        tag: 'DIRECT PARENT CHAT',
        time: '08:50 AM',
        title: 'New message from Engr. Chidi Nwosu (Parent · SS 3)',
        detail: '“Thank you for the extra calculus worksheet for Chisom’s WAEC prep...”',
        accent: '#60a5fa'
      },
      {
        tag: 'CAMPUS SOCIAL FEED',
        time: 'Yesterday',
        title: 'Posted JSS 3 PuzzlePRO Python Hackathon Winners',
        detail: '48 parent likes · 14 comments · Approved on Campus Timeline',
        accent: '#4ade80'
      },
      {
        tag: 'CUSTOM REMINDER',
        time: '02:00 PM',
        title: 'Submit SS 2 CA2 Mark-Sheet on ResultsPRO',
        detail: '28 of 28 student scores entered · Ready for HOD sign-off',
        accent: '#c084fc'
      }
    ]
  },
  driver: {
    label: 'Bus Driver View',
    appId: 'MOB-DRV-55108',
    campus: 'Main Campus · Lekki Phase 1',
    userTitle: 'Mr. Sunday Olatunji · Route B-04 (Lekki – Ajah)',
    statusBadge: 'GPS Beacon Active · 28/28 Boarded',
    feedItems: [
      {
        tag: 'BUS MANIFEST & QR',
        time: 'Live Route',
        title: 'Morning Pickup Manifest Complete (28 of 28 Students)',
        detail: 'All parent boarding push notifications dispatched automatically',
        accent: '#4ade80'
      },
      {
        tag: 'SOS & SAFETY CONSOLE',
        time: 'Standby',
        title: '1-Tap Emergency SOS & Traffic Delay Broadcast',
        detail: 'Instantly alerts Transport Officer, Principal & Route B-04 Parents',
        accent: '#f87171'
      },
      {
        tag: 'ROUTE REMINDER',
        time: '02:45 PM',
        title: 'Afternoon Dismissal Loading at Bay 4',
        detail: '2 students excused early by parents via CampusPRO Gate Pass',
        accent: '#FBBC04'
      }
    ]
  },
  admin: {
    label: 'Campus Admin View',
    appId: 'MOB-ADM-10204',
    campus: 'All Campuses · Executive Command',
    userTitle: 'Mrs. Folake Adeyemi · Campus Bursar & Ops',
    statusBadge: '1,184 Mobile IDs Active',
    feedItems: [
      {
        tag: 'ATTENDANCE & FLEET PULSE',
        time: '08:15 AM',
        title: '96.8% Student Attendance · All 12 School Buses Arrived Safely',
        detail: 'Zero unresolved SOS alerts across Lekki, Ikeja & VI campuses',
        accent: '#4ade80'
      },
      {
        tag: 'BURSARY & FEE ALERTS',
        time: 'Today',
        title: '₦4,850,000 Settled via Mobile App Paystack Reminders',
        detail: '19 termly tuition invoices auto-reconciled & receipts issued',
        accent: '#FBBC04'
      },
      {
        tag: 'APP ID PROVISIONING',
        time: 'Just now',
        title: '14 New Parent & Driver Mobile App Invite Links Activated',
        detail: 'Role-bound permissions verified for 2026/2027 First Term',
        accent: '#60a5fa'
      }
    ]
  }
};

export default function MobileAppSection() {
  const [activeRole, setActiveRole] = useState<StakeholderRole>('parent');
  const preview = ROLE_PREVIEWS[activeRole];

  return (
    <section
      id="mobile-app"
      className="section-py"
      style={{
        background: 'var(--color-nets-navy-dark)',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div className="container-nets">
        {/* ── Section Header ── */}
        <div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          style={{ marginBottom: '4rem' }}
        >
          <div style={{ maxWidth: '720px' }}>
            <div className="overline-dark" style={{ marginBottom: '1rem' }}>
              <IconDeviceMobile size={15} />
              <span>Assigned Campus Mobile App (iOS &amp; Android)</span>
            </div>
            <h2 className="text-d4 fw-400" style={{ color: '#FFFFFF' }}>
              Every Campus Gets Its Own Mobile App. Role-Scoped by Unique App User IDs.
            </h2>
            <p
              className="text-body-lg"
              style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.75rem' }}
            >
              From the CampusPRO command center, administrators send role-specific invite links to{' '}
              <strong style={{ color: '#FFFFFF' }}>
                Parents, Teachers, Bus Drivers, and Co-Admins
              </strong>
              —automatically binding a unique Mobile App User ID to their account so they immediately see what pertains to their role and campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="#pricing" className="btn btn-red">
              Deploy Campus Mobile App
            </Link>
            <Link href="/admin/campus-os" className="btn btn-outline-white">
              Manage App IDs in CampusPRO &rarr;
            </Link>
          </div>
        </div>

        {/* ── Top Split: Interactive Role-Scoped Mobile App Simulator + Role-ID Explanation ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          style={{ marginBottom: '4rem' }}
        >
          {/* Left 5 Cols: Role Switcher & How Role-Bound App IDs Work */}
          <div className="lg:col-span-5 space-y-6">
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '4px',
                padding: '1.75rem'
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-nets-red)',
                  marginBottom: '0.5rem'
                }}
              >
                Interactive Role Preview
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                See What Each Stakeholder Experiences on Login
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.68)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem'
                }}
              >
                Select a stakeholder role below to preview how their assigned{' '}
                <code style={{ color: 'var(--color-nets-red)' }}>MOB-*</code> User ID tailors push alerts, bus telemetry, reminders, and results.
              </p>

              {/* 4 Role Buttons */}
              <div className="grid grid-cols-2 gap-2.5" style={{ marginBottom: '1.5rem' }}>
                {(
                  [
                    { id: 'parent', label: 'Parent (MOB-PRN)' },
                    { id: 'teacher', label: 'Teacher (MOB-TCH)' },
                    { id: 'driver', label: 'Bus Driver (MOB-DRV)' },
                    { id: 'admin', label: 'Admin (MOB-ADM)' }
                  ] as { id: StakeholderRole; label: string }[]
                ).map((tab) => {
                  const isSelected = activeRole === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveRole(tab.id)}
                      style={{
                        padding: '0.7rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        background: isSelected
                          ? 'var(--color-nets-red)'
                          : 'rgba(255,255,255,0.06)',
                        color: isSelected ? '#0D1060' : '#FFFFFF',
                        border: isSelected
                          ? '1.5px solid var(--color-nets-red)'
                          : '1.5px solid rgba(255,255,255,0.14)'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  <IconQrcode size={15} color="#FBBC04" />
                  <span>
                    <strong>1-Click Deep-Link Onboarding:</strong> Invite links auto-bind the campus &amp; role ID on first tap.
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  <IconShieldCheck size={15} color="#4ade80" />
                  <span>
                    <strong>Strict Role Isolation:</strong> Drivers only see route manifests; parents only see their linked wards.
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  <IconAlertTriangle size={15} color="#f87171" />
                  <span>
                    <strong>Instant SOS Priority:</strong> High-priority push channel overrides silent mode for campus emergencies.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Live Mobile App Feed Simulation */}
          <div className="lg:col-span-7">
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: '6px',
                padding: '1.75rem',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35)'
              }}
            >
              {/* Mock Mobile Top Status Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: 'var(--color-nets-red)',
                        color: '#0D1060',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '2px',
                        fontFamily: 'monospace'
                      }}
                    >
                      {preview.appId}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.65)',
                        fontWeight: 600
                      }}
                    >
                      {preview.campus}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginTop: '0.35rem'
                    }}
                  >
                    {preview.userTitle}
                  </div>
                </div>

                <span
                  style={{
                    background: 'rgba(74, 222, 128, 0.14)',
                    border: '1px solid rgba(74, 222, 128, 0.35)',
                    color: '#4ade80',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px'
                  }}
                >
                  ● {preview.statusBadge}
                </span>
              </div>

              {/* Simulated Push Notifications & Feed Cards */}
              <div className="space-y-3">
                {preview.feedItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(13, 16, 96, 0.75)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderLeft: `3px solid ${item.accent}`,
                      borderRadius: '3px',
                      padding: '1rem 1.25rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          color: item.accent,
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.tag}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
                        {item.time}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '0.2rem'
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.68)' }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 Mobile App Feature Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOBILE_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '3px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '3px',
                        background: 'rgba(251, 188, 4, 0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={22} color="#FBBC04" />
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '2px',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'var(--color-nets-red)'
                      }}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.68)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>

                <div
                  className="space-y-2 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {feat.bullets.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.82)'
                      }}
                    >
                      <IconCheck size={14} color="#4ade80" strokeWidth={2.5} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
