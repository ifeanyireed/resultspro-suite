"use client";

import React from "react";
import Link from "next/link";
import {
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconChartBar as BarChart3,
  IconCheck as Check,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

const assignedCohorts = [
  {
    id: 1,
    name: "JSS 2 Gold — Mathematics",
    campus: "Laurel Academy (Ikeja Campus)",
    students: 42,
    mastery: "78%",
    notes: 14,
    aiStories: 6,
    quizzes: 5,
    lastSync: "CA1 & CA2 Synced to CampusPRO",
  },
  {
    id: 2,
    name: "SS 2 Science — Further Mathematics",
    campus: "Laurel Academy (Ikeja Campus)",
    students: 38,
    mastery: "74%",
    notes: 12,
    aiStories: 4,
    quizzes: 6,
    lastSync: "CA1 Synced to CampusPRO",
  },
  {
    id: 3,
    name: "SS 3 Science — Mathematics",
    campus: "Laurel Academy (Ikeja Campus)",
    students: 45,
    mastery: "83%",
    notes: 18,
    aiStories: 5,
    quizzes: 8,
    lastSync: "CA1 & CA2 Synced to CampusPRO",
  },
];

export default function AssignedClassesLearningView() {
  return (
    <div className="space-y-6 py-4">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider mb-2">
            Synced Read-Only from CampusPRO Academic ERP
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Your Assigned Classes &amp; Learning Streams
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Class creation, student enrolment, and daily attendance roll-call live in <strong>CampusPRO</strong>. Manage each cohort&apos;s NERDC lesson notes, AI quizzes, and official CA score sync below.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <Link href="/dashboard/teacher/create-note">
            <Button className="bg-[#0D1060] text-[#FBBC04] font-extrabold rounded-2xl text-xs">
              + Author Note / AI Story
            </Button>
          </Link>
          <Link href="/dashboard/teacher/create-quiz">
            <Button variant="outline" className="border-gray-200 text-gray-900 font-extrabold rounded-2xl text-xs">
              + AI Quiz Generator
            </Button>
          </Link>
        </div>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {assignedCohorts.map((cls, i) => (
          <MotionRise
            key={cls.id}
            delay={i * 0.05}
            className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 space-y-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#146ef5]">
                  {cls.campus}
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">{cls.name}</h3>
                <p className="text-xs text-gray-500">{cls.students} Students (CampusPRO Roster)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                {cls.mastery} Mastery
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <div className="text-base font-extrabold text-gray-900">{cls.notes}</div>
                <div className="text-[10px] font-bold text-gray-500">Notes</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <div className="text-base font-extrabold text-amber-700">{cls.aiStories}</div>
                <div className="text-[10px] font-bold text-gray-500">AI Stories</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <div className="text-base font-extrabold text-[#146ef5]">{cls.quizzes}</div>
                <div className="text-[10px] font-bold text-gray-500">CBT Quizzes</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Check className="w-4 h-4 shrink-0" />
              <span>{cls.lastSync}</span>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard/teacher/analytics" className="flex-1">
                <Button className="w-full bg-[#0D1060] hover:bg-[#151980] text-[#FBBC04] text-xs font-extrabold h-10 rounded-xl">
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  Topic Gaps &amp; Sync Scores
                </Button>
              </Link>
            </div>
          </MotionRise>
        ))}
      </MotionStagger>
    </div>
  );
}
