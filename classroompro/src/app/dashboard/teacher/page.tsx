"use client";

import React from "react";
import Link from "next/link";
import {
  IconFilePlus as FilePlus,
  IconBook as BookOpen,
  IconChartBar as BarChart3,
  IconBrain as BrainCircuit,
  IconChevronRight as ChevronRight,
  IconCheck as Check,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const teacherName = user?.full_name || "Mr. Tunde Ogunleye";

  const teacherStats = [
    {
      label: "CampusPRO Synced Classes",
      value: "4 Cohorts",
      sub: "156 enrolled students",
      icon: <BookOpen className="w-5 h-5 text-[#146ef5]" />,
      bg: "bg-blue-50",
    },
    {
      label: "NERDC Notes & AI Stories",
      value: "24 Published",
      sub: "98% curriculum aligned",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Moderated CBT Quizzes",
      value: "14 Active",
      sub: "640 attempt records tracked",
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

  const myClasses = [
    { name: "JSS 2 Gold — Mathematics", students: 42, mastery: "78%", weakTopic: "Algebraic Fractions" },
    { name: "SS 2 Science — Further Maths", students: 38, mastery: "74%", weakTopic: "Vectors & Mechanics" },
    { name: "SS 3 Science — Mathematics", students: 45, mastery: "83%", weakTopic: "Integration by Parts" },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Teacher Digital Learning &amp; Formative Assessment Hub
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Hello, {teacherName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Author NERDC lesson notes &amp; AI stories, generate moderated quizzes, and approve official CA scores for CampusPRO.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/teacher/create-note">
            <Button className="bg-[#0D1060] hover:bg-[#151980] text-white font-extrabold rounded-2xl">
              <FilePlus className="w-4 h-4 mr-2" /> Author Lesson Note / Story
            </Button>
          </Link>
          <Link href="/dashboard/teacher/create-quiz">
            <Button variant="outline" className="border-gray-200 text-gray-900 font-extrabold rounded-2xl">
              <BrainCircuit className="w-4 h-4 mr-2" /> AI Quiz Generator
            </Button>
          </Link>
        </div>
      </MotionRise>

      {/* Stats Grid */}
      <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teacherStats.map((stat, idx) => (
          <MotionRise key={idx} delay={idx * 0.05} className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900">{stat.value}</h4>
            <p className="text-xs font-bold text-gray-800 mt-1">{stat.label}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</p>
          </MotionRise>
        ))}
      </MotionStagger>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assigned Classes (Synced from CampusPRO) */}
        <MotionRise className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Assigned Classes (Synced Read-Only from CampusPRO)
              </h3>
              <p className="text-xs text-gray-500">
                Class rosters and subject allocations are managed in CampusPRO.
              </p>
            </div>
            <Link href="/dashboard/teacher/analytics" className="text-xs font-extrabold text-[#146ef5] flex items-center">
              Topic Mastery &amp; Score Sync <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {myClasses.map((cls, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-extrabold text-gray-900">{cls.name}</h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">CampusPRO Roster</span>
                    <span className="font-bold text-gray-900">{cls.students} Students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg. Topic Mastery</span>
                    <span className="font-bold text-emerald-700">{cls.mastery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Focus Gap</span>
                    <span className="font-bold text-amber-700">{cls.weakTopic}</span>
                  </div>
                </div>
                <Link href="/dashboard/teacher/analytics" className="block pt-2">
                  <Button variant="outline" className="w-full border-gray-200 text-gray-900 text-xs font-extrabold rounded-xl h-9">
                    Inspect Mastery &amp; Sync CA
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </MotionRise>

        {/* System-of-Record Boundary Card (Replaces duplicate Messages widget) */}
        <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider">
            Unified Trio Workflow
          </span>
          <h3 className="text-base font-extrabold text-gray-900">
            Score Approval vs. Messaging &amp; OCR
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            In ClassroomPRO, students can retry practice quizzes multiple times, while you explicitly approve which official CA score syncs to <strong>CampusPRO</strong>.
          </p>
          <ul className="space-y-2 text-xs text-gray-700 font-semibold">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Parent &amp; Faculty Messaging lives exclusively in <strong>CampusPRO Messaging</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Handwritten Marksheet OCR &amp; Report Card Comments live in <strong>ResultsPRO</strong>.</span>
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
