"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconChartBar as BarChart3,
  IconCheck as Check,
  IconAlertTriangle as AlertTriangle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { syncEngine } from "@/lib/syncEngine";

export default function PrincipalCurriculumOversightConsole() {
  const [packs, setPacks] = useState<any[]>([]);
  const [officialScoresCount, setOfficialScoresCount] = useState<number>(0);

  const loadPacks = async () => {
    const [{ packs: list }, scoresData] = await Promise.all([
      syncEngine.fetchStudyPacksCatalog(),
      import("@/lib/api")
        .then((m) => m.getCampusOfficialExamScores())
        .catch(() => ({ official_scores: [] })),
    ]);
    setPacks(list);
    setOfficialScoresCount(
      Array.isArray(scoresData?.official_scores)
        ? scoresData.official_scores.length
        : 0
    );
  };

  useEffect(() => {
    loadPacks();
    return syncEngine.subscribe(loadPacks);
  }, []);

  const totalNotes = packs.reduce((acc, p) => acc + (p.notes_count || 0), 0);
  const totalQuizzes = packs.reduce(
    (acc, p) => acc + (p.quizzes_count || 0) + (p.exams_count || 0),
    0
  );
  const totalBadges = packs.reduce((acc, p) => acc + (p.badges_count || 0), 0);

  const stats = [
    {
      label: "Active Scheme Study Packs",
      value: `${packs.length} Packs`,
      sub: `${packs.filter((p) => p.pricing_type === "FREE").length} Free · ${
        packs.filter((p) => p.pricing_type === "PAID").length
      } Paid in Neon Storage`,
      icon: <Layers className="w-5 h-5" />,
      color: "text-[#146ef5]",
      bg: "bg-blue-50",
    },
    {
      label: "Published Notes & Video Lectures",
      value: `${totalNotes} Notes`,
      sub: "Bundled with cached diagrams & YouTube links",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Quizzes, CBT Exams & Badges",
      value: `${totalQuizzes} CBT Items`,
      sub: `${totalBadges} Mastery Badges configured`,
      icon: <BrainCircuit className="w-5 h-5" />,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Official Scores Synced to CampusPRO",
      value: `${officialScoresCount} Records`,
      sub: "100% teacher-verified audit trail",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-700",
      bg: "bg-purple-50",
    },
  ];

  const topicGaps = [
    {
      topic: "Algebraic Fractions & Linear Inequalities",
      classLevel: "JSS 2 Gold",
      mastery: 52,
      remedialAssigned: "Assigned NERDC JSS 2 Mathematics Second Term Study Pack",
    },
    {
      topic: "Projectile Motion & Wave Optics",
      classLevel: "SSS 2 Science",
      mastery: 48,
      remedialAssigned: "Assigned NERDC SSS 2 Physics WAEC Study Pack",
    },
    {
      topic: "Whole Numbers to 1,000,000 & Place Value Abacus",
      classLevel: "Primary 4",
      mastery: 64,
      remedialAssigned: "Assigned NERDC Primary 4 First Term Study Pack",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Architecture Boundary Banner */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Principal Curriculum, Study Pack Creator &amp; Learning Oversight
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            School-Wide NERDC Study Packs &amp; Topic-Gap Console
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create or moderate Free and Paid Scheme-of-Work Study Packs, manage refunds/revocations, and audit score pushes to CampusPRO.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link href="/dashboard/admin/study-packs">
            <Button className="px-4 py-2.5 rounded-2xl bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-extrabold">
              <Layers className="w-4 h-4 mr-1.5" /> Study Pack Creator Studio (Free / Paid)
            </Button>
          </Link>
          <Link
            href="/dashboard/admin/subjects"
            className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold transition-colors"
          >
            Moderate NERDC Content
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
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
            <div className="text-xs font-bold text-gray-800 mt-1">{stat.label}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
          </MotionRise>
        ))}
      </MotionStagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Study Packs Moderation & Pricing Queue */}
        <MotionRise className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Active Study Packs &amp; Pricing Moderation Queue
              </h2>
              <p className="text-xs text-gray-500">
                Review teacher-created and school-wide study packs stored in Neon Object Storage.
              </p>
            </div>
            <Link
              href="/dashboard/admin/study-packs"
              className="text-xs font-extrabold text-[#146ef5] hover:underline"
            >
              Open Creator Studio →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {packs.map((pack) => (
              <div
                key={pack.pack_id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#146ef5] text-white">
                      {pack.curriculum} · {pack.class_label} · {pack.subject_name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        pack.pricing_type === "PAID"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {pack.pricing_type === "PAID"
                        ? `PAID • ₦${(pack.price_naira || (pack.price_kobo || 0) / 100).toLocaleString()}`
                        : "FREE • ₦0"}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900">{pack.title}</h3>
                  <p className="text-xs text-gray-500">
                    {pack.creator_name} ({pack.creator_role}) · {pack.notes_count} Notes ·{" "}
                    {pack.videos_count} Videos · {pack.flashcards_count} SRS Cards ·{" "}
                    {pack.quizzes_count} Quizzes · {pack.exams_count} CBT Exam · 🏅{" "}
                    {pack.badges_count} Badges
                  </p>
                </div>
                <Link href="/dashboard/admin/study-packs" className="shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                    {pack.moderation_status || "PUBLISHED"}
                  </span>
                </Link>
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
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#146ef5] text-white">
                CampusPRO
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
              <span>School Messaging, Notices &amp; Circulars</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#146ef5] text-white">
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
              Critical Topic Learning Gaps &amp; Active Remedial Study Packs
            </h2>
            <p className="text-xs text-gray-500">
              Topics where cohort mastery is below 65% across quiz and practice exam attempts.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topicGaps.map((gap, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#146ef5]">
                  {gap.classLevel}
                </span>
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
