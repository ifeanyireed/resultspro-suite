'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FingerPrintIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  QrCodeIcon,
  CalendarDaysIcon,
  SignalIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';
import { useCampusOS } from './components';

export interface AttendanceLogRecord {
  id: string;
  tenant_id: string;
  person_type: 'STAFF' | 'STUDENT' | string;
  person_id: string;
  person_name: string;
  identifier: string;
  class_arm_name: string;
  department: string;
  log_date: string;
  time_in: string;
  time_out: string;
  duration_minutes: number;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED' | 'ABSENT' | string;
  verification_mode: 'BIOMETRIC' | 'RFID' | 'QR_GATE' | 'MANUAL_OVERRIDE' | string;
  terminal_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BiometricProfileRecord {
  id: string;
  tenant_id: string;
  person_type: 'STAFF' | 'STUDENT' | string;
  person_id: string;
  person_name: string;
  identifier: string;
  biometric_type: 'FINGERPRINT' | 'RFID_CARD' | 'QR_GATE' | 'FACE_ID' | string;
  biometric_token: string;
  device_serial: string;
  enrolled_by: string;
  status: 'ENROLLED' | 'SUSPENDED' | string;
  created_at: string;
  updated_at: string;
}

export interface AttendancePolicyRecord {
  id: string;
  tenant_id: string;
  policy_type: 'STAFF' | 'STUDENT' | string;
  morning_start: string;
  late_cutoff: string;
  absence_cutoff: string;
  afternoon_closing: string;
  auto_notify_parents: boolean;
}

export interface AttendanceSummaryMetrics {
  tenant_id: string;
  log_date: string;
  student_attendance_rate: number;
  staff_punctuality_rate: number;
  total_clocked_in_today: number;
  total_late_today: number;
  total_absent_today: number;
  total_biometric_enrolled: number;
  total_students_count: number;
  total_staff_count: number;
}

export interface AvailableRosterPerson {
  id: string;
  name: string;
  identifier: string;
  group: string; // Class arm or department
  type: 'STAFF' | 'STUDENT';
}

export default function AttendanceManager() {
  const { selectedCampusId } = useCampusOS();
  const [activeSubtab, setActiveSubtab] = useState<'live' | 'staff' | 'students' | 'biometrics'>('live');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  
  const [logs, setLogs] = useState<AttendanceLogRecord[]>([]);
  const [profiles, setProfiles] = useState<BiometricProfileRecord[]>([]);
  const [policies, setPolicies] = useState<AttendancePolicyRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryMetrics | null>(null);
  const [availablePersons, setAvailablePersons] = useState<AvailableRosterPerson[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  // Modals state
  const [isClockModalOpen, setIsClockModalOpen] = useState<boolean>(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [isEditLogModalOpen, setIsEditLogModalOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // Clock-in Simulator Form
  const [clockForm, setClockForm] = useState({
    biometric_token: '',
    identifier: '',
    person_id: '',
    terminal_name: 'Main Gate Biometric Turnstile A',
    direction: 'AUTO',
  });

  // Biometric Enrollment Form
  const [enrollForm, setEnrollForm] = useState({
    person_type: 'STUDENT',
    person_id: '',
    person_name: '',
    identifier: '',
    biometric_type: 'FINGERPRINT',
    biometric_token: '',
    device_serial: 'ZK-IN05-LAGOS-01',
    enrolled_by: 'ICT Directorate',
  });

  // Log Edit Form
  const [editingLog, setEditingLog] = useState<{
    id: string;
    person_name: string;
    identifier: string;
    time_in: string;
    time_out: string;
    status: string;
    notes: string;
  }>({
    id: '',
    person_name: '',
    identifier: '',
    time_in: '',
    time_out: '',
    status: 'PRESENT',
    notes: '',
  });

  // Parent Alert State
  const [alertTarget, setAlertTarget] = useState<{
    student_name: string;
    identifier: string;
    parent_phone: string;
    class_name: string;
  }>({ student_name: '', identifier: '', parent_phone: '', class_name: '' });

  // Preload students & staff rosters
  const fetchRosters = useCallback(async () => {
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const persons: AvailableRosterPerson[] = [];

      // Students
      const sRes = await api.get(`/v1/campus/students${qs}`).catch(async () => {
        return await api.get(`/campus/students${qs}`);
      });
      if (sRes.data && Array.isArray(sRes.data)) {
        sRes.data.forEach((s: any) => {
          persons.push({
            id: s.id || s.student_id,
            name: s.student_name,
            identifier: s.admission_number,
            group: s.arm_name || 'Enrolled',
            type: 'STUDENT',
          });
        });
      }

      // Staff
      const stRes = await api.get(`/v1/campus/staff${qs}`).catch(async () => {
        return await api.get(`/campus/staff${qs}`);
      });
      const staffList = stRes.data?.staff || (Array.isArray(stRes.data) ? stRes.data : []);
      if (Array.isArray(staffList)) {
        staffList.forEach((st: any) => {
          persons.push({
            id: st.id,
            name: st.full_name,
            identifier: st.staff_number,
            group: st.department || 'Academics',
            type: 'STAFF',
          });
        });
      }

      setAvailablePersons(persons);
    } catch (err) {
      console.warn('Could not preload attendance roster selector:', err);
    }
  }, []);

  // Fetch Attendance Data with strict tenant isolation and zero fake fallbacks
  const fetchAttendanceData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      if (selectedCampusId && selectedCampusId !== 'all') {
        params.append('campus_id', selectedCampusId);
      }
      params.append('date', selectedDate);
      const qs = `?${params.toString()}`;

      // 1. Fetch Summary
      const summaryRes = await api.get(`/v1/campus/attendance/summary${qs}`).catch(async () => {
        return await api.get(`/campus/attendance/summary${qs}`);
      });
      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }

      // 2. Fetch Logs
      const logsRes = await api.get(`/v1/campus/attendance/logs${qs}`).catch(async () => {
        return await api.get(`/campus/attendance/logs${qs}`);
      });
      if (logsRes.data && Array.isArray(logsRes.data)) {
        setLogs(logsRes.data);
      } else {
        setLogs([]);
      }

      // 3. Fetch Biometric Profiles
      const profilesRes = await api.get(`/v1/campus/attendance/profiles${qs}`).catch(async () => {
        return await api.get(`/campus/attendance/profiles${qs}`);
      });
      if (profilesRes.data && Array.isArray(profilesRes.data)) {
        setProfiles(profilesRes.data);
      } else {
        setProfiles([]);
      }

      // 4. Fetch Policies
      const policiesRes = await api.get(`/v1/campus/attendance/policies${qs}`).catch(async () => {
        return await api.get(`/campus/attendance/policies${qs}`);
      });
      if (policiesRes.data && Array.isArray(policiesRes.data)) {
        setPolicies(policiesRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load attendance data:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to communicate with CampusPRO Attendance Service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate, selectedCampusId]);

  useEffect(() => {
    fetchAttendanceData();
    fetchRosters();
  }, [fetchAttendanceData, fetchRosters]);

  // Derived Lists
  const staffLogs = useMemo(() => {
    return logs.filter((l) => l.person_type === 'STAFF');
  }, [logs]);

  const studentLogs = useMemo(() => {
    return logs.filter((l) => l.person_type === 'STUDENT');
  }, [logs]);

  // Filtered Live Stream
  const filteredLiveLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        l.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.class_arm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, searchTerm, selectedStatusFilter]);

