"use client";

import React, { useState } from "react";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

interface QueryPreset {
  id: string;
  question: string;
  answerNarrative: string;
  tableHeaders: string[];
  tableRows: string[][];
}

const QUERY_PRESETS: QueryPreset[] = [
  {
    id: "q1",
    question: "Which subjects experienced the biggest decline in SS2 this term?",
    answerNarrative:
      "Across Laurel Academy's 3 campuses, Further Mathematics (-9.4%) and Physics (-7.1%) in SS2 experienced the steepest declines compared to 1st Term. ClassroomPRO topic telemetry indicates 68% of missed questions were in 'Vectors & Mechanics' and 'Trigonometric Identities'.",
    tableHeaders: ["Subject", "Campus", "1st Term Avg", "2nd Term Avg", "Delta", "ClassroomPRO Weak Topic"],
    tableRows: [
      ["Further Mathematics", "Ikeja Campus", "72.4%", "63.0%", "-9.4%", "Trigonometric Identities (38% accuracy)"],
      ["Physics", "Abuja Campus", "70.1%", "63.0%", "-7.1%", "Vectors & Equilibrium of Forces (42% accuracy)"],
      ["English Language", "Lekki Campus", "74.5%", "69.8%", "-4.7%", "Summary Passages & Lexis (51% accuracy)"],
    ],
  },
  {
    id: "q2",
    question: "Identify students whose Mathematics performance has declined over the last three terms.",
    answerNarrative:
      "4 students across Ikeja, Lekki, and Abuja campuses have shown a consecutive 3-term decline in Mathematics. ClassroomPRO assessment history confirms persistent struggles in Fractions, Algebraic Simplification, and Word Problems.",
    tableHeaders: ["Student", "Campus & Class", "3rd Term '25", "1st Term '26", "2nd Term '26", "Recommended Action"],
    tableRows: [
      ["Danjuma Fatima (LAU/ABJ/2026/012)", "Abuja · SS 2 Science", "86%", "74%", "48%", "Assign Trigonometry & Algebra Pack"],
      ["Bello Musa Ibrahim (LAU/IKJ/2026/009)", "Ikeja · JSS 2 Gold", "71%", "62%", "52%", "Assign Fractions & Percentages AI Story"],
      ["Oladipo Samuel (LAU/LEK/2026/033)", "Lekki · JSS 3 Emerald", "78%", "65%", "55%", "Assign BECE Past Questions Remedial"],
    ],
  },
  {
    id: "q3",
    question: "Run AI Class Promotion & WAEC Forecast for SS2 across all campuses.",
    answerNarrative:
      "[PREDICTION] Based on 6 terms of CampusPRO official exam scores and ClassroomPRO CBT mastery velocity, 88.5% of SS2 students meet Laurel Academy's promotion threshold (>= 50% average including Maths & English). 14 students require holiday intervention.",
    tableHeaders: ["Campus", "Enrolled SS2", "Meets Promotion Criteria", "Borderline (45-49%)", "Forecasted WAEC Distinction Rate"],
    tableRows: [
      ["Ikeja Campus", "120 Students", "108 (90.0%)", "8 Students", "84% (Predicted)"],
      ["Lekki Campus", "95 Students", "86 (90.5%)", "6 Students", "87% (Predicted)"],
      ["Abuja Campus", "80 Students", "67 (83.8%)", "9 Students", "79% (Predicted)"],
    ],
  },
];

