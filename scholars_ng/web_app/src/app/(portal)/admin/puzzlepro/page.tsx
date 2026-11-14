'use client';

import React from 'react';
import {
  CodeBracketIcon,
  TrophyIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { CustomizerLeaderboard } from '@puzzlepro/modules';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

function PuzzlePROAdminAnalytics() {
  return (
    <div>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Coding Cohorts & School-Wide Progress</h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor PuzzlePRO visual coding, algorithmic thinking, and robotics outcomes across all grade levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[#f59e0b] text-[#d97706] hover:bg-amber-50 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            Export STEM Progress Report
          </button>
        </div>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Total Enrolled Coders */}
        <MotionRise className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[1.5rem] p-6 shadow-sm shadow-amber-500/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-950 rounded-full filter blur-[3rem] opacity-40"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Active Coders</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">412</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" /> +38
              </div>
              <span>Active this term</span>
            </div>
          </div>
        </MotionRise>

        {/* Puzzles Solved */}
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Puzzles Solved</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <PuzzlePieceIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">14.8k</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">636 Worlds</div>
              <span>Across JSS1 – SS3</span>
            </div>
          </div>
        </MotionRise>

        {/* Active Portfolios */}
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Game Projects</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CodeBracketIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">128</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold">Live</div>
              <span>Blockly &amp; JS builds</span>
            </div>
          </div>
        </MotionRise>

        {/* Certificates & Badges */}
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Skill Badges</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <DocumentCheckIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">94</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Verified certificates</span>
            </div>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.08} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Table Area */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active PuzzlePRO Class Cohorts</h3>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                636 Adventures Synced
              </span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Cohort / Class</th>
                  <th className="px-6 py-4">Current Adventure World</th>
                  <th className="px-6 py-4">Coders</th>
                  <th className="px-6 py-4">Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'JSS 1 — Algorithmic Sequences', world: 'World 1: Jungle Logic', students: 64, completion: 92 },
                  { name: 'JSS 2 — Loops & Autonomous Sprites', world: 'World 2: Cyber Canyon', students: 58, completion: 85 },
                  { name: 'JSS 3 — Conditionals & Sensors', world: 'World 3: Deep Sea Rover', students: 52, completion: 78 },
                  { name: 'SS 1 — Functions & Game Physics', world: 'World 4: Orbital Station', students: 48, completion: 74 },
                  { name: 'SS 2 — JavaScript & AI Agents', world: 'World 5: Neural Nexus', students: 44, completion: 66 },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.world}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                        {c.students} Students
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm text-gray-900">
                        <span>{c.completion}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full ${c.completion >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${c.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Student Builders */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Top Puzzle Builders</h3>
            <div className="flex-1 flex flex-col gap-6">
              {[
                { name: 'Chidi Okoro', project: 'Autonomous Maze Solver (World 5)', level: 'SS 2 • 4,850 XP' },
                { name: 'Aisha Bello', project: 'Solar Rover Pathfinding Engine', level: 'JSS 3 • 4,420 XP' },
                { name: 'Tomiwa Ade', project: 'Blockly Arcade Physics Defender', level: 'JSS 2 • 3,990 XP' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 overflow-hidden border border-amber-200 shadow-sm shrink-0">
                    <img
                      src={`/avatars/character${i + 4}.jpg`}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-normal text-gray-900">{s.name}</h4>
                    <p className="text-sm text-amber-600 font-medium mt-0.5">{s.project}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionRise>
    </div>
  );
}

function PuzzlePROCurriculumWorlds() {
  const worlds = [
    {
      world: 'World 1',
      title: 'Algorithmic Foundations & Sequencing',
      levels: 'Levels 1 – 106',
      skills: ['Step-by-step instructions', 'Spatial orientation', 'Pattern recognition'],
      status: 'Active across Primary 5 – JSS 1',
    },
    {
      world: 'World 2',
      title: 'Loops, Iteration & Efficiency',
      levels: 'Levels 107 – 212',
      skills: ['Repeat loops', 'Nested loops', 'Path optimization'],
      status: 'Active across JSS 1 – JSS 2',
    },
    {
      world: 'World 3',
      title: 'Conditionals, Sensors & Logic Gates',
      levels: 'Levels 213 – 318',
      skills: ['If / Else branching', 'While loops', 'Obstacle detection'],
      status: 'Active across JSS 2 – JSS 3',
    },
    {
      world: 'World 4',
      title: 'Functions, Modularity & Subroutines',
      levels: 'Levels 319 – 424',
      skills: ['Reusable functions', 'Parameters', 'Event-driven triggers'],
      status: 'Active across JSS 3 – SS 1',
    },
    {
      world: 'World 5',
      title: 'Variables, Arrays & Game Physics',
      levels: 'Levels 425 – 530',
      skills: ['State tracking', 'Coordinate math', 'Sprite collision engines'],
      status: 'Active across SS 1 – SS 2',
    },
    {
      world: 'World 6',
      title: 'Text Bridge: JavaScript & Python Algorithms',
      levels: 'Levels 531 – 636',
      skills: ['Block-to-code transition', 'Pathfinding algorithms', 'AI logic agents'],
      status: 'Active across SS 2 – SS 3',
    },
  ];

  return (
    <div className="space-y-6">
      <MotionRise className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            636 Interactive Waypoints
          </span>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">PuzzlePRO Curriculum Map</h3>
          <p className="text-sm text-gray-500 mt-1">
            Structured progression from visual Blockly logic to full JavaScript and Python problem-solving.
          </p>
        </div>
        <a
          href="https://puzzlepro.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-sm transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <SparklesIcon className="w-4 h-4" />
          Launch PuzzlePRO Studio
        </a>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {worlds.map((w) => (
          <MotionRise key={w.world} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">{w.world}</span>
                <span className="text-xs font-semibold text-gray-400">{w.levels}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">{w.title}</h4>
              <ul className="space-y-1.5 mb-5">
                {w.skills.map((skill) => (
                  <li key={skill} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs font-medium text-emerald-600">
              {w.status}
            </div>
          </MotionRise>
        ))}
      </MotionStagger>
    </div>
  );
}

function AdminPuzzleLeaderboardView() {
  return (
    <MotionRise style={{ maxWidth: '900px', margin: '1rem auto 4rem auto' }}>
      <CustomizerLeaderboard onClose={() => {}} />
    </MotionRise>
  );
}

export default function AdminPuzzlePROHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'analytics',
      label: 'Coding Cohorts & Analytics',
      icon: ChartBarIcon,
      component: PuzzlePROAdminAnalytics,
    },
    {
      id: 'curriculum',
      label: '636 Adventures Curriculum',
      icon: PuzzlePieceIcon,
      component: PuzzlePROCurriculumWorlds,
    },
    {
      id: 'leaderboard',
      label: 'School XP Leaderboard',
      icon: TrophyIcon,
      component: AdminPuzzleLeaderboardView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="PuzzlePRO Coding & Future Skills Academy"
      appSubtitle="Gamified Blockly & JavaScript coding adventures, 636 algorithmic waypoints, and school-wide STEM telemetry."
      appBadge="PuzzlePRO"
      accentColor="#f59e0b"
      tabs={tabs}
      defaultTabId="analytics"
    />
  );
}
