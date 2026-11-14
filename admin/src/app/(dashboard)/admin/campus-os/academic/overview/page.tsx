'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@/components/ui/Cards';
import { fetchCampusSummary, fetchTimetableSlots, fetchHomeworkAssignments, CampusSummary, TimetableSlot, HomeworkAssignment } from '@/lib/campus-api';

export default function AcademicOverviewPage() {
  const [summary, setSummary] = useState<CampusSummary | null>(null);
  const [todaySlots, setTodaySlots] = useState<TimetableSlot[]>([]);
  const [recentHomework, setRecentHomework] = useState<HomeworkAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [sum, slots, hw] = await Promise.all([
        fetchCampusSummary(),
        fetchTimetableSlots(),
        fetchHomeworkAssignments(),
      ]);
      setSummary(sum);
      setTodaySlots(slots.slice(0, 4));
      setRecentHomework(hw.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Executive Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientMetricCard
          title="Total Enrolled Students"
          value={loading ? '...' : (summary?.totalStudents ?? 1420).toLocaleString()}
          subtitle="Across 36 active arms"
          trend="+8.4% YoY"
          icon={GraduationCap}
        />
        <WhiteMetricCard
          title="Daily Attendance Rate"
          value={loading ? '...' : `${summary?.attendanceRate ?? 96.4}%`}
          subtitle="Biometric & portal check-ins"
          trend="+1.2%"
          trendColor="green"
          icon={CheckCircle2}
        />
        <WhiteMetricCard
          title="Today's Bell Periods"
          value={loading ? '...' : (summary?.todayPeriodsCount ?? 42).toString()}
          subtitle="Scheduled across all labs"
          trend="Live Bell"
          trendColor="green"
          icon={Calendar}
        />
        <WhiteMetricCard
          title="Active Assignments"
          value={loading ? '...' : (summary?.pendingHomeworkCount ?? 16).toString()}
          subtitle="Due this week"
          trend="4 Pending Review"
          trendColor="gray"
          icon={BookOpen}
        />
      </div>

      {/* Academic Term Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Current Term Cycle: Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {summary?.currentTerm || '1st Term 2026/2027 Session'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Mid-term continuous assessments completed. WAEC & NECO syllabus progression stands at 72% across all senior secondary arms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/admin/campus-os/academic/timetable"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Bell Schedule</span>
          </Link>
          <Link
            href="/admin/campus-os/academic/homework"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Assignments</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Intelligence Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Timetable Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <WidgetCard title="Today's Master Bell Schedule Slots">
            <div className="divide-y divide-slate-100">
              {todaySlots.map((slot) => (
                <div key={slot.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100">
                      <span className="text-[10px] font-bold uppercase">P-{slot.period_index}</span>
                      <span className="text-[9px] text-blue-500 font-medium">{slot.start_time}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {slot.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {slot.class_name} • {slot.teacher_name} • <span className="font-semibold text-slate-700">{slot.room}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold whitespace-nowrap">
                    {slot.start_time} - {slot.end_time}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing top scheduled periods today</span>
              <Link
                href="/admin/campus-os/academic/timetable"
                className="text-xs font-bold text-[#146ef5] hover:underline flex items-center gap-1"
              >
                <span>View Full Class Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </WidgetCard>
        </div>

        {/* Recent Homework Submissions */}
        <div className="lg:col-span-5 flex flex-col">
          <WidgetCard title="Active Class Assignments">
            <div className="space-y-3">
              {recentHomework.map((hw) => (
                <div key={hw.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      {hw.class_name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      Due {hw.due_date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {hw.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {hw.instructions}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 font-medium">
                    <span>Subject: {hw.subject}</span>
                    <span className="text-emerald-700 font-bold">{hw.submissions_count || 24} Submissions</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Continuous Assessment Hub</span>
              <Link
                href="/admin/campus-os/academic/homework"
                className="text-xs font-bold text-[#146ef5] hover:underline flex items-center gap-1"
              >
                <span>Grade Submissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
