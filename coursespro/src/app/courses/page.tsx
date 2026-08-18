'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconLayers as Layers, IconCalendar as Calendar, IconUsers2 as Users2, IconArrowRight as ArrowRight, IconCheckCircle2 as CheckCircle2 } from '@tabler/icons-react';

export default function CoursesCatalogPage() {
  const cohorts = [
    {
      id: 'c-1',
      title: 'Fullstack Distributed Systems & Go Microservices',
      duration: '12 Weeks',
      startDate: 'Oct 15, 2026',
      seatsLeft: 4,
      mentor: 'Dr. Adeyemi Alabi',
      badge: 'ACTIVE COHORT',
      description: 'Master decoupled microservice architecture, GORM MySQL connection pooling, and React 19 fluid design systems.',
      skills: ['Go 1.23', 'GORM', 'MySQL', 'Next.js 15', 'Docker', 'WebSockets'],
    },
    {
      id: 'c-2',
      title: 'AI Engineering & Production LLM Applications',
      duration: '8 Weeks',
      startDate: 'Nov 01, 2026',
      seatsLeft: 8,
      mentor: 'Engr. Chioma Nwachukwu',
      badge: 'ENROLLING',
      description: 'Build production RAG pipelines, autonomous coding agents, and real-time inference streaming engines.',
      skills: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'Gemini / Claude APIs'],
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Browse Cohort Programs"
        subtitle="Cohort-based, mentor-led programs designed for production engineers and builders"
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
        {cohorts.map((c) => (
          <div key={c.id} className="bg-surface rounded-2xl border border-line p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="mono text-[10px] font-bold uppercase text-signal">{c.badge}</span>
                <h3 className="font-grotesk font-bold text-xl text-ink mt-1">{c.title}</h3>
              </div>
              <span className="mono text-xs font-bold text-growth bg-growth-soft px-3 py-1 rounded-full border border-growth/20">
                {c.seatsLeft} Seats Remaining
              </span>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed">{c.description}</p>

            <div className="flex flex-wrap gap-2">
              {c.skills.map((s, i) => (
                <span
                  key={i}
                  className="mono text-[10px] font-semibold px-2.5 py-1 rounded-md bg-surface2 text-ink-soft border border-line"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-line text-xs">
              <div className="flex items-center space-x-6 text-ink-soft">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-ink-faint" />
                  <span>Starts: <strong>{c.startDate}</strong></span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Users2 className="w-4 h-4 text-ink-faint" />
                  <span>Mentor: <strong>{c.mentor}</strong></span>
                </span>
              </div>

              <button className="bg-signal text-white px-5 py-2.5 rounded-lg font-bold hover:bg-signal-light transition-colors flex items-center justify-center space-x-1.5 shadow-sm">
                <span>Apply for Cohort</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
