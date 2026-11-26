"use client";

import React, { useState } from "react";
import {
  IconBook as BookOpen,
  IconSearch as Search,
  IconCheck as Check,
  IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

const nerdcContentData = [
  {
    id: 1,
    subject: "Mathematics",
    category: "STEM · JSS 1–SS 3",
    notes: 145,
    aiStories: 42,
    flashcardDecks: 68,
    cbtQuizzes: 54,
    coverage: 94,
  },
  {
    id: 2,
    subject: "English Language",
    category: "Humanities · JSS 1–SS 3",
    notes: 132,
    aiStories: 56,
    flashcardDecks: 74,
    cbtQuizzes: 48,
    coverage: 91,
  },
  {
    id: 3,
    subject: "Basic Science & Biology",
    category: "STEM · JSS 1–SS 3",
    notes: 98,
    aiStories: 31,
    flashcardDecks: 52,
    cbtQuizzes: 39,
    coverage: 88,
  },
  {
    id: 4,
    subject: "Physics",
    category: "STEM · SS 1–SS 3",
    notes: 76,
    aiStories: 19,
    flashcardDecks: 44,
    cbtQuizzes: 32,
    coverage: 86,
  },
  {
    id: 5,
    subject: "Chemistry",
    category: "STEM · SS 1–SS 3",
    notes: 82,
    aiStories: 22,
    flashcardDecks: 49,
    cbtQuizzes: 35,
    coverage: 85,
  },
  {
    id: 6,
    subject: "Civic Education & Government",
    category: "General · JSS 1–SS 3",
    notes: 64,
    aiStories: 28,
    flashcardDecks: 38,
    cbtQuizzes: 29,
    coverage: 92,
  },
];

export default function NerdcContentModerationPage() {
  const [query, setQuery] = useState("");
  const filtered = nerdcContentData.filter((s) =>
    s.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO Content Moderation · Subject Definitions Synced from CampusPRO
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            NERDC Syllabus &amp; Learning Content Repository
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Subject creation and teacher allocations are managed in <strong>CampusPRO</strong>. Use this console to audit NERDC lesson notes, AI storybooks, flashcard decks, and moderated quizzes per subject.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter NERDC subjects..."
            className="pl-10 bg-gray-50 border-gray-200 rounded-2xl text-gray-900"
          />
        </div>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((sub, idx) => (
          <MotionRise
            key={sub.id}
            delay={idx * 0.04}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {sub.coverage}% NERDC Covered
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-900">{sub.subject}</h3>
              <p className="text-xs font-bold text-gray-500 mt-0.5">{sub.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50">
                <span className="font-extrabold text-gray-900">{sub.notes}</span>{" "}
                <span className="text-gray-500">Lesson Notes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50">
                <span className="font-extrabold text-amber-700">{sub.aiStories}</span>{" "}
                <span className="text-gray-500">AI Stories</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50">
                <span className="font-extrabold text-[#146ef5]">{sub.flashcardDecks}</span>{" "}
                <span className="text-gray-500">SRS Decks</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50">
                <span className="font-extrabold text-emerald-700">{sub.cbtQuizzes}</span>{" "}
                <span className="text-gray-500">CBT Quizzes</span>
              </div>
            </div>
          </MotionRise>
        ))}
      </MotionStagger>
    </div>
  );
}
