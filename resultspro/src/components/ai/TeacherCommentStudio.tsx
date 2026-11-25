"use client";

import React, { useState } from "react";
import {
  SparklesIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

type CommentRole = "CLASS_TEACHER" | "PRINCIPAL" | "HEAD_TEACHER" | "SUBJECT_TEACHER";
type CommentTone = "ENCOURAGING" | "CORRECTIVE" | "DEVELOPMENTAL" | "CELEBRATORY";

interface StudentNarrativeRecord {
  id: string;
  studentName: string;
  admissionNumber: string;
  campus: string;
  className: string;
  averageScore: number;
  previousTermAvg: number;
  attendanceRate: string;
  excelsIn: string[];
  needsImprovementIn: string[];
  classroomProGapNote: string;
  draftComment: string;
  approved: boolean;
}

const TONE_TEMPLATES: Record<CommentTone, (s: StudentNarrativeRecord, role: CommentRole) => string> = {
  ENCOURAGING: (s, role) =>
    role === "PRINCIPAL"
      ? `${s.studentName.split(" ")[0]} has shown commendable progress this term (${s.averageScore}% avg, up from ${s.previousTermAvg}%). Strong distinction in ${s.excelsIn.join(" and ")}. With focused holiday practice on ${s.needsImprovementIn.join(", ")}, even greater heights await next term.`
      : `${s.studentName.split(" ")[0]} has demonstrated considerable improvement in ${s.excelsIn.join(" and ")} this term (${s.averageScore}% average). Participates actively in classroom activities (${s.attendanceRate} attendance) but needs to improve consistency in ${s.needsImprovementIn.join(", ")}—specifically ${s.classroomProGapNote}. Continued daily practice on ClassroomPRO is recommended.`,
  CORRECTIVE: (s) =>
    `While ${s.studentName.split(" ")[0]} performed creditably in ${s.excelsIn.join(" and ")}, overall performance (${s.averageScore}%) was held back by ${s.needsImprovementIn.join(", ")}. ClassroomPRO telemetry indicates recurring difficulty with ${s.classroomProGapNote}. Immediate attention to assigned remedial exercises is required.`,
  DEVELOPMENTAL: (s) =>
    `${s.studentName.split(" ")[0]} maintained a ${s.averageScore}% average with ${s.attendanceRate} attendance. Mastery in ${s.excelsIn.join(" and ")} is solid; our next developmental milestone is closing the gap in ${s.needsImprovementIn.join(", ")} (${s.classroomProGapNote}) through structured weekly revision.`,
  CELEBRATORY: (s) =>
    `An outstanding term for ${s.studentName.split(" ")[0]}! Achieving ${s.averageScore}% (up from ${s.previousTermAvg}% last term) with stellar mastery in ${s.excelsIn.join(" and ")} reflects dedication and exemplary attendance (${s.attendanceRate}). Keep up the brilliant momentum!`,
};

const INITIAL_STUDENTS: StudentNarrativeRecord[] = [
  {
    id: "st-1",
    studentName: "Daniel Oluwaseun Adebayo",
    admissionNumber: "LAU/IKJ/2026/001",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    averageScore: 78.4,
    previousTermAvg: 71.2,
    attendanceRate: "97%",
    excelsIn: ["Mathematics (89%)", "Basic Science (85%)"],
    needsImprovementIn: ["English Language (54%)"],
    classroomProGapNote: "Comprehension Inference & Summary Writing",
    draftComment:
      "Daniel has demonstrated considerable improvement in Mathematics and Basic Science this term. He participates actively in classroom activities (97% attendance) but needs to improve his consistency in English Language—specifically Comprehension Inference & Summary Writing. Continued reading and regular ClassroomPRO practice are recommended.",
    approved: true,
  },
  {
    id: "st-2",
    studentName: "Chidera Grace Anozie",
    admissionNumber: "LAU/IKJ/2026/004",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    averageScore: 86.0,
    previousTermAvg: 82.5,
    attendanceRate: "100%",
    excelsIn: ["English Language (92%)", "Civic Education (90%)"],
    needsImprovementIn: ["Mathematics (61%)"],
    classroomProGapNote: "Algebraic Fractions & Word Problems with Percentages",
    draftComment:
      "Chidera has shown commendable progress this term (86% average, up from 82.5%) with 100% attendance. She excels in English Language and Civic Education, though ClassroomPRO quiz history shows she should review Algebraic Fractions & Word Problems with Percentages.",
    approved: false,
  },
  {
    id: "st-3",
    studentName: "Musa Ibrahim Bello",
    admissionNumber: "LAU/IKJ/2026/009",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    averageScore: 64.5,
    previousTermAvg: 68.0,
    attendanceRate: "89%",
    excelsIn: ["Physical & Health Ed (81%)", "Social Studies (74%)"],
    needsImprovementIn: ["Mathematics (52%)", "Basic Technology (49%)"],
    classroomProGapNote: "Fractions, Ratios & Isometric Drawing",
    draftComment:
      "Musa performed well in Physical & Health Education and Social Studies, but his overall average (64.5%) dipped slightly from last term. ClassroomPRO learning telemetry highlights gaps in Fractions, Ratios & Isometric Drawing. Completing his assigned holiday revision pack will rebuild his confidence.",
    approved: false,
  },
];

export const TeacherCommentStudio: React.FC = () => {
  const [role, setRole] = useState<CommentRole>("CLASS_TEACHER");
  const [tone, setTone] = useState<CommentTone>("ENCOURAGING");
  const [students, setStudents] = useState<StudentNarrativeRecord[]>(INITIAL_STUDENTS);

  const handleRegenerateAll = (newTone: CommentTone, newRole: CommentRole) => {
    setTone(newTone);
    setRole(newRole);
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        draftComment: TONE_TEMPLATES[newTone](s, newRole),
        approved: false,
      }))
    );
  };

  const handleCommentChange = (id: string, text: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, draftComment: text, approved: false } : s))
    );
  };

  const handleToggleApprove = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approved: !s.approved } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Studio Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-xs font-black uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" /> AI Report-Card Narrative Studio
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Data-Backed Teacher &amp; Principal Report Card Comments
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Synthesizes each student&apos;s <span className="font-bold text-[#0D1060]">CampusPRO</span> term scores, previous term trajectory, and attendance with <span className="font-bold text-[#146ef5]">ClassroomPRO&apos;s</span> topic-level learning gaps to draft meaningful, personalized remarks.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleRegenerateAll(tone, role)}
            className="px-5 py-3 rounded-2xl bg-[#0D1060] text-[#FBBC04] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-all shadow-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Batch Generate Class Remarks
          </button>
          <button
            onClick={() =>
              setStudents((prev) => prev.map((s) => ({ ...s, approved: true })))
            }
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-sm"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Approve All ({students.filter((s) => s.approved).length}/{students.length})
          </button>
        </div>
      </div>

      {/* Role & Tone Selector Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            1. Select Comment Author Role
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "CLASS_TEACHER", label: "Class Teacher's Remark" },
                { id: "PRINCIPAL", label: "Principal's Remark" },
                { id: "HEAD_TEACHER", label: "Head Teacher's Remark" },
                { id: "SUBJECT_TEACHER", label: "Subject Teacher's Remark" },
              ] as { id: CommentRole; label: string }[]
            ).map((r) => (
              <button
                key={r.id}
                onClick={() => handleRegenerateAll(tone, r.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  role === r.id
                    ? "bg-[#0D1060] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            2. Select Narrative Tone
          </div>
          <div className="flex flex-wrap gap-2">
            {(["ENCOURAGING", "CORRECTIVE", "DEVELOPMENTAL", "CELEBRATORY"] as CommentTone[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => handleRegenerateAll(t, role)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    tone === t
                      ? "bg-[#FBBC04] text-[#0D1060] shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0D1060] text-[#FBBC04] flex items-center justify-center font-black text-lg">
                  {student.studentName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-extrabold text-gray-900">
                      {student.studentName}
                    </h3>
                    <span className="text-xs font-mono text-gray-500">
                      {student.admissionNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5] text-[10px] font-black">
                      {student.campus} · {student.className}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>
                      Term Avg: <strong className="text-gray-900">{student.averageScore}%</strong>{" "}
                      (Last Term: {student.previousTermAvg}%)
                    </span>
                    <span>
                      Attendance: <strong className="text-gray-900">{student.attendanceRate}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <AcademicCapIcon className="w-4 h-4" /> Excels: {student.excelsIn.join(", ")}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4" /> ClassroomPRO Gap: {student.classroomProGapNote}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <PencilSquareIcon className="w-3.5 h-3.5 text-[#146ef5]" />
                Editable {role.replace(/_/g, " ")} Draft ({tone} Tone)
              </label>
              <textarea
                rows={3}
                value={student.draftComment}
                onChange={(e) => handleCommentChange(student.id, e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 font-medium leading-relaxed focus:border-[#146ef5] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-500">
                {student.approved
                  ? "Approved for official report card broadsheet"
                  : "Draft pending teacher approval"}
              </span>
              <button
                onClick={() => handleToggleApprove(student.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  student.approved
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-[#FBBC04] text-[#0D1060] shadow-sm"
                }`}
              >
                <CheckCircleIcon className="w-4 h-4" />
                {student.approved ? "Approved (Click to Edit)" : "Approve Remark"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
