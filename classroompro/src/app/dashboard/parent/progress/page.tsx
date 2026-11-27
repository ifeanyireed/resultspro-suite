"use client";

import {
  IconTrendingUp as TrendingUp,
  IconTarget as Target,
  IconAward as Award,
  IconArrowLeft as ArrowLeft,
  IconCalendar as Calendar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api, { getCampusParentWards, getCampusOfficialExamScores } from "@/lib/api";

export default function ChildProgressReport() {
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [progressData, setProgressData] = useState<any>(null);
  const [officialScores, setOfficialScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const wardsRes = await getCampusParentWards().catch(() => ({ linked_wards: [] }));
        const linked = Array.isArray(wardsRes?.linked_wards) ? wardsRes.linked_wards : [];
        if (cancelled) return;
        setWards(linked);
        const activeId = linked[0]?.student_id || "";
        setSelectedWardId(activeId);

        const [progRes, scoresRes] = await Promise.all([
          api
            .get(`/progress/overview${activeId ? `?student_id=${encodeURIComponent(activeId)}` : ""}`)
            .catch(() => ({ data: null })),
          getCampusOfficialExamScores(activeId ? { student_id: activeId } : undefined).catch(() => ({
            official_scores: [],
          })),
        ]);
        if (cancelled) return;
        setProgressData(progRes?.data || null);
        setOfficialScores(
          Array.isArray(scoresRes?.official_scores) ? scoresRes.official_scores : []
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeWard = wards.find((w) => w.student_id === selectedWardId) || wards[0] || null;
  const childName = activeWard?.full_name || "Linked Ward";
  const subjectProgress: any[] = Array.isArray(progressData?.subjectProgress)
    ? progressData.subjectProgress
    : [];

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48 rounded" />
          </div>
        </div>
        <main className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[32px]" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <MotionRise className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/parent"
            className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </Link>
          <div className="h-6 w-px bg-gray-100 mx-2" />
          <h1 className="text-lg font-bold text-gray-900">
            {activeWard ? `${childName}'s Progress (${activeWard.class_label || activeWard.admission_number})` : "Ward Progress"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {wards.length > 1 && (
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-900"
            >
              {wards.map((w) => (
                <option key={w.student_id} value={w.student_id}>
                  {w.full_name} ({w.class_label})
                </option>
              ))}
            </select>
          )}
          <Button variant="outline" size="sm" className="border-gray-100 text-gray-900 hover:bg-gray-50 h-9">
            <Calendar className="w-4 h-4 mr-2" /> CampusPRO Synced
          </Button>
        </div>
      </MotionRise>

      <main className="p-8 max-w-7xl mx-auto space-y-10">
        {!activeWard ? (
          <div className="p-12 rounded-3xl bg-white border border-gray-100 text-center text-sm text-gray-500">
            No linked wards found on <code>service_campuspro</code> for this parent account.
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MotionRise delay={0.05} className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">
                    Overall Mastery
                  </p>
                  <h4 className="text-3xl font-bold text-gray-900">
                    {progressData?.overallMastery || 0}%
                  </h4>
                </div>
              </MotionRise>
              <MotionRise delay={0.1} className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">
                    Total Points
                  </p>
                  <h4 className="text-3xl font-bold text-gray-900">
                    {(progressData?.totalPoints || 0).toLocaleString()}
                  </h4>
                </div>
              </MotionRise>
              <MotionRise delay={0.15} className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">
                    Official Exam Records
                  </p>
                  <h4 className="text-3xl font-bold text-gray-900">{officialScores.length}</h4>
                </div>
              </MotionRise>
            </MotionStagger>

            {/* Subject Breakdown */}
            <MotionStagger className="grid lg:grid-cols-2 gap-8">
              <MotionRise delay={0.05} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 font-display px-2">
                  Syllabus Completion (ClassroomPRO)
                </h3>
                <div className="space-y-6 p-8 rounded-[40px] bg-white shadow-sm border border-gray-100">
                  {subjectProgress.length === 0 ? (
                    <p className="text-sm text-gray-500">No study pack lessons completed yet.</p>
                  ) : (
                    subjectProgress.map((item, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-900">
                            {item.subject || item.name}
                          </span>
                          <span className="text-gray-500 font-mono">
                            {item.completion ?? item.percentage ?? 0}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#146ef5] transition-all duration-1000"
                            style={{ width: `${item.completion ?? item.percentage ?? 0}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </MotionRise>

              <MotionRise delay={0.1} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 font-display px-2">
                  Official Approved Scores (CampusPRO)
                </h3>
                <div className="space-y-4 p-8 rounded-[40px] bg-white shadow-sm border border-gray-100">
                  {officialScores.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No official approved scores synced to <code>service_campuspro</code> for {childName} yet.
                    </p>
                  ) : (
                    officialScores.map((sc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                      >
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {sc.subject} · {sc.component_code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sc.term} ({sc.academic_session})
                          </div>
                        </div>
                        <div className="text-sm font-black text-emerald-600">
                          {sc.approved_score} / {sc.max_score}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </MotionRise>
            </MotionStagger>
          </>
        )}
      </main>
    </div>
  );
}
