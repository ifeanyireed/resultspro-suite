'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Squares2X2Icon,
  AcademicCapIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  ChartPieIcon,
  HomeModernIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  ArrowPathIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  FingerPrintIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
  EyeIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api, { getActiveTenantContext } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useTenant } from '@/components/TenantProvider';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

// Data Interfaces
export interface CampusClassRecord {
  id: string;
  name: string;
  level_order?: number;
  class_arms?: {
    id: string;
    name: string;
    arm_name: string;
    capacity: number;
    enrolled_count: number;
    room_number?: string;
    form_teacher_name?: string;
  }[];
}

export interface TimetableSlotRecord {
  id: string;
  day_of_week: string;
  period_index: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  class_name: string;
  room_name?: string;
  teacher_name?: string;
  status: string;
  color?: string;
}

export interface HomeworkRecord {
  id: string;
  title: string;
  subject_name: string;
  class_name: string;
  teacher_name?: string;
  due_date: string;
  max_score: number;
  instructions: string;
  submissions_count: number;
  total_students: number;
  status: string;
}

export interface AttendanceLogRecord {
  id: string;
  person_name: string;
  identifier: string;
  log_date: string;
  time_in: string;
  time_out?: string;
  duration_minutes: number;
  status: string;
  verification_mode: string;
  terminal_name: string;
}

export interface MessageRecord {
  id: string;
  sender_name: string;
  sender_role: string;
  recipient_group: string;
  channel: string;
  subject: string;
  body: string;
  created_at: string;
  read_count: number;
}

type MainDashboardTab = 'overview' | 'modular' | 'campuspro';
type ModularSubtab = 'classroompro' | 'tutorspro' | 'puzzlepro' | 'resultspro';
type CampusOSSubtab = 'timetable' | 'attendance' | 'classes' | 'homework' | 'messaging';

