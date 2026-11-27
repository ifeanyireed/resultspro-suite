"use client";

import { useState, useEffect } from "react";
import {
  IconSchool as School,
  IconUsers as Users,
  IconBook as BookOpen,
  IconArrowUpRight as ArrowUpRight,
  IconShieldCheck as ShieldCheck,
  IconAlertCircle as AlertCircle,
  IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { getCampusBranches, getCampusStudents } from "@/lib/api";
import { syncEngine } from "@/lib/syncEngine";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const [branchRes, stuRes, packList] = await Promise.all([
          getCampusBranches().catch(() => ({ branches: [] })),
          getCampusStudents().catch(() => ({ students: [] })),
          syncEngine.fetchAvailableManifests({ include_pending: true }).catch(() => []),
        ]);
        if (cancelled) return;
        setBranches(Array.isArray(branchRes?.branches) ? branchRes.branches : []);
        setStudentsCount(
          Array.isArray(stuRes?.students) ? stuRes.students.length : 0
        );
        setPacks(Array.isArray(packList) ? packList : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingPacks = packs.filter(
    (p) => p.moderation_status === "PENDING_APPROVAL"
  );

  const stats = [
    {
      label: "Campus Branches (CampusPRO)",
      value: String(branches.length),
      trend: "Live",
      positive: true,
      icon: <School className="w-5 h-5" />,
      color: "text-[#146ef5]",
      bg: "bg-blue-50",
    },
    {
      label: "Enrolled Students (CampusPRO)",
      value: studentsCount.toLocaleString(),
      trend: "Synced",
      positive: true,
      icon: <Users className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Persisted Study Packs",
      value: String(packs.length),
      trend: "ClassroomPRO",
      positive: true,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Moderation Queue",
      value: String(pendingPacks.length),
      trend: "Pending",
      positive: true,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      <main className="p-8 space-y-10">
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
                {loading ? (
                  <Skeleton className="h-4 w-12 rounded-full" />
                ) : (
                  <div className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? <Skeleton className="h-8 w-24" /> : stat.value}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </MotionRise>
          ))}
        </MotionStagger>

        <MotionStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campus Branches Table */}
          <MotionRise className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-gray-900 font-display">
                Registered Campus Branches (service_campuspro)
              </h3>
              <Link href="/dashboard/super-admin/schools">
                <Button variant="link" className="text-emerald-600 font-bold text-xs">
                  View All Campuses <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden text-sm">
              {!loading && branches.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-500">
                  No campus branches returned from <code>service_campuspro</code> yet.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-white">
                      <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                        Campus / Branch
                      </th>
                      <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                        Code
                      </th>
                      <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                        Students
                      </th>
                      <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {branches.map((branch, i) => (
                      <tr key={branch.id || i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-gray-900">{branch.name}</div>
                          <div className="text-xs text-gray-500">
                            {branch.city || branch.state || branch.address || "Campus Site"}
                          </div>
                        </td>
                        <td className="p-6 text-xs font-mono text-gray-600">
                          {branch.code || "MAIN"}
                        </td>
                        <td className="p-6 text-gray-900 font-medium">
                          {(branch.students_count || 0).toLocaleString()}
                        </td>
                        <td className="p-6">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {branch.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </MotionRise>

          {/* Platform Health & Moderation Queue */}
          <MotionRise delay={0.1} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 font-display px-2">
              System Integration
            </h3>

            <div className="space-y-4">
              <div className="p-6 rounded-[32px] bg-white shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
                    System of Record
                  </h4>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Users &amp; Rosters</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">
                    service_campuspro
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-gray-500">Study Packs &amp; Progress</span>
                  <span className="text-[10px] font-bold text-[#146ef5] uppercase">
                    service_classroompro
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-amber-50 border border-amber-200 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
                    Study Pack Moderation
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  There are{" "}
                  <span className="text-gray-900 font-bold">{pendingPacks.length} items</span>{" "}
                  awaiting approval in the Study Pack moderation queue.
                </p>
                <Link href="/dashboard/super-admin/moderation" className="block">
                  <Button
                    size="sm"
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border-none font-bold text-xs h-10"
                  >
                    Open Moderation Queue
                  </Button>
                </Link>
              </div>
            </div>
          </MotionRise>
        </MotionStagger>
      </main>
    </div>
  );
}
