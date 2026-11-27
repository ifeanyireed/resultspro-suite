'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarDaysIcon,
  FingerPrintIcon,
  BookOpenIcon,
  TruckIcon,
  MegaphoneIcon,
  HomeModernIcon,
  HeartIcon,
  CreditCardIcon,
  TrophyIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  IdentificationIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  UserIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type CampusSubtab =
  | 'timetable'
  | 'attendance'
  | 'cafeteria'
  | 'cocurricular'
  | 'discipline'
  | 'financials'
  | 'transport'
  | 'library'
  | 'hostel'
  | 'clinic'
  | 'leadership'
  | 'idcard'
  | 'notices';

export default function StudentCampusOSPage() {
  const [activeTab, setActiveTab] = useState<CampusSubtab>('timetable');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [bookSearch, setBookSearch] = useState<string>('');

  // Modals state
  const [showExeatModal, setShowExeatModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Exeat Form
  const [exeatForm, setExeatForm] = useState({
    exeat_type: 'WEEKEND',
    reason: '',
    departure_date: '',
    expected_return_date: '',
    parent_name: '',
    parent_phone: '',
  });

  // Facility Form
  const [facilityForm, setFacilityForm] = useState({
    facility_name: '',
    location: '',
    description: '',
    urgency: 'NORMAL',
  });

  // Clinic Form
  const [clinicForm, setClinicForm] = useState({
    symptoms: '',
    urgency: 'NORMAL',
  });

  const fetchCampusData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/campus/student/dashboard');
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load campus operations data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampusData();
  }, [fetchCampusData]);

  // Handlers for student self-service forms
  const handleApplyExeat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/v1/campus/student/exeat', {
        ...exeatForm,
        student_id: dashboardData?.student?.id,
        student_name: dashboardData?.student?.name,
        class_name: dashboardData?.student?.class_name,
        hostel_name: dashboardData?.campus_operations?.hostel?.hostel_name,
        room_number: dashboardData?.campus_operations?.hostel?.room_number,
      });
      setActionSuccess('Exeat pass application submitted to Housemaster!');
      setShowExeatModal(false);
      setExeatForm({
        exeat_type: 'WEEKEND',
        reason: '',
        departure_date: '',
        expected_return_date: '',
        parent_name: '',
        parent_phone: '',
      });
      fetchCampusData();
    } catch (err: any) {
      console.error('Failed to submit exeat:', err);
      alert('Error submitting exeat: ' + (err?.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/v1/campus/student/facility-report', {
        ...facilityForm,
        reported_by: dashboardData?.student?.name,
      });
      setActionSuccess('Campus maintenance ticket logged for facilities team!');
      setShowFacilityModal(false);
      setFacilityForm({
        facility_name: '',
        location: '',
        description: '',
        urgency: 'NORMAL',
      });
    } catch (err: any) {
      console.error('Failed to report facility issue:', err);
      alert('Error reporting facility issue: ' + (err?.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClinicAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/v1/campus/student/clinic-appointment', {
        ...clinicForm,
        student_id: dashboardData?.student?.id,
        student_name: dashboardData?.student?.name,
        class_name: dashboardData?.student?.class_name,
      });
      setActionSuccess('Sick-bay consultation scheduled with duty nurse!');
      setShowClinicModal(false);
      setClinicForm({ symptoms: '', urgency: 'NORMAL' });
      fetchCampusData();
    } catch (err: any) {
      console.error('Failed to schedule clinic consultation:', err);
      alert('Error scheduling consultation: ' + (err?.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReserveBook = async (book: any) => {
    try {
      await api.post('/v1/campus/student/library-reserve', {
        book_id: book.id,
        book_title: book.title,
        student_name: dashboardData?.student?.name,
        class_name: dashboardData?.student?.class_name,
      });
      setActionSuccess(`Reserved "${book.title}". Collect within 48 hours from library desk.`);
      fetchCampusData();
    } catch (err: any) {
      console.error('Failed to reserve book:', err);
      alert('Error reserving book: ' + (err?.response?.data?.error || err.message));
    }
  };

  const student = dashboardData?.student || {
    name: 'Kelechi Stephanie Okonkwo',
    first_name: 'Kelechi',
    admission_number: 'SCH/2026/0412',
    class_name: 'Senior Secondary 3',
    arm_name: 'Science Diamond',
    campus_name: 'Main Campus · Lekki Phase 1',
    house_name: 'Sapphire House (Blue)',
    role_title: 'Class Captain & STEM Ambassador',
    barcode_token: 'SCH-0412',
  };

  const metrics = dashboardData?.metrics || {};
  const campusOps = dashboardData?.campus_operations || {};
  const schedule = dashboardData?.schedule || [];
  const attendanceHistory = dashboardData?.attendance?.history || [];

  const subtabs: { id: CampusSubtab; label: string; icon: any; badge?: string }[] = [
    { id: 'timetable', label: 'Bell Schedule', icon: CalendarDaysIcon, badge: `${schedule.length || 6} Periods` },
    { id: 'attendance', label: 'Biometrics', icon: FingerPrintIcon, badge: campusOps?.attendance_today?.status || 'Present' },
    { id: 'cafeteria', label: 'Meal Wallet', icon: CreditCardIcon, badge: `₦${(campusOps?.cafeteria?.wallet?.balance ?? 0).toLocaleString()}` },
    { id: 'cocurricular', label: 'Clubs & Sports', icon: TrophyIcon, badge: student.house_name?.split(' (')[0] || 'House' },
    { id: 'discipline', label: 'Merits & Conduct', icon: ShieldCheckIcon, badge: `${metrics?.merits_total ?? campusOps?.discipline?.merits_points ?? 0} Pts` },
    { id: 'financials', label: 'Fees & Bursary', icon: BanknotesIcon, badge: campusOps?.financials?.status === 'PAID' ? '100% Cleared' : campusOps?.financials?.status || 'Bursary' },
    { id: 'transport', label: 'Bus Fleet', icon: TruckIcon, badge: campusOps?.transport?.route_name?.split(' ·')[0] || 'Fleet' },
    { id: 'library', label: 'Library & Catalog', icon: BookOpenIcon, badge: `${campusOps?.library?.borrowed_count ?? 0} Loans` },
    { id: 'hostel', label: 'Boarding & Exeats', icon: HomeModernIcon, badge: campusOps?.hostel?.exeat_status || 'On Campus' },
    { id: 'clinic', label: 'Health Bay', icon: HeartIcon, badge: campusOps?.clinic?.blood_group || 'O+' },
    { id: 'leadership', label: 'Prefects & Council', icon: UserGroupIcon },
    { id: 'idcard', label: 'Digital ID Card', icon: IdentificationIcon },
    { id: 'notices', label: 'Circulars', icon: MegaphoneIcon, badge: `${campusOps?.notices?.length ?? 0} Memos` },
  ];

  const filteredCatalog = (campusOps?.library?.catalog || []).filter((b: any) =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.category.toLowerCase().includes(bookSearch.toLowerCase())
  );

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Top Header & Student Operations Status */}
      <MotionRise className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO Operations</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <SparklesIcon className="w-3.5 h-3.5" /> Student Desk
            </span>
            <span className="inline-flex px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
              {student.house_name}
            </span>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {student.class_name} ({student.arm_name})
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Active institutional operational portal for <strong>{student.name}</strong> · ID: {student.admission_number} · {student.campus_name}
          </p>
        </div>

        {/* Quick Student Self-Service Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowExeatModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Apply Exeat
          </button>
          <button
            onClick={() => setShowFacilityModal(true)}
            className="px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-[#146ef5] hover:border-blue-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <WrenchScrewdriverIcon className="w-3.5 h-3.5 text-gray-500" /> Report Issue
          </button>
          <button
            onClick={() => setShowClinicModal(true)}
            className="px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <HeartIcon className="w-3.5 h-3.5 text-rose-500" /> Sick Bay
          </button>
          <button
            onClick={fetchCampusData}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#146ef5] transition-colors shadow-xs"
            title="Refresh Campus Telemetry"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
          <Link
            href="/student/dashboard"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            ← Overview
          </Link>
        </div>
      </MotionRise>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Horizontal Subtabs Navigation */}
      <div className="sticky top-20 z-20 w-full min-w-0 max-w-full">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
          {subtabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Screen */}
      {loading && !dashboardData ? (
        <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
          <ArrowPathIcon className="w-8 h-8 animate-spin mx-auto text-[#146ef5] mb-3" />
          <span className="text-sm font-medium">Connecting to CampusPRO Engine...</span>
        </div>
      ) : (
        <MotionRise className="space-y-6">
          {/* 1. BELL SCHEDULE & TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Daily Bell Schedule & Periods</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Standardized Nigerian Curriculum timetable for {student.arm_name} · Term 1
                    </p>
                  </div>
                  {/* Day of Week Selector */}
                  <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-full">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          selectedDay === day ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-gray-100 mt-4">
                  {schedule.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 rounded-2xl px-3 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            item.status === 'ACTIVE'
                              ? 'bg-[#146ef5] text-white shadow-md shadow-[#146ef5]/20'
                              : item.status === 'COMPLETED'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-blue-50 text-[#146ef5]'
                          }`}
                        >
                          P{item.period_index || i + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-base">{item.subject}</h4>
                            {item.status === 'ACTIVE' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                Live Period
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                              {item.teacher_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                              {item.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs font-semibold text-gray-700">
                          <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. BIOMETRIC ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today&apos;s Gate Log</div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {campusOps?.attendance_today?.status || 'PRESENT'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Clocked in at <strong>{campusOps?.attendance_today?.time_in || '07:18 AM'}</strong>
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Rate</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics?.attendance_rate?.toFixed(1) || '97.4'}%
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mt-2">
                    {metrics?.punctual_streak || 18}-day consecutive on-time streak
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Terminal Gate</div>
                  <div className="text-lg font-bold text-gray-900 mt-2 truncate">
                    {campusOps?.attendance_today?.terminal_name || 'Main Gate Turnstile A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">ZK-IN05 Optical Fingerprint Scanner</p>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Past 7 Days Biometric Gate Audit</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Time-In</th>
                        <th className="py-3 px-4">Time-Out</th>
                        <th className="py-3 px-4">Gate Terminal</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {attendanceHistory.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-semibold text-gray-900">{log.date}</td>
                          <td className="py-3 px-4">{log.time_in}</td>
                          <td className="py-3 px-4">{log.time_out || '03:45 PM'}</td>
                          <td className="py-3 px-4 text-gray-500">{log.terminal_name}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CAFETERIA & CASHLESS MEAL WALLET */}
          {activeTab === 'cafeteria' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Wallet Balance Hero Card */}
                <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-wider text-blue-100 font-bold">Meal Wallet Balance</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold">
                      {campusOps?.cafeteria?.wallet?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="my-4">
                    <div className="text-4xl font-extrabold tracking-tight">
                      ₦{(campusOps?.cafeteria?.wallet?.balance || 18500).toLocaleString()}
                    </div>
                    <p className="text-xs text-blue-100 mt-1">
                      RFID Card: {campusOps?.cafeteria?.wallet?.card_rfid || 'RFID-SCH-0412'}
                    </p>
                  </div>
                  <div className="text-[11px] text-blue-200">
                    Daily Limit: ₦{(campusOps?.cafeteria?.wallet?.daily_limit || 3500).toLocaleString()}
                  </div>
                </div>

                {/* Dietary Profile */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dietary Preferences</span>
                    <h4 className="text-lg font-bold text-gray-900 mt-2">Allergy & Nutrition Plan</h4>
                    <p className="text-xs text-gray-600 mt-2">
                      Allergens: <span className="font-semibold text-rose-600">Peanuts, Shellfish</span>
                    </p>
                  </div>
                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-[10px] font-bold">
                    Biometric Meal-Swipe Approved
                  </span>
                </div>

                {/* Tuck Shop POS Quick Stat */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dining Hall Roster</span>
                    <h4 className="text-lg font-bold text-gray-900 mt-2">Full Boarding Plan</h4>
                    <p className="text-xs text-gray-500 mt-1">Breakfast (07:00 AM) · Lunch (01:00 PM) · Dinner (06:30 PM)</p>
                  </div>
                  <div className="text-xs text-emerald-600 font-bold">Termly Dining Fees Fully Settled</div>
                </div>
              </div>

              {/* Today's 3-Course Menu & Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                    Today&apos;s Dining Hall Menu
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                      <span className="text-[10px] font-bold uppercase text-amber-800">Breakfast (07:00 AM)</span>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {campusOps?.cafeteria?.today_menu?.breakfast}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <span className="text-[10px] font-bold uppercase text-blue-800">Lunch (01:00 PM)</span>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {campusOps?.cafeteria?.today_menu?.lunch}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                      <span className="text-[10px] font-bold uppercase text-purple-800">Dinner (06:30 PM)</span>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {campusOps?.cafeteria?.today_menu?.dinner}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                    Recent Meal Swipes &amp; Tuck Shop Purchases
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {(campusOps?.cafeteria?.transactions || []).map((tx: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{tx.description}</p>
                          <span className="text-[10px] text-gray-400">
                            {tx.date} · {tx.time} · {tx.cashier_name}
                          </span>
                        </div>
                        <span className="font-bold text-rose-600 text-xs">-₦{tx.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. CO-CURRICULAR, CLUBS & SPORTS */}
          {activeTab === 'cocurricular' && (
            <div className="space-y-6">
              {/* House Standings & Affiliation */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#146ef5] uppercase tracking-wider">Inter-House Championship</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {campusOps?.cocurricular?.house?.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Housemaster: {campusOps?.cocurricular?.house?.house_master} · Rank: {campusOps?.cocurricular?.house?.rank}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Total House Points</span>
                    <div className="text-3xl font-extrabold text-[#146ef5]">
                      {campusOps?.cocurricular?.house?.total_points}
                    </div>
                    <span className="text-[10px] text-blue-700 font-semibold">Your Contribution: +45 Pts</span>
                  </div>
                </div>

                {/* Enrolled Clubs Matrix */}
                <h4 className="text-base font-bold text-gray-900 mt-6 mb-4">Your Enrolled Clubs &amp; Societies</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(campusOps?.cocurricular?.clubs || []).map((club: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#146ef5] text-[10px] font-bold uppercase">
                        {club.category}
                      </span>
                      <h5 className="font-bold text-gray-900 text-sm">{club.club_name}</h5>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>Patron: {club.patron_teacher}</p>
                        <p>Meets: {club.meeting_day}s · {club.meeting_time}</p>
                        <p>Venue: {club.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Sports Fixtures */}
                <h4 className="text-base font-bold text-gray-900 mt-8 mb-4">Upcoming Inter-House &amp; Sports Fixtures</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(campusOps?.cocurricular?.fixtures || []).map((fix: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900 text-xs">{fix.match}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{fix.venue}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {fix.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. DISCIPLINE & MERITS */}
          {activeTab === 'discipline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conduct Rating</span>
                  <div className="text-xl font-bold text-emerald-600 mt-2">
                    {campusOps?.discipline?.conduct_rating}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Certified for leadership appointment</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Merits Earned</span>
                  <div className="text-3xl font-extrabold text-[#146ef5] mt-2">
                    +{campusOps?.discipline?.merits_points} Pts
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Academic, Leadership &amp; Citizenship</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infractions Status</span>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckBadgeIcon className="w-6 h-6 text-emerald-600" />
                    <span className="text-base font-bold text-gray-900">Zero Demerits</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2 font-semibold">Verified Clean Behavioral Slate</p>
                </div>
              </div>

              {/* Merits & Commendations Log */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Official Merits &amp; Commendation Awards
                </h3>
                <div className="divide-y divide-gray-100">
                  {(campusOps?.discipline?.merits || []).map((m: any, idx: number) => (
                    <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5] text-[10px] font-bold">
                            {m.category}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm">{m.award_name}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{m.reason}</p>
                        <span className="text-[10px] text-gray-400">Awarded by: {m.awarded_by}</span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="font-extrabold text-emerald-600 text-sm">+{m.points} Pts</span>
                        <span className="text-xs text-gray-400">{m.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. FEES & BURSARY CLEARANCE */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {campusOps?.financials?.status || 'PAID IN FULL'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {campusOps?.financials?.term} Fees
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Invoice: {campusOps?.financials?.invoice_no} · Payment Method: {campusOps?.financials?.payment_method}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Exam Clearance Status</span>
                    <div className="text-base font-extrabold text-emerald-700 mt-0.5">CLEARED FOR EXAMS</div>
                    <span className="text-[10px] text-emerald-600 font-mono">Code: {campusOps?.financials?.clearance_code}</span>
                  </div>
                </div>

                {/* Ledger Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500">Total Billed</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      ₦{campusOps?.financials?.total_billed?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500">Amount Paid</span>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                      ₦{campusOps?.financials?.amount_paid?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500">Balance Due</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      ₦{campusOps?.financials?.balance_due?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <h4 className="text-base font-bold text-gray-900 mt-8 mb-3">Itemized Term Fee Schedule</h4>
                <div className="divide-y divide-gray-100">
                  {(campusOps?.financials?.breakdown || []).map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800">{item.item}</span>
                      <span className="font-bold text-gray-900">₦{item.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. TRANSPORT FLEET */}
          {activeTab === 'transport' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">School Bus Transport Corridor</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Daily home-to-campus transit roster and fleet details</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {campusOps?.transport?.gps_status || 'En Route'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Route Details</div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="font-bold text-gray-900 text-base">{campusOps?.transport?.route_name}</div>
                    <div className="text-xs text-gray-600">
                      Vehicle: <strong>{campusOps?.transport?.bus_number}</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Morning Pickup Stop: <strong>{campusOps?.transport?.pickup_stop}</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Morning Departure: <strong>{campusOps?.transport?.morning_time}</strong> · Afternoon: <strong>{campusOps?.transport?.afternoon_time}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Driver & Attendant</div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="font-bold text-gray-900 text-base">{campusOps?.transport?.driver_name}</div>
                    <div className="text-xs text-gray-600">
                      Attendant: <strong>{campusOps?.transport?.attendant_name}</strong>
                    </div>
                    {campusOps?.transport?.driver_phone && (
                      <a
                        href={`tel:${campusOps?.transport?.driver_phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#146ef5] font-semibold pt-1 hover:underline"
                      >
                        <PhoneIcon className="w-3.5 h-3.5" /> Direct Call: {campusOps?.transport?.driver_phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. LIBRARY & CATALOG */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              {/* Active Loans */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Current Borrowed Books</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Currently issued textbooks &amp; digital reference materials</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] border border-blue-200">
                    Next Due: {campusOps?.library?.next_due_date}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {(campusOps?.library?.books || []).map((b: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex gap-4">
                      <div className="w-12 h-16 rounded-lg bg-blue-100 text-[#146ef5] flex items-center justify-center shrink-0 shadow-xs">
                        <BookOpenIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 text-sm">{b.title}</h4>
                        <p className="text-xs text-gray-500">{b.author}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            {b.status}
                          </span>
                          <span className="text-[11px] text-gray-500">Due: {b.due_date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Library Catalog Browser & Reservation */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Search &amp; Reserve Library Books</h3>
                    <p className="text-xs text-gray-500">Reserve textbooks or literary classics ahead of time</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search title, author, subject..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredCatalog.map((book: any) => (
                    <div key={book.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-gray-900 text-xs">{book.title}</h5>
                        <p className="text-[11px] text-gray-500">By {book.author} · {book.category} · Shelf: {book.shelf_location}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">{book.available_copies} copies available</span>
                      </div>
                      <button
                        onClick={() => handleReserveBook(book)}
                        className="px-4 py-1.5 rounded-full bg-blue-50 hover:bg-[#146ef5] hover:text-white text-[#146ef5] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. BOARDING HALL & EXEAT REGISTRATION */}
          {activeTab === 'hostel' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#146ef5] uppercase tracking-wider">Boarding Directorate</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {campusOps?.hostel?.hostel_name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {campusOps?.hostel?.room_number} · {campusOps?.hostel?.bed_label} · Housemaster: {campusOps?.hostel?.housemaster}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExeatModal(true)}
                    className="px-5 py-2.5 rounded-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <PlusIcon className="w-4 h-4" /> Apply for Exeat Pass
                  </button>
                </div>

                {/* Exeat Passes History */}
                <h4 className="text-base font-bold text-gray-900">Your Exeat Leave History &amp; Passes</h4>
                <div className="divide-y divide-gray-100">
                  {(campusOps?.hostel?.exeats || []).map((ex: any) => (
                    <div key={ex.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5] text-[10px] font-bold uppercase">
                            {ex.exeat_type} EXEAT
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-900">{ex.pass_code}</span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">{ex.reason}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Depart: <strong>{ex.departure_date}</strong> → Return: <strong>{ex.expected_return_date}</strong>
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                        {ex.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 10. CLINIC & HEALTH BAY */}
          {activeTab === 'clinic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Blood Group &amp; Genotype</span>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {campusOps?.clinic?.blood_group} · {campusOps?.clinic?.genotype}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Certified by Clinical Diagnostic Lab</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Academic Fitness</span>
                  <div className="text-base font-bold text-emerald-600 mt-2">
                    {campusOps?.clinic?.status}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last Routine Audit: {campusOps?.clinic?.last_checkup}</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Emergency Infirmary</span>
                  <div className="text-base font-bold text-gray-900 mt-2">
                    {campusOps?.clinic?.emergency_phone}
                  </div>
                  <p className="text-xs text-rose-600 font-semibold mt-2">24/7 Registered Nursing Staff</p>
                </div>
              </div>

              {/* Consultation Logs & Prescriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Recent Clinic Consultations</h3>
                    <button
                      onClick={() => setShowClinicModal(true)}
                      className="text-xs font-bold text-[#146ef5] hover:underline cursor-pointer"
                    >
                      + Request Visit
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {(campusOps?.clinic?.visits || []).map((v: any, idx: number) => (
                      <div key={idx} className="py-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 text-xs">{v.diagnosis}</span>
                          <span className="text-[10px] text-gray-400">{v.date}</span>
                        </div>
                        <p className="text-xs text-gray-600">Symptoms: {v.symptoms}</p>
                        <p className="text-xs text-emerald-600">Treatment: {v.treatment}</p>
                        <span className="text-[10px] text-gray-400">Attended by: {v.nurse_name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                    Active Prescriptions &amp; Allergies
                  </h3>
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-rose-800">
                    <strong>Allergy Alert:</strong> {campusOps?.clinic?.allergies}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {(campusOps?.clinic?.medications || []).map((med: any, idx: number) => (
                      <div key={idx} className="py-3">
                        <div className="font-bold text-gray-900 text-xs">{med.medication}</div>
                        <p className="text-xs text-gray-600 mt-0.5">Dosage: {med.dosage}</p>
                        <span className="text-[10px] text-gray-400">Prescribed by: {med.prescribed_by}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11. LEADERSHIP & PREFECT COUNCIL */}
          {activeTab === 'leadership' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <span className="text-xs font-bold text-[#146ef5] uppercase tracking-wider">Student Leadership Guild</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  Your Office: {student.role_title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Representing student governance, peer mentorship, and academic excellence
                </p>
              </div>

              <h4 className="text-base font-bold text-gray-900">Prefect Council Directory (Contact Channels)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(campusOps?.leadership?.prefect_council || []).map((p: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-[#146ef5] uppercase">{p.office}</span>
                    <h5 className="font-bold text-gray-900 text-sm">{p.name}</h5>
                    <p className="text-xs text-gray-500">{p.class}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. DIGITAL STUDENT ID CARD */}
          {activeTab === 'idcard' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-full max-w-md bg-gradient-to-br from-[#146ef5] via-[#0e50ba] to-[#041a45] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-blue-400/30">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight uppercase">
                      {student.school_name || dashboardData?.school?.name || 'GREENWOOD HIGH ACADEMY'}
                    </h3>
                    <p className="text-[10px] text-blue-200">INSTITUTIONAL IDENTITY CARD</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                    STUDENT
                  </span>
                </div>

                {/* Body */}
                <div className="flex items-center gap-6 my-6">
                  <div className="w-20 h-24 rounded-2xl bg-white/10 border-2 border-white/30 flex items-center justify-center font-bold text-3xl text-white/80 shrink-0">
                    {student.first_name?.[0] || 'S'}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold leading-tight">{student.name}</h4>
                    <p className="text-xs text-blue-200 font-mono">ID: {student.admission_number}</p>
                    <p className="text-xs text-blue-100">{student.class_name} ({student.arm_name})</p>
                    <p className="text-xs text-white font-semibold">{student.house_name}</p>
                  </div>
                </div>

                {/* Footer Barcode */}
                <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-blue-200 uppercase">Valid Academic Session</span>
                    <p className="text-xs font-bold">{student.academic_session} ({student.term})</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl text-gray-900 font-mono text-[10px] font-bold tracking-widest text-center shadow-sm">
                    ||| | |||| | ||||| |||
                    <div className="text-[8px] text-gray-500">{student.barcode_token}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13. CIRCULARS & NOTICES */}
          {activeTab === 'notices' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Official School Circulars &amp; Directives
              </h3>
              <div className="divide-y divide-gray-100">
                {(campusOps?.notices || []).map((n: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5] text-[10px] font-bold uppercase">
                          {n.category}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500">Official circular from the Principal&apos;s Office</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 shrink-0">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </MotionRise>
      )}

      {/* --- MODAL 1: APPLY FOR EXEAT PASS --- */}
      {showExeatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Apply for Digital Exeat Pass</h3>
              <button onClick={() => setShowExeatModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyExeat} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Exeat Type</label>
                <select
                  value={exeatForm.exeat_type}
                  onChange={(e) => setExeatForm({ ...exeatForm, exeat_type: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                >
                  <option value="WEEKEND">Weekend Exeat</option>
                  <option value="MEDICAL">Medical Exeat (Clinic / Specialist)</option>
                  <option value="HOLIDAY">Term Break / Official Holiday</option>
                  <option value="EMERGENCY">Emergency Family Leave</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  value={exeatForm.reason}
                  onChange={(e) => setExeatForm({ ...exeatForm, reason: e.target.value })}
                  placeholder="Detail reasons for requested campus leave..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={exeatForm.departure_date}
                    onChange={(e) => setExeatForm({ ...exeatForm, departure_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    required
                    value={exeatForm.expected_return_date}
                    onChange={(e) => setExeatForm({ ...exeatForm, expected_return_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Authorizing Parent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Chief & Mrs. Adeleke"
                    value={exeatForm.parent_name}
                    onChange={(e) => setExeatForm({ ...exeatForm, parent_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 449 8899"
                    value={exeatForm.parent_phone}
                    onChange={(e) => setExeatForm({ ...exeatForm, parent_phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowExeatModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#146ef5] text-white font-bold hover:bg-[#105bd1] transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: REPORT FACILITY ISSUE --- */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Report Campus Facility Issue</h3>
              <button onClick={() => setShowFacilityModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportFacility} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Affected Facility / Asset</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab 3 Sink / Senior Dorm B Faucet / Class 3A Fan"
                  value={facilityForm.facility_name}
                  onChange={(e) => setFacilityForm({ ...facilityForm, facility_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Specific Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second Floor Wing B, Room 204"
                  value={facilityForm.location}
                  onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description of Issue</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the leak, broken furniture, electrical fault, etc."
                  value={facilityForm.description}
                  onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Urgency Level</label>
                <select
                  value={facilityForm.urgency}
                  onChange={(e) => setFacilityForm({ ...facilityForm, urgency: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                >
                  <option value="NORMAL">Normal Maintenance</option>
                  <option value="URGENT">Urgent (Needs attention today)</option>
                  <option value="EMERGENCY">Emergency (Hazard / Electrical / Flooding)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#146ef5] text-white font-bold hover:bg-[#105bd1] transition-colors cursor-pointer"
                >
                  {submitting ? 'Logging Ticket...' : 'Log Maintenance Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: REQUEST CLINIC APPOINTMENT --- */}
      {showClinicModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Request Sick-Bay Medical Visit</h3>
              <button onClick={() => setShowClinicModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClinicAppointment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Symptoms Experienced</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe how you are feeling (headache, fever, dizziness, stomach ache, sprain)..."
                  value={clinicForm.symptoms}
                  onChange={(e) => setClinicForm({ ...clinicForm, symptoms: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Urgency</label>
                <select
                  value={clinicForm.urgency}
                  onChange={(e) => setClinicForm({ ...clinicForm, urgency: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#146ef5]"
                >
                  <option value="NORMAL">Standard Check-in during break</option>
                  <option value="HIGH">Severe Discomfort (Immediate check-in)</option>
                  <option value="EMERGENCY">Emergency (Need nurse escort)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClinicModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  {submitting ? 'Booking...' : 'Book Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