export const PerformanceIntelligenceView: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState("All 3 Campuses (Laurel Academy)");
  const [activeQuery, setActiveQuery] = useState<QueryPreset>(QUERY_PRESETS[0]);
  const [customInput, setCustomInput] = useState(QUERY_PRESETS[0].question);
  const [officerTargetClass, setOfficerTargetClass] = useState("Primary 5 Ivory (Ikeja Campus)");
  const [remindersSent, setRemindersSent] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-8">
      {/* Multi-Campus Selector & Executive Header */}
      <div className="bg-[#0D1060] text-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider">
            <BuildingLibraryIcon className="w-4 h-4" /> Multi-Campus Performance Intelligence
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Laurel Academy — School &amp; Cohort Intelligence Engine
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Combines official examination records from <span className="text-white font-bold">CampusPRO</span> across Ikeja, Lekki, and Abuja campuses with <span className="text-white font-bold">ClassroomPRO&apos;s</span> multi-year topic mastery history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 text-xs font-bold outline-none"
          >
            <option className="text-gray-900">All 3 Campuses (Laurel Academy)</option>
            <option className="text-gray-900">Ikeja Campus (480 Students)</option>
            <option className="text-gray-900">Lekki Campus (390 Students)</option>
            <option className="text-gray-900">Abuja Campus (310 Students)</option>
          </select>
        </div>
      </div>

      {/* Multi-Campus Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            campus: "Ikeja Campus",
            avg: "76.4%",
            delta: "+3.2%",
            positive: true,
            topSubject: "Civic Education (88%)",
            weakSubject: "Further Maths (63%)",
            synced: "42 / 44 Subjects Synced",
          },
          {
            campus: "Lekki Campus",
            avg: "79.1%",
            delta: "+4.8%",
            positive: true,
            topSubject: "Basic Science (89%)",
            weakSubject: "English Lit. (69%)",
            synced: "38 / 38 Subjects Synced",
          },
          {
            campus: "Abuja Campus",
            avg: "72.8%",
            delta: "-1.4%",
            positive: false,
            topSubject: "Chemistry (84%)",
            weakSubject: "Physics (63%)",
            synced: "34 / 36 Subjects Synced",
          },
        ].map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Campus Branch
                </span>
                <h3 className="text-lg font-extrabold text-gray-900">{c.campus}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                  c.positive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {c.positive ? (
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
                )}
                {c.delta} vs Last Term
              </span>
            </div>

            <div className="text-4xl font-black text-[#0D1060]">{c.avg}</div>

            <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Best Performing:</span>
                <span className="font-bold text-emerald-700">{c.topSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Needs Attention:</span>
                <span className="font-bold text-amber-700">{c.weakSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CampusPRO Score Sync:</span>
                <span className="font-bold text-[#146ef5]">{c.synced}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversational Natural-Language Intelligence Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#146ef5] uppercase tracking-wider mb-1">
              <SparklesIcon className="w-4 h-4" /> Ask ResultsPRO Intelligence
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Natural-Language Academic Data Query (With Verifiable Figures)
            </h3>
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2">
          {QUERY_PRESETS.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuery(q);
                setCustomInput(q.question);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                activeQuery.id === q.id
                  ? "bg-[#0D1060] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              &ldquo;{q.question}&rdquo;
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask any question about campus performance, declining students, or subject trends..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-36 text-sm font-bold text-gray-900 focus:border-[#146ef5] outline-none"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider">
            Analyze Data
          </button>
        </div>

        {/* AI Narrative + Verifiable Figures Table */}
        <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0D1060] text-white flex items-center justify-center shrink-0 mt-0.5">
              <AcademicCapIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#0D1060] mb-1">
                Verified School Data Synthesis
              </div>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {activeQuery.answerNarrative}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-black uppercase tracking-wider text-gray-500">
                  {activeQuery.tableHeaders.map((h, i) => (
                    <th key={i} className="py-3 px-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeQuery.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50/70">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-3 px-4 ${
                          cIdx === 0 ? "font-extrabold text-gray-900" : "text-gray-700 font-medium"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* THE LONG-TERM DIFFERENTIATOR: AI Results-Processing Officer Copilot */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#0D1060]/15 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-white text-xs font-black uppercase tracking-wider">
              <ClipboardDocumentCheckIcon className="w-4 h-4" /> AI Results-Processing Officer (Admin Copilot)
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              &ldquo;Prepare my school&apos;s end-of-term result processing for {officerTargetClass}&rdquo;
            </h3>
            <p className="text-xs text-gray-500">
              Your automated results-processing officer checks CampusPRO subject allocations, identifies outstanding teachers, verifies grading configuration, runs the AI audit, and guides you through publication.
            </p>
          </div>

          <select
            value={officerTargetClass}
            onChange={(e) => {
              setOfficerTargetClass(e.target.value);
              setPublishedSuccess(false);
            }}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
          >
            <option>Primary 5 Ivory (Ikeja Campus)</option>
            <option>JSS 2 Gold (Ikeja Campus)</option>
            <option>SS 2 Science (Lekki Campus)</option>
            <option>JSS 3 Emerald (Abuja Campus)</option>
          </select>
        </div>

        {/* 5-Stage Automated Readiness Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Step 1 · Subject Submissions
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                  10 / 12 Submitted
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">
                2 Outstanding Teachers Identified
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Mr. Okafor (Basic Technology) &amp; Mrs. Eze (French) have not yet synced CA 2 &amp; Exam scores from ClassroomPRO to CampusPRO.
              </p>
            </div>
            <button
              onClick={() => setRemindersSent(true)}
              className="w-full py-2.5 rounded-xl bg-[#0D1060] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95"
            >
              <PaperAirplaneIcon className="w-3.5 h-3.5" />
              {remindersSent ? "WhatsApp & Email Reminders Sent ✓" : "Send 1-Click Teacher Reminders"}
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Step 2 · Grading &amp; Weights Config
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                  Verified
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">
                CampusPRO Exam Configuration Valid
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                CA 1 (20%) + CA 2 (20%) + Exam (60%) = 100%. Standard NERDC grading scale (A: 75–100, B: 65–74, C: 50–64) active.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckBadgeIcon className="w-4 h-4" /> Deterministic rules locked
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Step 3 · Pre-Publication Audit &amp; Remarks
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                  Ready
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">
                32/32 AI Report Comments Drafted
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Class Teacher and Head Teacher remarks generated with ClassroomPRO learning-gap recommendations attached.
              </p>
            </div>
            <button
              onClick={() => setPublishedSuccess(true)}
              className="w-full py-2.5 rounded-xl bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 shadow-sm"
            >
              <ShieldCheckIcon className="w-4 h-4" />
              {publishedSuccess
                ? "Broadsheet Published & Parents Notified ✓"
                : "Approve & Publish Class Results"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
