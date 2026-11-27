"use client";

import React from "react";
import Link from "next/link";
import {
  IconTrendingUp as TrendingUp,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconCheck as Check,
  IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function ParentLearningHub() {
  const user = useAuthStore((state) => state.user);
  const parentName = user?.full_name || "Chief & Mrs. O. Adeleke";

  const wardRemedialPacks = [
    {
      wardName: "Chidinma Adeleke",
      classLevel: "JSS 2 Gold · Laurel Academy (Ikeja Campus)",
      overallMastery: 82,
      streak: "9-Day Study Streak",
      activeRemedial: [
        {
          topic: "Algebraic Fractions & Word Problems",
          subject: "Mathematics",
          trigger: "Triggered by ResultsPRO Term 2 Diagnostic",
          assets: "1 AI Illustrated Story · 15 SRS Flashcards · 10-Q Practice Quiz",
          progress: 75,
        },
        {
          topic: "Chemical Formulae & Balancing Equations",
          subject: "Basic Science",
          trigger: "Triggered by ClassroomPRO Topic Gap Detector",
          assets: "1 NERDC Visual Lesson Note · 12 SRS Flashcards",
          progress: 90,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Parent Learning &amp; Remedial Revision Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Hello, {parentName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your ward&apos;s topic-level mastery, daily revision streaks, and AI remedial packs triggered from ResultsPRO.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/parent/progress">
            <Button className="bg-[#0D1060] hover:bg-[#151980] text-white font-extrabold rounded-2xl">
              <TrendingUp className="w-4 h-4 mr-2" /> Full Topic Mastery Report
            </Button>
          </Link>
        </div>
      </MotionRise>

      {/* Ward Remedial Loop Cards */}
      {wardRemedialPacks.map((ward, idx) => (
        <MotionRise key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[11px] font-extrabold text-[#146ef5] uppercase tracking-wider">
                Ward Profile Synced from CampusPRO
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">{ward.wardName}</h2>
              <p className="text-xs text-gray-500">{ward.classLevel}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                {ward.overallMastery}% Topic Mastery
              </div>
              <div className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 text-xs font-extrabold">
                {ward.streak}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#146ef5]" />
              Active Remedial Revision Packs (ResultsPRO → ClassroomPRO Continuous Loop)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ward.activeRemedial.map((pack, pIdx) => (
                <div key={pIdx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5]">
                      {pack.subject}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">{pack.trigger}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-gray-900">{pack.topic}</h4>
                  <p className="text-xs text-gray-600 font-medium">{pack.assets}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Remedial Completion</span>
                      <span className="text-emerald-700">{pack.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pack.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href="/dashboard/notes" className="flex-1">
                      <Button variant="outline" className="w-full text-xs font-extrabold h-9 rounded-xl border-gray-200">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Open Story / Note
                      </Button>
                    </Link>
                    <Link href="/dashboard/quizzes" className="flex-1">
                      <Button className="w-full text-xs font-extrabold h-9 rounded-xl bg-[#0D1060] text-white">
                        <BrainCircuit className="w-3.5 h-3.5 mr-1.5" /> Practice Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionRise>
      ))}

      {/* System Boundary Notice (Replaces duplicate My Children, Billing & Messages tabs) */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#146ef5] text-white">
            CampusPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">Teacher Messaging &amp; School Circulars</h3>
          <p className="text-xs text-gray-500">
            All direct messages with subject teachers and official school notices are unified inside <strong>CampusPRO Messaging</strong>.
          </p>
        </MotionRise>
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#146ef5] text-white">
            CampusPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">Bursary, Fees &amp; Ward Enrolment</h3>
          <p className="text-xs text-gray-500">
            Tuition invoices, payment receipts, attendance logs, and ward profile linking live exclusively in <strong>CampusPRO</strong>.
          </p>
        </MotionRise>
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#1565C0] text-white">
            ResultsPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">Official Terminal Report Cards &amp; AI Interpreter</h3>
          <p className="text-xs text-gray-500">
            Terminal report cards, plain-language AI result interpretation, and scratch-card validation live in <strong>ResultsPRO</strong>.
          </p>
        </MotionRise>
      </MotionStagger>
    </div>
  );
}
