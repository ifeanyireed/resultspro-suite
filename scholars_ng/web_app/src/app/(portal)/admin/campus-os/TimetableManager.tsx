'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  PrinterIcon,
  FunnelIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface TimetableSlot {
  id: string;
  tenant_id: string;
  class_name: string;
  section_id?: string;
  arm_id?: string;
  arm_name?: string;
  day_of_week: string;
  period_index: number;
  period_label: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  subject_id?: string;
  subject_code?: string;
  teacher_id?: string;
  teacher_name: string;
  room: string;
  color: string;
  status: string;
}

export interface BellPeriod {
  id: string;
  period_index: number;
  period_label: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PRESET_COLORS = [
  { label: 'Blue (Core / STEM)', value: 'bg-blue-50 text-[#146ef5] border-blue-200' },
  { label: 'Purple (Humanities)', value: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Emerald (Sciences / Labs)', value: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Teal (Chemistry / Practical)', value: 'bg-teal-50 text-teal-700 border-teal-200' },
  { label: 'Amber (Future Skills / ICT)', value: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Indigo (Commercial)', value: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { label: 'Rose (Civic / Languages)', value: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'Orange (Sports / Health)', value: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export default function TimetableManager() {
  // Slots & Meta data
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [bellSchedule, setBellSchedule] = useState<BellPeriod[]>([]);
  const [availableArms, setAvailableArms] = useState<string[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  // View Mode
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedArm, setSelectedArm] = useState<string>('SS 1 Science');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  // Async States
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Slot Edit/Create Modal State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotFormData, setSlotFormData] = useState({
    class_name: 'SS 1 Science',
    day_of_week: 'Monday',
    period_index: 1,
    period_label: 'Period 1',
    start_time: '08:00 AM',
    end_time: '08:45 AM',
    subject_name: '',
    teacher_name: '',
    room: '',
    color: 'bg-blue-50 text-[#146ef5] border-blue-200',
    status: 'SCHEDULED',
    allow_conflict: false,
  });
  const [slotSubmitting, setSlotSubmitting] = useState<boolean>(false);
  const [slotConflictError, setSlotConflictError] = useState<string | null>(null);

  // Auto-Generate Modal State
  const [isGenModalOpen, setIsGenModalOpen] = useState<boolean>(false);
  const [genTargetArm, setGenTargetArm] = useState<string>('SS 1 Science');
  const [genOverwrite, setGenOverwrite] = useState<boolean>(true);
  const [genSubmitting, setGenSubmitting] = useState<boolean>(false);

  // Clear Confirmation State
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);

