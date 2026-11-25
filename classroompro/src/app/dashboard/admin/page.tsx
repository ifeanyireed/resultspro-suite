"use client";

import React from "react";
import Link from "next/link";
import {
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconChartBar as BarChart3,
  IconCheck as Check,
  IconArrowUpRight as ArrowUpRight,
  IconAlertTriangle as AlertTriangle,
} from "@tabler/icons-react";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function PrincipalCurriculumOversightConsole() {
  const stats = [
    {
      label: "NERDC Syllabus Coverage",
      value: "84.2%",
      sub: "Across 18 active subjects",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-[#0D1060]",
      bg: "bg-blue-50",
    },
    {
      label: "Published Lesson Notes & AI Stories",
      value: "342",
      sub: "28 awaiting principal moderation",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Moderated AI CBT Quizzes",
      value: "118",
      sub: "4,920 student practice attempts",
      icon: <BrainCircuit className="w-5 h-5" />,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Official Scores Synced to CampusPRO",
      value: "19 Batches",
      sub: "100% teacher-verified audit trail",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-700",
      bg: "bg-purple-50",
    },
  ];

  const moderationQueue = [
    {
      title: "JSS 2 Mathematics — Algebraic Fractions & Word Problems (AI Storybook + Quiz)",
      author: "Mr. Tunde Ogunleye (Ikeja Campus)",
      alignment: "98% NERDC Aligned",
      status: "Ready for Approval",
    },
    {
      title: "SS 2 Physics — Projectile Motion & Vector Resolution (20 CBT Questions)",
      author: "Mrs. Funke Adebayo (Lekki Campus)",
      alignment: "96% NERDC Aligned",
      status: "Ready for Approval",
    },
    {
      title: "JSS 3 Basic Science — Chemical Symbols, Formulae & Equations",
      author: "Mr. Ibrahim Musa (Abuja Campus)",
      alignment: "94% NERDC Aligned",
      status: "Approved & Published",
    },
  ];

  const topicGaps = [
    {
      topic: "Quadratic Equations by Completing the Square",
      classLevel: "SS 2 Science",
      mastery: 44,
      remedialAssigned: "38 students assigned AI Story + 15 Flashcards",
    },
    {
      topic: "Balancing Redox Equations in Acidic Media",
      classLevel: "SS 2 Science",
      mastery: 49,
      remedialAssigned: "31 students assigned Remedial Practice Quiz",
    },
    {
      topic: "Linear Inequalities in One Variable",
      classLevel: "JSS 2 Gold",
      mastery: 52,
      remedialAssigned: "24 students assigned Visual Lesson Note",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Architecture Boundary Banner */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Principal Curriculum &amp; Learning Oversight
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            School-Wide NERDC Learning &amp; Topic-Gap Console
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor curriculum coverage, moderate AI lesson notes and quizzes, and audit official score pushes to CampusPRO.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/dashboard/admin/subjects"
            className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold transition-colors"
          >
            Moderate NERDC Content
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="px-4 py-2.5 rounded-2xl bg-[#0D1060] text-[#FBBC04] text-xs font-extrabold transition-colors"
          >
            Topic-Gap &amp; Sync Reports
          </Link>
        </div>
      </MotionRise>

      {/* KPI Cards */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <MotionRise
            key={i}
            delay={i * 0.05}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
            <div className="text-xs font-bold text-gray-800 mt-1">{stat.label}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
          </MotionRise>
        ))}
      </MotionStagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content & Assessment Moderation Queue */}
        <MotionRise className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                NERDC Lesson Note &amp; CBT Quiz Moderation Queue
              </h2>
              <p className="text-xs text-gray-500">
                Review teacher-authored and AI-generated learning materials before school-wide release.
              </p>
            </div>
            <Link
              href="/dashboard/admin/subjects"
              className="text-xs font-extrabold text-[#1565C0] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {moderationQueue.map((item, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.author} · <span className="text-emerald-700 font-bold">{item.alignment}</span>
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </MotionRise>

        {/* System-of-Record Handoff to CampusPRO & ResultsPRO */}
        <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            Zero-Duplication Boundary
          </span>
          <h2 className="text-base font-extrabold text-gray-900">
            School ERP &amp; Result Processing Live in CampusPRO &amp; ResultsPRO
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            To prevent duplicate databases, <strong>Manage Teachers</strong>, <strong>Manage Students</strong>, <strong>Classes/Subjects/Terms</strong>, <strong>Fees</strong>, and <strong>All Messaging</strong> are managed exclusively in <strong>CampusPRO</strong>.
          </p>
          <div className="space-y-2 pt-1 text-xs font-bold text-gray-700">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
              <span>Manage Teachers, Students &amp; Classes</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0D1060] text-[#FBBC04]">
                CampusPRO
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
              <span>School Messaging, Notices &amp; Circulars</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0D1060] text-[#FBBC04]">
                CampusPRO
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
              <span>Marksheet OCR, Result Audit &amp; Broadsheets</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#1565C0] text-white">
                ResultsPRO
              </span>
            </div>
          </div>
        </MotionRise>
      </div>

      {/* School-Wide Topic Learning Gaps */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Critical Topic Learning Gaps &amp; Active Remedial Loops
            </h2>
            <p className="text-xs text-gray-500">
              Topics where cohort mastery is below 55% across quiz and practice exam attempts.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topicGaps.map((gap, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#1565C0]">{gap.classLevel}</span>
                <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {gap.mastery}% Mastery
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-gray-900">{gap.topic}</h3>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                {gap.remedialAssigned}
              </p>
            </div>
          ))}
        </div>
      </MotionRise>
    </div>
  );
}