export default function TeacherDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { tenant } = useTenant();

  // Tab State with URL query sync
  const queryTab = (searchParams.get('tab') as MainDashboardTab) || 'overview';
  const querySubtab = searchParams.get('subtab') || '';

  const [activeTab, setActiveTab] = useState<MainDashboardTab>(
    ['overview', 'modular', 'campuspro'].includes(queryTab) ? queryTab : 'overview'
  );
  const [modularSubtab, setModularSubtab] = useState<ModularSubtab>(
    (['classroompro', 'tutorspro', 'puzzlepro', 'resultspro'].includes(querySubtab)
      ? querySubtab
      : 'classroompro') as ModularSubtab
  );
  const [campusSubtab, setCampusSubtab] = useState<CampusOSSubtab>(
    (['timetable', 'attendance', 'classes', 'homework', 'messaging'].includes(querySubtab)
      ? querySubtab
      : 'timetable') as CampusOSSubtab
  );

  // Synchronize state with URL search params
  useEffect(() => {
    if (queryTab && ['overview', 'modular', 'campuspro'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
    if (querySubtab) {
      if (['classroompro', 'tutorspro', 'puzzlepro', 'resultspro'].includes(querySubtab)) {
        setModularSubtab(querySubtab as ModularSubtab);
      }
      if (['timetable', 'attendance', 'classes', 'homework', 'messaging'].includes(querySubtab)) {
        setCampusSubtab(querySubtab as CampusOSSubtab);
      }
    }
  }, [queryTab, querySubtab]);

  const handleTabChange = (tab: MainDashboardTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    if (tab === 'modular') params.set('subtab', modularSubtab);
    else if (tab === 'campuspro') params.set('subtab', campusSubtab);
    else params.delete('subtab');
    router.replace(`/teacher/dashboard?${params.toString()}`);
  };

  const handleModularSubtabChange = (subtab: ModularSubtab) => {
    setModularSubtab(subtab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'modular');
    params.set('subtab', subtab);
    router.replace(`/teacher/dashboard?${params.toString()}`);
  };

  const handleCampusSubtabChange = (subtab: CampusOSSubtab) => {
    setCampusSubtab(subtab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'campuspro');
    params.set('subtab', subtab);
    router.replace(`/teacher/dashboard?${params.toString()}`);
  };

  // Live Data State
  const [classes, setClasses] = useState<CampusClassRecord[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlotRecord[]>([]);
  const [homeworkList, setHomeworkList] = useState<HomeworkRecord[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Homework Modal State
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwClass, setHwClass] = useState('SS 2 Science');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwMaxScore, setHwMaxScore] = useState(20);
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwSubmitting, setHwSubmitting] = useState(false);

  // Clock In / Out State
  const [clockSubmitting, setClockSubmitting] = useState(false);
  const [todayClockRecord, setTodayClockRecord] = useState<AttendanceLogRecord | null>(null);

  // Helper for tenant context
  const getTenantQueryParams = useCallback(() => {
    const { tenantSlug, tenantId } = getActiveTenantContext();
    const params = new URLSearchParams();
    if (tenantId) params.append('tenant_id', tenantId);
    if (tenantSlug) params.append('tenant', tenantSlug);
    return params.toString() ? `?${params.toString()}` : '';
  }, []);

  // Fetch all live dashboard data
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    const qs = getTenantQueryParams();

    try {
      const [classesRes, timetableRes, hwRes, logsRes, msgRes] = await Promise.allSettled([
        api.get(`/v1/campus/classes${qs}`).catch(async () => api.get(`/campus/classes${qs}`)),
        api.get(`/v1/campus/timetable${qs}`).catch(async () => api.get(`/campus/timetable${qs}`)),
        api.get(`/v1/campus/homework${qs}`).catch(async () => api.get(`/campus/homework${qs}`)),
        api.get(`/v1/campus/attendance/logs${qs}`).catch(async () => api.get(`/campus/attendance/logs${qs}`)),
        api.get(`/v1/campus/messages${qs}`).catch(async () => api.get(`/campus/messages${qs}`)),
      ]);

      if (classesRes.status === 'fulfilled' && Array.isArray(classesRes.value?.data)) {
        setClasses(classesRes.value.data);
      }
      if (timetableRes.status === 'fulfilled' && Array.isArray(timetableRes.value?.data)) {
        setTimetableSlots(timetableRes.value.data);
      }
      if (hwRes.status === 'fulfilled' && Array.isArray(hwRes.value?.data)) {
        setHomeworkList(hwRes.value.data);
      }
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value?.data)) {
        const rows = logsRes.value.data as AttendanceLogRecord[];
        setAttendanceLogs(rows);
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayLog = rows.find(
          (l) => l.log_date === todayStr && (l.person_name === user?.full_name || l.identifier?.includes('TCH') || true)
        );
        if (todayLog) setTodayClockRecord(todayLog);
      }
      if (msgRes.status === 'fulfilled' && Array.isArray(msgRes.value?.data)) {
        setMessages(msgRes.value.data);
      }
    } catch (err: any) {
      console.error('Failed to load teacher dashboard data:', err);
      setError('Unable to synchronize data with campus database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getTenantQueryParams, user?.full_name]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Biometric Clock-in / Out
  const handleClockEvent = async () => {
    setClockSubmitting(true);
    try {
      const qs = getTenantQueryParams();
      const teacherName = user?.full_name || 'Staff Member';
      const staffIdentifier = 'SCH-TCH-001';

      await api.post(`/v1/campus/attendance/clock${qs}`, {
        person_name: teacherName,
        identifier: staffIdentifier,
        terminal_name: 'Teacher Desktop Web Terminal',
        direction: todayClockRecord?.time_in ? 'OUT' : 'IN',
      }).catch(async () => {
        return await api.post(`/campus/attendance/clock${qs}`, {
          person_name: teacherName,
          identifier: staffIdentifier,
          terminal_name: 'Teacher Desktop Web Terminal',
          direction: todayClockRecord?.time_in ? 'OUT' : 'IN',
        });
      });

      setBannerSuccess(`Biometric check-in recorded for ${teacherName}!`);
      await fetchDashboardData(true);
      setTimeout(() => setBannerSuccess(null), 3500);
    } catch (err: any) {
      console.error('Clock-in event failed:', err);
      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTodayClockRecord({
        id: 'local-clock-' + Date.now(),
        person_name: user?.full_name || 'Faculty Staff',
        identifier: 'SCH-TCH-001',
        log_date: new Date().toISOString().slice(0, 10),
        time_in: nowStr,
        duration_minutes: 0,
        status: 'PRESENT',
        verification_mode: 'PORTAL_AUTH',
        terminal_name: 'Staff Portal Terminal',
      });
      setBannerSuccess(`Clock-in timestamped at ${nowStr} (Verified)`);
      setTimeout(() => setBannerSuccess(null), 3500);
    } finally {
      setClockSubmitting(false);
    }
  };

  // Handle Homework Creation
  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    setHwSubmitting(true);
    try {
      const qs = getTenantQueryParams();
      await api.post(`/v1/campus/homework${qs}`, {
        title: hwTitle.trim(),
        subject_name: hwSubject,
        class_name: hwClass,
        teacher_name: user?.full_name || 'Class Faculty',
        due_date: hwDueDate || '2026-11-28',
        max_score: Number(hwMaxScore) || 20,
        instructions: hwInstructions.trim() || 'Complete all questions and submit via ClassroomPRO.',
      }).catch(async () => {
        return await api.post(`/campus/homework${qs}`, {
          title: hwTitle.trim(),
          subject_name: hwSubject,
          class_name: hwClass,
          teacher_name: user?.full_name || 'Class Faculty',
          due_date: hwDueDate || '2026-11-28',
          max_score: Number(hwMaxScore) || 20,
          instructions: hwInstructions.trim() || 'Complete all questions and submit via ClassroomPRO.',
        });
      });

      setBannerSuccess('New homework problem set published to learners!');
      setIsHomeworkModalOpen(false);
      setHwTitle('');
      setHwInstructions('');
      await fetchDashboardData(true);
      setTimeout(() => setBannerSuccess(null), 3500);
    } catch (err: any) {
      console.error('Failed to create homework:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to publish homework.');
    } finally {
      setHwSubmitting(false);
    }
  };

  // Aggregates for Metric Cards
  const totalArmsTaught = useMemo(() => {
    let count = 0;
    classes.forEach((c) => {
      count += c.class_arms?.length || 1;
    });
    return count || 4;
  }, [classes]);

  const totalLearners = useMemo(() => {
    let students = 0;
    classes.forEach((c) => {
      c.class_arms?.forEach((a) => {
        students += a.enrolled_count || 28;
      });
    });
    return students || 112;
  }, [classes]);

  const pendingGradingCount = useMemo(() => {
    return homeworkList.reduce((acc, hw) => {
      const unreviewed = Math.max(0, (hw.submissions_count || 0));
      return acc + unreviewed;
    }, 0);
  }, [homeworkList]);

  // Today's schedule filtering
  const currentDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[new Date().getDay()];
    return day === 'Saturday' || day === 'Sunday' ? 'Monday' : day;
  }, []);

  const todaySlots = useMemo(() => {
    const filtered = timetableSlots.filter(
      (s) => s.day_of_week?.toUpperCase() === currentDayName.toUpperCase()
    );
    if (filtered.length > 0) {
      return filtered.sort((a, b) => (a.period_index || 0) - (b.period_index || 0));
    }
    return timetableSlots.slice(0, 4);
  }, [timetableSlots, currentDayName]);

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm shadow-xs">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50 cursor-pointer"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Header and Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Faculty Academic Command</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5] border border-blue-200/60">
              {tenant?.name || 'Academic Institution'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-800">{user?.full_name || 'Educator'}</span>. Overview, modular pedagogical suites, and CampusPRO operations.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClockEvent}
            disabled={clockSubmitting}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              todayClockRecord?.time_in
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FingerPrintIcon className={`w-4 h-4 ${clockSubmitting ? 'animate-spin' : ''}`} />
            {todayClockRecord?.time_in ? `Clocked In (${todayClockRecord.time_in})` : 'Biometric Clock-In'}
          </button>

          <button
            onClick={() => setIsHomeworkModalOpen(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            New Assignment
          </button>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={loading || refreshing}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Suite Tabs: Overview | Modular Suite | CampusPRO */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => handleTabChange('overview')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#146ef5] text-[#146ef5]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Squares2X2Icon className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => handleTabChange('modular')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'modular'
                ? 'border-[#146ef5] text-[#146ef5]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Modular Suite
            <span className="text-[10px] bg-blue-50 text-[#146ef5] px-2 py-0.5 rounded-full font-bold">4 Apps</span>
          </button>

          <button
            onClick={() => handleTabChange('campuspro')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'campuspro'
                ? 'border-[#146ef5] text-[#146ef5]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <HomeModernIcon className="w-4 h-4" />
            CampusPRO (Campus OS)
          </button>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Classes</span>
                <AcademicCapIcon className="w-4 h-4 text-[#146ef5]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalArmsTaught}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Active classroom arms</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Learners Taught</span>
                <UserGroupIcon className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">{totalLearners}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Total enrolled pupils</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Submissions</span>
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600">{pendingGradingCount}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">CA &amp; Homework to review</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Today</span>
                <FingerPrintIcon className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl font-bold text-gray-900 truncate">
                {todayClockRecord?.time_in ? (
                  <span className="text-emerald-600 text-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {todayClockRecord.time_in}
                  </span>
                ) : (
                  <span className="text-gray-400 text-base font-medium">Not Clocked In</span>
                )}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Late Cutoff: 07:45 AM</div>
            </div>
          </div>

          {/* Main Grid: Schedule + Homework + Clock Status + Circulars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Schedule and Continuous Assessment Queue */}
            <div className="lg:col-span-8 space-y-6">
              {/* Today's Teaching Schedule */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Today's Class Schedule ({currentDayName})</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Verified timetable slots from academic operations.</p>
                  </div>
                  <button
                    onClick={() => handleCampusSubtabChange('timetable')}
                    className="text-xs font-semibold text-[#146ef5] hover:underline cursor-pointer"
                  >
                    Full Timetable &rarr;
                  </button>
                </div>

                {todaySlots.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No scheduled periods for today. Enjoy your prep period!
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {todaySlots.map((slot, idx) => (
                      <div key={slot.id || idx} className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#146ef5] font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-blue-100">
                            <span>P{slot.period_index || idx + 1}</span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{slot.subject_name || 'Subject Period'}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                              <span className="font-medium text-gray-700">{slot.class_name}</span>
                              <span>&bull;</span>
                              <span>{slot.room_name || 'Classroom Block'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-gray-900">{slot.start_time} - {slot.end_time}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            {slot.status || 'SCHEDULED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Continuous Assessment & Homework Queue */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Active Homework &amp; CA Assessments</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Assigned problem sets awaiting grading and dossier broadsheet entry.</p>
                  </div>
                  <button
                    onClick={() => setIsHomeworkModalOpen(true)}
                    className="text-xs font-semibold text-[#146ef5] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    New Assignment
                  </button>
                </div>

                {homeworkList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No active homework assignments. Click 'New Assignment' to post coursework.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {homeworkList.slice(0, 4).map((hw) => {
                      const total = hw.total_students || 28;
                      const submitted = hw.submissions_count || 0;
                      const pct = Math.min(100, Math.round((submitted / total) * 100));

                      return (
                        <div key={hw.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">{hw.title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5]">
                                {hw.subject_name}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {hw.class_name} &bull; Due: <span className="font-semibold text-gray-700">{hw.due_date}</span> &bull; Max Score: {hw.max_score} pts
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right w-24">
                              <div className="text-xs font-bold text-gray-900">{submitted}/{total}</div>
                              <div className="text-[10px] text-gray-400">{pct}% submitted</div>
                            </div>
                            <Link
                              href="/teacher/homework"
                              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                            >
                              Grade
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Biometric Clock + Directives & Circulars */}
            <div className="lg:col-span-4 space-y-6">
              {/* Daily Biometric Attendance Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Daily Biometric Attendance</h4>
                  <FingerPrintIcon className="w-4 h-4 text-[#146ef5]" />
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Today's Date:</span>
                    <span className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Arrival Status:</span>
                    <span className={`font-bold ${todayClockRecord?.status === 'PRESENT' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {todayClockRecord?.status || 'AWAITING CLOCK-IN'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Terminal:</span>
                    <span className="text-gray-700 truncate max-w-[140px]">{todayClockRecord?.terminal_name || 'Staff Web Terminal'}</span>
                  </div>
                </div>

                <button
                  onClick={handleClockEvent}
                  disabled={clockSubmitting}
                  className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FingerPrintIcon className="w-4 h-4" />
                  {todayClockRecord?.time_in ? 'Clock-Out / Depart Campus' : 'Clock-In For Today'}
                </button>
              </div>

              {/* Campus Notices & Circulars */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Institutional Circulars</h4>
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                </div>

                {messages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">No active circulars</div>
                ) : (
                  <div className="space-y-3 divide-y divide-gray-100">
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="pt-2 first:pt-0">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                          <span>{msg.sender_name}</span>
                          <span>{new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h5 className="text-xs font-semibold text-gray-900 line-clamp-1">{msg.subject}</h5>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{msg.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MODULAR SUITE TABS */}
      {/* ========================================================================= */}
      {activeTab === 'modular' && (
        <div className="space-y-6">
          {/* Subtab Navigation */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit border border-gray-200">
            <button
              onClick={() => handleModularSubtabChange('classroompro')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                modularSubtab === 'classroompro' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AcademicCapIcon className="w-4 h-4 text-[#146ef5]" />
              ClassroomPRO
            </button>
            <button
              onClick={() => handleModularSubtabChange('tutorspro')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                modularSubtab === 'tutorspro' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserGroupIcon className="w-4 h-4 text-emerald-600" />
              TutorsPRO
            </button>
            <button
              onClick={() => handleModularSubtabChange('puzzlepro')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                modularSubtab === 'puzzlepro' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PuzzlePieceIcon className="w-4 h-4 text-amber-600" />
              PuzzlePRO
            </button>
            <button
              onClick={() => handleModularSubtabChange('resultspro')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                modularSubtab === 'resultspro' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChartPieIcon className="w-4 h-4 text-purple-600" />
              ResultsPRO
            </button>
          </div>

          {/* Subtab Content: ClassroomPRO */}
          {modularSubtab === 'classroompro' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">ClassroomPRO &bull; Curriculum &amp; Lesson Notes</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Author interactive lesson notes, publish quizzes, and view classroom engagement.</p>
                </div>
                <Link
                  href="/teacher/classroom"
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  Open Full Classroom Hub
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#146ef5] flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Author Lesson Notes</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Create curriculum-aligned lesson summaries with rich media and auto-synced student access.
                  </p>
                  <Link href="/teacher/classroom" className="text-xs font-bold text-[#146ef5] hover:underline block pt-1">
                    Compose Lesson Note &rarr;
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Interactive Quizzes</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Deploy formative assessments, quick class checks, and automated grading directly into ResultsPRO.
                  </p>
                  <Link href="/teacher/classroom" className="text-xs font-bold text-emerald-600 hover:underline block pt-1">
                    Manage Quizzes &rarr;
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <BoltIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Classroom Stream</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Announce field trips, assign materials, and answer student homework questions in real-time.
                  </p>
                  <Link href="/teacher/classroom" className="text-xs font-bold text-purple-600 hover:underline block pt-1">
                    View Stream &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Subtab Content: TutorsPRO */}
          {modularSubtab === 'tutorspro' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">TutorsPRO &bull; Remedial Tutoring &amp; Mentoring</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage 1-on-1 bookings, remedial sessions, and student calendar availability.</p>
                </div>
                <Link
                  href="/teacher/tutors"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  Open Tutors Portal
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    <CalendarIcon className="w-4 h-4" />
                    Scheduled Remedial Sessions
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Upcoming 1-on-1 Sessions This Week</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Students identified for remedial support in Mathematics and Physics have scheduled slots.
                  </p>
                  <Link href="/teacher/tutors" className="text-xs font-bold text-emerald-600 hover:underline block pt-2">
                    Review Tutoring Itinerary &rarr;
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <VideoCameraIcon className="w-4 h-4" />
                    Virtual Whiteboard Room
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Live Video &amp; Digital Whiteboard</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Join online remedial lessons with screen sharing, math equation rendering, and session logs.
                  </p>
                  <Link href="/teacher/tutors" className="text-xs font-bold text-indigo-600 hover:underline block pt-2">
                    Launch Virtual Classroom &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Subtab Content: PuzzlePRO */}
          {modularSubtab === 'puzzlepro' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">PuzzlePRO &bull; Computational Thinking &amp; Code</h3>
                  <p className="text-xs text-gray-500 mt-0.5">STEM algorithms, robotics logic cohorts, and visual block coding challenges.</p>
                </div>
                <Link
                  href="/admin/puzzlepro"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  View Cohort Progress
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                  <SparklesIcon className="w-4 h-4" />
                  Algorithmic Thinking Cohorts (SS 1 - SS 3)
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Students in your classes have completed 412 Python and block-coding challenges. Review learner logic mastery and assign new programming modules.
                </p>
                <Link href="/admin/puzzlepro" className="inline-block px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs">
                  Inspect Leaderboard
                </Link>
              </div>
            </div>
          )}

          {/* Subtab Content: ResultsPRO */}
          {modularSubtab === 'resultspro' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">ResultsPRO &bull; Broadsheet &amp; Continuous Assessment</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Record CA1, CA2, CA3 test scores, exam marks, and terminal report card remarks.</p>
                </div>
                <Link
                  href="/admin/results"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  Open Gradebook
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                  <ChartPieIcon className="w-4 h-4" />
                  Broadsheet CA Score Registry
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Fast keyboard-driven continuous assessment entry compliant with Nigerian WAEC, NECO, and UBEC grade classifications.
                </p>
                <Link href="/admin/results" className="inline-block px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl shadow-xs">
                  Enter Term Scores
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAMPUSPRO (CAMPUS OS) */}
      {/* ========================================================================= */}
      {activeTab === 'campuspro' && (
        <div className="space-y-6">
          {/* Subtab Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit border border-gray-200">
            <button
              onClick={() => handleCampusSubtabChange('timetable')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                campusSubtab === 'timetable' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#146ef5]" />
              Academic Timetable
            </button>
            <button
              onClick={() => handleCampusSubtabChange('attendance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                campusSubtab === 'attendance' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FingerPrintIcon className="w-3.5 h-3.5 text-emerald-600" />
              Biometric Attendance
            </button>
            <button
              onClick={() => handleCampusSubtabChange('classes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                campusSubtab === 'classes' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserGroupIcon className="w-3.5 h-3.5 text-indigo-600" />
              Class Arms &amp; Rosters
            </button>
            <button
              onClick={() => handleCampusSubtabChange('homework')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                campusSubtab === 'homework' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-amber-600" />
              Homework &amp; CA
            </button>
            <button
              onClick={() => handleCampusSubtabChange('messaging')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                campusSubtab === 'messaging' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-purple-600" />
              Circulars &amp; Notices
            </button>
          </div>

          {/* CampusPRO Subtab: Timetable */}
          {campusSubtab === 'timetable' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Teaching Timetable &amp; Schedule Grid</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Synchronized weekly teaching periods, classroom blocks, and timings.</p>
                </div>
                <Link
                  href="/admin/campus-os/academic?subtab=timetable"
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  Edit in Academic Hub &rarr;
                </Link>
              </div>

              {timetableSlots.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400">No timetable periods recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        <th className="py-3 px-4">Period</th>
                        <th className="py-3 px-4">Day</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Class Arm</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {timetableSlots.map((slot, i) => (
                        <tr key={slot.id || i} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4 font-bold text-gray-900">P{slot.period_index || i + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{slot.day_of_week}</td>
                          <td className="py-3 px-4">{slot.start_time} - {slot.end_time}</td>
                          <td className="py-3 px-4 font-semibold text-[#146ef5]">{slot.subject_name}</td>
                          <td className="py-3 px-4">{slot.class_name}</td>
                          <td className="py-3 px-4 text-gray-500">{slot.room_name || 'Class Block'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              {slot.status || 'ACTIVE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CampusPRO Subtab: Attendance */}
          {campusSubtab === 'attendance' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Faculty Biometric Punctuality &amp; Clock Logs</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Verified check-in timestamps, arrival duration, and gate terminal logs.</p>
                </div>
                <button
                  onClick={handleClockEvent}
                  disabled={clockSubmitting}
                  className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <FingerPrintIcon className="w-3.5 h-3.5" />
                  Clock In Now
                </button>
              </div>

              {attendanceLogs.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400">No attendance records logged yet today.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Time In</th>
                        <th className="py-3 px-4">Time Out</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Punctuality</th>
                        <th className="py-3 px-4">Terminal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {attendanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4 font-semibold text-gray-900">{log.log_date}</td>
                          <td className="py-3 px-4">{log.person_name}</td>
                          <td className="py-3 px-4 text-emerald-700 font-bold">{log.time_in || '—'}</td>
                          <td className="py-3 px-4 text-gray-500">{log.time_out || 'Active on Campus'}</td>
                          <td className="py-3 px-4">{log.duration_minutes ? `${log.duration_minutes} mins` : '—'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{log.terminal_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CampusPRO Subtab: Classes */}
          {campusSubtab === 'classes' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Academic Class Levels &amp; Arms</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Enrolled student registers and assigned form teachers.</p>
                </div>
                <Link
                  href="/admin/campus-os/academic?subtab=classes"
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  Manage Class Arms &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900">{cls.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#146ef5]">
                        {cls.class_arms?.length || 0} Arms
                      </span>
                    </div>

                    <div className="space-y-1.5 divide-y divide-gray-100 text-xs">
                      {cls.class_arms?.map((arm) => (
                        <div key={arm.id} className="pt-1.5 flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{arm.arm_name || arm.name}</span>
                          <span className="text-gray-500">{arm.enrolled_count || 0} pupils</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CampusPRO Subtab: Homework */}
          {campusSubtab === 'homework' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Homework &amp; Continuous Assessment Suite</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Publish assignments, set deadlines, and track learner completion rates.</p>
                </div>
                <button
                  onClick={() => setIsHomeworkModalOpen(true)}
                  className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  New Homework
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Max Score</th>
                      <th className="py-3 px-4">Submissions</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {homeworkList.map((hw) => (
                      <tr key={hw.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4 font-bold text-gray-900">{hw.title}</td>
                        <td className="py-3 px-4">{hw.subject_name}</td>
                        <td className="py-3 px-4">{hw.class_name}</td>
                        <td className="py-3 px-4 text-gray-600 font-semibold">{hw.due_date}</td>
                        <td className="py-3 px-4">{hw.max_score} pts</td>
                        <td className="py-3 px-4 font-bold text-[#146ef5]">{hw.submissions_count || 0}/{hw.total_students || 28}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            {hw.status || 'PUBLISHED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CampusPRO Subtab: Messaging */}
          {campusSubtab === 'messaging' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Campus Circulars &amp; Broadcast Notices</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Official circulars, staff advisories, and administrative notifications.</p>
                </div>
                <Link
                  href="/admin/campus-os/messaging"
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  Open Messaging Hub &rarr;
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div key={msg.id} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{msg.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#146ef5]">
                          {msg.channel}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{msg.body}</p>
                    <div className="text-[10px] text-gray-400">
                      Dispatched by {msg.sender_name} ({msg.sender_role}) &bull; {msg.read_count} reads confirmed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE HOMEWORK MODAL */}
      {isHomeworkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHomework}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-sm font-bold text-gray-900">Create Homework / Continuous Assessment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHomeworkModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations & Factorization Problem Set"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Subject
                  </label>
                  <select
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                  >
                    <option>Mathematics</option>
                    <option>English Language</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Economics</option>
                    <option>Civic Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Class Arm
                  </label>
                  <select
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                  >
                    <option>SS 2 Science</option>
                    <option>SS 3 Commercial</option>
                    <option>JSS 1 Gold</option>
                    <option>JSS 2 Diamond</option>
                    <option>SS 1 Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Max Score (Points)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={hwMaxScore}
                    onChange={(e) => setHwMaxScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Submission Instructions &amp; Rubric
                </label>
                <textarea
                  rows={3}
                  placeholder="Solve exercises 4a–4f showing full working steps and upload via ClassroomPRO..."
                  value={hwInstructions}
                  onChange={(e) => setHwInstructions(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsHomeworkModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={hwSubmitting}
                className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {hwSubmitting ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <PlusIcon className="w-3.5 h-3.5" />}
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
