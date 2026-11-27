"use client";

import {
  IconTrendingUp as TrendingUp,
  IconUsers as Users,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconDownload as Download,
  IconCalendar as Calendar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api, {
  getCampusClasses,
  getCampusStudents,
  getCampusOfficialExamScores,
} from "@/lib/api";
import { syncEngine } from "@/lib/syncEngine";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [packsCount, setPacksCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadReports = async () => {
      setLoading(true);
      try {
        const [clsRes, stuRes, subjRes, scoreRes, packs] = await Promise.all([
          getCampusClasses().catch(() => ({ classes: [] })),
          getCampusStudents().catch(() => ({ students: [] })),
          api.get("/subjects").catch(() => ({ data: [] })),
          getCampusOfficialExamScores().catch(() => ({ official_scores: [] })),
          syncEngine.fetchAvailableManifests().catch(() => []),
        ]);
        if (cancelled) return;
        setClasses(Array.isArray(clsRes?.classes) ? clsRes.classes : []);
        setStudents(Array.isArray(stuRes?.students) ? stuRes.students : []);
        setSubjects(Array.isArray(subjRes?.data) ? subjRes.data : []);
        setScores(Array.isArray(scoreRes?.official_scores) ? scoreRes.official_scores : []);
        setPacksCount(Array.isArray(packs) ? packs.length : 0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const avgScore = useMemo(() => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, s) => {
      const max = Number(s.max_score) || 100;
      return acc + ((Number(s.approved_score) || 0) / max) * 100;
    }, 0);
    return Math.round(total / scores.length);
  }, [scores]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const schoolStatsData = [
    {
      label: "Active Students (CampusPRO)",
      value: students.length.toLocaleString(),
      trend: "Live",
      positive: true,
      icon: <Users className="w-5 h-5" />,
      color: "text-[#146ef5]",
      bg: "bg-blue-50",
    },
    {
      label: "Published Study Packs",
      value: String(packsCount),
      trend: "ClassroomPRO",
      positive: true,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg. Official Score",
      value: `${avgScore}%`,
      trend: `${scores.length} synced`,
      positive: true,
      icon: <BrainCircuit className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Subjects (CampusPRO)",
      value: String(subjects.length),
      trend: `${classes.length} classes`,
      positive: true,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex-1">
      <main className="p-8 space-y-8">
        <MotionRise className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Academic Analytics (CampusPRO + ClassroomPRO)
            </h2>
            <p className="text-sm text-gray-500">
              Live enrollment, subject allocation, and official exam score metrics read from{" "}
              <code>service_campuspro</code>.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-100 hover:bg-gray-50 text-gray-900">
              <Calendar className="w-4 h-4 mr-2" /> Current Academic Session
            </Button>
          </div>
        </MotionRise>

        {/* Stats Grid */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schoolStatsData.map((stat, i) => (
            <MotionRise
              key={i}
              delay={i * 0.06}
              className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </MotionRise>
          ))}
        </MotionStagger>

        <MotionStagger className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Classes from CampusPRO */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-6">
              Class Cohorts (Synced from CampusPRO)
            </h3>
            {classes.length === 0 ? (
              <p className="text-sm text-gray-500">
                No class records returned from <code>service_campuspro</code> yet.
              </p>
            ) : (
              <div className="space-y-4">
                {classes.map((cls: any, i: number) => (
                  <div
                    key={cls.id || i}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {cls.name || cls.code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cls.level_category || "Academic Level"}
                      </div>
                    </div>
                    <div className="text-xs font-extrabold text-[#146ef5]">
                      {cls.students_count ?? 0} Students · {cls.arms_count ?? 0} Arms
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subjects from CampusPRO */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-6">
              Curriculum Subjects (Synced from CampusPRO)
            </h3>
            {subjects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No subject records returned from <code>service_campuspro</code> yet.
              </p>
            ) : (
              <div className="space-y-3">
                {subjects.map((subj: any, i: number) => (
                  <div
                    key={subj.id || i}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">{subj.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {subj.code} · {subj.department || subj.curriculum || "NERDC"}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">
                      {subj.topicsCount || 0} Pack Topics
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </MotionStagger>
      </main>
    </div>
  );
}
