'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconTrophy as Trophy, IconFlame as Flame, IconAward as Award, IconZap as Zap, IconStar as Star } from '@tabler/icons-react';
import { mockLeaderboard } from '@/lib/data';

export default function LeaderboardPage() {
  const badges = [
    { name: 'Fast Finisher', desc: 'Submitted sprint deliverables 48 hours ahead of schedule', earned: true },
    { name: 'Project Hero', desc: 'Maintained 100% test coverage across all microservice projects', earned: true },
    { name: 'Top Reviewer', desc: 'Provided detailed peer reviews on 15+ community pull requests', earned: true },
    { name: 'Class Champion', desc: 'Held the #1 rank on the cohort leaderboard for 2 consecutive weeks', earned: false },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Cohort Leaderboard & Badges"
        subtitle="Rankings, professional XP milestones, and earned peer endorsements"
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Class Champion Spotlight */}
        <div className="bg-gradient-to-r from-signal to-signal-light rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-signal-soft">
              <Trophy className="w-4 h-4 text-amber fill-amber" />
              <span>WEEKLY CLASS CHAMPION</span>
            </div>
            <h3 className="font-grotesk font-bold text-2xl">Tunde Bakare</h3>
            <p className="text-xs text-signal-soft">
              Earned 4,850 XP • 18-Day Streak • 4 Approved Microservice Architectures
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/20 overflow-hidden shadow-inner hidden sm:block">
            <img
              src="/avatars/character10.jpg"
              alt="Champion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden space-y-2 p-6">
          <h4 className="font-grotesk font-bold text-base text-ink mb-4">Cohort Ranking (Sprint 03)</h4>

          <div className="divide-y divide-line text-xs">
            {mockLeaderboard.map((user) => (
              <div
                key={user.rank}
                className={`py-3.5 flex items-center justify-between px-3 rounded-xl transition-colors ${
                  user.isCurrentUser ? 'bg-signal-soft/40 font-bold border border-signal/20' : 'hover:bg-surface2/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="mono font-bold text-sm text-ink-faint w-6 text-center">
                    #{user.rank}
                  </span>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-ink">{user.name}</p>
                    <p className="mono text-[10px] text-ink-faint">{user.badge}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1 text-ember">
                    <Flame className="w-3.5 h-3.5 fill-ember" />
                    <span>{user.streak}d</span>
                  </div>
                  <div className="flex items-center space-x-1 text-signal font-bold">
                    <Zap className="w-3.5 h-3.5 fill-signal" />
                    <span>{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Showcase */}
        <div className="space-y-4">
          <h4 className="font-grotesk font-bold text-base text-ink">Earned Badges & Achievements</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex items-start space-x-3.5 shadow-sm ${
                  b.earned ? 'bg-surface border-line' : 'bg-surface2/50 border-line/40 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    b.earned ? 'bg-signal-soft text-signal' : 'bg-line text-ink-faint'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-ink">{b.name}</h5>
                  <p className="text-xs text-ink-soft mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