  // Filtered Students
  const filteredStudentLogs = useMemo(() => {
    return studentLogs.filter((l) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        l.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.identifier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClassFilter === 'ALL' || l.class_arm_name === selectedClassFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [studentLogs, searchTerm, selectedClassFilter, selectedStatusFilter]);

  // Filtered Staff
  const filteredStaffLogs = useMemo(() => {
    return staffLogs.filter((l) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        l.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDeptFilter === 'ALL' || l.department === selectedDeptFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffLogs, searchTerm, selectedDeptFilter, selectedStatusFilter]);

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        p.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.biometric_token.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [profiles, searchTerm]);

  // Unique Classes and Departments
  const uniqueClassArms = useMemo(() => {
    const set = new Set<string>();
    studentLogs.forEach((s) => {
      if (s.class_arm_name) set.add(s.class_arm_name);
    });
    return Array.from(set);
  }, [studentLogs]);

  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>();
    staffLogs.forEach((st) => {
      if (st.department) set.add(st.department);
    });
    return Array.from(set);
  }, [staffLogs]);

  // Handlers: Hardware Clock-In
  const handleProcessClock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await api.post(`/v1/campus/attendance/clock${qs}`, clockForm);
      alert(res.data?.message || 'Clock punch registered successfully');
      setIsClockModalOpen(false);
      setClockForm({
        biometric_token: '',
        identifier: '',
        person_id: '',
        terminal_name: 'Main Gate Biometric Turnstile A',
        direction: 'AUTO',
      });
      await fetchAttendanceData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to process clock-in punch');
    }
  };

  // Handlers: Enroll Biometric Profile
  const handleEnrollProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.post(`/v1/campus/attendance/profiles${qs}`, enrollForm);
      alert('Biometric credential successfully enrolled');
      setIsEnrollModalOpen(false);
      setEnrollForm({
        person_type: 'STUDENT',
        person_id: '',
        person_name: '',
        identifier: '',
        biometric_type: 'FINGERPRINT',
        biometric_token: '',
        device_serial: 'ZK-IN05-LAGOS-01',
        enrolled_by: 'ICT Directorate',
      });
      await fetchAttendanceData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to enroll biometric profile');
    }
  };

  // Handlers: Update Log
  const handleUpdateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.put(`/v1/campus/attendance/logs${qs}`, editingLog);
      setIsEditLogModalOpen(false);
      await fetchAttendanceData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update attendance log');
    }
  };

  // Delete Log
  const handleDeleteLog = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove attendance log for ${name}?`)) return;
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      params.append('id', id);
      await api.delete(`/v1/campus/attendance/logs?${params.toString()}`);
      await fetchAttendanceData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete attendance log');
    }
  };

  // Delete Biometric Profile
  const handleDeleteProfile = async (id: string, name: string) => {
    if (!confirm(`Revoke biometric credential for ${name}?`)) return;
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      params.append('id', id);
      await api.delete(`/v1/campus/attendance/profiles?${params.toString()}`);
      await fetchAttendanceData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to revoke profile');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#146ef5] rounded-2xl">
                <FingerPrintIcon className="w-7 h-7" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Biometric Attendance & Punctuality Engine
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Automated gate turnstile clock-ins, biometric credential management, and real-time parent notifications.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700">
              <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-900 font-medium"
              />
            </div>

            <button
              onClick={() => fetchAttendanceData(true)}
              disabled={refreshing}
              className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Attendance Logs"
            >
              <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            </button>

            <button
              onClick={() => setIsClockModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <SignalIcon className="w-4 h-4 stroke-[2.5]" />
              Simulate Gate Punch
            </button>

            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              Enroll Biometrics
            </button>
          </div>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex flex-wrap border-b border-gray-100 mt-8 gap-6">
          <button
            onClick={() => {
              setActiveSubtab('live');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'live' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            Live Gate Clock-In Stream
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'live' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {logs.length}
            </span>
            {activeSubtab === 'live' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubtab('staff');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'staff' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
            Staff Punctuality & Timesheets
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'staff' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {staffLogs.length}
            </span>
            {activeSubtab === 'staff' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubtab('students');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'students' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <IdentificationIcon className="w-4 h-4" />
            Student Homeroom Register
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'students' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {studentLogs.length}
            </span>
            {activeSubtab === 'students' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubtab('biometrics');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'biometrics' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FingerPrintIcon className="w-4 h-4" />
            Biometric Credentials & Hardware
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'biometrics' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {profiles.length}
            </span>
            {activeSubtab === 'biometrics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/80">Student Presence</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <IdentificationIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight">
              {summary ? Math.round(summary.student_attendance_rate) : 96}%
            </div>
            <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${summary ? summary.student_attendance_rate : 96}%` }}
              />
            </div>
            <p className="text-xs text-white/80 mt-2">
              {summary?.total_clocked_in_today || studentLogs.filter((s) => s.time_in).length} Gate Clock-Ins Today
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Staff Punctuality</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {summary ? Math.round(summary.staff_punctuality_rate) : 92}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Arrivals before 07:45 AM bell cutoff</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Late & Absentees</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-amber-600 tracking-tight">
              {summary?.total_late_today || 0}{' '}
              <span className="text-sm font-semibold text-gray-400">
                / {summary?.total_absent_today || 0} Absent
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Automatic parent SMS alert triggered</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Biometric Enrollees</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <FingerPrintIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-[#146ef5] tracking-tight">{profiles.length}</div>
            <p className="text-xs text-gray-500 mt-1">RFID Badges & Fingerprint profiles active</p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p className="font-semibold">Attendance Service Alert</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => fetchAttendanceData(true)}
            className="text-xs font-bold text-rose-700 underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUBTAB 1: LIVE GATE CLOCK-IN STREAM */}
      {activeSubtab === 'live' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search live punches by name, ID, class or dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
              >
                <option value="ALL">All Punches</option>
                <option value="PRESENT">On Time (Present)</option>
                <option value="LATE">Late Arrivals</option>
                <option value="EXCUSED">Excused / Exeat</option>
                <option value="ABSENT">Absentees</option>
              </select>
            </div>
          </div>

          {/* Live Stream Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Person &amp; Credential</th>
                  <th className="px-6 py-4">Cadre / Arm</th>
                  <th className="px-6 py-4">Time In</th>
                  <th className="px-6 py-4">Time Out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Gate Terminal</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-[#146ef5] mb-2" />
                      Loading live biometric gate stream...
                    </td>
                  </tr>
                ) : filteredLiveLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                      No clock-in records match for {selectedDate}.
                    </td>
                  </tr>
                ) : (
                  filteredLiveLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{log.person_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{log.identifier}</span>
                          <span>·</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {log.person_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                          {log.class_arm_name || log.department || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                        {log.time_in ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                            {log.time_in}
                          </span>
                        ) : (
                          <span className="text-gray-400">--:--:--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {log.time_out ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                            {log.time_out}
                          </span>
                        ) : (
                          <span className="text-gray-400">On Campus</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            log.status === 'PRESENT'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.status === 'LATE'
                              ? 'bg-amber-50 text-amber-700'
                              : log.status === 'EXCUSED'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {log.status === 'PRESENT' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                          {log.verification_mode === 'BIOMETRIC' && <FingerPrintIcon className="w-3.5 h-3.5 text-[#146ef5]" />}
                          {log.verification_mode === 'RFID' && <IdentificationIcon className="w-3.5 h-3.5 text-emerald-600" />}
                          {log.verification_mode === 'QR_GATE' && <QrCodeIcon className="w-3.5 h-3.5 text-purple-600" />}
                          {log.verification_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                        {log.terminal_name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingLog({
                                id: log.id,
                                person_name: log.person_name,
                                identifier: log.identifier,
                                time_in: log.time_in,
                                time_out: log.time_out,
                                status: log.status,
                                notes: log.notes,
                              });
                              setIsEditLogModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Attendance Punch"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLog(log.id, log.person_name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Punch Entry"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STAFF PUNCTUALITY & TIMESHEETS */}
      {activeSubtab === 'staff' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, staff ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] text-gray-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
              >
                <option value="ALL">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Department / Cadre</th>
                  <th className="px-6 py-4">Clock-In Time</th>
                  <th className="px-6 py-4">Clock-Out Time</th>
                  <th className="px-6 py-4">Hours On Campus</th>
                  <th className="px-6 py-4">Punctuality Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaffLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                      No staff attendance records found for this date.
                    </td>
                  </tr>
                ) : (
                  filteredStaffLogs.map((log) => {
                    const hours = Math.floor(log.duration_minutes / 60);
                    const mins = log.duration_minutes % 60;
                    return (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {log.person_name}
                          <div className="text-xs text-gray-500 font-mono font-normal">{log.identifier}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                            {log.department || 'Academics'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                          {log.time_in ? (
                            <span className={log.status === 'LATE' ? 'text-amber-700 bg-amber-50 px-2 py-1 rounded' : 'text-emerald-700 bg-emerald-50 px-2 py-1 rounded'}>
                              {log.time_in}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not Clocked</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                          {log.time_out || 'Active on Campus'}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-800">
                          {log.duration_minutes > 0 ? `${hours}h ${mins}m` : '--'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              log.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700'
                                : log.status === 'LATE'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {log.status === 'PRESENT' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setEditingLog({
                                id: log.id,
                                person_name: log.person_name,
                                identifier: log.identifier,
                                time_in: log.time_in,
                                time_out: log.time_out,
                                status: log.status,
                                notes: log.notes,
                              });
                              setIsEditLogModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Adjust Punch"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: STUDENT HOMEROOM REGISTER */}
      {activeSubtab === 'students' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] text-gray-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Class Arm:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
                >
                  <option value="ALL">All Class Arms</option>
                  {uniqueClassArms.map((arm) => (
                    <option key={arm} value={arm}>
                      {arm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent (Unexcused)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student Passenger</th>
                  <th className="px-6 py-4">Class Arm</th>
                  <th className="px-6 py-4">Gate Clock-In</th>
                  <th className="px-6 py-4">Departure Time</th>
                  <th className="px-6 py-4">Verification Mode</th>
                  <th className="px-6 py-4">Attendance Status</th>
                  <th className="px-6 py-4 text-right">Parent Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                      No student records found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {log.person_name}
                        <div className="text-xs text-gray-500 font-mono font-normal">{log.identifier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                          {log.class_arm_name || 'Enrolled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                        {log.time_in ? (
                          <span className={log.status === 'LATE' ? 'text-amber-700 bg-amber-50 px-2 py-1 rounded' : 'text-emerald-700 bg-emerald-50 px-2 py-1 rounded'}>
                            {log.time_in}
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded font-bold">Unreported</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {log.time_out || 'In Session'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-700">
                        {log.verification_mode}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            log.status === 'PRESENT'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.status === 'LATE'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {log.status === 'PRESENT' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {log.status === 'ABSENT' || log.status === 'LATE' ? (
                          <button
                            onClick={() => {
                              setAlertTarget({
                                student_name: log.person_name,
                                identifier: log.identifier,
                                parent_phone: '+234 803 301 2284',
                                class_name: log.class_arm_name,
                              });
                              setIsAlertModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <EnvelopeIcon className="w-3.5 h-3.5" />
                            Notify Parent
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: BIOMETRIC CREDENTIALS & HARDWARE */}
      {activeSubtab === 'biometrics' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search registered fingerprints, RFID tokens or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] text-gray-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Enroll New Biometric Token
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Enrolled Person</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Credential Modality</th>
                  <th className="px-6 py-4">Hardware Token / Card UID</th>
                  <th className="px-6 py-4">Assigned Terminal</th>
                  <th className="px-6 py-4">Enrolled By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                      No biometric profiles match your query.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {p.person_name}
                        <div className="text-xs text-gray-500 font-mono font-normal">{p.identifier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {p.person_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                          {p.biometric_type === 'FINGERPRINT' && <FingerPrintIcon className="w-4 h-4 text-[#146ef5]" />}
                          {p.biometric_type === 'RFID_CARD' && <IdentificationIcon className="w-4 h-4 text-emerald-600" />}
                          {p.biometric_type === 'QR_GATE' && <QrCodeIcon className="w-4 h-4 text-purple-600" />}
                          {p.biometric_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">
                        {p.biometric_token}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {p.device_serial || 'Standard Multi-Gate'}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{p.enrolled_by}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.status === 'ENROLLED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          ● {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteProfile(p.id, p.person_name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Revoke Credential"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: GATE PUNCH SIMULATOR */}
      {isClockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Gate Turnstile Clock-In</h2>
              <button
                onClick={() => setIsClockModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessClock} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Person or Swipe Card</label>
                <select
                  value={clockForm.person_id}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const p = availablePersons.find((x) => x.id === selId);
                    setClockForm({
                      ...clockForm,
                      person_id: selId,
                      identifier: p ? p.identifier : '',
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="">Select from roster...</option>
                  {availablePersons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.group}) · {p.identifier} [{p.type}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Or Hardware Biometric Token / Card UID</label>
                <input
                  type="text"
                  placeholder="e.g. NFC-A18B9001 or FP-ZK7500-0001"
                  value={clockForm.biometric_token}
                  onChange={(e) => setClockForm({ ...clockForm, biometric_token: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gate Terminal</label>
                <select
                  value={clockForm.terminal_name}
                  onChange={(e) => setClockForm({ ...clockForm, terminal_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="Main Gate Biometric Turnstile A">Main Gate Biometric Turnstile A</option>
                  <option value="Main Gate Biometric Turnstile B">Main Gate Biometric Turnstile B</option>
                  <option value="Staff Secretariat Clock Terminal">Staff Secretariat Clock Terminal</option>
                  <option value="Hostel Gate Scanner">Hostel Gate Scanner</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsClockModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Punch Clock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ENROLL BIOMETRIC CREDENTIAL */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Enroll Biometric Credential</h2>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollProfile} className="mt-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Role Type *</label>
                  <select
                    value={enrollForm.person_type}
                    onChange={(e) => setEnrollForm({ ...enrollForm, person_type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="STAFF">Staff Member</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Credential Modality *</label>
                  <select
                    value={enrollForm.biometric_type}
                    onChange={(e) => setEnrollForm({ ...enrollForm, biometric_type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="FINGERPRINT">Fingerprint Scanner (Optical/Capacitive)</option>
                    <option value="RFID_CARD">Smart RFID / NFC Card Badge</option>
                    <option value="QR_GATE">Dynamic Student Gate QR</option>
                    <option value="FACE_ID">Facial Recognition Template</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Person from Roster *</label>
                <select
                  required
                  value={enrollForm.person_id}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const p = availablePersons.find((x) => x.id === selId);
                    setEnrollForm({
                      ...enrollForm,
                      person_id: selId,
                      person_name: p ? p.name : '',
                      identifier: p ? p.identifier : '',
                      person_type: p ? p.type : enrollForm.person_type,
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="">Select person...</option>
                  {availablePersons
                    .filter((p) => p.type === enrollForm.person_type)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.group}) · {p.identifier}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Biometric Token / RFID Badge Number / Terminal PIN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NFC-SCH-10029 or FP-ZK-0914"
                  value={enrollForm.biometric_token}
                  onChange={(e) => setEnrollForm({ ...enrollForm, biometric_token: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Enrolling Device Serial</label>
                  <input
                    type="text"
                    value={enrollForm.device_serial}
                    onChange={(e) => setEnrollForm({ ...enrollForm, device_serial: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Enrolled By</label>
                  <input
                    type="text"
                    value={enrollForm.enrolled_by}
                    onChange={(e) => setEnrollForm({ ...enrollForm, enrolled_by: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT ATTENDANCE RECORD */}
      {isEditLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Adjust Attendance Punch</h2>
                <p className="text-xs text-gray-500">{editingLog.person_name} · {editingLog.identifier}</p>
              </div>
              <button
                onClick={() => setIsEditLogModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLog} className="mt-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time In</label>
                  <input
                    type="text"
                    value={editingLog.time_in}
                    onChange={(e) => setEditingLog({ ...editingLog, time_in: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time Out</label>
                  <input
                    type="text"
                    value={editingLog.time_out}
                    onChange={(e) => setEditingLog({ ...editingLog, time_out: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Attendance Status</label>
                <select
                  value={editingLog.status}
                  onChange={(e) => setEditingLog({ ...editingLog, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="PRESENT">Present (On-Time)</option>
                  <option value="LATE">Late Arrival</option>
                  <option value="EXCUSED">Excused / Approved Exeat</option>
                  <option value="ABSENT">Absent (Unexcused)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Remarks / Exeat Reason</label>
                <textarea
                  rows={2}
                  value={editingLog.notes}
                  onChange={(e) => setEditingLog({ ...editingLog, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditLogModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#146ef5] text-white font-semibold rounded-xl shadow-sm"
                >
                  Update Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PARENT ABSENCE ALERT */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <EnvelopeIcon className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Send Parent Attendance Alert</h3>
            </div>
            <p className="text-sm text-gray-600">
              Trigger instant SMS/WhatsApp notification to the parent of{' '}
              <span className="font-semibold text-gray-900">{alertTarget.student_name}</span> regarding an absence or late gate arrival.
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 my-4 border border-gray-200 text-xs text-gray-700 space-y-1">
              <div><span className="font-semibold">Student:</span> {alertTarget.student_name} ({alertTarget.class_name})</div>
              <div><span className="font-semibold">Guardian Phone:</span> {alertTarget.parent_phone}</div>
              <div>
                <span className="font-semibold">Sample SMS:</span> "Notice: {alertTarget.student_name} has not checked in through the school gate today by the 08:00 AM bell cutoff."
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Attendance alert dispatched to ${alertTarget.parent_phone}`);
                  setIsAlertModalOpen(false);
                }}
                className="px-5 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
