"use client";

import React from "react";
import Link from "next/link";
import {
  IconBook as BookOpen,
  IconVideo as VideoIcon,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconTrendingUp as TrendingUp,
  IconSparkles as Sparkles,
  IconCloudDownload as CloudDownload,
  IconCircleCheck as CheckCircle,
  IconPlayerPlay as Play,
  IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const studentName = (user as any)?.name || user?.full_name || "Chidinma Adeleke";

  const metrics = [
    {
      label: "Overall Topic Mastery",
      value: "82%",
      sub: "Across 8 NERDC subjects",
      icon: <TrendingUp className="w-5 h-5" />,
      primary: true,
    },
    {
      label: "Notes & AI Stories Read",
      value: "34",
      sub: "4 downloaded for offline study",
      icon: <BookOpen className="w-5 h-5 text-[#146ef5]" />,
      bg: "bg-blue-50",
    },
    {
      label: "Video Lessons Watched",
      value: "18",
      sub: "3.5 hrs of NERDC video lectures",
      icon: <VideoIcon className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      label: "Quizzes & SRS Flashcards",
      value: "14,850 XP",
      sub: "9-Day active study streak",
      icon: <BrainCircuit className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
  ];

  const continueLearning = [
    {
      type: "Video Lesson",
      badgeColor: "bg-purple-50 text-purple-700",
      title: "Simplifying Algebraic Fractions with LCM (Step-by-Step Video)",
      subject: "Mathematics · JSS 2 Term 2 · Week 3",
      duration: "14:20",
      href: "/dashboard/videos/vid-math-1",
    },
    {
      type: "Lesson Note & AI Story",
      badgeColor: "bg-blue-50 text-[#146ef5]",
      title: "Algebraic Fractions, Word Problems & Commercial Arithmetic",
      subject: "Mathematics · JSS 2 Term 2 · Week 3",
      duration: "8 min read",
      href: "/dashboard/notes/note-math-1",
    },
    {
      type: "SRS Flashcard Deck",
      badgeColor: "bg-emerald-50 text-emerald-700",
      title: "Cell Organelles & Plant vs. Animal Cells SRS Deck",
      subject: "Biology · Term 1 · 4 cards due today",
      duration: "5 min review",
      href: "/dashboard/flashcards/fc-bio-1",
    },
    {
      type: "Practice CBT Quiz",
      badgeColor: "bg-amber-50 text-amber-800",
      title: "Algebraic Fractions & Linear Equations Diagnostic Quiz",
      subject: "Mathematics · Best Score: 80%",
      duration: "15 min CBT",
      href: "/dashboard/quizzes/quiz-math-1",
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Welcome Banner */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO — NERDC Digital Learning &amp; Offline-First Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {studentName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Laurel Academy (Ikeja Campus) · JSS 2 Gold · Synced with CampusPRO &amp; ResultsPRO
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/dashboard/videos">
            <Button className="bg-[#0D1060] hover:bg-[#151980] text-white font-extrabold rounded-2xl text-xs h-10 px-4">
              <VideoIcon className="w-4 h-4 mr-1.5" /> Watch Video Lessons
            </Button>
          </Link>
          <Link href="/dashboard/notes">
            <Button variant="outline" className="rounded-2xl text-xs font-extrabold h-10 px-4">
              <BookOpen className="w-4 h-4 mr-1.5" /> Class Notes
            </Button>
          </Link>
          <Link href="/dashboard/quizzes">
            <Button variant="outline" className="rounded-2xl text-xs font-extrabold h-10 px-4">
              <BrainCircuit className="w-4 h-4 mr-1.5" /> Take Quiz
            </Button>
          </Link>
        </div>
      </MotionRise>

      {/* Top Metric Cards */}
      <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) =>
          m.primary ? (
            <MotionRise
              key={idx}
              className="bg-gradient-to-br from-[#0D1060] to-[#1565C0] rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  {m.label}
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center">
                  {m.icon}
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold">{m.value}</div>
                <p className="text-xs text-white/80 mt-1">{m.sub}</p>
              </div>
            </MotionRise>
          ) : (
            <MotionRise
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-2xl ${m.bg} flex items-center justify-center`}>
                  {m.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Synced
                </span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{m.value}</div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">{m.label}</div>
                <p className="text-[11px] text-gray-500 mt-0.5">{m.sub}</p>
              </div>
            </MotionRise>
          )
        )}
      </MotionStagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Modal Learning Stream (Videos, Notes, Flashcards, Quizzes) */}
        <MotionRise className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Continue Your NERDC Learning Stream
              </h2>
              <p className="text-xs text-gray-500">
                Pick up where you left off across Video Lessons, Markdown Notes, SRS Flashcards, and Quizzes.
              </p>
            </div>
            <Link href="/dashboard/subjects" className="text-xs font-extrabold text-[#146ef5] hover:underline">
              All Subjects →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {continueLearning.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-gray-50/70 -mx-3 px-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.type}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">{item.duration}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-[#146ef5] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.subject}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#0D1060] group-hover:text-white text-gray-700 flex items-center justify-center shrink-0 transition-colors">
                  <Play className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </MotionRise>

        {/* ResultsPRO Remedial Loop + Offline Sync Status */}
        <div className="space-y-6">
          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              ResultsPRO → ClassroomPRO Remedial Pack
            </span>
            <h3 className="text-base font-extrabold text-gray-900">
              Algebraic Fractions &amp; Word Problems
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Recommended from your Second Term diagnostic to boost your Mathematics score from 74% to 85%+.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-700">
              <Link href="/dashboard/videos/vid-math-1" className="p-2.5 rounded-xl bg-purple-50 text-purple-800 flex items-center gap-1.5">
                <VideoIcon className="w-4 h-4 shrink-0" /> 1 Video Lesson
              </Link>
              <Link href="/dashboard/notes/note-math-1" className="p-2.5 rounded-xl bg-blue-50 text-[#146ef5] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 shrink-0" /> 1 Note + Story
              </Link>
              <Link href="/dashboard/flashcards/fc-math-1" className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 shrink-0" /> 15 Flashcards
              </Link>
              <Link href="/dashboard/quizzes/quiz-math-1" className="p-2.5 rounded-xl bg-amber-50 text-amber-800 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 shrink-0" /> 10-Q Quiz
              </Link>
            </div>
          </MotionRise>

          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                Offline-First PWA Ready
              </span>
              <span className="text-[11px] font-bold text-gray-400">IndexedDB Synced</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              4 Lesson Notes, 2 Video Lectures, and 2 Flashcard Decks are cached locally for offline study.
            </p>
            <Link href="/dashboard/downloads" className="block pt-1">
              <Button variant="outline" className="w-full rounded-xl text-xs font-extrabold h-9">
                <CloudDownload className="w-4 h-4 mr-1.5" /> Manage Offline Downloads
              </Button>
            </Link>
          </MotionRise>
        </div>
      </div>
    </div>
  );
}
