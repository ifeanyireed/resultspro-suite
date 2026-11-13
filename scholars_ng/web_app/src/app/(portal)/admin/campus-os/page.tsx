'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  HeartIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  BoltIcon,
  ArrowUpRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  LinkIcon,
  ShieldCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

import TimetableDashboard from '../timetable/page';
import PerformanceDashboard from '../performance/page';
import EnrollmentDashboard from '../enrollment/page';
import FeesDashboard from '../fees/page';
import LibraryDashboard from '../library/page';
import ProcurementDashboard from '../procurement/page';
import TransportDashboard from '../transport/page';
import AdmissionsDashboard from '@/components/Dashboard/AdmissionsDashboard';

export type CampusOSTab =
  | 'academic'
  | 'staff'
  | 'students'
  | 'parents'
  | 'financials'
  | 'library'
  | 'inventory'
  | 'transportation'
  | 'admission'
  | 'messaging'
  | 'mobile-app';

type AcademicSubtab = 'overview' | 'session' | 'subjects' | 'classes' | 'assigned-tutors' | 'timetable';

function MasterTimetableGrid() {
  const [selectedArm, setSelectedArm] = useState('SS 1 Science');
  const arms = ['JSS 1 Gold', 'JSS 2 Gold', 'JSS 3 Emerald', 'SS 1 Science', 'SS 2 Commercial', 'SS 3 Science (WAEC)'];

  const periods = [
    { id: 'p1', label: 'Period 1', time: '08:00 – 08:45' },
    { id: 'p2', label: 'Period 2', time: '08:45 – 09:30' },
    { id: 'p3', label: 'Period 3', time: '09:30 – 10:15' },
    { id: 'break1', label: 'Short Break', time: '10:15 – 10:35', isBreak: true },
    { id: 'p4', label: 'Period 4', time: '10:35 – 11:20' },
    { id: 'p5', label: 'Period 5', time: '11:20 – 12:05' },
    { id: 'p6', label: 'Period 6', time: '12:05 – 12:50' },
    { id: 'break2', label: 'Lunch & Recreation', time: '12:50 – 13:30', isBreak: true },
    { id: 'p7', label: 'Period 7', time: '13:30 – 14:15' },
    { id: 'p8', label: 'Period 8', time: '14:15 – 15:00' },
  ];

  const schedule: Record<string, { subject: string; tutor: string; room: string; color: string }[]> = {
    Monday: [
      { subject: 'Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'English Language', tutor: 'Mrs. F. Adebayo', room: 'Sci-S1', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Physics (Theory)', tutor: 'Dr. S. Eze', room: 'Sci-S1', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Break', tutor: '', room: '', color: '' },
      { subject: 'Chemistry', tutor: 'Mr. K. Bello', room: 'Chem Lab', color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { subject: 'Biology', tutor: 'Ms. Z. Lawal', room: 'Bio Lab', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Data Processing & AI', tutor: 'Mr. E. Okafor', room: 'ICT Hub', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { subject: 'Lunch', tutor: '', room: '', color: '' },
      { subject: 'Further Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Civic Education', tutor: 'Mrs. H. Bello', room: 'Sci-S1', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    ],
    Tuesday: [
      { subject: 'Physics Practical', tutor: 'Dr. S. Eze', room: 'Physics Lab', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Physics Practical', tutor: 'Dr. S. Eze', room: 'Physics Lab', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Break', tutor: '', room: '', color: '' },
      { subject: 'English Literature', tutor: 'Mrs. F. Adebayo', room: 'Sci-S1', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Economics', tutor: 'Mrs. N. Obi', room: 'Sci-S1', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { subject: 'Technical Drawing', tutor: 'Engr. P. Audu', room: 'Studio 2', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { subject: 'Lunch', tutor: '', room: '', color: '' },
      { subject: 'Chemistry', tutor: 'Mr. K. Bello', room: 'Sci-S1', color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { subject: 'PuzzlePRO Coding Lab', tutor: 'Mr. E. Okafor', room: 'ICT Hub', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ],
    Wednesday: [
      { subject: 'Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Chemistry Practical', tutor: 'Mr. K. Bello', room: 'Chem Lab', color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { subject: 'Chemistry Practical', tutor: 'Mr. K. Bello', room: 'Chem Lab', color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { subject: 'Break', tutor: '', room: '', color: '' },
      { subject: 'Biology', tutor: 'Ms. Z. Lawal', room: 'Sci-S1', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'English Language', tutor: 'Mrs. F. Adebayo', room: 'Sci-S1', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Further Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Lunch', tutor: '', room: '', color: '' },
      { subject: 'Sports & Houses', tutor: 'Coach M. Musa', room: 'Main Pitch', color: 'bg-orange-50 text-orange-700 border-orange-200' },
      { subject: 'Club & Robotics Society', tutor: 'Mr. E. Okafor', room: 'Innovation Lab', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ],
    Thursday: [
      { subject: 'English Language', tutor: 'Mrs. F. Adebayo', room: 'Sci-S1', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Biology Practical', tutor: 'Ms. Z. Lawal', room: 'Bio Lab', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Break', tutor: '', room: '', color: '' },
      { subject: 'Physics', tutor: 'Dr. S. Eze', room: 'Sci-S1', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Geography & GIS', tutor: 'Mr. T. Bakare', room: 'Geo Room', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { subject: 'Data Processing & AI', tutor: 'Mr. E. Okafor', room: 'ICT Hub', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { subject: 'Lunch', tutor: '', room: '', color: '' },
      { subject: 'Economics', tutor: 'Mrs. N. Obi', room: 'Sci-S1', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { subject: 'Library & CBT Prep', tutor: 'Librarian', room: 'E-Library', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    ],
    Friday: [
      { subject: 'Further Mathematics', tutor: 'Mr. D. Jenkins', room: 'Sci-S1', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Physics', tutor: 'Dr. S. Eze', room: 'Sci-S1', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { subject: 'Chemistry', tutor: 'Mr. K. Bello', room: 'Sci-S1', color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { subject: 'Break', tutor: '', room: '', color: '' },
      { subject: 'English Language', tutor: 'Mrs. F. Adebayo', room: 'Sci-S1', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Civic Education', tutor: 'Mrs. H. Bello', room: 'Sci-S1', color: 'bg-rose-50 text-rose-700 border-rose-200' },
      { subject: 'Continuous Assessment CBT', tutor: 'Exam Officer', room: 'CBT Hall', color: 'bg-blue-50 text-[#146ef5] border-blue-200' },
      { subject: 'Lunch', tutor: '', room: '', color: '' },
      { subject: 'Mentorship & Assembly', tutor: 'Form Teacher', room: 'Auditorium', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { subject: 'Early Dismissal / Prep', tutor: 'All Staff', room: 'Campus', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Master Class Timetable</h2>
          <p className="text-sm text-gray-500 mt-1">
            Weekly period matrix, laboratory allocations, and conflict-free teacher scheduling for <span className="font-semibold text-gray-900">{selectedArm}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {arms.map((arm) => (
            <button
              key={arm}
              type="button"
              onClick={() => setSelectedArm(arm)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedArm === arm
                  ? 'bg-[#146ef5] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              {arm}
            </button>
          ))}
          <button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Auto-Generate Slot
          </button>
        </div>
      </div>

      {/* Timetable Weekly Grid */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-28 sticky left-0 bg-gray-50 z-10 border-r border-gray-100">
                  Day / Period
                </th>
                {periods.map((p) => (
                  <th
                    key={p.id}
                    className={`py-3 px-3 text-center border-r border-gray-100 last:border-r-0 ${
                      p.isBreak ? 'bg-amber-50/60 w-24' : 'min-w-[135px]'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-800">{p.label}</div>
                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(schedule).map(([day, slots]) => (
                <tr key={day} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-sm text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100">
                    {day}
                  </td>
                  {slots.map((slot, idx) => {
                    const periodMeta = periods[idx];
                    if (periodMeta?.isBreak) {
                      return (
                        <td
                          key={idx}
                          className="p-2 bg-amber-50/40 text-center border-r border-gray-100 align-middle"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            {periodMeta.label}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td key={idx} className="p-2 border-r border-gray-100 last:border-r-0 align-top">
                        <div className={`rounded-xl p-2.5 border ${slot.color} h-full flex flex-col justify-between`}>
                          <div>
                            <div className="text-xs font-bold leading-snug">{slot.subject}</div>
                            <div className="text-[10px] opacity-80 mt-1">{slot.tutor}</div>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between text-[10px] font-semibold">
                            <span>{slot.room}</span>
                            <span>45m</span>
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
    </div>
  );
}

function AcademicOperationsHub() {
  const [subtab, setSubtab] = useState<AcademicSubtab>('overview');

  const academicSubtabs: { id: AcademicSubtab; label: string; icon: any; count?: string }[] = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, count: 'Pulse' },
    { id: 'session', label: 'Academic Session', icon: CalendarIcon, count: '2026/2027' },
    { id: 'subjects', label: 'Subjects', icon: BookOpenIcon, count: '28' },
    { id: 'classes', label: 'Classes', icon: AcademicCapIcon, count: '18 Arms' },
    { id: 'assigned-tutors', label: 'Assigned Tutors', icon: UserGroupIcon, count: '64' },
    { id: 'timetable', label: 'Timetable', icon: ClockIcon, count: 'Weekly Grid' },
  ];

  return (
    <div className="space-y-6">
      {/* Secondary Subtab Bar under Academic */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 bg-gray-100/90 rounded-full p-1 border border-gray-200/70">
          {academicSubtabs.map((item) => {
            const Icon = item.icon;
            const active = subtab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSubtab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#146ef5] shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.count && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-blue-50 text-[#146ef5] font-bold' : 'bg-white/70 text-gray-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 0. OVERVIEW (Moved to Front) */}
      {subtab === 'overview' && <TimetableDashboard />}

      {/* 1. ACADEMIC SESSION */}
      {subtab === 'session' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Academic Session &amp; Term Calendar</h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure active academic year, term start/end dates, mid-term breaks, and assessment windows.
              </p>
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 self-start sm:self-auto">
              <PlusIcon className="w-4 h-4" />
              Create New Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                term: 'First Term (Harmattan)',
                session: '2026 / 2027 Session',
                status: 'Active Term',
                active: true,
                resumption: 'Sep 09, 2026',
                midTerm: 'Oct 26 – Oct 30, 2026',
                exams: 'Nov 30 – Dec 09, 2026',
                vacation: 'Dec 16, 2026',
                weeks: '14 Weeks (Week 9 in progress)',
              },
              {
                term: 'Second Term (Rain)',
                session: '2026 / 2027 Session',
                status: 'Upcoming',
                active: false,
                resumption: 'Jan 11, 2027',
                midTerm: 'Feb 22 – Feb 26, 2027',
                exams: 'Mar 22 – Apr 02, 2027',
                vacation: 'Apr 09, 2027',
                weeks: '13 Weeks Scheduled',
              },
              {
                term: 'Third Term (Promotional)',
                session: '2026 / 2027 Session',
                status: 'Planned',
                active: false,
                resumption: 'Apr 26, 2027',
                midTerm: 'Jun 07 – Jun 11, 2027',
                exams: 'Jul 05 – Jul 16, 2027',
                vacation: 'Jul 23, 2027',
                weeks: '13 Weeks Scheduled',
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`rounded-[1.5rem] p-6 border shadow-sm flex flex-col justify-between ${
                  t.active
                    ? 'bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white border-transparent'
                    : 'bg-white text-gray-900 border-gray-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        t.active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className={`text-xs ${t.active ? 'text-white/80' : 'text-gray-400'}`}>{t.session}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{t.term}</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className={t.active ? 'text-white/75' : 'text-gray-500'}>Resumption:</span>
                      <span className="font-semibold">{t.resumption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={t.active ? 'text-white/75' : 'text-gray-500'}>Mid-Term Break:</span>
                      <span className="font-semibold">{t.midTerm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={t.active ? 'text-white/75' : 'text-gray-500'}>Examinations:</span>
                      <span className="font-semibold">{t.exams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={t.active ? 'text-white/75' : 'text-gray-500'}>Vacation Date:</span>
                      <span className="font-semibold">{t.vacation}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-6 pt-4 border-t text-xs font-medium ${
                    t.active ? 'border-white/20 text-white/90' : 'border-gray-100 text-[#146ef5]'
                  }`}
                >
                  {t.weeks}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SUBJECTS */}
      {subtab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Curriculum Subjects</h2>
              <p className="text-sm text-gray-500 mt-1">
                NERDC, WAEC/NECO, and Cambridge IGCSE subjects offered across Junior and Senior Secondary levels.
              </p>
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 self-start sm:self-auto">
              <PlusIcon className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Subject Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Curriculum</th>
                  <th className="px-6 py-4">Assigned Tutors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { code: 'MTH-101', title: 'General Mathematics', dept: 'STEM & Sciences', type: 'Core Compulsory', curr: 'NERDC / WAEC / IGCSE', tutors: '4 Tutors' },
                  { code: 'ENG-102', title: 'English Language & Literature', dept: 'Humanities', type: 'Core Compulsory', curr: 'NERDC / WAEC / IGCSE', tutors: '5 Tutors' },
                  { code: 'PHY-201', title: 'Physics (Practical & Theory)', dept: 'STEM & Sciences', type: 'Science Core', curr: 'WAEC / IGCSE', tutors: '2 Tutors' },
                  { code: 'CHM-202', title: 'Chemistry', dept: 'STEM & Sciences', type: 'Science Core', curr: 'WAEC / IGCSE', tutors: '2 Tutors' },
                  { code: 'BIO-203', title: 'Biology', dept: 'STEM & Sciences', type: 'Science Core', curr: 'NERDC / WAEC', tutors: '3 Tutors' },
                  { code: 'CSC-301', title: 'Data Processing, Coding & AI', dept: 'Future Skills', type: 'Core Compulsory', curr: 'NERDC / PuzzlePRO', tutors: '3 Tutors' },
                  { code: 'ECO-210', title: 'Economics & Financial Accounting', dept: 'Commercial', type: 'Commercial Core', curr: 'NERDC / WAEC', tutors: '2 Tutors' },
                  { code: 'GOV-215', title: 'Civic Education & Government', dept: 'Humanities', type: 'Core / Elective', curr: 'NERDC / WAEC', tutors: '2 Tutors' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-[#146ef5]">{s.code}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.dept}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5]">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{s.curr}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-700">{s.tutors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLASSES */}
      {subtab === 'classes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Classes &amp; Class Arms</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage class arms, form teachers, classroom blocks, and student enrollment capacity.
              </p>
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 self-start sm:self-auto">
              <PlusIcon className="w-4 h-4" />
              Create Class Arm
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { arm: 'JSS 1 Gold', level: 'Junior Secondary 1', formTeacher: 'Mrs. Funke Adebayo', room: 'Block A · Room 101', students: 34, capacity: 35, subjects: 14 },
              { arm: 'JSS 1 Diamond', level: 'Junior Secondary 1', formTeacher: 'Mr. Tunde Bakare', room: 'Block A · Room 102', students: 32, capacity: 35, subjects: 14 },
              { arm: 'JSS 2 Gold', level: 'Junior Secondary 2', formTeacher: 'Ms. Zainab Lawal', room: 'Block A · Room 201', students: 35, capacity: 35, subjects: 14 },
              { arm: 'JSS 3 Emerald', level: 'Junior Secondary 3 (BECE)', formTeacher: 'Mr. Emeka Okafor', room: 'Block B · Room 104', students: 33, capacity: 35, subjects: 15 },
              { arm: 'SS 1 Science', level: 'Senior Secondary 1', formTeacher: 'Dr. Samuel Eze', room: 'Science Wing · S1', students: 30, capacity: 32, subjects: 11 },
              { arm: 'SS 2 Commercial', level: 'Senior Secondary 2', formTeacher: 'Mrs. Ngozi Obi', room: 'Block C · Room 202', students: 28, capacity: 32, subjects: 10 },
              { arm: 'SS 3 Science (WAEC)', level: 'Senior Secondary 3', formTeacher: 'Mr. David Jenkins', room: 'Exam Wing · E1', students: 31, capacity: 32, subjects: 9 },
              { arm: 'SS 3 Humanities', level: 'Senior Secondary 3', formTeacher: 'Mrs. Halima Bello', room: 'Exam Wing · E2', students: 27, capacity: 30, subjects: 9 },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">{c.room}</span>
                    <span className="text-xs font-semibold text-gray-400">{c.subjects} Subjects</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{c.arm}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 mb-4">{c.level}</p>
                  <div className="text-xs text-gray-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Form Teacher:</span>
                      <span className="font-semibold text-gray-800">{c.formTeacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Enrollment:</span>
                      <span className="font-semibold text-emerald-600">{c.students} / {c.capacity} Students</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#146ef5] rounded-full"
                      style={{ width: `${Math.round((c.students / c.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ASSIGNED TUTORS */}
      {subtab === 'assigned-tutors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Assigned Tutors &amp; Subject Allocation</h2>
              <p className="text-sm text-gray-500 mt-1">
                Map educators and subject specialists to specific class arms and monitor weekly teaching periods.
              </p>
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 self-start sm:self-auto">
              <PlusIcon className="w-4 h-4" />
              Assign Tutor to Class
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Tutor / Educator</th>
                  <th className="px-6 py-4">Primary Subject</th>
                  <th className="px-6 py-4">Assigned Class Arms</th>
                  <th className="px-6 py-4">Weekly Load</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Mr. David Jenkins', role: 'HOD Mathematics', subject: 'Further & General Mathematics', classes: 'SS 1 Sci, SS 2 Sci, SS 3 Sci', periods: '22 Periods / wk', status: 'Optimal Load' },
                  { name: 'Dr. Samuel Eze', role: 'Senior Physics Tutor', subject: 'Physics & Lab Practicals', classes: 'SS 1 Sci, SS 2 Sci, SS 3 Sci', periods: '20 Periods / wk', status: 'Optimal Load' },
                  { name: 'Mrs. Funke Adebayo', role: 'Lead English Educator', subject: 'English Language & Diction', classes: 'JSS 1 Gold, JSS 1 Diamond, JSS 2 Gold', periods: '24 Periods / wk', status: 'Full Capacity' },
                  { name: 'Mr. Emeka Okafor', role: 'STEM & Coding Mentor', subject: 'Data Processing & PuzzlePRO Coding', classes: 'JSS 1 – JSS 3 (All Arms)', periods: '18 Periods / wk', status: 'Optimal Load' },
                  { name: 'Ms. Zainab Lawal', role: 'Biology & Integrated Science', subject: 'Biology', classes: 'SS 1 Sci, SS 2 Sci, JSS 3 Emerald', periods: '21 Periods / wk', status: 'Optimal Load' },
                  { name: 'Mrs. Ngozi Obi', role: 'Commercial Studies Lead', subject: 'Economics & Financial Accounting', classes: 'SS 1 Comm, SS 2 Comm, SS 3 Comm', periods: '19 Periods / wk', status: 'Optimal Load' },
                ].map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#146ef5]">{t.subject}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{t.classes}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-800">{t.periods}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'Optimal Load'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MASTER TIMETABLE GRID */}
      {subtab === 'timetable' && <MasterTimetableGrid />}
    </div>
  );
}

function ParentsDashboard() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parents &amp; Guardians CRM</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage parent accounts, ward linkages, PTA communications, and portal engagement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" />
            Send PTA Broadcast
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            Export Directory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Active Guardians</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">892</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" /> +9.4%
              </div>
              <span>Portal logins this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Ward Linkages</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">98.4%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">1,228 of 1,248 students linked</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Notice Read Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">91%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">SMS, WhatsApp &amp; Email</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">PTA Attendance</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">86%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Last Term General Forum</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Guardian Directory &amp; Ward Accounts</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            Verified Household Profiles
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Parent / Guardian</th>
              <th className="px-6 py-4">Linked Wards</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Fee Status</th>
              <th className="px-6 py-4">Portal Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                name: 'Chief & Mrs. O. Adeleke',
                wards: 'Tomiwa Adeleke (SS 2), Kemi Adeleke (JSS 3)',
                contact: 'adeleke.family@gmail.com · +234 803 412 8890',
                feeStatus: 'Cleared',
                activity: 'Active Today',
              },
              {
                name: 'Engr. & Dr. (Mrs.) Chidi Nwosu',
                wards: 'Chisom Nwosu (SS 3)',
                contact: 'c.nwosu@nwosueng.ng · +234 809 221 3401',
                feeStatus: 'Cleared',
                activity: 'Active Yesterday',
              },
              {
                name: 'Alhaji & Hajiya Ibrahim Danjuma',
                wards: 'Amina Danjuma (JSS 2), Musa Danjuma (Primary 6)',
                contact: 'ibrahim.danjuma@yahoo.com · +234 802 310 5542',
                feeStatus: 'Installment 2/3',
                activity: 'Active 2d ago',
              },
              {
                name: 'Barr. & Mrs. Efe Omoregie',
                wards: 'Osaze Omoregie (SS 1)',
                contact: 'efe.omoregie@chambers.ng · +234 805 774 1129',
                feeStatus: 'Cleared',
                activity: 'Active Today',
              },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.wards}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{p.contact}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.feeStatus === 'Cleared'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.feeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#146ef5]">{p.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function MessagingDashboard() {
  const [selectedThread, setSelectedThread] = useState(0);
  const [channel, setChannel] = useState<'all' | 'whatsapp' | 'sms' | 'email' | 'portal'>('all');
  const [audience, setAudience] = useState('All Parents & Guardians (892)');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const threads = [
    {
      sender: 'Chief & Mrs. O. Adeleke',
      role: 'Parent · SS 2 & JSS 3',
      channel: 'WhatsApp',
      time: '10 mins ago',
      unread: true,
      subject: 'Confirmation of 1st Term Mid-Term Excursion Fee',
      preview: 'Good morning Principal, we have completed the transfer for Tomiwa and Kemi...',
      messages: [
        { from: 'parent', text: 'Good morning Principal, we have completed the transfer for Tomiwa and Kemi’s STEM Robotics Excursion. Kindly confirm receipt on the portal.', time: '09:05 AM' },
        { from: 'admin', text: 'Good morning Chief Adeleke! Payment has been verified by the Bursary and both students are cleared for the excursion.', time: '09:12 AM' },
      ],
    },
    {
      sender: 'Mr. David Jenkins',
      role: 'HOD Mathematics',
      channel: 'Portal',
      time: '42 mins ago',
      unread: false,
      subject: 'SS 3 WAEC Mock CBT Question Bank Ready',
      preview: 'All 120 objective and theory questions for Further Maths have been uploaded...',
      messages: [
        { from: 'parent', text: 'All 120 objective and theory questions for Further Maths have been uploaded to ClassroomPRO for the SS 3 Mock Exam.', time: '08:30 AM' },
        { from: 'admin', text: 'Thank you Mr. Jenkins. The Academic Office has scheduled the CBT slot for Friday Period 6.', time: '08:40 AM' },
      ],
    },
    {
      sender: 'Engr. & Dr. (Mrs.) Chidi Nwosu',
      role: 'Parent · SS 3 Science',
      channel: 'Email',
      time: '2 hrs ago',
      unread: false,
      subject: 'University Reference Letter Request for Chisom',
      preview: 'Dear Administration, kindly assist with the official transcript and reference...',
      messages: [
        { from: 'parent', text: 'Dear Administration, kindly assist with the official transcript and Principal reference letter for Chisom’s university application.', time: '07:15 AM' },
      ],
    },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentNotice(true);
    setSubject('');
    setMessageText('');
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Omnichannel Messaging &amp; Broadcasts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Unified school communications across WhatsApp Business, SMS, Email, and In-Portal Circulars.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'whatsapp', 'sms', 'email', 'portal'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                channel === c
                  ? 'bg-[#146ef5] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm text-white flex flex-col justify-between aspect-square relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal">Broadcasts Sent</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight mb-2">18.4k</h2>
            <p className="text-xs text-white/80">SMS, WhatsApp &amp; Email this term</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Delivery Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-emerald-600">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">99.2%</h2>
            <p className="text-xs text-gray-400">Verified gateway delivery</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">WhatsApp Read</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">94%</h2>
            <p className="text-xs text-gray-400">Opened within 15 minutes</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Open Threads</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <EnvelopeIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">7</h2>
            <p className="text-xs text-gray-400">Awaiting admin response</p>
          </div>
        </div>
      </div>

      {/* Two-Column Inbox & Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Direct Message Inbox & Conversation Thread */}
        <div className="lg:col-span-7 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Parent &amp; Staff Inbox</h3>
            <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
              Live 2-Way Threads
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[380px]">
            {/* Thread List */}
            <div className="md:col-span-5 border-r border-gray-100 divide-y divide-gray-100">
              {threads.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedThread(idx)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    selectedThread === idx ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {t.channel}
                    </span>
                    <span className="text-[10px] text-gray-400">{t.time}</span>
                  </div>
                  <div className="font-semibold text-sm text-gray-900 truncate">{t.sender}</div>
                  <div className="text-xs text-[#146ef5] font-medium truncate mt-0.5">{t.subject}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{t.preview}</div>
                </button>
              ))}
            </div>

            {/* Active Conversation */}
            <div className="md:col-span-7 p-5 flex flex-col justify-between bg-gray-50/40">
              <div>
                <div className="pb-3 mb-4 border-b border-gray-200/70">
                  <div className="font-bold text-sm text-gray-900">{threads[selectedThread].sender}</div>
                  <div className="text-xs text-gray-500">
                    {threads[selectedThread].role} · via {threads[selectedThread].channel}
                  </div>
                </div>
                <div className="space-y-3">
                  {threads[selectedThread].messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                        m.from === 'admin'
                          ? 'ml-auto bg-[#146ef5] text-white rounded-br-xs'
                          : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`block text-[10px] mt-1.5 ${
                          m.from === 'admin' ? 'text-white/75' : 'text-gray-400'
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/70 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                />
                <button
                  type="button"
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <PaperAirplaneIcon className="w-3.5 h-3.5" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instant Broadcast Composer */}
        <form
          onSubmit={handleBroadcast}
          className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">New Campus Broadcast</h3>
              {sentNotice && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Broadcast Dispatched!
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Target Recipient Group
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]"
              >
                <option>All Parents &amp; Guardians (892)</option>
                <option>All Academic &amp; Admin Staff (94)</option>
                <option>Senior Secondary Parents (SS 1 – SS 3)</option>
                <option>Junior Secondary Parents (JSS 1 – JSS 3)</option>
                <option>Pending Tuition / Fee Reminder List (64)</option>
                <option>School Bus / Transport Subscribers (310)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Subject / Headline
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mid-Term Break Resumption & PTA Notice"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Message Body (Supports Merge Tags: {'{{parent_name}}'}, {'{{student_name}}'})
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Dear {{parent_name}}, please be informed that..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold text-sm py-3 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Dispatch via WhatsApp, SMS &amp; Email
          </button>
        </form>
      </div>
    </div>
  );
}

type MobileRoleType = 'Parent' | 'Teacher' | 'Driver' | 'Admin';

interface MobileAppAccount {
  id: string;
  mobileUserId: string;
  name: string;
  contact: string;
  role: MobileRoleType;
  campus: string;
  scopeDetail: string;
  permissionsSummary: string;
  deviceStatus: string;
  status: 'Active' | 'Invite Sent';
  inviteLink: string;
}

const CAMPUS_APP_INSTANCES: Record<
  string,
  {
    appId: string;
    appName: string;
    bundleId: string;
    version: string;
    deepLinkPrefix: string;
    activeDevices: number;
  }
> = {
  'All Campuses (Multi-Campus)': {
    appId: 'CMP-APP-GLOBAL',
    appName: 'ScholarsNG Unified Multi-Campus Mobile',
    bundleId: 'ng.scholars.campus.unified',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/GLOBAL',
    activeDevices: 1184,
  },
  'Main Campus · Lekki Phase 1': {
    appId: 'CMP-APP-LK01',
    appName: 'ScholarsNG Mobile · Lekki Main Campus',
    bundleId: 'ng.scholars.campus.lekki',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-LK01',
    activeDevices: 540,
  },
  'Annex Campus · Ikeja GRA': {
    appId: 'CMP-APP-IK02',
    appName: 'ScholarsNG Mobile · Ikeja GRA Annex',
    bundleId: 'ng.scholars.campus.ikeja',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-IK02',
    activeDevices: 312,
  },
  'Victoria Island Junior Campus': {
    appId: 'CMP-APP-VI03',
    appName: 'ScholarsNG Mobile · VI Junior Campus',
    bundleId: 'ng.scholars.campus.vi',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-VI03',
    activeDevices: 198,
  },
  'Abuja Maitama Campus': {
    appId: 'CMP-APP-AB04',
    appName: 'ScholarsNG Mobile · Abuja Maitama',
    bundleId: 'ng.scholars.campus.abuja',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-AB04',
    activeDevices: 134,
  },
};

const ROLE_CONFIG: Record<
  MobileRoleType,
  {
    prefix: string;
    badgeClass: string;
    defaultScopePlaceholder: string;
    permissionsSummary: string;
  }
> = {
  Parent: {
    prefix: 'MOB-PRN',
    badgeClass: 'bg-blue-50 text-[#146ef5] border-blue-200',
    defaultScopePlaceholder: 'e.g., Ward: Tomiwa Adeleke (SS 2 Science)',
    permissionsSummary: 'Sees linked wards’ results, fee invoices, attendance, bus GPS & teacher chat',
  },
  Teacher: {
    prefix: 'MOB-TCH',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultScopePlaceholder: 'e.g., Assigned: SS 1 – SS 3 Mathematics',
    permissionsSummary: 'Sees assigned class arms, CA mark-sheet entry, timetable & student attendance',
  },
  Driver: {
    prefix: 'MOB-DRV',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultScopePlaceholder: 'e.g., Bus Route B-04 · Lekki Phase 1 – Chevron',
    permissionsSummary: 'Sees assigned bus route manifest, student boarding QR scanner & live GPS telemetry',
  },
  Admin: {
    prefix: 'MOB-ADM',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultScopePlaceholder: 'e.g., Vice Principal Academics / Bursar',
    permissionsSummary: 'Sees campus KPIs, bursary approvals, staff attendance logs & emergency broadcasts',
  },
};

function MobileAppDashboard({ selectedCampus }: { selectedCampus: string }) {
  const [roleFilter, setRoleFilter] = useState<'All' | MobileRoleType>('All');
  const [inviteRole, setInviteRole] = useState<MobileRoleType>('Parent');
  const [inviteCampus, setInviteCampus] = useState<string>(
    selectedCampus === 'All Campuses (Multi-Campus)'
      ? 'Main Campus · Lekki Phase 1'
      : selectedCampus
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [recipientScope, setRecipientScope] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteSentBanner, setInviteSentBanner] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<MobileAppAccount[]>([
    {
      id: '1',
      mobileUserId: 'MOB-PRN-88412',
      name: 'Chief & Mrs. O. Adeleke',
      contact: '+234 803 412 8890 · adeleke.family@gmail.com',
      role: 'Parent',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'Wards: Tomiwa Adeleke (SS 2), Kemi Adeleke (JSS 3)',
      permissionsSummary: ROLE_CONFIG.Parent.permissionsSummary,
      deviceStatus: 'iOS 18 · iPhone 15 Pro',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=parent&uid=MOB-PRN-88412',
    },
    {
      id: '2',
      mobileUserId: 'MOB-TCH-30914',
      name: 'Mr. David Jenkins',
      contact: '+234 809 118 4402 · d.jenkins@scholars.ng',
      role: 'Teacher',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'HOD Mathematics · SS 1, SS 2 & SS 3 Science',
      permissionsSummary: ROLE_CONFIG.Teacher.permissionsSummary,
      deviceStatus: 'Android 14 · Samsung S24',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=teacher&uid=MOB-TCH-30914',
    },
    {
      id: '3',
      mobileUserId: 'MOB-DRV-55108',
      name: 'Mr. Sunday Olatunji',
      contact: '+234 802 665 9012 · transport.b04@scholars.ng',
      role: 'Driver',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'Coaster Bus #04 · Route B-04 (Lekki Phase 1 – Ikate – Ajah)',
      permissionsSummary: ROLE_CONFIG.Driver.permissionsSummary,
      deviceStatus: 'Android 13 · Transit Tablet',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=driver&uid=MOB-DRV-55108',
    },
    {
      id: '4',
      mobileUserId: 'MOB-ADM-10204',
      name: 'Mrs. Folake Adeyemi (FCA)',
      contact: '+234 805 339 1100 · bursar.ikeja@scholars.ng',
      role: 'Admin',
      campus: 'Annex Campus · Ikeja GRA',
      scopeDetail: 'Campus Bursar & Operations Controller',
      permissionsSummary: ROLE_CONFIG.Admin.permissionsSummary,
      deviceStatus: 'iOS 18 · iPad Air + iPhone',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-IK02?role=admin&uid=MOB-ADM-10204',
    },
    {
      id: '5',
      mobileUserId: 'MOB-DRV-55192',
      name: 'Mr. Musa Abdullahi',
      contact: '+234 806 712 3389 · transport.abj01@scholars.ng',
      role: 'Driver',
      campus: 'Abuja Maitama Campus',
      scopeDetail: 'Hiace Bus #02 · Route ABJ-01 (Maitama – Wuse II – Asokoro)',
      permissionsSummary: ROLE_CONFIG.Driver.permissionsSummary,
      deviceStatus: 'Awaiting First Login',
      status: 'Invite Sent',
      inviteLink: 'https://app.scholars.ng/invite/CMP-AB04?role=driver&uid=MOB-DRV-55192',
    },
    {
      id: '6',
      mobileUserId: 'MOB-PRN-88940',
      name: 'Engr. & Dr. (Mrs.) Chidi Nwosu',
      contact: '+234 809 221 3401 · c.nwosu@nwosueng.ng',
      role: 'Parent',
      campus: 'Victoria Island Junior Campus',
      scopeDetail: 'Ward: Chisom Nwosu (Year 6 Emerald)',
      permissionsSummary: ROLE_CONFIG.Parent.permissionsSummary,
      deviceStatus: 'iOS 18 · iPhone 14',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-VI03?role=parent&uid=MOB-PRN-88940',
    },
  ]);

  const activeCampusMeta =
    CAMPUS_APP_INSTANCES[selectedCampus] || CAMPUS_APP_INSTANCES['All Campuses (Multi-Campus)'];

  // Preview next generated Mobile App User ID & role-scoped invite link
  const previewRoleMeta = ROLE_CONFIG[inviteRole];
  const deterministicSuffix = String(10000 + accounts.length * 731).slice(0, 5);
  const previewMobileUserId = `${previewRoleMeta.prefix}-${deterministicSuffix}`;
  const inviteCampusMeta =
    CAMPUS_APP_INSTANCES[inviteCampus] || CAMPUS_APP_INSTANCES['Main Campus · Lekki Phase 1'];
  const previewInviteLink = `${inviteCampusMeta.deepLinkPrefix}?role=${inviteRole.toLowerCase()}&uid=${previewMobileUserId}`;

  const handleCopy = (text: string, idKey: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientContact.trim()) return;

    const newEntry: MobileAppAccount = {
      id: String(Date.now()),
      mobileUserId: previewMobileUserId,
      name: recipientName.trim(),
      contact: recipientContact.trim(),
      role: inviteRole,
      campus: inviteCampus,
      scopeDetail:
        recipientScope.trim() ||
        `${inviteRole} Account · Scoped to ${inviteCampus}`,
      permissionsSummary: previewRoleMeta.permissionsSummary,
      deviceStatus: 'Invite Dispatched · Awaiting Login',
      status: 'Invite Sent',
      inviteLink: previewInviteLink,
    };

    setAccounts([newEntry, ...accounts]);
    setInviteSentBanner(
      `Assigned ${previewMobileUserId} to ${recipientName.trim()} (${inviteRole}) and dispatched role-scoped invite link!`
    );
    setRecipientName('');
    setRecipientContact('');
    setRecipientScope('');
    setTimeout(() => setInviteSentBanner(null), 5000);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesCampus =
      selectedCampus === 'All Campuses (Multi-Campus)' || acc.campus === selectedCampus;
    const matchesRole = roleFilter === 'All' || acc.role === roleFilter;
    return matchesCampus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Assigned Campus Mobile App Instance Banner */}
      <div className="bg-gradient-to-r from-[#0a2e70] via-[#146ef5] to-[#0d47a1] rounded-[1.5rem] p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <DevicePhoneMobileIcon className="w-4 h-4" />
              <span>Assigned Campus Mobile App Instance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {activeCampusMeta.appName}
            </h2>
            <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
              Every campus is provisioned with a dedicated mobile app instance. When you send a role-specific invite link below, a unique <strong>Mobile App User ID</strong> is automatically bound to the user&apos;s account so logging in immediately loads only the classes, wards, bus routes, or admin tools for their role and campus.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-black/25 px-3 py-1.5 rounded-full font-mono">
                App ID: <strong>{activeCampusMeta.appId}</strong>
              </span>
              <span className="bg-black/25 px-3 py-1.5 rounded-full font-mono">
                Bundle: <strong>{activeCampusMeta.bundleId}</strong>
              </span>
              <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-3 py-1.5 rounded-full font-semibold">
                ● {activeCampusMeta.version} · Live
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Parent App IDs</div>
              <div className="text-2xl font-bold mt-1">842</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">MOB-PRN-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Teacher App IDs</div>
              <div className="text-2xl font-bold mt-1">94</div>
              <div className="text-[11px] text-purple-200 mt-0.5">MOB-TCH-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Driver App IDs</div>
              <div className="text-2xl font-bold mt-1">28</div>
              <div className="text-[11px] text-amber-200 mt-0.5">MOB-DRV-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Admin App IDs</div>
              <div className="text-2xl font-bold mt-1">14</div>
              <div className="text-[11px] text-blue-200 mt-0.5">MOB-ADM-*</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Role-Specific Invite Generator + Live Mobile Account Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Send Role-Specific Invite & Bind Mobile App User ID */}
        <form
          onSubmit={handleSendInvite}
          className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Provision Mobile App ID &amp; Send Invite
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate a role-scoped deep link for Parents, Teachers, Bus Drivers, or Co-Admins.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] text-[11px] font-bold">
              <KeyIcon className="w-3.5 h-3.5" /> Auto-Bind ID
            </span>
          </div>

          {inviteSentBanner && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{inviteSentBanner}</span>
            </div>
          )}

          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              1. Select Stakeholder Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Parent', 'Teacher', 'Driver', 'Admin'] as MobileRoleType[]).map((r) => {
                const active = inviteRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInviteRole(r)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#146ef5] text-white border-[#146ef5] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {r}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Assigned Campus */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              2. Assigned Campus App Scope
            </label>
            <select
              value={inviteCampus}
              onChange={(e) => setInviteCampus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]"
            >
              <option>Main Campus · Lekki Phase 1</option>
              <option>Annex Campus · Ikeja GRA</option>
              <option>Victoria Island Junior Campus</option>
              <option>Abuja Maitama Campus</option>
            </select>
          </div>

          {/* Step 3: Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                3. Full Name / Title
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={
                  inviteRole === 'Parent'
                    ? 'e.g. Mr. & Mrs. B. Okafor'
                    : inviteRole === 'Driver'
                    ? 'e.g. Mr. Kolawole Balogun'
                    : inviteRole === 'Teacher'
                    ? 'e.g. Mrs. Grace Nwachukwu'
                    : 'e.g. Mr. Segun Lawal (VP)'
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                4. WhatsApp Phone or Email
              </label>
              <input
                type="text"
                required
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder="+234 803 000 0000 or email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>
          </div>

          {/* Step 4: Role Context Binding (Ward / Class / Route / Office) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              5. Role Assignment &amp; Data Scope
            </label>
            <input
              type="text"
              value={recipientScope}
              onChange={(e) => setRecipientScope(e.target.value)}
              placeholder={previewRoleMeta.defaultScopePlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
            />
          </div>

          {/* Auto-Generated Mobile App User ID & Role Deep-Link Preview Box */}
          <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Auto-Assigned Mobile App User ID
              </span>
              <span className="font-mono text-xs font-bold text-[#146ef5] bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                {previewMobileUserId}
              </span>
            </div>

            <div className="text-xs text-gray-700 leading-relaxed flex items-start gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>What they see on login:</strong> {previewRoleMeta.permissionsSummary}
              </span>
            </div>

            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
              <code className="text-[11px] text-gray-600 truncate flex-1">{previewInviteLink}</code>
              <button
                type="button"
                onClick={() => handleCopy(previewInviteLink, 'preview-link')}
                className="text-xs font-bold text-[#146ef5] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {copiedId === 'preview-link' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold text-sm py-3 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Bind {previewMobileUserId} &amp; Send {inviteRole} Invite Link
          </button>
        </form>

        {/* Right Column: Provisioned Mobile App Accounts & User IDs Table */}
        <div className="lg:col-span-7 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Campus Mobile App Accounts &amp; Bound User IDs
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredAccounts.length} accounts bound to{' '}
                <span className="font-semibold text-gray-800">{selectedCampus}</span>.
              </p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Parent', 'Teacher', 'Driver', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    roleFilter === r
                      ? 'bg-[#146ef5] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r === 'All' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredAccounts.map((acc) => {
              const roleMeta = ROLE_CONFIG[acc.role];
              return (
                <div
                  key={acc.id}
                  className="p-5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#146ef5] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {acc.mobileUserId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleMeta.badgeClass}`}
                      >
                        {acc.role}
                      </span>
                      <span className="text-xs font-medium text-gray-400">· {acc.campus}</span>
                    </div>

                    <div className="font-bold text-sm text-gray-900">{acc.name}</div>
                    <div className="text-xs text-gray-500">{acc.contact}</div>
                    <div className="text-xs font-medium text-gray-800">{acc.scopeDetail}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <QrCodeIcon className="w-3.5 h-3.5 text-[#146ef5] shrink-0" />
                      <span>{acc.permissionsSummary}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        acc.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {acc.status === 'Active' ? `● ${acc.deviceStatus}` : '● Invite Sent · Pending Login'}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.inviteLink, acc.id)}
                        className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#146ef5] text-xs font-semibold text-gray-700 hover:text-[#146ef5] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        {copiedId === acc.id ? 'Invite Link Copied!' : 'Copy Role Invite Link'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCampusOSPage() {
  const [activeTab, setActiveTab] = useState<CampusOSTab>('academic');
  const [selectedCampus, setSelectedCampus] = useState('All Campuses (Multi-Campus)');
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const scrollHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
  const [isScrollActive, setIsScrollActive] = useState(false);

  const tabs: { id: CampusOSTab; label: string; icon: any; badge?: string }[] = [
    { id: 'academic', label: 'Academic', icon: AcademicCapIcon, badge: 'Timetable' },
    { id: 'staff', label: 'Staff', icon: UserGroupIcon, badge: 'HR & KPIs' },
    { id: 'students', label: 'Students', icon: UsersIcon, badge: '1,248' },
    { id: 'parents', label: 'Parents', icon: HeartIcon, badge: '892' },
    { id: 'financials', label: 'Financials', icon: BanknotesIcon, badge: 'Bursary' },
    { id: 'library', label: 'Library', icon: BookOpenIcon, badge: 'Catalog' },
    { id: 'inventory', label: 'Inventory', icon: ArchiveBoxIcon, badge: 'Store' },
    { id: 'transportation', label: 'Transportation', icon: TruckIcon, badge: 'Fleet' },
    { id: 'admission', label: 'Admission', icon: ClipboardDocumentCheckIcon, badge: 'Pipeline' },
    { id: 'messaging', label: 'Messaging', icon: ChatBubbleLeftRightIcon, badge: 'Broadcast' },
    { id: 'mobile-app', label: 'Mobile App', icon: DevicePhoneMobileIcon, badge: 'App IDs' },
  ];

  const triggerScrollbarActivity = useCallback(() => {
    setIsScrollActive(true);
    if (scrollHideTimerRef.current) {
      clearTimeout(scrollHideTimerRef.current);
    }
    scrollHideTimerRef.current = setTimeout(() => {
      setIsScrollActive(false);
    }, 1000);
  }, []);

  const updateScrollMetrics = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setScrollMetrics({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
      return;
    }
    const widthPct = Math.max((clientWidth / scrollWidth) * 100, 15);
    const maxScroll = scrollWidth - clientWidth;
    const leftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setScrollMetrics({ thumbWidth: widthPct, thumbLeft: leftPct, hasOverflow: true });
  }, []);

  const handleTabsScroll = useCallback(() => {
    updateScrollMetrics();
    triggerScrollbarActivity();
  }, [updateScrollMetrics, triggerScrollbarActivity]);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      window.removeEventListener('resize', updateScrollMetrics);
      if (scrollHideTimerRef.current) clearTimeout(scrollHideTimerRef.current);
    };
  }, [updateScrollMetrics]);

  return (
    <div className="min-w-0 w-full max-w-full">
      {/* CampusPRO Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <HomeModernIcon className="w-3.5 h-3.5" /> Multi-Campus ERP
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Centralized institutional command across Academic, Staff, Students, Parents, Financials, Library, Inventory, Transportation, Admission, and Messaging.
          </p>
        </div>

        {/* Multi-Campus Selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm self-start sm:self-auto">
          <HomeModernIcon className="w-4 h-4 text-[#146ef5] shrink-0" />
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option>All Campuses (Multi-Campus)</option>
            <option>Main Campus · Lekki Phase 1</option>
            <option>Annex Campus · Ikeja GRA</option>
            <option>Victoria Island Junior Campus</option>
            <option>Abuja Maitama Campus</option>
          </select>
        </div>
      </div>

      {/* Horizontal Subtabs Bar — Sticky Outer Pill Container with Auto-Hiding 2px Scrollbar Underneath */}
      <div
        onMouseEnter={triggerScrollbarActivity}
        onMouseMove={triggerScrollbarActivity}
        onTouchStart={triggerScrollbarActivity}
        className="sticky top-24 z-20 w-full min-w-0 max-w-full"
      >
        <div className="w-full min-w-0 max-w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="w-full rounded-full overflow-hidden [clip-path:inset(0_round_9999px)]">
            <div
              ref={tabsScrollRef}
              onScroll={handleTabsScroll}
              className="w-full flex items-center gap-1.5 overflow-x-auto rounded-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
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
        </div>

        {/* 2px Auto-Hiding Scrollbar Positioned Just Under the Toggle Container */}
        <div
          onClick={(e) => {
            const el = tabsScrollRef.current;
            if (!el) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            el.scrollTo({ left: clickRatio * (el.scrollWidth - el.clientWidth), behavior: 'smooth' });
            triggerScrollbarActivity();
          }}
          className={`mt-1 mx-6 h-[2px] bg-gray-200/80 rounded-full relative overflow-hidden cursor-pointer transition-opacity duration-300 ${
            isScrollActive && scrollMetrics.hasOverflow
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute top-0 bottom-0 h-[2px] bg-gray-400 hover:bg-[#146ef5] rounded-full transition-all duration-75"
            style={{
              width: `${scrollMetrics.thumbWidth}%`,
              left: `${scrollMetrics.thumbLeft}%`,
            }}
          />
        </div>
      </div>

      {/* Active CampusOS Subtab Content — 10px below primary toggle container */}
      <div className="mt-[4px]">
        {activeTab === 'academic' && <AcademicOperationsHub />}
        {activeTab === 'staff' && <PerformanceDashboard />}
        {activeTab === 'students' && <EnrollmentDashboard />}
        {activeTab === 'parents' && <ParentsDashboard />}
        {activeTab === 'financials' && <FeesDashboard />}
        {activeTab === 'library' && <LibraryDashboard />}
        {activeTab === 'inventory' && <ProcurementDashboard />}
        {activeTab === 'transportation' && <TransportDashboard />}
        {activeTab === 'admission' && <AdmissionsDashboard />}
        {activeTab === 'messaging' && <MessagingDashboard />}
        {activeTab === 'mobile-app' && <MobileAppDashboard selectedCampus={selectedCampus} />}
      </div>
    </div>
  );
}
