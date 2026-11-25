"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  BuildingLibraryIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export interface ExtractedScoreRow {
  id: string;
  sheetPage: number;
  handwrittenName: string;
  matchedStudentName: string;
  admissionNumber: string;
  matchConfidence: "EXACT" | "FUZZY" | "UNMATCHED";
  matchReason?: string;
  ca1: number | null;
  ca2: number | null;
  exam: number | null;
  maxCa1: number;
  maxCa2: number;
  maxExam: number;
  flagType?: "NONE" | "MISSING_SCORE" | "DUPLICATE_ENTRY" | "LOW_OCR_CONFIDENCE" | "NAME_MISMATCH";
  flagMessage?: string;
  teacherApproved: boolean;
}

const INITIAL_EXTRACTED_ROWS: ExtractedScoreRow[] = [
  {
    id: "row-1",
    sheetPage: 1,
    handwrittenName: "Adebayo Oluwaseun",
    matchedStudentName: "Adebayo Oluwaseun Daniel",
    admissionNumber: "LAU/IKJ/2026/001",
    matchConfidence: "EXACT",
    ca1: 18,
    ca2: 17,
    exam: 54,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "NONE",
    teacherApproved: true,
  },
  {
    id: "row-2",
    sheetPage: 1,
    handwrittenName: "Chidera A.",
    matchedStudentName: "Anozie Chidera Grace",
    admissionNumber: "LAU/IKJ/2026/004",
    matchConfidence: "FUZZY",
    matchReason: "Abbreviated surname on handwritten sheet matched to CampusPRO Ikeja JSS 2 Gold roster (94% similarity).",
    ca1: 16,
    ca2: 19,
    exam: 51,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "NAME_MISMATCH",
    flagMessage: "Confirm abbreviated student identity match",
    teacherApproved: false,
  },
  {
    id: "row-3",
    sheetPage: 1,
    handwrittenName: "Bello Musa",
    matchedStudentName: "Bello Musa Ibrahim",
    admissionNumber: "LAU/IKJ/2026/009",
    matchConfidence: "EXACT",
    ca1: 14,
    ca2: null,
    exam: 45,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "MISSING_SCORE",
    flagMessage: "CA 2 cell is blank on marksheet Page 1",
    teacherApproved: false,
  },
  {
    id: "row-4",
    sheetPage: 2,
    handwrittenName: "Okafor Tobi",
    matchedStudentName: "Okafor Oluwatobi Emmanuel",
    admissionNumber: "LAU/IKJ/2026/015",
    matchConfidence: "FUZZY",
    matchReason: "Middle name 'Tobi' matched to 'Oluwatobi' in CampusPRO Ikeja roster.",
    ca1: 19,
    ca2: 18,
    exam: 56,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "LOW_OCR_CONFIDENCE",
    flagMessage: "Handwritten '56' had ink smudge (could be 56 or 58) — please verify",
    teacherApproved: false,
  },
  {
    id: "row-5",
    sheetPage: 2,
    handwrittenName: "Bello M. Ibrahim",
    matchedStudentName: "Bello Musa Ibrahim",
    admissionNumber: "LAU/IKJ/2026/009",
    matchConfidence: "FUZZY",
    ca1: 14,
    ca2: 15,
    exam: 45,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "DUPLICATE_ENTRY",
    flagMessage: "Duplicate student detected across Page 1 & Page 2 (LAU/IKJ/2026/009). Merge CA 2 = 15?",
    teacherApproved: false,
  },
  {
    id: "row-6",
    sheetPage: 2,
    handwrittenName: "Eze Zinachidi",
    matchedStudentName: "Eze Zinachidi Kamsiyochukwu",
    admissionNumber: "LAU/IKJ/2026/021",
    matchConfidence: "EXACT",
    ca1: 20,
    ca2: 19,
    exam: 58,
    maxCa1: 20,
    maxCa2: 20,
    maxExam: 60,
    flagType: "NONE",
    teacherApproved: true,
  },
];

