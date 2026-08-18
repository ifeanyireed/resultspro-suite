'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import {
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Radio,
  Sparkles,
  TrendingUp,
  Award,
  Video,
  PlayCircle,
} from 'lucide-react';
import Link from 'next/link';
import { mockPresence, mockProjects } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Cohort Overview & Presence"
        subtitle="Sprint 03 • 7-Stage Journey in Progress"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Alive Hero / Up Next Banner */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-signal-soft text-signal mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse"></span>
              <span>CURRENT MODULE • STAGE 02</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-grotesk text-ink">
              State Management & Fluid Micro-Interactions
            </h2>
            <p className="text-sm text-ink-soft">
              Continue your active lesson. Complete the reflection questions and submit your scenario challenge to unlock Stage 03 Projects.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link
                href="/journey/mod-4"
                className="bg-signal text-white px-5 py-2.5 rounded-md font-bold text-xs hover:bg-signal-light transition-all flex items-center space-x-2 shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Resume Lesson (75% Complete)</span>
              </Link>
              <Link
                href="/journey"
                className="text-xs font-semibold text-ink-soft hover:text-ink flex items-center space-x-1"
              >
                <span>View Full Journey Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Next Live Session Countdown */}
          <div className="bg-surface2 border border-line rounded-xl p-5 w-full lg:w-80 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="mono text-ink-faint font-bold uppercase">Live Mentorship</span>
              <span className="bg-growth-soft text-growth font-bold px-2 py-0.5 rounded-full text-[10px]">
                TODAY
              </span>
            </div>
            <h4 className="font-bold text-sm text-ink">Live Architecture Q&A & Code Critique</h4>
            <p className="text-xs text-ink-soft">With Dr. Adeyemi Alabi • 5:00 PM WAT</p>
            <button className="w-full bg-ink text-white py-2 rounded-md font-bold text-xs hover:bg-ink-soft transition-colors flex items-center justify-center space-x-2">
              <Video className="w-3.5 h-3.5" />
              <span>Join Live Office Hours</span>
            </button>
          </div>
        </div>

        {/* 3-Column Learning Health & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Consistency Meter */}
          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="mono text-[11px] font-bold uppercase text-ink-faint">Consistency Meter</span>
              <Flame className="w-4 h-4 text-ember fill-ember" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-grotesk text-ink">94%</span>
              <span className="text-xs text-growth font-semibold">+6% vs last week</span>
            </div>
            <p className="text-xs text-ink-soft">14 consecutive days of daily commits & reviews.</p>
            <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
              <div className="bg-ember h-1.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>

          {/* Portfolio Completion */}
          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="mono text-[11px] font-bold uppercase text-ink-faint">Portfolio Ready</span>
              <Award className="w-4 h-4 text-signal" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-grotesk text-ink">2 / 4</span>
              <span className="text-xs text-ink-faint">Approved Case Studies</span>
            </div>
            <p className="text-xs text-ink-soft">ResultsPRO engine endorsed by lead mentor.</p>
            <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
              <div className="bg-signal h-1.5 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* Cohort ELO Rank */}
          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="mono text-[11px] font-bold uppercase text-ink-faint">Cohort Rank</span>
              <TrendingUp className="w-4 h-4 text-growth" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-grotesk text-ink">#2</span>
              <span className="text-xs text-growth font-semibold">Top 5% Builder</span>
            </div>
            <p className="text-xs text-ink-soft">4,620 XP accumulated across 18 peer reviews.</p>
            <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
              <div className="bg-growth h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Dual Live Feeds: Weekly Objectives & Active Presence Ticker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Objectives Checklist */}
          <div className="bg-surface rounded-xl border border-line p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-grotesk font-bold text-base text-ink">Sprint 03 Objectives</h3>
              <span className="mono text-xs text-signal font-semibold">3 / 4 Completed</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-surface2 flex items-center justify-between border border-line/60">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-growth" />
                  <span className="line-through text-ink-faint">Design GORM MySQL Schema & Indexing</span>
                </div>
                <span className="mono text-[10px] text-growth font-bold">+150 XP</span>
              </div>

              <div className="p-3 rounded-lg bg-surface2 flex items-center justify-between border border-line/60">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-growth" />
                  <span className="line-through text-ink-faint">Build High-Performance Go REST Endpoints</span>
                </div>
                <span className="mono text-[10px] text-growth font-bold">+250 XP</span>
              </div>

              <div className="p-3 rounded-lg bg-surface2 flex items-center justify-between border border-line/60">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-growth" />
                  <span className="line-through text-ink-faint">Complete Bloom's Taxonomy Stage 02 Quiz</span>
                </div>
                <span className="mono text-[10px] text-growth font-bold">+100 XP</span>
              </div>

              <div className="p-3 rounded-lg bg-signal-soft/40 flex items-center justify-between border border-signal/20">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-signal"></div>
                  <span className="font-bold text-ink">Submit CBT Multiplayer Battle Arena Project</span>
                </div>
                <span className="mono text-[10px] text-signal font-bold">+500 XP</span>
              </div>
            </div>
          </div>

          {/* Real-Time Alive Classroom Presence */}
          <div className="bg-surface rounded-xl border border-line p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-growth animate-pulse" />
                <h3 className="font-grotesk font-bold text-base text-ink">Alive Classroom Presence</h3>
              </div>
              <Link href="/classroom" className="text-xs font-bold text-signal hover:underline">
                Enter Rooms
              </Link>
            </div>

            <div className="divide-y divide-line text-xs">
              {mockPresence.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-ink">{user.name}</p>
                      <p className="text-[11px] text-ink-faint">{user.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-signal-soft text-signal font-bold text-[10px]">
                      {user.activity}
                    </span>
                    <p className="text-[10px] text-ink-faint mt-0.5">{user.timeActive} active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