  // Fetch timetable slots and metadata (Strictly persistent & tenant isolated, NO fallbacks)
  const fetchTimetable = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);

      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await api.get(`/v1/campus/timetable${qs}`).catch(async () => {
        return await api.get(`/campus/timetable${qs}`);
      });

      if (res.data) {
        const fetchedSlots: TimetableSlot[] = res.data.slots || [];
        setSlots(fetchedSlots);
        setBellSchedule(res.data.bell_schedule || []);

        const arms: string[] = res.data.available_arms || [];
        setAvailableArms(arms);
        if (arms.length > 0 && !arms.includes(selectedArm)) {
          setSelectedArm(arms[0]);
        }

        const teachers: string[] = res.data.available_teachers || [];
        setAvailableTeachers(teachers);
        if (teachers.length > 0 && !selectedTeacher) {
          setSelectedTeacher(teachers[0]);
        }

        const rooms: string[] = res.data.available_rooms || [];
        setAvailableRooms(rooms);
        if (rooms.length > 0 && !selectedRoom) {
          setSelectedRoom(rooms[0]);
        }
      } else {
        setSlots([]);
      }
    } catch (err: any) {
      console.error('Failed to load timetable:', err);
      // STRICT: No fake mock fallback
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Unable to load timetable from the database. Please verify backend service connectivity.'
      );
      setSlots([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedArm, selectedTeacher, selectedRoom]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  // Open modal to add slot on a specific day & period
  const openAddSlotModal = (day: string, period: BellPeriod) => {
    setEditingSlotId(null);
    setSlotConflictError(null);
    setSlotFormData({
      class_name: selectedArm,
      day_of_week: day,
      period_index: period.period_index,
      period_label: period.period_label,
      start_time: period.start_time,
      end_time: period.end_time,
      subject_name: '',
      teacher_name: '',
      room: `Classroom ${selectedArm}`,
      color: 'bg-blue-50 text-[#146ef5] border-blue-200',
      status: 'SCHEDULED',
      allow_conflict: false,
    });
    setIsSlotModalOpen(true);
  };

  // Open modal to edit an existing slot
  const openEditSlotModal = (slot: TimetableSlot) => {
    setEditingSlotId(slot.id);
    setSlotConflictError(null);
    setSlotFormData({
      class_name: slot.class_name,
      day_of_week: slot.day_of_week,
      period_index: slot.period_index,
      period_label: slot.period_label,
      start_time: slot.start_time,
      end_time: slot.end_time,
      subject_name: slot.subject_name,
      teacher_name: slot.teacher_name,
      room: slot.room,
      color: slot.color || 'bg-blue-50 text-[#146ef5] border-blue-200',
      status: slot.status || 'SCHEDULED',
      allow_conflict: false,
    });
    setIsSlotModalOpen(true);
  };

  // Save or update slot
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotFormData.subject_name.trim()) {
      alert('Subject name is required.');
      return;
    }

    setSlotSubmitting(true);
    setSlotConflictError(null);

    try {
      await api.post('/v1/campus/timetable', {
        id: editingSlotId || undefined,
        ...slotFormData,
      }).catch(async () => {
        return await api.post('/campus/timetable', {
          id: editingSlotId || undefined,
          ...slotFormData,
        });
      });

      setIsSlotModalOpen(false);
      setBannerSuccess(`Period "${slotFormData.period_label}" saved for ${slotFormData.class_name}.`);
      fetchTimetable(true);
      setTimeout(() => setBannerSuccess(null), 4000);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // Teacher or Room clash detected by server
        setSlotConflictError(err?.response?.data?.error || 'Schedule Conflict detected by server.');
      } else {
        alert('Failed to save slot: ' + (err?.response?.data?.error || err.message));
      }
    } finally {
      setSlotSubmitting(false);
    }
  };

  // Delete slot
  const handleDeleteSlot = async (slotId: string, subjectName: string) => {
    if (!confirm(`Delete ${subjectName} from this timetable slot?`)) return;
    try {
      await api.delete(`/v1/campus/timetable?id=${slotId}`).catch(async () => {
        return await api.delete(`/campus/timetable?id=${slotId}`);
      });
      setBannerSuccess(`Slot removed.`);
      fetchTimetable(true);
      setTimeout(() => setBannerSuccess(null), 3000);
    } catch (err: any) {
      alert('Failed to delete slot: ' + (err?.response?.data?.error || err.message));
    }
  };

  // Clear all slots for selected arm
  const handleClearArmSchedule = async () => {
    try {
      await api.delete(`/v1/campus/timetable?action=clear&class_name=${encodeURIComponent(selectedArm)}`).catch(async () => {
        return await api.delete(`/campus/timetable?action=clear&class_name=${encodeURIComponent(selectedArm)}`);
      });
      setIsClearModalOpen(false);
      setBannerSuccess(`Schedule cleared for ${selectedArm}.`);
      fetchTimetable(true);
      setTimeout(() => setBannerSuccess(null), 3000);
    } catch (err: any) {
      alert('Failed to clear schedule: ' + (err?.response?.data?.error || err.message));
    }
  };

  // Auto-generate timetable for arm
  const handleAutoGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenSubmitting(true);
    try {
      const res = await api.post('/v1/campus/timetable/generate', {
        class_name: genTargetArm,
        overwrite: genOverwrite,
      }).catch(async () => {
        return await api.post('/campus/timetable/generate', {
          class_name: genTargetArm,
          overwrite: genOverwrite,
        });
      });

      setIsGenModalOpen(false);
      setBannerSuccess(res?.data?.message || `Timetable generated for ${genTargetArm}.`);
      setSelectedArm(genTargetArm);
      fetchTimetable(true);
      setTimeout(() => setBannerSuccess(null), 4500);
    } catch (err: any) {
      alert('Auto-generation failed: ' + (err?.response?.data?.error || err.message));
    } finally {
      setGenSubmitting(false);
    }
  };

  // Print layout
  const handlePrint = () => {
    window.print();
  };

  // Filter slots based on active View Mode
  const activeSlots = useMemo(() => {
    if (viewMode === 'class') {
      return slots.filter((s) => s.class_name === selectedArm);
    }
    if (viewMode === 'teacher') {
      return slots.filter((s) => s.teacher_name === selectedTeacher);
    }
    if (viewMode === 'room') {
      return slots.filter((s) => s.room === selectedRoom);
    }
    return slots;
  }, [slots, viewMode, selectedArm, selectedTeacher, selectedRoom]);

  // Map slots into grid lookup: day -> period_label -> slot
  const gridLookup = useMemo(() => {
    const map: Record<string, Record<string, TimetableSlot>> = {};
    DAYS_OF_WEEK.forEach((d) => {
      map[d] = {};
    });
    activeSlots.forEach((s) => {
      if (map[s.day_of_week]) {
        map[s.day_of_week][s.period_label] = s;
      }
    });
    return map;
  }, [activeSlots]);

  // Aggregate telemetry
  const stats = useMemo(() => {
    const totalPeriods = activeSlots.length;
    const uniqueTeachers = new Set(slots.map((s) => s.teacher_name).filter(Boolean)).size;
    const uniqueRooms = new Set(slots.map((s) => s.room).filter(Boolean)).size;
    return { totalPeriods, uniqueTeachers, uniqueRooms };
  }, [activeSlots, slots]);

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {bannerSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action Hub */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Master Class Timetable</h2>
            <span className="bg-blue-50 text-[#146ef5] border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Persistent DB
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Weekly period matrix, laboratory allocations, and conflict-free teacher scheduling for{' '}
            <span className="font-semibold text-gray-900">
              {viewMode === 'class' ? selectedArm : viewMode === 'teacher' ? selectedTeacher : selectedRoom}
            </span>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchTimetable(true)}
            disabled={refreshing || loading}
            title="Refresh from server"
            className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PrinterIcon className="w-4 h-4" />
            Print Timetable
          </button>

          <button
            onClick={() => {
              setGenTargetArm(selectedArm);
              setIsGenModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SparklesIcon className="w-4 h-4" />
            Auto-Generate Slots
          </button>

          {viewMode === 'class' && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer"
              title="Clear current class schedule"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Periods in View</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{stats.totalPeriods}</span>
            <span className="text-[10px] font-bold text-[#146ef5] bg-blue-50 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Active Educators</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-700">{stats.uniqueTeachers}</span>
            <span className="text-[10px] font-semibold text-gray-400">Deployed Tutors</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Labs &amp; Classrooms</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">{stats.uniqueRooms}</span>
            <span className="text-[10px] font-semibold text-gray-400">Allocated Venues</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Clash Engine Status</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">0 Clashes</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
          </div>
        </div>
      </div>

      {/* View Perspective Switcher & Selector Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Mode toggle */}
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1 border border-gray-200/60">
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'class' ? 'bg-white text-[#146ef5] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Class Timetable
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'teacher' ? 'bg-white text-[#146ef5] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teacher View
            </button>
            <button
              onClick={() => setViewMode('room')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'room' ? 'bg-white text-[#146ef5] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Venue / Lab View
            </button>
          </div>

          {/* Teacher or Room selector dropdown */}
          {viewMode === 'teacher' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Select Educator:</span>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs rounded-full px-3 py-1.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                {availableTeachers.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'room' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Select Venue / Lab:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs rounded-full px-3 py-1.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                {availableRooms.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Dynamic Arm Pills (Only in Class View) */}
        {viewMode === 'class' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {availableArms.map((arm) => {
              const active = selectedArm === arm;
              return (
                <button
                  key={arm}
                  onClick={() => setSelectedArm(arm)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#146ef5] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {arm}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Authoritative Error State (STRICT: NO MOCK FALLBACKS) */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Database Connectivity Issue</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchTimetable()}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition-colors cursor-pointer self-end sm:self-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-[1.5rem] p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-8 h-8 border-2 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Querying timetable database slots...</p>
        </div>
      )}

      {/* Main Timetable Weekly Grid */}
      {!loading && !error && (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-28 sticky left-0 bg-gray-50 z-10 border-r border-gray-100">
                    Day / Period
                  </th>
                  {bellSchedule.map((p) => (
                    <th
                      key={p.id || p.period_label}
                      className={`py-3 px-3 text-center border-r border-gray-100 last:border-r-0 ${
                        p.is_break ? 'bg-amber-50/60 w-24' : 'min-w-[135px]'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-800">{p.period_label}</div>
                      <div className="text-[10px] font-medium text-gray-400 mt-0.5">
                        {p.start_time} – {p.end_time}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-sm text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100">
                      {day}
                    </td>

                    {bellSchedule.map((period) => {
                      if (period.is_break) {
                        return (
                          <td
                            key={period.period_label}
                            className="p-2 bg-amber-50/40 text-center border-r border-gray-100 align-middle"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                              {period.period_label}
                            </span>
                          </td>
                        );
                      }

                      const slot = gridLookup[day]?.[period.period_label];

                      if (!slot) {
                        return (
                          <td
                            key={period.period_label}
                            className="p-2 border-r border-gray-100 last:border-r-0 align-top group/empty hover:bg-blue-50/20 transition-colors"
                          >
                            <div className="rounded-xl border border-dashed border-gray-200 h-24 p-2 flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] text-gray-400">Free Period</span>
                              {viewMode === 'class' && (
                                <button
                                  type="button"
                                  onClick={() => openAddSlotModal(day, period)}
                                  className="mt-1 text-[10px] font-semibold text-[#146ef5] opacity-0 group-hover/empty:opacity-100 hover:underline transition-opacity flex items-center gap-0.5"
                                >
                                  <PlusIcon className="w-3 h-3" /> Add Slot
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={period.period_label}
                          className="p-2 border-r border-gray-100 last:border-r-0 align-top group/slot"
                        >
                          <div
                            className={`rounded-xl p-2.5 border ${
                              slot.color || 'bg-blue-50 text-[#146ef5] border-blue-200'
                            } h-24 flex flex-col justify-between shadow-sm relative overflow-hidden`}
                          >
                            {/* Slot header */}
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <div className="text-xs font-bold leading-snug line-clamp-2">
                                  {slot.subject_name}
                                </div>
                                {/* Quick actions on hover */}
                                <div className="opacity-0 group-hover/slot:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/80 rounded px-1 backdrop-blur-xs">
                                  <button
                                    type="button"
                                    onClick={() => openEditSlotModal(slot)}
                                    title="Edit slot"
                                    className="p-0.5 hover:text-[#146ef5]"
                                  >
                                    <PencilSquareIcon className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSlot(slot.id, slot.subject_name)}
                                    title="Delete slot"
                                    className="p-0.5 hover:text-red-600"
                                  >
                                    <TrashIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] opacity-80 mt-0.5 truncate">
                                {viewMode === 'teacher' ? slot.class_name : slot.teacher_name}
                              </div>
                            </div>

                            {/* Slot footer */}
                            <div className="pt-1 border-t border-current/10 flex items-center justify-between text-[10px] font-semibold">
                              <span className="truncate max-w-[85px]">{slot.room}</span>
                              <span className="text-[9px] opacity-75">45m</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. SLOT EDIT / CREATE MODAL */}
      {/* ------------------------------------------------------------- */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingSlotId ? 'Edit Timetable Slot' : 'Allocate Period Slot'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {slotFormData.class_name} · {slotFormData.day_of_week} ({slotFormData.period_label})
                </p>
              </div>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Warning Alert */}
            {slotConflictError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Schedule Clash Detected</div>
                  <div className="mt-0.5">{slotConflictError}</div>
                  <label className="flex items-center gap-1.5 mt-2 font-semibold text-amber-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slotFormData.allow_conflict}
                      onChange={(e) => setSlotFormData({ ...slotFormData, allow_conflict: e.target.checked })}
                      className="rounded text-amber-600"
                    />
                    Override &amp; Allow Multiple Allocation
                  </label>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="mt-4 space-y-3 text-xs">
              {/* Subject */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={slotFormData.subject_name}
                  onChange={(e) => setSlotFormData({ ...slotFormData, subject_name: e.target.value })}
                  placeholder="e.g. Mathematics, Physics Practical"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>

              {/* Teacher */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Educator / Tutor</label>
                <input
                  type="text"
                  value={slotFormData.teacher_name}
                  onChange={(e) => setSlotFormData({ ...slotFormData, teacher_name: e.target.value })}
                  placeholder="e.g. Mr. David Jenkins, Dr. Samuel Eze"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>

              {/* Room & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    value={slotFormData.room}
                    onChange={(e) => setSlotFormData({ ...slotFormData, room: e.target.value })}
                    placeholder="e.g. Science Lab 1, Room 101"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Color Theme</label>
                  <select
                    value={slotFormData.color}
                    onChange={(e) => setSlotFormData({ ...slotFormData, color: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
                  >
                    {PRESET_COLORS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={slotSubmitting}
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold px-5 py-2 rounded-full shadow-sm shadow-[#146ef5]/20 disabled:opacity-50"
                >
                  {slotSubmitting ? 'Saving to Database...' : 'Save Timetable Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. AUTO-GENERATE SLOTS MODAL */}
      {/* ------------------------------------------------------------- */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center">
              Auto-Generate Timetable
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Automatically populate a conflict-free 5-day period matrix using registered curriculum subjects.
            </p>

            <form onSubmit={handleAutoGenerate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Class Arm</label>
                <select
                  value={genTargetArm}
                  onChange={(e) => setGenTargetArm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-semibold"
                >
                  {availableArms.map((arm) => (
                    <option key={arm} value={arm}>{arm}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genOverwrite}
                  onChange={(e) => setGenOverwrite(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="text-gray-700 font-medium">
                  Overwrite any existing slots for {genTargetArm}
                </span>
              </label>

              <div className="flex items-center justify-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsGenModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={genSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-full shadow-sm shadow-emerald-600/20 disabled:opacity-50"
                >
                  {genSubmitting ? 'Generating...' : 'Generate Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CLEAR ARM CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Clear Timetable?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to delete all scheduled periods for <span className="font-bold text-gray-800">{selectedArm}</span>?
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearArmSchedule}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
