"use client";

import React from "react";
import Link from "next/link";
import {
  IconTrophy,
  IconWorld,
  IconSparkles,
  IconPlayerPlay,
  IconCheck,
} from "@tabler/icons-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

const SYNCED_WARDS = [
  {
    id: "ward-1",
    name: "Chidinma Adeleke",
    campus: "Laurel Academy — Ikeja Campus (JSS 2 Gold)",
    currentWorld: "World 2: Cyber Canyon (Loops & Autonomous Sprites)",
    currentLevel: "Level 48 of 106",
    totalXp: 3420,
    badges: ["Sequence Master", "Loop Architect", "Bug Squasher"],
    completion: 85,
  },
  {
    id: "ward-2",
    name: "Tobi Adeleke",
    campus: "Laurel Academy — Ikeja Campus (Primary 5)",
    currentWorld: "World 1: Jungle Logic (Sequences & Directions)",
    currentLevel: "Level 72 of 106",
    totalXp: 2150,
    badges: ["First Algorithm", "Jungle Explorer"],
    completion: 91,
  },
];

export default function PuzzleProFamiliesConsole() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        {/* Header */}
        <MotionRise className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider">
              <IconSparkles className="w-3.5 h-3.5" />
              PuzzlePRO Family Coding Progress · Ward Profiles Synced from CampusPRO
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Parent Coding Adventure &amp; Robotics Portfolio Tracker
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Ward profiles, parent-student linking, and school billing are managed in <strong>CampusPRO</strong>. Track your children&apos;s visual coding adventures, earned algorithmic badges, and XP milestones below.
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-[#0D1060] text-white text-xs font-extrabold flex items-center gap-2 hover:bg-[#151980] transition-colors shrink-0"
          >
            <IconPlayerPlay className="w-4 h-4" />
            Open Coding Studio
          </Link>
        </MotionRise>

        {/* Synced Ward Cards */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SYNCED_WARDS.map((ward) => (
            <MotionRise
              key={ward.id}
              className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-extrabold text-[#1565C0] uppercase tracking-wider">
                    {ward.campus}
                  </span>
                  <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">{ward.name}</h2>
                </div>
                <span className="px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-800 text-xs font-extrabold flex items-center gap-1">
                  <IconTrophy className="w-4 h-4" />
                  {ward.totalXp.toLocaleString()} XP
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <IconWorld className="w-4 h-4 text-[#0D1060]" />
                    Active Adventure World
                  </span>
                  <span className="text-emerald-700">{ward.currentLevel}</span>
                </div>
                <p className="text-sm font-extrabold text-gray-900">{ward.currentWorld}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${ward.completion}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Earned Coding &amp; Robotics Badges
                </p>
                <div className="flex flex-wrap gap-2">
                  {ward.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-extrabold flex items-center gap-1"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </MotionRise>
          ))}
        </MotionStagger>
      </main>

      <SiteFooter />
    </div>
  );
}
