"use client";

import React, { useEffect, useState } from "react";
import {
  IconUsers as Users,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconCheck as Check,
  IconRefresh as Refresh,
  IconAlertCircle as AlertCircle,
} from "@tabler/icons-react";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api, {
  getCampusStudents,
  getCampusOfficialExamScores,
} from "@/lib/api";

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [officialScores, setOfficialScores] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState("CA1");
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [rosterData, scoresData] = await Promise.all([
        getCampusStudents().catch(() => ({ students: [] })),
        getCampusOfficialExamScores().catch(() => ({ official_scores: [] })),
      ]);

      const rawStudents = Array.isArray(rosterData?.students)
        ? rosterData.students
        : [];
      const rawScores = Array.isArray(scoresData?.official_scores)
        ? scoresData.official_scores
        : [];

      setOfficialScores(rawScores);

      const syncedByStudent = new Map<string, any>();
      for (const sc of rawScores) {
        if (sc.student_id) {
          syncedByStudent.set(sc.student_id, sc);
        }
      }

      setStudents(
        rawStudents.map((st: any) => {
          const synced = syncedByStudent.get(st.student_id || st.id);
          return {
            id: st.student_id || st.id,
            name: st.student_name || st.full_name,
            admissionNo: st.admission_number || "",
            className: st.class_name
              ? `${st.class_name} ${st.arm_name || ""}`.trim()
              : st.arm_name || "",
            score: synced?.score ?? 0,
            maxObtainable: synced?.max_obtainable ?? 20,
            syncedToCampusPro: Boolean(synced),
            syncRef: synced?.source_reference_id || "NOT_SYNCED",
          };
        })
      );
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          "Unable to load student roster from service_campuspro."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveAndSyncAll = async () => {
    if (students.length === 0) return;
    setSyncing(true);
    setSyncNotice(null);
    setErrorMsg(null);

    const assessmentId = `CLP-ASSESS-${selectedComponent}-${Date.now()}`;
    try {
      const res = await api.post(
        `/teacher/assessments/${assessmentId}/approve-and-sync`,
        {
          component_code: selectedComponent,
          max_obtainable: 20,
          entries: students.map((s) => ({
            student_id: s.id,
            student_name: s.name,
            admission_number: s.admissionNo,
            score: Number(s.score) || 0,
          })),
        }
      );
      setSyncNotice(
        `Synced ${students.length} student ${selectedComponent} scores to service_campuspro Official Exam Score Ledger (Ref: ${res.data?.classroompro_assessment_id}).`
      );
      await loadData();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          "Failed to push approved scores to service_campuspro."
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[24px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <main className="p-4 md:p-8 space-y-8">
        <MotionRise className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
              ClassroomPRO Learning Hub → service_campuspro Official Exam Ledger
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-display">
              CampusPRO Student Roster &amp; Official Score Approval Sync
            </h2>
            <p className="text-sm text-gray-500">
              Student rosters are read live from <code>service_campuspro</code> (<code>/api/v1/campus/classes/arms/students</code>), and approved scores are written directly to <code>/api/v1/campus/exam-scores/sync</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
            >
              <option value="CA1">CA 1 (Max 20)</option>
              <option value="CA2">CA 2 (Max 20)</option>
              <option value="EXAM">EXAM (Max 60)</option>
            </select>
            <Button
              onClick={handleApproveAndSyncAll}
              disabled={syncing || students.length === 0}
              className="bg-[#0D1060] hover:bg-[#0D1060]/95 text-white font-black text-xs rounded-xl"
            >
              <Refresh className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing
                ? "Pushing to service_campuspro..."
                : `Approve & Push ${selectedComponent} Scores to CampusPRO`}
            </Button>
          </div>
        </MotionRise>

        {syncNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live KPIs from CampusPRO */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionRise className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#146ef5] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">
              {students.length}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              CampusPRO Enrolled Roster
            </div>
          </MotionRise>

          <MotionRise className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">
              {officialScores.length}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              Official Scores in CampusPRO Ledger
            </div>
          </MotionRise>

          <MotionRise className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px]">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">
              {selectedComponent}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              Active Assessment Component
            </div>
          </MotionRise>
        </MotionStagger>

        {/* Student Roster Table */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900">
              CampusPRO Student Roster ({students.length})
            </h3>
            <p className="text-xs text-gray-500">
              Enter or verify approved scores before syncing to <code>campus_official_exam_scores</code>.
            </p>
          </div>

          {students.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-500 font-semibold">
              No student records found in <code>service_campuspro</code> for this tenant. Enroll students in CampusPRO to approve and sync their scores.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-extrabold uppercase text-[10px]">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-4">Admission No.</th>
                    <th className="py-3.5 px-4">Class Arm</th>
                    <th className="py-3.5 px-4">Approved Score</th>
                    <th className="py-3.5 px-4">CampusPRO Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-gray-50/70">
                      <td className="py-3.5 px-6 font-extrabold text-gray-900">
                        {st.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {st.admissionNo}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {st.className}
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={st.score}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setStudents((prev) =>
                              prev.map((row, rIdx) =>
                                rIdx === idx ? { ...row, score: val } : row
                              )
                            );
                          }}
                          className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-extrabold text-gray-900"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            st.syncedToCampusPro
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {st.syncedToCampusPro
                            ? `SYNCED (${st.syncRef})`
                            : "AWAITING APPROVAL"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