export const MarksheetScannerView: React.FC<{ standalone?: boolean }> = () => {
  const [selectedCampus, setSelectedCampus] = useState("Ikeja Campus");
  const [selectedClass, setSelectedClass] = useState("JSS 2 Gold");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedTerm, setSelectedTerm] = useState("2nd Term 2025/2026");
  const [rows, setRows] = useState<ExtractedScoreRow[]>(INITIAL_EXTRACTED_ROWS);
  const [isScanning, setIsScanning] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [syncedToCampusPro, setSyncedToCampusPro] = useState(false);

  const pendingApprovals = rows.filter((r) => !r.teacherApproved).length;

  const handleApproveRow = (id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          ca2: r.ca2 ?? 15,
          teacherApproved: true,
          flagType: "NONE",
        };
      })
    );
    setSyncedToCampusPro(false);
  };

  const handleMergeDuplicate = (id: string) => {
    setRows((prev) =>
      prev
        .filter((r) => r.id !== id)
        .map((r) =>
          r.admissionNumber === "LAU/IKJ/2026/009"
            ? { ...r, ca2: 15, flagType: "NONE", teacherApproved: true }
            : r
        )
    );
    setSyncedToCampusPro(false);
  };

  const handleScoreChange = (id: string, field: "ca1" | "ca2" | "exam", value: string) => {
    const num = value === "" ? null : Number(value);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: num } : r))
    );
    setSyncedToCampusPro(false);
  };

  const handleReScanDemo = () => {
    setIsScanning(true);
    setSyncedToCampusPro(false);
    setTimeout(() => {
      setRows(INITIAL_EXTRACTED_ROWS);
      setIsScanning(false);
    }, 900);
  };

  const handleCommitToCampusPro = () => {
    if (pendingApprovals > 0) return;
    setSyncedToCampusPro(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Architecture Banner */}
      <div className="bg-[#0D1060] text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4" /> AI Vision OCR · Multi-Sheet Reconciliation
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Handwritten Marksheet Scanner &amp; CampusPRO Reconciler
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Upload multi-page handwritten marksheets. AI extracts student names and scores, matches them against{" "}
              <span className="text-[#FBBC04] font-bold">CampusPRO&apos;s campus-scoped student roster</span>, and flags uncertain matches for mandatory teacher confirmation before syncing to official examination records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                voiceActive
                  ? "bg-red-500 text-white border-red-400 animate-pulse"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <MicrophoneIcon className="w-4 h-4" />
              {voiceActive ? "Listening: 'Adebayo CA1 18...'" : "Voice-Assisted Dictation"}
            </button>
            <button
              onClick={handleReScanDemo}
              className="px-5 py-3 rounded-2xl bg-[#FBBC04] text-[#0D1060] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-all shadow-md"
            >
              <CameraIcon className="w-4 h-4" />
              {isScanning ? "Extracting 2 Sheets..." : "Scan Handwritten Sheets"}
            </button>
          </div>
        </div>
      </div>

      {/* CampusPRO Context Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
            CampusPRO Branch (Multi-Campus)
          </label>
          <div className="relative">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:border-[#146ef5] outline-none"
            >
              <option>Ikeja Campus</option>
              <option>Lekki Campus</option>
              <option>Abuja Campus</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
            Class &amp; Arm Roster
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:border-[#146ef5] outline-none"
          >
            <option>JSS 2 Gold</option>
            <option>JSS 3 Emerald</option>
            <option>SS 2 Science</option>
            <option>Primary 5 Ivory</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
            Allocated Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:border-[#146ef5] outline-none"
          >
            <option>Mathematics</option>
            <option>English Language</option>
            <option>Basic Science</option>
            <option>Civic Education</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
            Academic Session / Term
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:border-[#146ef5] outline-none"
          >
            <option>2nd Term 2025/2026</option>
            <option>1st Term 2025/2026</option>
            <option>3rd Term 2024/2025</option>
          </select>
        </div>
      </div>

      {/* Multi-Sheet Upload Cards & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#0D1060]">
                Uploaded Marksheets (2 Pages)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] text-[10px] font-bold">
                Multi-Sheet Consolidated
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1060] text-[#FBBC04] flex items-center justify-center font-black text-xs">
                    P1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">ikeja_jss2_maths_sheet1.jpg</div>
                    <div className="text-[10px] text-gray-500">Handwritten · Roll 1–15 · 98.2% OCR Read</div>
                  </div>
                </div>
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1060] text-[#FBBC04] flex items-center justify-center font-black text-xs">
                    P2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">ikeja_jss2_maths_sheet2.jpg</div>
                    <div className="text-[10px] text-gray-500">Handwritten · Roll 16–30 · 1 Duplicate Flagged</div>
                  </div>
                </div>
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          <button className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-xs font-bold flex items-center justify-center gap-2 transition-all">
            <DocumentArrowUpIcon className="w-4 h-4" /> + Add Page 3 Marksheet Photo
          </button>
        </div>

        {/* Reconciliation Guardrails */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                AI Reconciliation &amp; Human-in-the-Loop Verification
              </h3>
              <p className="text-xs text-gray-500">
                AI never silently guesses a student identity or overwrites an uncertain score. Approve all flagged rows to unlock official CampusPRO sync.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                {rows.filter((r) => r.teacherApproved).length} Approved
              </span>
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  pendingApprovals > 0
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {pendingApprovals} Needs Review
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Roster Source
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
                <BuildingLibraryIcon className="w-4 h-4 text-[#146ef5]" />
                CampusPRO ({selectedCampus})
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Matched against {selectedClass} official enrolment
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Score Arithmetic
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                100% Deterministic Go Engine
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                CA1 (20) + CA2 (20) + Exam (60) = 100
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Target Destination
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
                <DocumentDuplicateIcon className="w-4 h-4 text-[#0D1060]" />
                Official Exam Score Ledger
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Traceable Batch ID: OCR-IKJ-2026-089
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {syncedToCampusPro ? (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-2xl text-xs font-bold">
                <CheckBadgeIcon className="w-5 h-5" />
                Official scores synchronized to CampusPRO ({selectedCampus}) &amp; ready for ResultsPRO processing!
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-medium">
                {pendingApprovals > 0
                  ? `Please confirm ${pendingApprovals} flagged entry/entries in the table below before committing.`
                  : "All extracted rows verified by teacher. Ready to sync to CampusPRO."}
              </div>
            )}

            <button
              onClick={handleCommitToCampusPro}
              disabled={pendingApprovals > 0}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                pendingApprovals > 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#0D1060] text-[#FBBC04] hover:opacity-95 shadow-md"
              }`}
            >
              <ArrowPathIcon className="w-4 h-4" />
              Approve &amp; Sync to CampusPRO Official Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Scores & Reconciliation Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Extracted Handwritten Scores vs. CampusPRO Student Roster
            </h3>
            <p className="text-xs text-gray-500">
              Edit any score inline or confirm fuzzy student matches. Totals and grades are calculated deterministically.
            </p>
          </div>
          <button
            onClick={() => {
              setRows((prev) =>
                prev
                  .filter((r) => r.id !== "row-5")
                  .map((r) => ({
                    ...r,
                    ca2: r.ca2 ?? 15,
                    flagType: "NONE",
                    teacherApproved: true,
                  }))
              );
            }}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
          >
            Confirm All Remaining Flagged Rows
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500">
                <th className="py-3.5 px-4">Sheet</th>
                <th className="py-3.5 px-4">Handwritten OCR Read</th>
                <th className="py-3.5 px-4">CampusPRO Matched Student</th>
                <th className="py-3.5 px-4 text-center">CA 1 (20)</th>
                <th className="py-3.5 px-4 text-center">CA 2 (20)</th>
                <th className="py-3.5 px-4 text-center">Exam (60)</th>
                <th className="py-3.5 px-4 text-center">Total (100)</th>
                <th className="py-3.5 px-4">AI Audit / Match Status</th>
                <th className="py-3.5 px-4 text-right">Teacher Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {rows.map((row) => {
                const total = (row.ca1 || 0) + (row.ca2 || 0) + (row.exam || 0);
                const grade =
                  total >= 75
                    ? "A"
                    : total >= 65
                    ? "B"
                    : total >= 50
                    ? "C"
                    : total >= 45
                    ? "D"
                    : "F";

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      !row.teacherApproved ? "bg-amber-50/40" : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">
                        Page {row.sheetPage}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs font-bold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-lg inline-block">
                        &ldquo;{row.handwrittenName}&rdquo;
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{row.matchedStudentName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500 font-mono">
                          {row.admissionNumber}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            row.matchConfidence === "EXACT"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.matchConfidence} MATCH
                        </span>
                      </div>
                      {row.matchReason && (
                        <div className="text-[11px] text-gray-500 mt-1 max-w-xs">
                          {row.matchReason}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={row.ca1 ?? ""}
                        onChange={(e) => handleScoreChange(row.id, "ca1", e.target.value)}
                        className="w-16 text-center font-bold bg-white border border-gray-200 rounded-xl py-1.5 text-gray-900 focus:border-[#146ef5] outline-none"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={row.ca2 ?? ""}
                        placeholder="--"
                        onChange={(e) => handleScoreChange(row.id, "ca2", e.target.value)}
                        className={`w-16 text-center font-bold border rounded-xl py-1.5 outline-none ${
                          row.ca2 === null
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-white border-gray-200 text-gray-900 focus:border-[#146ef5]"
                        }`}
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={row.exam ?? ""}
                        onChange={(e) => handleScoreChange(row.id, "exam", e.target.value)}
                        className="w-16 text-center font-bold bg-white border border-gray-200 rounded-xl py-1.5 text-gray-900 focus:border-[#146ef5] outline-none"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-extrabold text-gray-900">
                        {total}{" "}
                        <span className="text-xs font-black text-[#146ef5]">({grade})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {row.teacherApproved ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          <CheckCircleIcon className="w-4 h-4" /> Verified &amp; Locked
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                            {row.flagType?.replace(/_/g, " ")}
                          </span>
                          <p className="text-xs text-gray-600 max-w-xs">{row.flagMessage}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {row.flagType === "DUPLICATE_ENTRY" ? (
                        <button
                          onClick={() => handleMergeDuplicate(row.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#0D1060] text-[#FBBC04] text-xs font-bold hover:opacity-95 transition-all"
                        >
                          Merge Page 1 &amp; 2
                        </button>
                      ) : !row.teacherApproved ? (
                        <button
                          onClick={() => handleApproveRow(row.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#FBBC04] text-[#0D1060] text-xs font-black hover:opacity-95 transition-all"
                        >
                          Confirm &amp; Approve
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">Approved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
