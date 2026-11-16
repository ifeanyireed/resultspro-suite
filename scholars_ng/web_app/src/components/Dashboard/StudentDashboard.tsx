'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  UserPlusIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  HomeModernIcon,
  Squares2X2Icon,
  FingerPrintIcon,
  TruckIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  ChartPieIcon,
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  MegaphoneIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type DashboardPillarTab = 'overview' | 'modular-suite' | 'campus-os';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardPillarTab>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModularSubtab, setActiveModularSubtab] = useState<'classroom' | 'tutors' | 'puzzlepro' | 'resultspro'>('classroom');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/v1/campus/student/dashboard');
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!dashboardData && loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 min-h-[50vh]">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-[#146ef5] mb-3" />
        <span className="text-sm font-medium">Loading Student Command Hub...</span>
      </div>
    );
  }

  const student = dashboardData?.student || {
    name: 'Kelechi Stephanie Okonkwo',
    first_name: 'Kelechi',
    admission_number: 'SCH/2026/0412',
    class_name: 'Senior Secondary 3',
    arm_name: 'Science Diamond',
    campus_name: 'Main Campus · Lekki Phase 1',
    term: 'First Term',
    academic_session: '2026/2027',
  };

  const metrics = dashboardData?.metrics || {
    average_score: 92.4,
    average_gpa: 3.84,
    gpa_growth: '+4.2%',
    attendance_rate: 97.4,
    punctual_streak: 18,
    homework_completion: 88.5,
    pending_tasks: 2,
    study_hours_week: 14.5,
    percentile_rank: 'Top 5% in Level',
  };

  const schedule = dashboardData?.schedule || [];
  const recentActivity = dashboardData?.recent_activity || [];
  const campusOps = dashboardData?.campus_operations || {};
  const modularSuite = dashboardData?.modular_suite || {};

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Top Header & Student Identification */}
      <MotionRise delay={0.02} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Pulse</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <SparklesIcon className="w-3.5 h-3.5" /> Academic Hub
            </span>
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {student.class_name} ({student.arm_name})
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {student.name} · {student.campus_name} · {student.academic_session} ({student.term})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/classroom"
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlayIcon className="w-3.5 h-3.5" />
            Join Next Class
          </Link>
          <Link
            href="/student/campus-os"
            className="bg-white border border-gray-200 text-gray-700 hover:text-[#146ef5] hover:border-blue-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <HomeModernIcon className="w-3.5 h-3.5 text-[#146ef5]" />
            CampusPRO Desk
          </Link>
        </div>
      </MotionRise>

      {/* Primary Pillar Navigation Bar (Overview, Modular Suite, CampusPRO) */}
      <div className="sticky top-20 z-20 w-full min-w-0 max-w-full">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            <Squares2X2Icon className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('modular-suite')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'modular-suite'
                ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            <AcademicCapIcon className="w-4 h-4 shrink-0" />
            <span>Modular Suite</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'modular-suite' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              4 Engines
            </span>
          </button>

          <button
            onClick={() => setActiveTab('campus-os')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'campus-os'
                ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            <HomeModernIcon className="w-4 h-4 shrink-0" />
            <span>CampusPRO</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'campus-os' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Operations
            </span>
          </button>
        </div>
      </div>

      {/* PILLAR 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <MotionRise className="space-y-6">
          {/* Top 4 Hero Metric Cards matching Principal Pulse Design */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Primary Dark Gradient Card */}
            <MotionRise
              delay={0.04}
              className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>

              <div className="flex justify-between items-start z-10">
                <h3 className="text-xl font-normal text-white">Academic Average</h3>
                <Link
                  href="/student/results"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors"
                >
                  <ArrowUpRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="z-10">
                <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{metrics.average_score}%</h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" /> GPA {metrics.average_gpa}
                  </div>
                  <span>{metrics.gpa_growth} vs Last Term</span>
                </div>
              </div>
            </MotionRise>

            {/* Card 2: Biometric Attendance */}
            <MotionRise
              delay={0.08}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Attendance</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                  <FingerPrintIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">
                  {metrics.attendance_rate.toFixed(1)}%
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" /> {metrics.punctual_streak}-Day Streak
                  </div>
                  <span>On-time arrivals</span>
                </div>
              </div>
            </MotionRise>

            {/* Card 3: Homework & Coursework */}
            <MotionRise
              delay={0.12}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Coursework</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                  <BookOpenIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">
                  {metrics.homework_completion}%
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    {metrics.pending_tasks} Tasks Pending
                  </div>
                  <span>Due this week</span>
                </div>
              </div>
            </MotionRise>

            {/* Card 4: Study & Learning Time */}
            <MotionRise
              delay={0.16}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Focus Hours</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                  <ClockIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{metrics.study_hours_week}h</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-[#146ef5] font-semibold">{metrics.percentile_rank}</span>
                </div>
              </div>
            </MotionRise>
          </MotionStagger>

          {/* Main Grid: Left Side Schedule & Syllabus, Right Side Activity & Focus Timer */}
          <MotionStagger className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left 9 Columns */}
            <MotionRise delay={0.06} className="lg:col-span-9 flex flex-col gap-3">
              <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
                {/* Today's Classes */}
                <div className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-normal text-gray-900">Today&apos;s Schedule</h3>
                      <p className="text-xs text-gray-500 mt-0.5">8-period timetable for {student.arm_name}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('campus-os')}
                      className="text-xs font-semibold text-[#146ef5] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    {schedule.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border border-white shadow-xs ${
                              i % 2 === 0 ? 'bg-blue-50 text-[#146ef5]' : 'bg-purple-50 text-purple-600'
                            }`}
                          >
                            <AcademicCapIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-normal text-gray-900">{item.subject}</h4>
                            <p className="text-xs text-gray-500">
                              {item.time} · <span className="font-medium text-gray-700">{item.room}</span>
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.status === 'ACTIVE' ? 'Live Now' : `Period ${item.period_index || i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Term Syllabus Coverage Arc */}
                <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                  <h3 className="text-xl font-normal text-gray-900 mb-6 self-start">Syllabus Progress</h3>

                  <div className="relative w-full aspect-[2/1] max-w-[260px] flex items-end justify-center mt-2 mb-4">
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                      <defs>
                        <pattern
                          id="stripes-arc-student"
                          width="4"
                          height="4"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <line x1="0" y1="0" x2="0" y2="4" stroke="#d1d5db" strokeWidth="2" />
                        </pattern>
                      </defs>
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="transparent"
                        stroke="url(#stripes-arc-student)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="125.66 125.66"
                        strokeDashoffset="0"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="transparent"
                        stroke="#111827"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="82.93 125.66"
                        strokeDashoffset="0"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="transparent"
                        stroke="#146ef5"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="51.52 125.66"
                        strokeDashoffset="0"
                      />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end translate-y-[15%]">
                      <span className="text-5xl font-normal tracking-tight text-gray-900">45%</span>
                      <span className="text-xs font-medium text-gray-500 mt-1">Curriculum Covered</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-auto w-full justify-center pt-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#146ef5]"></div>
                      <span className="text-xs text-gray-500 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#111827]"></div>
                      <span className="text-xs text-gray-500 font-medium">In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-300"></div>
                      <span className="text-xs text-gray-500 font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modular Suite Quick Launchpad Bar */}
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Modular Suite Launchpad</h3>
                    <p className="text-xs text-gray-500">Quick access to your core learning specialist modules</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('modular-suite')}
                    className="text-xs font-semibold text-[#146ef5] hover:underline"
                  >
                    View All Modules →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Link
                    href="/student/classroom"
                    className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#146ef5] uppercase">ClassroomPRO</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-[#146ef5] transition-colors" />
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-gray-900 text-sm">Learning Stream</div>
                      <div className="text-xs text-gray-500 mt-0.5">28 lesson notes · SRS Flashcards</div>
                    </div>
                  </Link>

                  <Link
                    href="/student/tutors"
                    className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">TutorsPRO</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-gray-900 text-sm">1-on-1 Mentorship</div>
                      <div className="text-xs text-gray-500 mt-0.5">42 vetted expert tutors</div>
                    </div>
                  </Link>

                  <Link
                    href="/student/future-skills"
                    className="p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">PuzzlePRO</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-gray-900 text-sm">Coding Adventures</div>
                      <div className="text-xs text-gray-500 mt-0.5">Python Algorithms · 7 Badges</div>
                    </div>
                  </Link>

                  <Link
                    href="/student/results"
                    className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-600 uppercase">ResultsPRO</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-gray-900 text-sm">Academic Standings</div>
                      <div className="text-xs text-gray-500 mt-0.5">Verified Term Broadsheets</div>
                    </div>
                  </Link>
                </div>
              </div>
            </MotionRise>

            {/* Right 3 Columns Stack */}
            <MotionRise delay={0.1} className="lg:col-span-3 flex flex-col gap-3">
              {/* Recent Activity */}
              <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-xl font-normal text-gray-900 mb-6">Recent Reports</h3>
                <div className="flex-1 flex flex-col gap-6 pb-2">
                  {recentActivity.map((act: any) => (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center shrink-0">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{act.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{act.subtitle}</p>
                        <span className="text-[10px] text-gray-400">{act.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Timer Photo Card */}
              <div className="rounded-[1.5rem] p-6 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('/skies.jpeg')" }}
                ></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Focus Timer</h3>
                <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                  <div className="text-5xl font-medium tracking-tight mb-8 font-sans">01:24:08</div>
                  <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer">
                      <PauseIcon className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer">
                      <StopIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </MotionRise>
          </MotionStagger>
        </MotionRise>
      )}

      {/* PILLAR 2: MODULAR SUITE TABS */}
      {activeTab === 'modular-suite' && (
        <MotionRise className="space-y-6">
          {/* Subtab Pill bar */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            {[
              { id: 'classroom', label: 'ClassroomPRO', icon: AcademicCapIcon },
              { id: 'tutors', label: 'TutorsPRO', icon: UserGroupIcon },
              { id: 'puzzlepro', label: 'PuzzlePRO', icon: PuzzlePieceIcon },
              { id: 'resultspro', label: 'ResultsPRO', icon: ChartPieIcon },
            ].map((st) => {
              const Icon = st.icon;
              const isActive = activeModularSubtab === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveModularSubtab(st.id as any)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#146ef5] border border-blue-200 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subtab 1: ClassroomPRO */}
          {activeModularSubtab === 'classroom' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">ClassroomPRO · Digital Learning Stream</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Curriculum lesson notes, interactive practice quizzes, and SRS flashcards</p>
                </div>
                <Link
                  href="/student/classroom"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#146ef5] text-white text-xs font-bold hover:bg-[#105bd1] transition-colors shadow-xs"
                >
                  Open Full Classroom Hub →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">Lesson Notes</span>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{modularSuite?.classroompro?.active_notes || 28}</div>
                  <p className="text-xs text-gray-500 mt-1">Available for revision</p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">Quizzes Completed</span>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{modularSuite?.classroompro?.quizzes_taken || 14}</div>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Next: {modularSuite?.classroompro?.next_quiz || 'Physics Quiz'}</p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">Flashcard Decks</span>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{modularSuite?.classroompro?.flashcard_decks || 6}</div>
                  <p className="text-xs text-gray-500 mt-1">Spaced Repetition active</p>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: TutorsPRO */}
          {activeModularSubtab === 'tutors' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">TutorsPRO · 1-on-1 Mentorship & Sessions</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Connect with subject experts, schedule private tutoring, and attend virtual rooms</p>
                </div>
                <Link
                  href="/student/tutors"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Open Tutors Desk →
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase">Next Scheduled Session</span>
                  <h4 className="text-base font-bold text-gray-900 mt-1">{modularSuite?.tutorspro?.upcoming_session || 'English Diction'}</h4>
                  <p className="text-xs text-gray-600">With {modularSuite?.tutorspro?.tutor_name || 'Mrs. Folashade Bakare'} · {modularSuite?.tutorspro?.session_time || 'Tomorrow, 04:00 PM'}</p>
                </div>
                <Link
                  href="/student/tutors"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Join Room
                </Link>
              </div>
            </div>
          )}

          {/* Subtab 3: PuzzlePRO */}
          {activeModularSubtab === 'puzzlepro' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">PuzzlePRO · Coding Adventures & Future Skills</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Block-based visual coding, Python algorithmic tracks, and STEM robotics</p>
                </div>
                <Link
                  href="/student/future-skills"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs"
                >
                  Open Coding Arena →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase">Track</span>
                  <h4 className="text-base font-bold text-gray-900 mt-1">{modularSuite?.puzzlepro?.current_track || 'Python Algorithms'}</h4>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase">Badges Earned</span>
                  <h4 className="text-3xl font-bold text-gray-900 mt-1">{modularSuite?.puzzlepro?.badges_earned || 7}</h4>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase">Leaderboard Standing</span>
                  <h4 className="text-base font-bold text-gray-900 mt-1">{modularSuite?.puzzlepro?.leaderboard_rank || '#3 in Grade 12'}</h4>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 4: ResultsPRO */}
          {activeModularSubtab === 'resultspro' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">ResultsPRO · Official Broadsheets & Grades</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Verified Nigerian curriculum terminal broadsheets, term GPA, and grade analytics</p>
                </div>
                <Link
                  href="/student/results"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-xs"
                >
                  Open Results Desk →
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-800 uppercase">Current Academic Standing</span>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">Cumulative GPA: {metrics.average_gpa}</h4>
                  <p className="text-xs text-gray-600">Best Subject: {modularSuite?.resultspro?.best_subject || 'Mathematics (95%)'}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  Verified &amp; Published
                </span>
              </div>
            </div>
          )}
        </MotionRise>
      )}

      {/* PILLAR 3: CAMPUSPRO OPERATIONS */}
      {activeTab === 'campus-os' && (
        <MotionRise className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">CampusPRO · Operations Hub</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Institutional student logistics: Biometrics, Bell Schedule, Library, Fleet &amp; Health Bay
                </p>
              </div>
              <Link
                href="/student/campus-os"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#146ef5] text-white text-xs font-bold hover:bg-[#105bd1] transition-colors shadow-xs"
              >
                Open Full CampusPRO Workspace →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Card 1: Attendance */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <FingerPrintIcon className="w-5 h-5 text-[#146ef5]" />
                  <span className="font-bold text-gray-900 text-sm">Today&apos;s Biometric Log</span>
                </div>
                <div className="text-xs text-gray-600">
                  Clock-in: <strong>{campusOps?.attendance_today?.time_in || '07:18 AM'}</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Terminal: <strong>{campusOps?.attendance_today?.terminal_name || 'Main Turnstile Gate A'}</strong>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {campusOps?.attendance_today?.status || 'PRESENT'}
                </span>
              </div>

              {/* Card 2: Transport */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-[#146ef5]" />
                  <span className="font-bold text-gray-900 text-sm">Transport Fleet</span>
                </div>
                <div className="text-xs text-gray-600">
                  Route: <strong>{campusOps?.transport?.route_name}</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Pickup Stop: <strong>{campusOps?.transport?.pickup_stop}</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Morning Departure: <strong>{campusOps?.transport?.morning_time}</strong>
                </div>
              </div>

              {/* Card 3: Library */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5 text-[#146ef5]" />
                  <span className="font-bold text-gray-900 text-sm">Library Books on Loan</span>
                </div>
                <div className="text-xs text-gray-600">
                  Issued: <strong>{campusOps?.library?.borrowed_count || 2} Books</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Return Due Date: <strong>{campusOps?.library?.next_due_date || 'In 7 Days'}</strong>
                </div>
              </div>
            </div>
          </div>
        </MotionRise>
      )}
    </div>
  );
}
