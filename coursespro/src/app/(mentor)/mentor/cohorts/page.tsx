"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { coursesApi } from '@/lib/api';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  VideoCameraIcon, 
  DocumentCheckIcon, 
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  current_stage_number: number;
  current_xp: number;
  streak_days: number;
  status: string;
}

interface CohortCard {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  program_title: string;
  duration_weeks: number;
  start_date: string;
  end_date: string;
  meeting_days: string;
  meeting_time: string;
  location_type: string;
  difficulty_level: string;
  enrolled_count: number;
  pending_reviews_count: number;
  completed_reviews_count: number;
  students: StudentInfo[];
}

export default function MentorCohorts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCohortId, setExpandedCohortId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['mentor-cohorts'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/cohorts');
      return res.data;
    }
  });

  const cohorts: CohortCard[] = data?.cohorts || [];

  // Filter cohorts by search term (matches cohort title, program, or student names)
  const filteredCohorts = cohorts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesCohort = 
      c.title.toLowerCase().includes(q) || 
      (c.program_title && c.program_title.toLowerCase().includes(q)) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q));
    const matchesStudent = c.students?.some((s) => 
      s.name.toLowerCase().includes(q) || (s.email && s.email.toLowerCase().includes(q))
    );
    return matchesCohort || matchesStudent;
  });

  const totalMentees = cohorts.reduce((acc, c) => acc + (c.enrolled_count || 0), 0);
  const totalPendingReviews = cohorts.reduce((acc, c) => acc + (c.pending_reviews_count || 0), 0);
  const totalCompletedReviews = cohorts.reduce((acc, c) => acc + (c.completed_reviews_count || 0), 0);

  const toggleExpand = (id: string) => {
    setExpandedCohortId((prev) => (prev === id ? null : id));
  };

  return (
    <MotionRise className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] mb-2 border border-blue-100">
            <AcademicCapIcon className="w-3.5 h-3.5" />
            Instructor Cohort Supervision
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assigned Cohorts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Supervise enrolled student builders, monitor stage completions, and launch live coworking studios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/classroom"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <VideoCameraIcon className="w-4 h-4" />
            Open Live Studio
          </Link>
          <Link
            href="/mentor/reviews"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <DocumentCheckIcon className="w-4 h-4 text-gray-500" />
            Review Queue
            {totalPendingReviews > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalPendingReviews}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Cohorts</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{cohorts.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
            <UserGroupIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Mentees</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalMentees}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <SparklesIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Evaluations</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{totalPendingReviews}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ClockIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluations Signed</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">{totalCompletedReviews}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <DocumentCheckIcon className="w-6 h-6" />
          </div>
        </div>
      </MotionStagger>

      {/* Search Input */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by cohort, program, or student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent transition shadow-sm"
        />
      </div>

      {/* Cohorts List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
        </div>
      ) : filteredCohorts.length > 0 ? (
        <div className="space-y-6">
          {filteredCohorts.map((cohort) => {
            const isExpanded = expandedCohortId === cohort.id;
            const studentsList = cohort.students || [];

            return (
              <div 
                key={cohort.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Cohort Main Card */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#146ef5] border border-blue-100">
                          {cohort.program_title || "Curriculum Track"}
                        </span>
                        {cohort.difficulty_level && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                            {cohort.difficulty_level}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                          {cohort.duration_weeks ? `${cohort.duration_weeks} Weeks` : 'Active'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">{cohort.title}</h2>
                      {cohort.subtitle && (
                        <p className="text-sm text-gray-500">{cohort.subtitle}</p>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        href="/dashboard/classroom"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#146ef5] text-xs font-semibold rounded-lg transition-colors"
                      >
                        <VideoCameraIcon className="w-4 h-4" />
                        Launch Classroom
                      </Link>
                      <Link
                        href="/mentor/reviews"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors border border-gray-200"
                      >
                        <DocumentCheckIcon className="w-4 h-4 text-gray-500" />
                        Review Queue ({cohort.pending_reviews_count || 0})
                      </Link>
                      <button
                        onClick={() => toggleExpand(cohort.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide Roster <ChevronUpIcon className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            View Mentees ({studentsList.length || cohort.enrolled_count}) <ChevronDownIcon className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Schedule & Metrics Sub-Bar */}
                  <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Live Days</span>
                        <span className="font-medium text-gray-800">{cohort.meeting_days || "Scheduled Weekly"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Class Time</span>
                        <span className="font-medium text-gray-800">{cohort.meeting_time || "Flexible / TBA"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Enrolled Mentees</span>
                        <span className="font-bold text-gray-900">{cohort.enrolled_count} Students</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DocumentCheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Evaluations Signed</span>
                        <span className="font-bold text-emerald-700">{cohort.completed_reviews_count || 0} Projects</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Student Roster Table */}
                {isExpanded && (
                  <div className="bg-gray-50/70 border-t border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-blue-600" />
                        Mentee Roster ({studentsList.length})
                      </h4>
                      <span className="text-xs text-gray-500">
                        Showing enrolled students for {cohort.title}
                      </span>
                    </div>

                    {studentsList.length > 0 ? (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-100/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                              <th className="py-3 px-4">Student</th>
                              <th className="py-3 px-4">Current Milestone</th>
                              <th className="py-3 px-4 text-center">XP Points</th>
                              <th className="py-3 px-4 text-center">Streak</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {studentsList.map((student) => (
                              <tr key={student.id} className="hover:bg-blue-50/40 transition-colors">
                                <td className="py-3 px-4 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                                    {student.avatar ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img 
                                        src={student.avatar} 
                                        alt={student.name} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      student.name.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{student.name}</p>
                                    <p className="text-[11px] text-gray-500">{student.email}</p>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Stage {student.current_stage_number || 1}
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-center font-bold text-gray-900">
                                  {student.current_xp ? `${student.current_xp.toLocaleString()} XP` : '0 XP'}
                                </td>

                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold">
                                    <FireIcon className="w-3.5 h-3.5 text-amber-500" />
                                    {student.streak_days || 0}d
                                  </span>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <Link
                                    href={`/dashboard/messages?user=${student.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-[#146ef5] hover:border-blue-200 rounded-lg font-medium transition shadow-xs"
                                  >
                                    <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                    Direct Message
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <UserGroupIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">No students enrolled yet in this cohort</p>
                        <p className="text-xs text-gray-500 mt-1">Students will appear here as soon as admissions finalize.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Cohorts Found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery 
              ? "No cohorts matched your search query. Try adjusting your filters." 
              : "You are not currently assigned to any cohorts. Contact your platform administrator to link your instructor profile."}
          </p>
        </div>
      )}
    </MotionRise>
  );
}
