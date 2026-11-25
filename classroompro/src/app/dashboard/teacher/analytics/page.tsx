"use client";

import { IconTrendingUp as TrendingUp, IconUsers as Users, IconBook as BookOpen, IconBrain as BrainCircuit, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconCheck as Check, IconRefresh as Refresh } from '@tabler/icons-react';
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

const stats = [
  { label: "Content Engagement", value: "88%", trend: "+5.2%", positive: true, icon: <BookOpen className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg. CA 1 CBT Score", value: "74%", trend: "+4.1%", positive: true, icon: <BrainCircuit className="w-5 h-5" />, color: "text-[#0D1060]", bg: "bg-amber-100" },
  { label: "Attempts Retained", value: "1,420", trend: "2-Yr History", positive: true, icon: <TrendingUp className="w-5 h-5" />, color: "text-[#146ef5]", bg: "bg-blue-50" },
  { label: "Ikeja JSS 2 Roster", value: "38", trend: "CampusPRO", positive: true, icon: <Users className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50" },
];

const topicPerformance = [
  { topic: "Plane Geometry & Angles", score: 88, status: "Excellent", action: "Mastered" },
  { topic: "Linear Equations", score: 79, status: "Good", action: "On Track" },
  { topic: "Algebraic Simplification", score: 62, status: "Needs Review", action: "Assign Flashcards" },
  { topic: "Fractions & Percentages", score: 41, status: "Critical Gap", action: "Assign AI Story + Remedial Quiz" },
];

const initialStudentAttempts = [
  {
    id: "clp-st-1",
    name: "Daniel Oluwaseun Adebayo",
    admissionNo: "LAU/IKJ/2026/001",
    attemptsCount: 3,
    rawBestScore: "18 / 20",
    weakTopic: "Word Problems with Percentages",
    remedialAssigned: true,
    syncedToCampusPro: true,
    syncRef: "CLP-ASSESS-2026-CA1-01",
  },
  {
    id: "clp-st-2",
    name: "Chidera Grace Anozie",
    admissionNo: "LAU/IKJ/2026/004",
    attemptsCount: 2,
    rawBestScore: "16 / 20",
    weakTopic: "Algebraic Fractions",
    remedialAssigned: true,
    syncedToCampusPro: true,
    syncRef: "CLP-ASSESS-2026-CA1-04",
  },
  {
    id: "clp-st-3",
    name: "Musa Ibrahim Bello",
    admissionNo: "LAU/IKJ/2026/009",
    attemptsCount: 4,
    rawBestScore: "14 / 20",
    weakTopic: "Fractions & Ratios (34% accuracy)",
    remedialAssigned: false,
    syncedToCampusPro: false,
    syncRef: "PENDING-APPROVAL",
  },
  {
    id: "clp-st-4",
    name: "Oluwatobi Emmanuel Okafor",
    admissionNo: "LAU/IKJ/2026/015",
    attemptsCount: 1,
    rawBestScore: "19 / 20",
    weakTopic: "None (95% Topic Mastery)",
    remedialAssigned: false,
    syncedToCampusPro: false,
    syncRef: "PENDING-APPROVAL",
  },
];

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState("Ikeja Campus");
  const [selectedClass, setSelectedClass] = useState("JSS 2 Gold · Mathematics");
  const [students, setStudents] = useState(initialStudentAttempts);
  const [batchSynced, setBatchSynced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[24px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleApproveAndSyncAll = () => {
    setStudents((prev) =>
      prev.map((s, idx) => ({
        ...s,
        syncedToCampusPro: true,
        syncRef: `CLP-ASSESS-2026-CA1-0${idx + 1}`,
      }))
    );
    setBatchSynced(true);
  };

  const handleAssignRemedial = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remedialAssigned: true } : s))
    );
  };

  return (
    <div className="flex-1">
      <main className="p-4 md:p-8 space-y-8">
        <MotionRise className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider mb-2">
              ClassroomPRO Learning Hub → CampusPRO Official Exam Ledger
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-display">
              Topic Mastery, Assessment History &amp; Official Score Sync
            </h2>
            <p className="text-sm text-gray-500">
              ClassroomPRO retains every quiz attempt and question-level struggle over time, while transferring only teacher-approved scores into CampusPRO.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
            >
              <option>Ikeja Campus</option>
              <option>Lekki Campus</option>
              <option>Abuja Campus</option>
            </select>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
            >
              <option>JSS 2 Gold · Mathematics</option>
              <option>JSS 3 Emerald · Mathematics</option>
              <option>SS 2 Science · Further Maths</option>
            </select>
            <Button
              onClick={handleApproveAndSyncAll}
              className="bg-[#0D1060] hover:bg-[#0D1060]/95 text-[#FBBC04] font-black text-xs rounded-xl"
            >
              <Refresh className="w-4 h-4 mr-2" />
              {batchSynced
                ? "Synced to CampusPRO Official Exam Records ✓"
                : "Approve & Push CA 1 Scores to CampusPRO"}
            </Button>
          </div>
        </MotionRise>

        {/* Stats Grid */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <MotionRise
              key={i}
              delay={i * 0.05}
              className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px] hover:border-gray-200 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",
                    stat.positive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </MotionRise>
          ))}
        </MotionStagger>

        {/* Traceable ClassroomPRO -> CampusPRO Score Approval Table */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Continuous Assessment 1 (CA 1) — Attempt History vs. Official Score Transfer
              </h3>
              <p className="text-xs text-gray-500">
                Every transferred score retains its ClassroomPRO assessment reference (`clp_assessment_id`), teacher approval timestamp, and sync status in CampusPRO.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold">
              Scope: Laurel Academy · {selectedCampus}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-5">Student (CampusPRO ID)</th>
                  <th className="py-3.5 px-5">ClassroomPRO Attempts Retained</th>
                  <th className="py-3.5 px-5">Approved CA 1 Score</th>
                  <th className="py-3.5 px-5">Detected Topic Struggle</th>
                  <th className="py-3.5 px-5">Remedial Intervention</th>
                  <th className="py-3.5 px-5 text-right">CampusPRO Official Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900">{s.name}</div>
                      <div className="text-xs font-mono text-gray-500">
                        {s.admissionNo}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold">
                        {s.attemptsCount} Quiz Attempts Stored
                      </span>
                    </td>
                    <td className="py-4 px-5 font-extrabold text-[#0D1060]">
                      {s.rawBestScore}
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                        {s.weakTopic}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {s.remedialAssigned ? (
                        <span className="text-xs font-bold text-emerald-700">
                          AI Story + Flashcards Assigned ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAssignRemedial(s.id)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#146ef5] text-xs font-bold hover:bg-blue-100"
                        >
                          + Assign AI Story &amp; Flashcards
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {s.syncedToCampusPro ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" /> Synced to CampusPRO
                          </span>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                            Ref: {s.syncRef}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleApproveAndSyncAll}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FBBC04] text-[#0D1060] text-xs font-black"
                        >
                          Approve &amp; Sync
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Topic Mastery & Reteaching Breakdown */}
        <MotionStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MotionRise className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-display">
                  Longitudinal Learning &amp; Attempt Engagement ({selectedCampus})
                </h3>
                <p className="text-xs text-gray-500">
                  Retained in ClassroomPRO for 2+ years to power ResultsPRO end-of-term performance intelligence.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0D1060]" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    Notes &amp; AI Stories Read
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FBBC04]" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    Quiz Attempts
                  </span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[45, 62, 58, 85, 74, 66, 90, 78, 82, 88, 91, 95].map((height, i) => (
                <div key={i} className="flex-1 space-y-2 group">
                  <div className="relative w-full h-full flex items-end gap-1">
                    <div
                      className="w-full bg-[#0D1060]/80 group-hover:bg-[#0D1060] transition-all rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="w-full bg-[#FBBC04] group-hover:opacity-90 transition-all rounded-t-sm"
                      style={{ height: `${height - 10}%` }}
                    />
                  </div>
                  <div className="text-[8px] text-center text-gray-500 font-bold uppercase">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </div>
                </div>
              ))}
            </div>
          </MotionRise>

          <MotionRise
            delay={0.1}
            className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 font-display mb-2">
              Topic-Level Knowledge Gaps
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Topics requiring reteaching or automated remedial packs.
            </p>
            <div className="space-y-6">
              {topicPerformance.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">{item.topic}</span>
                    <span
                      className={cn(
                        "font-black",
                        item.score >= 80
                          ? "text-emerald-600"
                          : item.score >= 70
                          ? "text-[#146ef5]"
                          : "text-amber-600"
                      )}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        item.score >= 80
                          ? "bg-emerald-600"
                          : item.score >= 70
                          ? "bg-[#146ef5]"
                          : "bg-[#FBBC04]"
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                    <span>{item.status}</span>
                    <span className="text-[#0D1060] underline cursor-pointer">
                      {item.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </MotionRise>
        </MotionStagger>
      </main>
    </div>
  );
}
