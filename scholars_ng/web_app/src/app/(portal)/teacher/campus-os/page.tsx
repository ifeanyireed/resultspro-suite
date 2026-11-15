'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarDaysIcon,
  FingerPrintIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ScaleIcon,
  HeartIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  BookOpenIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SparklesIcon,
  DocumentTextIcon,
  HomeModernIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type TeacherCampusSubtab =
  | 'rollcall'
  | 'timetable'
  | 'homework'
  | 'discipline'
  | 'clinic'
  | 'facilities'
  | 'hostel'
  | 'library'
  | 'messaging';

interface RollCallStudent {
  student_id: string;
  student_name: string;
  admission_number: string;
  gender: string;
  arm_id: string;
  arm_name: string;
  class_name: string;
  log_id?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
  time_in?: string;
  notes?: string;
}

function TeacherCampusOSContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSubtab = (searchParams.get('subtab') as TeacherCampusSubtab) || 'rollcall';

  const [activeTab, setActiveTab] = useState<TeacherCampusSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Multi-campus branches
  const [campuses, setCampuses] = useState<any[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('all');

  // Roll Call state
  const [selectedArmId, setSelectedArmId] = useState<string>('');
  const [rollCallDate, setRollCallDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [rollCallStudents, setRollCallStudents] = useState<RollCallStudent[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [savingRollCall, setSavingRollCall] = useState(false);
  const [rollCallSuccessMsg, setRollCallSuccessMsg] = useState<string | null>(null);

  // Homework Modal state
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('');
  const [hwClass, setHwClass] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwMaxScore, setHwMaxScore] = useState(100);
  const [hwDescription, setHwDescription] = useState('');
  const [submittingHw, setSubmittingHw] = useState(false);

  // Discipline Modal state
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [disciplineMode, setDisciplineMode] = useState<'infraction' | 'merit'>('infraction');
  const [discStudentName, setDiscStudentName] = useState('');
  const [discClassName, setDiscClassName] = useState('');
  const [discCategory, setDiscCategory] = useState('Lateness & Truancy');
  const [discSeverity, setDiscSeverity] = useState('MINOR');
  const [discPoints, setDiscPoints] = useState(5);
  const [discDescription, setDiscDescription] = useState('');
  const [discAwardName, setDiscAwardName] = useState('Academic Excellence');
  const [submittingDiscipline, setSubmittingDiscipline] = useState(false);

  // Clinic Referral Modal state
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [clinicStudentName, setClinicStudentName] = useState('');
  const [clinicClassName, setClinicClassName] = useState('');
  const [clinicSymptoms, setClinicSymptoms] = useState('');
  const [clinicPriority, setClinicPriority] = useState('MEDIUM');
  const [submittingClinic, setSubmittingClinic] = useState(false);

  // Facility Booking Modal state
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [facilityName, setFacilityName] = useState('Science Laboratory 1');
  const [facilityTitle, setFacilityTitle] = useState('');
  const [facilityDate, setFacilityDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [facilityStartTime, setFacilityStartTime] = useState('09:00 AM');
  const [facilityEndTime, setFacilityEndTime] = useState('10:30 AM');
  const [facilityAttendees, setFacilityAttendees] = useState(35);
  const [submittingFacility, setSubmittingFacility] = useState(false);

  // Sync tab with URL query parameter
  const handleTabChange = useCallback((tab: TeacherCampusSubtab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('subtab', tab);
    router.replace(`/teacher/campus-os?${params.toString()}`);
  }, [router]);

  // Fetch Teacher Command Dashboard
  const fetchTeacherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = selectedCampusId && selectedCampusId !== 'all' ? `?campus_id=${selectedCampusId}` : '';
      const res = await api
        .get(`/v1/campus/teacher/dashboard${qs}`)
        .catch(async () => await api.get(`/campus/teacher/dashboard${qs}`))
        .catch(async () => await api.get(`/teacher/dashboard${qs}`));

      if (res?.data) {
        setDashboardData(res.data);
        // Default selected arm to teacher's first assigned arm
        if (res.data.classes && res.data.classes.length > 0 && !selectedArmId) {
          setSelectedArmId(res.data.classes[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load teacher campus data:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to communicate with CampusPRO');
    } finally {
      setLoading(false);
    }
  }, [selectedCampusId, selectedArmId]);

  // Fetch Campus Branches
  const fetchBranches = useCallback(async () => {
    try {
      const res = await api
        .get('/v1/campus/branches')
        .catch(async () => await api.get('/campus/branches'));
      if (res?.data?.branches) {
        setCampuses(res.data.branches);
      }
    } catch (err) {
      console.error('Failed to load campus branches:', err);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  // Fetch Roll Call Roster when selectedArmId or rollCallDate changes
  const fetchRollCallRoster = useCallback(async () => {
    if (!selectedArmId) return;
    setLoadingRoster(true);
    setRollCallSuccessMsg(null);
    try {
      const res = await api
        .get(`/v1/campus/attendance/rollcall?arm_id=${selectedArmId}&log_date=${rollCallDate}`)
        .catch(async () => await api.get(`/campus/attendance/rollcall?arm_id=${selectedArmId}&log_date=${rollCallDate}`));

      if (res?.data?.students) {
        setRollCallStudents(res.data.students);
      } else {
        // Fallback: fetch arm students directly
        const armRes = await api.get(`/v1/campus/classes/arms/students?arm_id=${selectedArmId}`).catch(async () => {
          return await api.get(`/campus/classes/arms/students?arm_id=${selectedArmId}`);
        });
        if (armRes?.data && Array.isArray(armRes.data)) {
          setRollCallStudents(
            armRes.data.map((s: any) => ({
              student_id: s.student_id || s.id,
              student_name: s.student_name,
              admission_number: s.admission_number,
              gender: s.gender || 'MALE',
              arm_id: s.arm_id,
              arm_name: s.arm_name || '',
              class_name: s.class_name || '',
              status: 'PRESENT',
            }))
          );
        }
      }
    } catch (err) {
      console.error('Failed to load roll call roster:', err);
    } finally {
      setLoadingRoster(false);
    }
  }, [selectedArmId, rollCallDate]);

  useEffect(() => {
    if (activeTab === 'rollcall' && selectedArmId) {
      fetchRollCallRoster();
    }
  }, [activeTab, selectedArmId, rollCallDate, fetchRollCallRoster]);

  // Bulk status toggling
  const setBulkStatus = (status: 'PRESENT' | 'ABSENT') => {
    setRollCallStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status,
      }))
    );
  };

  const handleStudentStatusChange = (studentId: string, status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED') => {
    setRollCallStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s))
    );
  };

  const handleStudentNotesChange = (studentId: string, notes: string) => {
    setRollCallStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, notes } : s))
    );
  };

  // Submit Roll Call Register
  const submitRollCallRegister = async () => {
    if (rollCallStudents.length === 0) return;
    setSavingRollCall(true);
    setRollCallSuccessMsg(null);
    try {
      const activeArm = dashboardData?.classes?.find((c: any) => c.id === selectedArmId);
      const payload = {
        arm_id: selectedArmId,
        arm_name: activeArm?.arm_name || '',
        class_name: activeArm?.class_name || '',
        log_date: rollCallDate,
        taken_by: dashboardData?.teacher?.name || 'Classroom Form Teacher',
        records: rollCallStudents.map((s) => ({
          student_id: s.student_id,
          student_name: s.student_name,
          admission_number: s.admission_number,
          status: s.status,
          notes: s.notes || '',
        })),
      };

      await api
        .post('/v1/campus/attendance/rollcall', payload)
        .catch(async () => await api.post('/campus/attendance/rollcall', payload));

      setRollCallSuccessMsg(`Roll call successfully recorded for ${rollCallStudents.length} learners!`);
      setTimeout(() => setRollCallSuccessMsg(null), 4000);
      fetchTeacherData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to submit roll call register');
    } finally {
      setSavingRollCall(false);
    }
  };

  // Submit Homework
  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;
    setSubmittingHw(true);
    try {
      const payload = {
        title: hwTitle,
        subject_name: hwSubject || dashboardData?.teacher?.subject || 'Physics',
        class_name: hwClass || dashboardData?.classes?.[0]?.class_name || 'SSS 3',
        due_date: hwDueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        max_score: Number(hwMaxScore) || 100,
        description: hwDescription,
        status: 'PUBLISHED',
      };
      await api.post('/v1/campus/homework', payload).catch(async () => {
        return await api.post('/campus/homework', payload);
      });
      setIsHomeworkModalOpen(false);
      setHwTitle('');
      setHwDescription('');
      fetchTeacherData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to publish homework');
    } finally {
      setSubmittingHw(false);
    }
  };

  // Submit Discipline
  const handleCreateDiscipline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discStudentName.trim()) return;
    setSubmittingDiscipline(true);
    try {
      if (disciplineMode === 'infraction') {
        const payload = {
          action: 'record_infraction',
          student_name: discStudentName,
          class_name: discClassName || 'Senior Secondary 3',
          incident_type: 'DEMERIT',
          category: discCategory,
          severity: discSeverity,
          points: Number(discPoints) || 5,
          description: discDescription,
          reported_by: dashboardData?.teacher?.name || 'Classroom Teacher',
        };
        await api.post('/v1/campus/discipline', payload).catch(async () => {
          return await api.post('/campus/discipline', payload);
        });
      } else {
        const payload = {
          action: 'award_merit',
          student_name: discStudentName,
          class_name: discClassName || 'Senior Secondary 3',
          award_name: discAwardName,
          category: discCategory,
          points: Number(discPoints) || 10,
          reason: discDescription,
          awarded_by: dashboardData?.teacher?.name || 'Senior Form Master',
        };
        await api.post('/v1/campus/discipline', payload).catch(async () => {
          return await api.post('/campus/discipline', payload);
        });
      }
      setIsDisciplineModalOpen(false);
      setDiscStudentName('');
      setDiscDescription('');
      fetchTeacherData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to submit record');
    } finally {
      setSubmittingDiscipline(false);
    }
  };

  // Submit Clinic Referral
  const handleCreateClinicReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicStudentName.trim() || !clinicSymptoms.trim()) return;
    setSubmittingClinic(true);
    try {
      const payload = {
        action: 'log_visit',
        student_name: clinicStudentName,
        class_name: clinicClassName || 'Senior Secondary 3',
        symptoms: clinicSymptoms,
        triage_priority: clinicPriority,
        visit_type: 'CLASSROOM_REFERRAL',
        nurse_name: 'Duty Matron / School Nurse',
        notes: `Referred directly from classroom by ${dashboardData?.teacher?.name || 'Class Teacher'}`,
      };
      await api.post('/v1/campus/clinic', payload).catch(async () => {
        return await api.post('/campus/clinic', payload);
      });
      setIsClinicModalOpen(false);
      setClinicStudentName('');
      setClinicSymptoms('');
      fetchTeacherData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to refer student to clinic');
    } finally {
      setSubmittingClinic(false);
    }
  };

  // Submit Facility Booking
  const handleCreateFacilityBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityTitle.trim()) return;
    setSubmittingFacility(true);
    try {
      const payload = {
        action: 'book_facility',
        facility_name: facilityName,
        event_title: facilityTitle,
        booked_by: dashboardData?.teacher?.name || 'Faculty Member',
        department: dashboardData?.teacher?.subject || 'Science & STEM',
        start_date: facilityDate,
        start_time: facilityStartTime,
        end_date: facilityDate,
        end_time: facilityEndTime,
        attendees_estimate: Number(facilityAttendees) || 35,
        notes: 'Curriculum laboratory practical session',
      };
      await api.post('/v1/campus/facilities', payload).catch(async () => {
        return await api.post('/campus/facilities', payload);
      });
      setIsFacilityModalOpen(false);
      setFacilityTitle('');
      fetchTeacherData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to reserve facility');
    } finally {
      setSubmittingFacility(false);
    }
  };

  const teacher = dashboardData?.teacher || {
    name: 'Mr. Ifeanyi Felix',
    role: 'Senior STEM Faculty & Form Tutor',
    subject: 'Physics & Advanced STEM',
    campus_name: 'ExamsPRO Academy · Main Campus',
  };

  const telemetry = dashboardData?.telemetry || {
    assigned_arms_count: 3,
    total_pupils_taught: 107,
    today_teaching_periods: 4,
    today_attendance_rate: 94.6,
  };

  const subtabs: { id: TeacherCampusSubtab; label: string; icon: any; badge?: string }[] = [
    { id: 'rollcall', label: 'Class Register', icon: FingerPrintIcon, badge: 'Roll Call' },
    { id: 'timetable', label: 'Bell Schedule', icon: CalendarDaysIcon, badge: `${telemetry.today_teaching_periods} Periods` },
    { id: 'homework', label: 'Homework & CA', icon: DocumentTextIcon, badge: `${dashboardData?.homework?.length || 0} Sets` },
    { id: 'discipline', label: 'Merits & Demerits', icon: ScaleIcon, badge: 'Pastoral' },
    { id: 'clinic', label: 'Sick Bay Passes', icon: HeartIcon, badge: `${dashboardData?.clinic_admitted?.length || 0} Admitted` },
    { id: 'facilities', label: 'Lab & Venues', icon: BuildingOfficeIcon, badge: 'Bookings' },
    { id: 'hostel', label: 'Boarder Exeats', icon: BuildingOffice2Icon, badge: 'Hostel' },
    { id: 'library', label: 'Curriculum Library', icon: BookOpenIcon, badge: 'Books' },
    { id: 'messaging', label: 'Campus Circulars', icon: MegaphoneIcon, badge: 'Notices' },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Top Header */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <AcademicCapIcon className="w-3.5 h-3.5" /> Faculty Workspace
            </span>
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {teacher.role} · {teacher.subject}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Academic operations, classroom roll call register, and student welfare command for {teacher.name}.
          </p>
        </div>

        {/* Multi-Campus Switcher & Refresh */}
        <div className="flex items-center gap-3">
          {campuses.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs shadow-xs">
              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCampusId}
                onChange={(e) => setSelectedCampusId(e.target.value)}
                className="bg-transparent border-none text-gray-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Campus Sites</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              fetchTeacherData();
              if (activeTab === 'rollcall') fetchRollCallRoster();
            }}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-xs cursor-pointer"
            title="Refresh Operations Data"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
        </div>
      </MotionRise>

      {/* KPI Telemetry Banner */}
      <MotionRise delay={0.05} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Assigned Arms</span>
            <UserGroupIcon className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{telemetry.assigned_arms_count}</p>
          <p className="text-[11px] text-gray-400">Classrooms managed</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Learners Taught</span>
            <AcademicCapIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{telemetry.total_pupils_taught}</p>
          <p className="text-[11px] text-gray-400">Enrolled student register</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today's Periods</span>
            <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{telemetry.today_teaching_periods}</p>
          <p className="text-[11px] text-gray-400">Scheduled bell lessons</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today's Attendance</span>
            <FingerPrintIcon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{Number(telemetry.today_attendance_rate).toFixed(1)}%</p>
          <p className="text-[11px] text-gray-400">Learners present &amp; verified</p>
        </div>
      </MotionRise>

      {/* Subtab Navigation Pills */}
      <MotionRise delay={0.1} className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
        {subtabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#146ef5] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </MotionRise>

      {/* Tab 1: Class Register (Roll Call) */}
      {activeTab === 'rollcall' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Classroom Roll Call Attendance Register</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record daily morning roll call or period attendance for your assigned class arm.
                </p>
              </div>

              {/* Arm Selector & Date Picker */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500">Class Arm:</label>
                  <select
                    value={selectedArmId}
                    onChange={(e) => setSelectedArmId(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  >
                    {dashboardData?.classes?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.class_name} · {c.arm_name} ({c.enrolled_count} pupils)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500">Date:</label>
                  <input
                    type="date"
                    value={rollCallDate}
                    onChange={(e) => setRollCallDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center justify-between pt-3 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-semibold">Bulk Set:</span>
                <button
                  type="button"
                  onClick={() => setBulkStatus('PRESENT')}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg transition"
                >
                  ✓ All Present
                </button>
                <button
                  type="button"
                  onClick={() => setBulkStatus('ABSENT')}
                  className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg transition"
                >
                  ✕ All Absent
                </button>
              </div>

              <div className="flex items-center gap-3">
                {rollCallSuccessMsg && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> {rollCallSuccessMsg}
                  </span>
                )}
                <button
                  onClick={submitRollCallRegister}
                  disabled={savingRollCall || rollCallStudents.length === 0}
                  className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingRollCall ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <ClipboardDocumentCheckIcon className="w-4 h-4" />
                  )}
                  {savingRollCall ? 'Saving...' : 'Save & Submit Register'}
                </button>
              </div>
            </div>

            {/* Students Table */}
            {loadingRoster ? (
              <div className="p-12 text-center text-xs text-gray-400">Loading student roster...</div>
            ) : rollCallStudents.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">
                No enrolled students found in this class arm.
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Admission No.</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">Attendance Status</th>
                      <th className="py-3 px-4">Notes / Pastoral Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {rollCallStudents.map((st, idx) => (
                      <tr key={st.student_id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4 text-gray-400 font-semibold">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{st.student_name}</td>
                        <td className="py-3 px-4 font-mono text-gray-500">{st.admission_number}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.gender === 'FEMALE' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {st.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-[11px]">
                            {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => handleStudentStatusChange(st.student_id, mode)}
                                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                                  st.status === mode
                                    ? mode === 'PRESENT'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : mode === 'LATE'
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : mode === 'ABSENT'
                                      ? 'bg-red-600 text-white shadow-xs'
                                      : 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="e.g. Excused, at sick bay..."
                            value={st.notes || ''}
                            onChange={(e) => handleStudentNotesChange(st.student_id, e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#146ef5] text-xs py-1 focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </MotionRise>
      )}

      {/* Tab 2: Timetable & Bell Schedule */}
      {activeTab === 'timetable' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Weekly Teaching Bell Schedule</h3>
              <p className="text-xs text-gray-500 mt-0.5">Assigned subject periods, class arms, and lab/room locations.</p>
            </div>
            <span className="text-xs font-bold text-[#146ef5] px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
              Term Pacing: Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Class Arm</th>
                  <th className="py-3 px-4">Venue / Lab</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(dashboardData?.today_schedule || []).map((slot: any, idx: number) => (
                  <tr key={slot.id || idx} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4 font-bold text-gray-900">Period {slot.period_index || idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{slot.day_of_week}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{slot.start_time} - {slot.end_time}</td>
                    <td className="py-3 px-4 font-bold text-[#146ef5]">{slot.subject_name}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{slot.class_name}</td>
                    <td className="py-3 px-4 text-gray-500">{slot.room_name || 'Class Block'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {slot.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionRise>
      )}

      {/* Tab 3: Homework & Continuous Assessments */}
      {activeTab === 'homework' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Continuous Assessment &amp; Homework Problem Sets</h3>
              <p className="text-xs text-gray-500 mt-0.5">Publish assignments, set deadlines, and track submission completion rates.</p>
            </div>
            <button
              onClick={() => setIsHomeworkModalOpen(true)}
              className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Assign Homework
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Target Class</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Max Score</th>
                  <th className="py-3 px-4">Turn-in Rate</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(dashboardData?.homework || []).map((hw: any) => (
                  <tr key={hw.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4 font-bold text-gray-900">{hw.title}</td>
                    <td className="py-3 px-4">{hw.subject_name}</td>
                    <td className="py-3 px-4">{hw.class_name}</td>
                    <td className="py-3 px-4 font-medium text-gray-600">{hw.due_date}</td>
                    <td className="py-3 px-4 font-semibold">{hw.max_score} pts</td>
                    <td className="py-3 px-4 font-bold text-[#146ef5]">
                      {hw.submissions_count || 0}/{hw.total_students || 35}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {hw.status || 'PUBLISHED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionRise>
      )}

      {/* Tab 4: Student Discipline & Merits */}
      {activeTab === 'discipline' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Pastoral Care, Demerits &amp; Commendation Merits</h3>
                <p className="text-xs text-gray-500 mt-0.5">Report disciplinary infractions or award character excellence commendations.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDisciplineMode('infraction');
                    setIsDisciplineModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                  Report Infraction
                </button>
                <button
                  onClick={() => {
                    setDisciplineMode('merit');
                    setIsDisciplineModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Award Merit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Severity / Points</th>
                    <th className="py-3 px-4">Narrative Description</th>
                    <th className="py-3 px-4">Reported By</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {(dashboardData?.discipline || []).map((d: any) => (
                    <tr key={d.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">{d.student_name}</td>
                      <td className="py-3 px-4">{d.class_name}</td>
                      <td className="py-3 px-4">{d.category}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          {d.severity} (-{d.points_impact} pts)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{d.description}</td>
                      <td className="py-3 px-4 text-gray-500">{d.reported_by}</td>
                      <td className="py-3 px-4 text-gray-400">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Tab 5: Clinic / Sick Bay Referrals */}
      {activeTab === 'clinic' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Clinic &amp; Infirmary Admitted Learners</h3>
              <p className="text-xs text-gray-500 mt-0.5">Students currently admitted or treated at the campus clinic bay.</p>
            </div>
            <button
              onClick={() => setIsClinicModalOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <HeartIcon className="w-3.5 h-3.5" />
              Send Pupil to Sick Bay
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Reported Symptoms</th>
                  <th className="py-3 px-4">Diagnosis / Treatment</th>
                  <th className="py-3 px-4">Bed Ward</th>
                  <th className="py-3 px-4">Triage Priority</th>
                  <th className="py-3 px-4">Nurse on Duty</th>
                  <th className="py-3 px-4">Time Admitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(dashboardData?.clinic_admitted || []).map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4 font-bold text-gray-900">{v.student_name}</td>
                    <td className="py-3 px-4">{v.class_name}</td>
                    <td className="py-3 px-4 text-red-700 font-semibold">{v.symptoms}</td>
                    <td className="py-3 px-4 text-gray-600">{v.diagnosis}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{v.bed || 'Bed 01'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.triage_priority === 'EMERGENCY' ? 'bg-red-100 text-red-800' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {v.triage_priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{v.nurse_name}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">{v.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionRise>
      )}

      {/* Tab 6: Facility & Lab Bookings */}
      {activeTab === 'facilities' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Science Labs, CBT Halls &amp; Venue Reservations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Book specialized campus infrastructure for practical classes and examinations.</p>
            </div>
            <button
              onClick={() => setIsFacilityModalOpen(true)}
              className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Reserve Lab / Venue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Facility Name</th>
                  <th className="py-3 px-4">Event / Session Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Reservation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(dashboardData?.facility_bookings || []).map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4 font-bold text-gray-900">{b.facility_name}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{b.event_title}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{b.start_date}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{b.start_time} - {b.end_time}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionRise>
      )}

      {/* Tab 7: Boarder Hostel & Exeat Passes */}
      {activeTab === 'hostel' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Boarding Student Exeat Passes</h3>
              <p className="text-xs text-gray-500 mt-0.5">Verify authorized weekend exeat slips and departures for students in your arm.</p>
            </div>
            <Link
              href="/admin/campus-os/hostel"
              className="text-xs font-semibold text-[#146ef5] hover:underline"
            >
              Open Full Hostel Registry &rarr;
            </Link>
          </div>

          <div className="p-8 text-center text-xs text-gray-500 space-y-2">
            <BuildingOffice2Icon className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="font-bold text-gray-800 text-sm">Boarding Hall &amp; Exeat Verification</p>
            <p className="max-w-md mx-auto text-gray-500">
              Boarding exeat approvals are synchronized with the hostel master terminal. Check security check-in codes directly from your form tutor desk.
            </p>
          </div>
        </MotionRise>
      )}

      {/* Tab 8: Library Curriculum References */}
      {activeTab === 'library' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Curricular Reference Textbooks &amp; Research Catalog</h3>
              <p className="text-xs text-gray-500 mt-0.5">Recommended syllabus textbooks, reserve class book sets, and shelf numbers.</p>
            </div>
            <Link
              href="/admin/campus-os/library"
              className="text-xs font-semibold text-[#146ef5] hover:underline"
            >
              Search Library Catalog &rarr;
            </Link>
          </div>

          <div className="p-8 text-center text-xs text-gray-500 space-y-2">
            <BookOpenIcon className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="font-bold text-gray-800 text-sm">Library Book Catalog &amp; Pacing References</p>
            <p className="max-w-md mx-auto text-gray-500">
              Access the digital catalog to reserve subject textbooks for laboratory research and classroom reading blocks.
            </p>
          </div>
        </MotionRise>
      )}

      {/* Tab 9: Campus Circulars & Messaging */}
      {activeTab === 'messaging' && (
        <MotionRise delay={0.15} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Campus Circulars &amp; Official Faculty Bulletins</h3>
              <p className="text-xs text-gray-500 mt-0.5">Staff circulars, executive advisories, and administrative notices.</p>
            </div>
            <Link
              href="/admin/campus-os/messaging"
              className="text-xs font-semibold text-[#146ef5] hover:underline"
            >
              Open Messaging Hub &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {(dashboardData?.messages || []).map((msg: any) => (
              <div key={msg.id} className="py-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{msg.subject}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#146ef5]">
                      {msg.channel}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">{msg.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>Issued by: <strong className="text-gray-700">{msg.sender_name}</strong></span>
                  <span>·</span>
                  <span className="text-amber-700 font-semibold">{msg.priority} Priority</span>
                </div>
              </div>
            ))}
          </div>
        </MotionRise>
      )}

      {/* MODAL: Assign Homework */}
      {isHomeworkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Assign New Homework / Continuous Assessment</h3>
              <button onClick={() => setIsHomeworkModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Newton's Laws & Momentum Problem Set 1"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    placeholder="Physics"
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Target Class</label>
                  <input
                    type="text"
                    placeholder="SSS 3 Science B"
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Maximum Points</label>
                  <input
                    type="number"
                    value={hwMaxScore}
                    onChange={(e) => setHwMaxScore(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide instructions, problem numbers, or reference book pages..."
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsHomeworkModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingHw}
                  className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-bold rounded-xl shadow-xs"
                >
                  {submittingHw ? 'Publishing...' : 'Publish to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Record Infraction / Merit */}
      {isDisciplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {disciplineMode === 'infraction' ? 'Log Student Demerit / Infraction' : 'Award Student Commendation Merit'}
              </h3>
              <button onClick={() => setIsDisciplineModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscipline} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mustapha Bello"
                  value={discStudentName}
                  onChange={(e) => setDiscStudentName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Class Name</label>
                  <input
                    type="text"
                    placeholder="SSS 3 Science B"
                    value={discClassName}
                    onChange={(e) => setDiscClassName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Category</label>
                  <input
                    type="text"
                    value={discCategory}
                    onChange={(e) => setDiscCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              {disciplineMode === 'infraction' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700">Severity</label>
                    <select
                      value={discSeverity}
                      onChange={(e) => setDiscSeverity(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                    >
                      <option value="MINOR">Minor (-5 pts)</option>
                      <option value="MODERATE">Moderate (-10 pts)</option>
                      <option value="SEVERE">Severe (-20 pts)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Demerit Points</label>
                    <input
                      type="number"
                      value={discPoints}
                      onChange={(e) => setDiscPoints(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700">Award Title</label>
                    <input
                      type="text"
                      value={discAwardName}
                      onChange={(e) => setDiscAwardName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Merit Points</label>
                    <input
                      type="number"
                      value={discPoints}
                      onChange={(e) => setDiscPoints(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-gray-700">Reason / Incident Narrative *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context or explanation for pastoral tracking..."
                  value={discDescription}
                  onChange={(e) => setDiscDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDisciplineModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDiscipline}
                  className={`px-4 py-2 font-bold rounded-xl text-white shadow-xs ${
                    disciplineMode === 'infraction' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {submittingDiscipline ? 'Saving...' : 'Submit to Pastoral Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Clinic Referral */}
      {isClinicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Send Pupil to Sick Bay / Clinic</h3>
              <button onClick={() => setIsClinicModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClinicReferral} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chioma Chukwuma"
                  value={clinicStudentName}
                  onChange={(e) => setClinicStudentName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Class Name</label>
                  <input
                    type="text"
                    placeholder="SSS 3 Science B"
                    value={clinicClassName}
                    onChange={(e) => setClinicClassName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Triage Urgency</label>
                  <select
                    value={clinicPriority}
                    onChange={(e) => setClinicPriority(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  >
                    <option value="LOW">Low (Mild headache, fatigue)</option>
                    <option value="MEDIUM">Medium (Fever, abdominal pain)</option>
                    <option value="EMERGENCY">Emergency (Acute distress, injury)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Observed Symptoms / Reason for Referral *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Pupil complained of sudden high fever and chills during double physics lesson..."
                  value={clinicSymptoms}
                  onChange={(e) => setClinicSymptoms(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsClinicModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClinic}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {submittingClinic ? 'Dispatching...' : 'Dispatch to Sick Bay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Facility Reservation */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Book Campus Laboratory or Facility</h3>
              <button onClick={() => setIsFacilityModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacilityBooking} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Facility / Laboratory *</label>
                <select
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                >
                  <option value="Physics Laboratory Block A">Physics Laboratory Block A</option>
                  <option value="Chemistry & Wet Science Lab">Chemistry &amp; Wet Science Lab</option>
                  <option value="Computer & ICT CBT Testing Hall">Computer &amp; ICT CBT Testing Hall</option>
                  <option value="School Main Auditorium">School Main Auditorium</option>
                  <option value="Sports Arena & Football Pitch">Sports Arena &amp; Football Pitch</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Practical Session / Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSS 3 Optics & Refraction Practical Experiment"
                  value={facilityTitle}
                  onChange={(e) => setFacilityTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Date</label>
                  <input
                    type="date"
                    value={facilityDate}
                    onChange={(e) => setFacilityDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={facilityStartTime}
                    onChange={(e) => setFacilityStartTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">End Time</label>
                  <input
                    type="text"
                    placeholder="10:30 AM"
                    value={facilityEndTime}
                    onChange={(e) => setFacilityEndTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Estimated Learners / Attendees</label>
                <input
                  type="number"
                  value={facilityAttendees}
                  onChange={(e) => setFacilityAttendees(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFacility}
                  className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-bold rounded-xl shadow-xs"
                >
                  {submittingFacility ? 'Reserving...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherCampusOSPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">
          Loading CampusPRO Teacher Workspace...
        </div>
      }
    >
      <TeacherCampusOSContent />
    </Suspense>
  );
}
