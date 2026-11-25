"use client";

import React, { useState } from "react";
import {
  SparklesIcon,
  AcademicCapIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface ParentQA {
  id: string;
  question: string;
  answer: string;
}

const PARENT_QA_LIST: ParentQA[] = [
  {
    id: "qa-1",
    question: "Why did my child perform poorly in English Language?",
    answer:
      "While Alex scored 17/20 in Continuous Assessment 1 (Grammar & Vocabulary), his ClassroomPRO assessment history over the term shows he struggled with Comprehension Inference and Summary Writing (44% accuracy across 4 class quizzes), which accounted for 40% of the terminal examination paper.",
  },
  {
    id: "qa-2",
    question: "Which subjects should we concentrate on during the holidays?",
    answer:
      "Focus primarily on English Language (Comprehension & Summary Writing) and Basic Technology (Isometric Drawing). In Mathematics, Alex improved by +11% this term, though practicing Word Problems with Percentages for 15 minutes twice a week will keep his momentum strong.",
  },
  {
    id: "qa-3",
    question: "Has my child's performance improved compared to last term?",
    answer:
      "Yes! Alex's overall average rose from 74.2% in 1st Term to 79.8% in 2nd Term at Laurel Academy (Ikeja Campus), moving him into the top 15% of JSS 2 Gold. He recorded significant gains in Mathematics (+11%), Basic Science (+8%), and Civic Education (+6%).",
  },
  {
    id: "qa-4",
    question: "What can I do at home to support learning?",
    answer:
      "We recommend 20 minutes of daily guided reading using the ClassroomPRO Interactive AI Story pack below, followed by the 15-card Comprehension & Vocabulary Spaced-Repetition Flashcard deck.",
  },
];

export const ParentResultInterpreter: React.FC = () => {
  const [selectedQA, setSelectedQA] = useState<ParentQA>(PARENT_QA_LIST[0]);
  const [launchedPack, setLaunchedPack] = useState<string | null>(null);

  const subjectSummaries = [
    {
      subject: "Mathematics",
      score: "88%",
      delta: "+11% vs 1st Term",
      status: "Excellent performance",
      tone: "emerald",
      detail: "Mastered Linear Equations & Geometry; minor review on Percentages.",
    },
    {
      subject: "Basic Science",
      score: "85%",
      delta: "+8% vs 1st Term",
      status: "Consistent performance",
      tone: "blue",
      detail: "Strong practical & CBT quiz accuracy across all term modules.",
    },
    {
      subject: "Civic Education",
      score: "91%",
      delta: "+6% vs 1st Term",
      status: "Significant improvement",
      tone: "emerald",
      detail: "Top 3 in JSS 2 Gold (Ikeja Campus).",
    },
    {
      subject: "English Language",
      score: "56%",
      delta: "-5% vs 1st Term",
      status: "Needs improvement",
      tone: "amber",
      detail: "ClassroomPRO pinpoints gaps in Summary Writing & Comprehension.",
    },
  ];

  const remedialPacks = [
    {
      id: "pack-eng",
      subject: "English Language",
      gapTopic: "Comprehension Inference & Summary Writing",
      detectedFrom: "ClassroomPRO Assessment History (4 Quizzes · 44% Accuracy)",
      resources: [
        "NERDC JSS 2 Lesson Note: Identifying Topic Sentences",
        "AI Interactive Story: 'The Lagos Lagoon Mystery' (Reading Comprehension)",
        "15 Spaced-Repetition Flashcards + 10-Question Practice Quiz",
      ],
    },
    {
      id: "pack-math",
      subject: "Mathematics",
      gapTopic: "Fractions & Word Problems with Percentages",
      detectedFrom: "ClassroomPRO Assessment History (3 Quizzes · 58% Accuracy)",
      resources: [
        "NERDC JSS 2 Lesson Note: Fractions, Ratios & Commercial Arithmetic",
        "AI Interactive Story: 'Sharing Shares at Balogun Market'",
        "12 Spaced-Repetition Flashcards + 10-Question CBT Drill",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* AI Plain-Language Executive Summary Card */}
      <div className="bg-[#0D1060] text-white rounded-3xl p-6 md:p-8 shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider w-fit">
            <SparklesIcon className="w-4 h-4" /> AI Parent Result Interpretation · Laurel Academy (Ikeja Campus)
          </div>
          <span className="text-xs text-white/70 font-bold">
            Student: Alex Johnson (JSS 2 Gold) · 2nd Term 2025/2026
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
          Your Child&apos;s Academic Progress Explained in Plain Language
        </h2>

        <div className="p-5 rounded-2xl bg-white/10 border border-white/15 text-sm md:text-base text-white/95 leading-relaxed">
          &ldquo;Your child has improved in <strong>three subjects</strong> compared with the previous term (Mathematics, Basic Science, and Civic Education), raising his overall term average to <strong>79.8%</strong>. However, <strong>English Language (56%)</strong> remains an area requiring attention—ClassroomPRO learning records show he understands grammar rules well but loses marks in <strong>Comprehension Inference and Summary Writing</strong>. We recommend 20 minutes of daily reading practice using his personalized ClassroomPRO revision pack below.&rdquo;
        </div>

        {/* Subject Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {subjectSummaries.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white text-gray-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-gray-900">{item.subject}</span>
                  <span className="text-sm font-black text-[#0D1060]">{item.score}</span>
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${
                    item.tone === "emerald"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.tone === "blue"
                      ? "bg-blue-50 text-[#146ef5]"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
                <p className="text-[11px] text-gray-600 leading-snug">{item.detail}</p>
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-3 pt-2 border-t border-gray-100">
                {item.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Parent Q&A Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Ask About Your Child&apos;s Result
            </h3>
            <p className="text-xs text-gray-500">
              Tap a question below to see how ResultsPRO + ClassroomPRO explain your child&apos;s performance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PARENT_QA_LIST.map((qa) => (
            <button
              key={qa.id}
              onClick={() => setSelectedQA(qa)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedQA.id === qa.id
                  ? "bg-[#0D1060] text-[#FBBC04] shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <QuestionMarkCircleIcon className="w-4 h-4 shrink-0" />
              {qa.question}
            </button>
          ))}
        </div>

        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-[#146ef5]">
            AI Academic Advisor Response
          </div>
          <p className="text-sm text-gray-800 font-medium leading-relaxed">
            {selectedQA.answer}
          </p>
        </div>
      </div>

      {/* Closed-Loop ClassroomPRO Remedial Revision Recommendations */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#0D1060] uppercase tracking-wider mb-1">
              <BoltIcon className="w-4 h-4 text-[#FBBC04]" /> Continuous Academic Improvement Loop
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Recommended ClassroomPRO Revision Packs (Based on Exact Performance Gaps)
            </h3>
            <p className="text-xs text-gray-500">
              Connected directly to ClassroomPRO&apos;s 2-year topic mastery history so your child can close specific concept gaps before next term.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {remedialPacks.map((pack) => (
            <div
              key={pack.id}
              className="p-6 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider">
                    {pack.subject}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Targeted Gap Intervention
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-gray-900">
                  Focus Topic: {pack.gapTopic}
                </h4>
                <p className="text-xs text-gray-500 font-medium">{pack.detectedFrom}</p>

                <ul className="space-y-2 pt-2">
                  {pack.resources.map((res, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-gray-800 font-semibold flex items-start gap-2"
                    >
                      <BookOpenIcon className="w-4 h-4 text-[#146ef5] shrink-0 mt-0.5" />
                      {res}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setLaunchedPack(pack.id)}
                className="w-full py-3.5 rounded-2xl bg-[#FBBC04] text-[#0D1060] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-sm"
              >
                {launchedPack === pack.id ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Assigned to Student&apos;s ClassroomPRO Queue ✓
                  </>
                ) : (
                  <>
                    Launch Revision Pack in ClassroomPRO
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
