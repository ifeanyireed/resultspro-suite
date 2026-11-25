"use client";

import React, { useState } from "react";
import {
  ShieldExclamationIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalculatorIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export interface AuditAnomaly {
  id: string;
  campus: string;
  className: string;
  subject: string;
  studentName: string;
  admissionNumber: string;
  category:
    | "MISSING_ASSESSMENT"
    | "CALCULATION_OVERFLOW"
    | "DUPLICATE_IDENTITY"
    | "ATTENDANCE_CONFLICT"
    | "HISTORICAL_VARIATION";
  detectedIssue: string;
  aiRecommendation: string;
  sourceEvidence: string;
  severity: "HIGH" | "MEDIUM";
  resolved: boolean;
  resolutionActionLabel: string;
}

const INITIAL_AUDIT_ANOMALIES: AuditAnomaly[] = [
  {
    id: "aud-1",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    subject: "Mathematics",
    studentName: "Bello Musa Ibrahim",
    admissionNumber: "LAU/IKJ/2026/009",
    category: "MISSING_ASSESSMENT",
    detectedIssue: "Student has Exam score (45/60) and CA 1 (14/20) but no CA 2 score recorded.",
    aiRecommendation: "Missing assessment — Request CA 2 sync from ClassroomPRO or enter make-up CA score.",
    sourceEvidence: "CampusPRO Official Exam Ledger (CA2 = NULL)",
    severity: "HIGH",
    resolved: false,
    resolutionActionLabel: "Pull CA 2 (15/20) from ClassroomPRO",
  },
  {
    id: "aud-2",
    campus: "Ikeja Campus",
    className: "SS 2 Science",
    subject: "Physics",
    studentName: "Ogunleye Femi Joshua",
    admissionNumber: "LAU/IKJ/2026/044",
    category: "CALCULATION_OVERFLOW",
    detectedIssue: "CA 1 score entered as 24, exceeding configured CampusPRO maximum of 20 (Total = 102/100).",
    aiRecommendation: "Verify calculation — Cap or correct CA 1 against 20-mark rubric.",
    sourceEvidence: "CampusPRO Exam Config (Max CA 1 = 20)",
    severity: "HIGH",
    resolved: false,
    resolutionActionLabel: "Correct CA 1 to 14/20",
  },
  {
    id: "aud-3",
    campus: "Lekki Campus",
    className: "JSS 3 Emerald",
    subject: "English Language",
    studentName: "Nwosu Chisom / Nwosu C. Ada",
    admissionNumber: "LAU/LEK/2026/019",
    category: "DUPLICATE_IDENTITY",
    detectedIssue: "Two score records in JSS 3 Emerald match the same student biometric/guardian phone in CampusPRO.",
    aiRecommendation: "Check student identity — Consolidate duplicate record into LAU/LEK/2026/019.",
    sourceEvidence: "CampusPRO Enrolment Registry",
    severity: "HIGH",
    resolved: false,
    resolutionActionLabel: "Merge Duplicate Record",
  },
  {
    id: "aud-4",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    subject: "Basic Science",
    studentName: "Adeyemi Toluwani",
    admissionNumber: "LAU/IKJ/2026/031",
    category: "ATTENDANCE_CONFLICT",
    detectedIssue: "Student marked Absent in CampusPRO Clinic/Attendance log on Exam Date (Nov 18) but has Exam score 52/60.",
    aiRecommendation: "Verify attendance — Confirm if student sat make-up exam or if score belongs to adjacent roll number.",
    sourceEvidence: "CampusPRO Biometric Attendance Log (Nov 18: ABSENT - Clinic)",
    severity: "HIGH",
    resolved: false,
    resolutionActionLabel: "Confirm Make-Up Exam Sitting",
  },
  {
    id: "aud-5",
    campus: "Abuja Campus",
    className: "SS 2 Science",
    subject: "Mathematics",
    studentName: "Danjuma Fatima",
    admissionNumber: "LAU/ABJ/2026/012",
    category: "HISTORICAL_VARIATION",
    detectedIssue: "Score dropped by 36% compared to previous term (84% in 1st Term -> 48% in 2nd Term).",
    aiRecommendation: "Review performance — Flag for Class Teacher review & attach ClassroomPRO Trigonometry remedial pack.",
    sourceEvidence: "ResultsPRO 3-Term Trajectory + ClassroomPRO Topic Telemetry",
    severity: "MEDIUM",
    resolved: false,
    resolutionActionLabel: "Acknowledge & Flag for Remedial",
  },
];

export const ResultAuditView: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState("All Campuses (Laurel Academy)");
  const [anomalies, setAnomalies] = useState<AuditAnomaly[]>(INITIAL_AUDIT_ANOMALIES);
  const [isAuditing, setIsAuditing] = useState(false);

  const filtered = anomalies.filter(
    (a) =>
      selectedCampus.startsWith("All") || a.campus === selectedCampus
  );
  const unresolvedCount = filtered.filter((a) => !a.resolved).length;

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAnomalies(INITIAL_AUDIT_ANOMALIES);
      setIsAuditing(false);
    }, 700);
  };

  const handleResolve = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <ShieldExclamationIcon className="w-4 h-4" /> Pre-Publication AI Result Auditor
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Intelligent Result Auditing &amp; Error Detection
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cross-checks official examination scores in <span className="font-bold text-[#0D1060]">CampusPRO</span> against maximum score rules, daily attendance logs, duplicate identities, and historical term trajectories before results are approved for publication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
          >
            <option>All Campuses (Laurel Academy)</option>
            <option>Ikeja Campus</option>
            <option>Lekki Campus</option>
            <option>Abuja Campus</option>
          </select>

          <button
            onClick={handleRunAudit}
            className="px-6 py-3.5 rounded-2xl bg-[#0D1060] text-[#FBBC04] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-all shadow-md"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? "Running AI Audit..." : "Run AI Result Audit"}
          </button>
        </div>
      </div>

      {/* Summary Metric Cards matching user prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Missing Scores</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">12</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Missing CA or subject scores across 3 classes
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Possible Duplicates</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">3</div>
          <div className="text-[11px] text-[#146ef5] font-semibold mt-1">
            Student identity collisions flagged
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Unusual Variations</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowTrendingDownIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">4</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            &gt;25% swing vs. previous term average
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Calculation / Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <CalculatorIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">2</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Max score overflow &amp; absent student score
          </div>
        </div>
      </div>

      {/* Audit Findings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Detected Issues &amp; AI Audit Recommendations
            </h3>
            <p className="text-xs text-gray-500">
              Resolve or verify flagged items below before unlocking term result publication.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-600">
              {unresolvedCount} Unresolved Issue{unresolvedCount === 1 ? "" : "s"}
            </span>
            <button
              onClick={() =>
                setAnomalies((prev) => prev.map((a) => ({ ...a, resolved: true })))
              }
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition-all"
            >
              Resolve All Flagged Items
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors ${
                item.resolved ? "bg-gray-50/60 opacity-75" : "bg-white hover:bg-gray-50/40"
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider">
                    {item.campus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                    {item.className} · {item.subject}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.resolved
                        ? "bg-emerald-50 text-emerald-700"
                        : item.severity === "HIGH"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.resolved ? "RESOLVED" : item.category.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-sm font-extrabold text-gray-900">
                  {item.studentName}{" "}
                  <span className="text-xs font-mono text-gray-500 font-normal">
                    ({item.admissionNumber})
                  </span>{" "}
                  — {item.detectedIssue}
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-gray-800">
                  <span className="font-black text-[#0D1060]">AI Recommendation: </span>
                  {item.aiRecommendation}
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                    <CalendarDaysIcon className="w-3.5 h-3.5 text-[#146ef5]" />
                    Cross-Checked Source: {item.sourceEvidence}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.resolved ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <CheckBadgeIcon className="w-4 h-4" /> Verified &amp; Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="px-5 py-3 rounded-2xl bg-[#FBBC04] text-[#0D1060] font-black text-xs hover:opacity-95 transition-all shadow-sm"
                  >
                    {item.resolutionActionLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
