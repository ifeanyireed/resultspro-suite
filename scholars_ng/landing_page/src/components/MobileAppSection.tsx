"use client";

import React from 'react';
import Link from 'next/link';
import { MotionRise } from './ScrollRiseProvider';
import {
  IconBus,
  IconSocial,
  IconMessages,
  IconBellRinging,
  IconCalendarTime,
  IconReportAnalytics,
  IconDeviceMobile,
  IconCheck
} from '@tabler/icons-react';

const MOBILE_FEATURES = [
  {
    id: 'bus-tracking',
    title: 'School Bus Tracking',
    badge: 'Live GPS Map',
    icon: IconBus,
    desc: 'Track school buses in real time from pickup to campus drop-off, with live route progress and estimated arrival times for parents and school management.',
    bullets: [
      'Real-time bus location & route progress',
      'Student pickup & drop-off confirmation',
      'Live ETA updates for every bus stop'
    ]
  },
  {
    id: 'social-feeds',
    title: 'Campus Social Feeds',
    badge: 'School Community',
    icon: IconSocial,
    desc: 'A vibrant, private school timeline celebrating classroom activities, STEM projects, cultural days, inter-house sports, and official announcements.',
    bullets: [
      'Private photo & video campus moments',
      'Class, club & house updates',
      'Safe, distraction-free school community'
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging',
    badge: 'Direct Chat',
    icon: IconMessages,
    desc: 'Seamless two-way messaging connecting parents, teachers, and school administrators in one organized place without personal phone number clutter.',
    bullets: [
      'Direct parent-to-teacher conversations',
      'Class announcements & group broadcasts',
      'Instant file, photo & voice note sharing'
    ]
  },
  {
    id: 'push-notifications',
    title: 'Attendance, Bus Arrival, Chat & SOS Push Notifications',
    badge: 'Instant Alerts',
    icon: IconBellRinging,
    desc: 'Stay informed in real time with instant mobile push notifications the moment your child arrives at school, the bus approaches, a chat arrives, or an SOS is raised.',
    bullets: [
      'Morning arrival & dismissal attendance alerts',
      'Approaching school bus & chat notifications',
      'One-tap emergency SOS alerts'
    ]
  },
  {
    id: 'smart-reminders',
    title: 'Payment, Events, Class Session & Custom Reminders',
    badge: 'Smart Reminders',
    icon: IconCalendarTime,
    desc: 'Never miss an important date with automated reminders for school fees, PTA events, upcoming class sessions, exams, and personal schedules.',
    bullets: [
      'School fee & payment due-date reminders',
      'Upcoming class session & timetable alerts',
      'School events & custom personal reminders'
    ]
  },
  {
    id: 'results-checker',
    title: 'Results Checker',
    badge: 'Instant Report Cards',
    icon: IconReportAnalytics,
    desc: 'Check continuous assessment scores and terminal examination report cards directly from your phone with clear subject performance insights.',
    bullets: [
      'Instant CA & terminal broadsheet lookup',
      'Downloadable official PDF report cards',
      'Term-by-term academic progress charts'
    ]
  }
];

export default function MobileAppSection() {
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
        <MotionRise
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          style={{ marginBottom: '4rem' }}
        >
          <div style={{ maxWidth: '700px' }}>
            <div className="overline-dark" style={{ marginBottom: '1rem' }}>
              <IconDeviceMobile size={15} />
              <span>ScholarsNG Mobile App (iOS &amp; Android)</span>
            </div>
            <h2 className="text-d4 fw-400" style={{ color: '#FFFFFF' }}>
              Your Entire School Community, Right in Every Pocket.
            </h2>
            <p
              className="text-body-lg"
              style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.75rem' }}
            >
              Keep parents, teachers, students, and administrators effortlessly connected on the go with real-time bus tracking, campus feeds, instant push alerts, smart reminders, and one-tap result checking.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="#pricing" className="btn btn-red">
              Deploy School Portal
            </Link>
          </div>
        </MotionRise>

        {/* ── 6 Mobile App Feature Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOBILE_FEATURES.map((feat, featIdx) => {
            const Icon = feat.icon;
            return (
              <MotionRise
                key={feat.id}
                delay={featIdx * 0.08}
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
              </MotionRise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
