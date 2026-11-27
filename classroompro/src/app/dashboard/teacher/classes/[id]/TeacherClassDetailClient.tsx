"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconUsers as Users,
  IconArrowLeft as ArrowLeft,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconCertificate as GraduationCap,
  IconChartBar as BarChart3,
  IconSearch as Search,
  IconDotsVertical as MoreVertical,
  IconMail as Mail,
  IconFilePlus as FilePlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import {
  getCampusClasses,
  getCampusStudents,
  getCampusOfficialExamScores,
} from "@/lib/api";

export function TeacherClassDetailClient() {
  const params = useParams();
  const classOrArmId = String(params?.id || "");
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState<string>("Class Cohort");
  const [students, setStudents] = useState<any[]>([]);
  const [officialScores, setOfficialScores] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadClassDetails = async () => {
      setLoading(true);
      try {
        const [classesRes, studentsRes, scoresRes] = await Promise.all([
          getCampusClasses().catch(() => ({ classes: [], arms: [] })),
          getCampusStudents({ arm_id: classOrArmId }).catch(() => ({ students: [] })),
          getCampusOfficialExamScores().catch(() => ({ official_scores: [] })),
        ]);
        if (cancelled) return;

        const classes = Array.isArray(classesRes?.classes) ? classesRes.classes : [];
        const arms = Array.isArray(classesRes?.arms) ? classesRes.arms : [];
        const matchedArm =
          arms.find((a: any) => String(a.id) === classOrArmId) ||
          classes
            .flatMap((c: any) => (Array.isArray(c.arms) ? c.arms : []))
            .find((a: any) => String(a.id) === classOrArmId);
        const matchedClass = classes.find((c: any) => String(c.id) === classOrArmId);

        if (matchedArm) {
          setClassName(matchedArm.arm_name || matchedArm.name || classOrArmId);
        } else if (matchedClass) {
          setClassName(matchedClass.name || matchedClass.code || classOrArmId);
        } else if (classOrArmId) {
          setClassName(decodeURIComponent(classOrArmId));
        }

        const roster = Array.isArray(studentsRes?.students) ? studentsRes.students : [];
        setStudents(roster);
        setOfficialScores(
          Array.isArray(scoresRes?.official_scores) ? scoresRes.official_scores : []
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadClassDetails();
    return () => {
      cancelled = true;
    };
  }, [classOrArmId]);

  const scoreByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const sc of officialScores) {
      const sid = String(sc.student_id || sc.admission_number || "");
      if (!sid) continue;
      const maxS = Number(sc.max_score) || 100;
      const pct = Math.round(((Number(sc.approved_score) || 0) / maxS) * 100);
      map[sid] = pct;
    }
    return map;
  }, [officialScores]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = String(s.full_name || s.name || "").toLowerCase();
      const adm = String(s.admission_number || "").toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || adm.includes(q);
    });
  }, [students, search]);

  const avgPerformance = useMemo(() => {
    const vals = Object.values(scoreByStudent);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scoreByStudent]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[500px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <MotionRise className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/teacher/classes"
              className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{className}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" /> {students.length} Students Enrolled (Synced from CampusPRO)
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/teacher/study-packs">
              <Button className="bg-emerald-600 text-white font-bold">
                <FilePlus className="w-4 h-4 mr-2" /> Manage Study Packs
              </Button>
            </Link>
          </div>
        </MotionRise>

        {/* Stats Grid */}
        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MotionRise delay={0.05} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#146ef5] mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
              Avg. Official Score
            </p>
            <h4 className="text-2xl font-bold text-gray-900">{avgPerformance}%</h4>
          </MotionRise>
          <MotionRise delay={0.1} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
              Enrolled Students
            </p>
            <h4 className="text-2xl font-bold text-gray-900">{students.length}</h4>
          </MotionRise>
          <MotionRise delay={0.15} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
              Synced Score Entries
            </p>
            <h4 className="text-2xl font-bold text-gray-900">{officialScores.length}</h4>
          </MotionRise>
          <MotionRise delay={0.2} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
              System of Record
            </p>
            <h4 className="text-lg font-bold text-gray-900">CampusPRO API</h4>
          </MotionRise>
        </MotionStagger>

        {/* Student Roster */}
        <MotionRise className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Student Roster (CampusPRO)</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="pl-9 bg-white shadow-sm border border-gray-100 text-gray-900"
              />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-500">
                No enrolled student records returned by <code>service_campuspro</code> for this class arm yet.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Admission No.</th>
                    <th className="px-6 py-4">Latest Score</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => {
                    const name = student.full_name || student.name || student.id;
                    const adm = student.admission_number || "—";
                    const pct =
                      scoreByStudent[String(student.id)] ??
                      scoreByStudent[String(student.admission_number)] ??
                      0;
                    const status = student.status || "Active";
                    return (
                      <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 uppercase">
                              {String(name).charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{name}</div>
                              <div className="text-[10px] text-gray-500">
                                {student.class_arm_name || className}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-600">{adm}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-900">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              status === "Active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </MotionRise>
      </div>
    </div>
  );
}
