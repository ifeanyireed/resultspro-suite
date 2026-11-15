'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  FingerPrintIcon,
  BookOpenIcon,
  TruckIcon,
  MegaphoneIcon,
  HomeModernIcon,
  HeartIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type CampusSubtab = 'timetable' | 'attendance' | 'library' | 'transport' | 'notices' | 'hostel' | 'clinic';

export default function StudentCampusOSPage() {
  const [activeTab, setActiveTab] = useState<CampusSubtab>('timetable');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCampusData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api
        .get('/v1/campus/student/dashboard')
        .catch(async () => await api.get('/campus/student/dashboard'))
        .catch(async () => await api.get('/student/dashboard'));
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load campus operations data:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to communicate with CampusPRO');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampusData();
  }, [fetchCampusData]);

  const student = dashboardData?.student || {
    name: 'Kelechi Stephanie Okonkwo',
    first_name: 'Kelechi',
    admission_number: 'SCH/2026/0412',
    class_name: 'Senior Secondary 3',
    arm_name: 'Science Diamond',
    campus_name: 'Main Campus · Lekki Phase 1',
  };

  const campusOps = dashboardData?.campus_operations || {};
  const schedule = dashboardData?.schedule || [];

  const subtabs: { id: CampusSubtab; label: string; icon: any; badge?: string }[] = [
    { id: 'timetable', label: 'Bell Schedule', icon: CalendarDaysIcon, badge: '6 Periods' },
    { id: 'attendance', label: 'Biometrics', icon: FingerPrintIcon, badge: campusOps?.attendance_today?.status || 'Present' },
    { id: 'library', label: 'Library Books', icon: BookOpenIcon, badge: `${campusOps?.library?.borrowed_count || 2} Books` },
    { id: 'transport', label: 'Bus Fleet', icon: TruckIcon, badge: 'Route A' },
    { id: 'notices', label: 'Circulars', icon: MegaphoneIcon, badge: '3 New' },
    { id: 'hostel', label: 'Boarding Hall', icon: HomeModernIcon },
    { id: 'clinic', label: 'Health Bay', icon: HeartIcon },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Top Header */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <HomeModernIcon className="w-3.5 h-3.5" /> Student Desk
            </span>
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {student.class_name} · {student.arm_name}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Institutional operations portal for {student.name} · {student.campus_name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCampusData}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#146ef5] hover:border-blue-200 transition-colors shadow-xs"
            title="Refresh Campus Telemetry"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
          <Link
            href="/student/dashboard"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </MotionRise>

      {/* Sticky Pill Subtabs Bar */}
      <div className="sticky top-20 z-20 w-full min-w-0 max-w-full">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
          {subtabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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

      {/* Main Tab Content Panels */}
      {loading && !dashboardData ? (
        <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
          <ArrowPathIcon className="w-8 h-8 animate-spin mx-auto text-[#146ef5] mb-3" />
          Loading CampusPRO records...
        </div>
      ) : (
        <MotionRise>
          {/* TAB 1: BELL SCHEDULE & TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      Daily Class Timetable & Bell Schedule
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      8-period standard Nigerian curriculum schedule for {student.arm_name}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Term 1 In Session
                  </span>
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

          {/* TAB 2: BIOMETRIC ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today&apos;s Status</div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {campusOps?.attendance_today?.status || 'PRESENT'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Clocked in at {campusOps?.attendance_today?.time_in || '07:18 AM'}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Rate</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {dashboardData?.metrics?.attendance_rate?.toFixed(1) || '97.4'}%
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mt-2">
                    {dashboardData?.metrics?.punctual_streak || 18}-day on-time streak
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gate Terminal</div>
                  <div className="text-lg font-bold text-gray-900 mt-2 truncate">
                    {campusOps?.attendance_today?.terminal_name || 'Main Gate Turnstile A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">ZK-IN05 Biometric Optical Fingerprint</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Institutional Attendance Log</h3>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
                  <span>
                    Hardware enrollment confirmed for <strong>{student.name}</strong> · ID: {student.admission_number}
                  </span>
                  <span className="font-bold text-[#146ef5]">Synced Live</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIBRARY & CATALOG */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Library Book Loans</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Currently issued textbooks & digital reference books</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] border border-blue-200">
                    Next Due: {campusOps?.library?.next_due_date || '7 Days'}
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
                        <p className="text-xs text-gray-500">By {b.author}</p>
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
            </div>
          )}

          {/* TAB 4: BUS FLEET & TRANSPORTATION */}
          {activeTab === 'transport' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">School Bus Transport Corridor</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Daily home-to-campus transit roster and fleet details</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bus En Route
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Route Details</div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="font-bold text-gray-900 text-base">{campusOps?.transport?.route_name}</div>
                    <div className="text-xs text-gray-600">
                      Vehicle: <strong>{campusOps?.transport?.bus_number}</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Morning Pickup Stop: <strong>{campusOps?.transport?.pickup_stop}</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Scheduled Pickup: <strong>{campusOps?.transport?.morning_time}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Driver & Attendant</div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="font-bold text-gray-900 text-base">{campusOps?.transport?.driver_name}</div>
                    <div className="text-xs text-gray-600">Fleet Operations Division</div>
                    {campusOps?.transport?.driver_phone && (
                      <a
                        href={`tel:${campusOps?.transport?.driver_phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#146ef5] font-semibold pt-1 hover:underline"
                      >
                        <PhoneIcon className="w-3.5 h-3.5" /> Call Driver: {campusOps?.transport?.driver_phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CIRCULARS & NOTICES */}
          {activeTab === 'notices' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Official School Circulars & Events
              </h3>
              <div className="divide-y divide-gray-100">
                {(campusOps?.notices || []).map((n: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5] text-[10px] font-bold">
                          {n.category}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500">Published for all students and academic staff</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 shrink-0">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HOSTEL */}
          {activeTab === 'hostel' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Boarding Hall & Exeat Register
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold text-gray-500">Hall & Room Allocation</span>
                  <div className="font-bold text-gray-900">{campusOps?.hostel?.hostel_name}</div>
                  <div className="text-xs text-gray-600">
                    {campusOps?.hostel?.room_number} · {campusOps?.hostel?.bed_label}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold text-gray-500">Housemaster</span>
                  <div className="font-bold text-gray-900">{campusOps?.hostel?.housemaster}</div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    Status: {campusOps?.hostel?.exeat_status || 'ON_CAMPUS'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CLINIC */}
          {activeTab === 'clinic' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Campus Clinic & Student Health Bay
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500">Blood Group & Genotype</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {campusOps?.clinic?.blood_group || 'O+'} · {campusOps?.clinic?.genotype || 'AA'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500">Health Certification</div>
                  <div className="text-sm font-bold text-emerald-600 mt-1">
                    {campusOps?.clinic?.status || 'FIT FOR ACADEMICS'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500">Emergency Phone</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">
                    {campusOps?.clinic?.emergency_phone || '+234 803 449 8899'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </MotionRise>
      )}
    </div>
  );
}
