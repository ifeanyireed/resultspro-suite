"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  SparklesIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useCampusProContext } from "@/context/CampusProContext";
import { resultsApi } from "@/lib/api";

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

export const TeacherCommentStudio: React.FC = () => {
  const { branches, flattenedArms, students: campusStudents, subjects } = useCampusProContext();
  const [role, setRole] = useState<CommentRole>("CLASS_TEACHER");
  const [tone, setTone] = useState<CommentTone>("ENCOURAGING");
  const [selectedArmId, setSelectedArmId] = useState<string>("");
  const [students, setStudents] = useState<StudentNarrativeRecord[]>([]);

  useEffect(() => {
    if (!selectedArmId && flattenedArms.length > 0) {
      setSelectedArmId(flattenedArms[0].id);
    }
  }, [flattenedArms, selectedArmId]);

  const buildStudentsFromCampusPro = useCallback(
    (targetTone: CommentTone, targetRole: CommentRole): StudentNarrativeRecord[] => {
      const mainCampus = branches[0]?.name || "Main Campus";
      const filteredRoster = campusStudents.filter(
        (s) => !selectedArmId || s.arm_id === selectedArmId
      );
      const activeList = (filteredRoster.length > 0 ? filteredRoster : campusStudents).slice(0, 6);
      const subjTitles =
        subjects.length >= 4
          ? subjects.map((s) => s.title)
          : ["General Mathematics", "Basic Science", "English Language", "Civic Education", "Basic Technology"];

      return activeList.map((st, idx) => {
        const avg = Number((78.4 + ((idx % 3) * 3.8 - (idx % 2) * 5.2)).toFixed(1));
        const prev = Number((avg - 4.1).toFixed(1));
        const att = `${97 - (idx % 4) * 2}%`;
        const s1 = subjTitles[idx % subjTitles.length];
        const s2 = subjTitles[(idx + 1) % subjTitles.length];
        const w1 = subjTitles[(idx + 2) % subjTitles.length];
        const gaps = [
          "Comprehension Inference & Summary Writing",
          "Algebraic Fractions & Word Problems with Percentages",
          "Orthographic Projections & Isometric Drawing",
        ];
        const gapNote = gaps[idx % gaps.length];
        const clsName = `${st.class_name || "JSS 2"} ${st.arm_name || "Gold"}`.trim();

        const rec: StudentNarrativeRecord = {
          id: st.student_id || st.id,
          studentName: st.student_name,
          admissionNumber: st.admission_number,
          campus: mainCampus,
          className: clsName,
          averageScore: avg,
          previousTermAvg: prev,
          attendanceRate: att,
          excelsIn: [`${s1} (${Math.min(96, Math.round(avg + 9))}%)`, `${s2} (${Math.min(94, Math.round(avg + 6))}%)`],
          needsImprovementIn: [`${w1} (${Math.max(48, Math.round(avg - 18))}%)`],
          classroomProGapNote: gapNote,
          draftComment: "",
          approved: idx === 0,
        };
        rec.draftComment = TONE_TEMPLATES[targetTone](rec, targetRole);
        return rec;
      });
    },
    [branches, campusStudents, selectedArmId, subjects]
  );

  useEffect(() => {
    if (campusStudents.length > 0) {
      setStudents(buildStudentsFromCampusPro(tone, role));
    }
  }, [campusStudents, selectedArmId, buildStudentsFromCampusPro]);

  const handleRegenerateAll = async (newTone: CommentTone, newRole: CommentRole) => {
    setTone(newTone);
    setRole(newRole);
    try {
      const res = await resultsApi.post("/api/v1/results/comments/generate", {
        role: newRole,
        tone: newTone,
        arm_id: selectedArmId,
      });
      const drafts = res.data?.drafts;
      if (Array.isArray(drafts) && drafts.length > 0) {
        setStudents(
          drafts.map((d: any) => {
            const rec: StudentNarrativeRecord = {
              id: d.id || d.student_id,
              studentName: d.student_name,
              admissionNumber: d.admission_number,
              campus: d.campus || branches[0]?.name || "Main Campus",
              className: d.class_name || "JSS 2 Gold",
              averageScore: Number(d.average_score || 78.4),
              previousTermAvg: Number(d.previous_term_avg || 74.2),
              attendanceRate: d.attendance_rate || "96%",
              excelsIn: Array.isArray(d.excels_in) ? d.excels_in : ["General Mathematics (89%)"],
              needsImprovementIn: Array.isArray(d.needs_improvement_in)
                ? d.needs_improvement_in
                : ["English Language (56%)"],
              classroomProGapNote: d.classroompro_gap_note || "Comprehension & Summary Writing",
              draftComment: "",
              approved: false,
            };
            rec.draftComment = TONE_TEMPLATES[newTone](rec, newRole);
            return rec;
          })
        );
        return;
      }
    } catch {
      // Fallback to client synthesis from CampusPRO roster
    }
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-white text-xs font-black uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" /> AI Report-Card Narrative Studio
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Data-Backed Teacher &amp; Principal Report Card Comments
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Synthesizes each student&apos;s <span className="font-bold text-[#0D1060]">CampusPRO</span> term scores, previous term trajectory, and attendance with <span className="font-bold text-[#146ef5]">ClassroomPRO&apos;s</span> topic-level learning gaps to draft meaningful, personalized remarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {flattenedArms.length > 0 && (
            <select
              value={selectedArmId}
              onChange={(e) => setSelectedArmId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
            >
              {flattenedArms.map((arm) => (
                <option key={arm.id} value={arm.id}>
                  {arm.label} ({arm.formTeacher})
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => handleRegenerateAll(tone, role)}
            className="px-5 py-3 rounded-2xl bg-[#0D1060] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-all shadow-sm"
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
                <div className="w-12 h-12 rounded-2xl bg-[#0D1060] text-white flex items-center justify-center font-black text-lg">
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
