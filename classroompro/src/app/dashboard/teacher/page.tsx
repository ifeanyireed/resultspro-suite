"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconFilePlus as FilePlus,
  IconBook as BookOpen,
  IconChartBar as BarChart3,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconChevronRight as ChevronRight,
  IconCheck as Check,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { syncEngine } from "@/lib/syncEngine";

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const teacherName = user?.full_name || "Mr. Tunde Ogunleye";
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { packs: list } = await syncEngine.fetchStudyPacksCatalog();
      setPacks(list);
    };
    load();
    return syncEngine.subscribe(load);
  }, []);

  const totalNotes = packs.reduce((acc, p) => acc + (p.notes_count || 0), 0);
  const totalQuizzes = packs.reduce(
    (acc, p) => acc + (p.quizzes_count || 0) + (p.exams_count || 0),
    0
  );
  const totalFlashcards = packs.reduce((acc, p) => acc + (p.flashcards_count || 0), 0);

  const teacherStats = [
    {
      label: "Authored Study Packs",
      value: `${packs.length} Packs`,
      sub: `${packs.filter((p) => p.pricing_type === "FREE").length} Free · ${
        packs.filter((p) => p.pricing_type === "PAID").length
      } Paid`,
      icon: <Layers className="w-5 h-5 text-[#146ef5]" />,
      bg: "bg-blue-50",
    },
    {
      label: "Scheme Notes & AI Stories",
      value: `${totalNotes} Published`,
      sub: "100% NERDC scheme aligned",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Quizzes, CBT Exams & SRS Cards",
      value: `${totalQuizzes} Assessments`,
      sub: `${totalFlashcards} SRS flashcards bundled`,
      icon: <BrainCircuit className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Scores Synced to CampusPRO",
      value: "6 Batches",
      sub: "Traceable official CA push",
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Teacher Digital Learning &amp; Study Pack Creator Hub
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Hello, {teacherName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Create Free or Paid Curriculum &amp; Scheme-of-Work Study Packs (Notes, Videos, Flashcards, Quizzes, CBT Exams &amp; Badges), and approve official CA scores for CampusPRO.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/teacher/study-packs">
            <Button className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-extrabold rounded-2xl">
              <Layers className="w-4 h-4 mr-2" /> Study Pack Creator Studio (Free / Paid)
            </Button>
          </Link>
          <Link href="/dashboard/teacher/create-note">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-900 font-extrabold rounded-2xl"
            >
              <FilePlus className="w-4 h-4 mr-2" /> Author Lesson Note
            </Button>
          </Link>
        </div>
      </MotionRise>

      {/* Stats Grid */}
      <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teacherStats.map((stat, idx) => (
          <MotionRise
            key={idx}
            delay={idx * 0.05}
            className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100"
          >
            <div
              className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900">{stat.value}</h4>
            <p className="text-xs font-bold text-gray-800 mt-1">{stat.label}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</p>
          </MotionRise>
        ))}
      </MotionStagger>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Teacher Study Packs */}
        <MotionRise className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Your Published &amp; Scheme-Aligned Study Packs
              </h3>
              <p className="text-xs text-gray-500">
                Live packs compiled to Neon Object Storage for your assigned classes.
              </p>
            </div>
            <Link
              href="/dashboard/teacher/study-packs"
              className="text-xs font-extrabold text-[#146ef5] flex items-center"
            >
              Create or Edit Packs <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <div
                key={pack.pack_id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#146ef5] text-white">
                      {pack.class_label} · {pack.subject_name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        pack.pricing_type === "PAID"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {pack.pricing_type === "PAID"
                        ? `₦${(pack.price_naira || (pack.price_kobo || 0) / 100).toLocaleString()}`
                        : "FREE"}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-900 line-clamp-2">
                    {pack.title}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Notes &amp; Videos</span>
                      <span className="font-bold text-gray-900">
                        {pack.notes_count} Notes · {pack.videos_count} Vids
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Flashcards &amp; Quizzes</span>
                      <span className="font-bold text-emerald-700">
                        {pack.flashcards_count} Cards · {pack.quizzes_count} Quizzes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CBT Exam &amp; Badges</span>
                      <span className="font-bold text-amber-700">
                        {pack.exams_count} Exam · 🏅 {pack.badges_count} Badges
                      </span>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/teacher/study-packs" className="block pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-900 text-xs font-extrabold rounded-xl h-9"
                  >
                    Manage Study Pack
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </MotionRise>

        {/* System-of-Record Boundary Card */}
        <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider">
            Unified Trio Workflow
          </span>
          <h3 className="text-base font-extrabold text-gray-900">
            Study Packs vs. Score Approval &amp; Messaging
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            In ClassroomPRO, students study your Scheme-of-Work packs offline and earn badges, while you explicitly approve which official CA score syncs to <strong>CampusPRO</strong>.
          </p>
          <ul className="space-y-2 text-xs text-gray-700 font-semibold">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Creator controls <strong>Free (₦0)</strong> vs. <strong>Paid (₦)</strong> pricing per Study Pack.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Parent &amp; Faculty Messaging lives exclusively in <strong>CampusPRO Messaging</strong>.
              </span>
            </li>
          </ul>
          <Link href="/dashboard/teacher/analytics" className="block pt-2">
            <Button className="w-full bg-[#0D1060] hover:bg-[#151980] text-white text-xs font-extrabold rounded-xl h-10">
              Open Topic Mastery &amp; CampusPRO Sync
            </Button>
          </Link>
        </MotionRise>
      </div>
    </div>
  );
}
