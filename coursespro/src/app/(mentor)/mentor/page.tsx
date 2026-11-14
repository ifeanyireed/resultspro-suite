"use client";
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  CheckCircleIcon, 
  DocumentDuplicateIcon, 
  VideoCameraIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  ClockIcon,
  BanknotesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  ArrowTrendingUpIcon, 
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  DocumentCheckIcon
} from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface Submission {
  id: string;
  user_id: string;
  student_name?: string;
  student_avatar?: string;
  cohort_id: string;
  cohort_title?: string;
  stage_number: number;
  project_title: string;
  repo_url: string;
  figma_url: string;
  live_demo_url: string;
  notes: string;
  submitted_at: string;
}

interface MentorSession {
  cohort_name: string;
  module_title: string;
  live_date: string;
  meeting_url: string;
}

export default function MentorDashboard() {
  const { user } = useAuthStore();

  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery<Submission[]>({
    queryKey: ['mentor-submissions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/submissions');
      return res.data.submissions || [];
    }
  });

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<MentorSession[]>({
    queryKey: ['mentor-sessions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/sessions');
      return res.data.sessions || [];
    }
  });

  const { data: profileData } = useQuery({
    queryKey: ['mentor-profile-dashboard', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });

  const profile = profileData?.profile || {};
  const payoutsEnabled = profileData?.payouts_enabled ?? true;
  const cohortAssignments = profileData?.cohort_assignments || [];
  const mentorName = profile.full_name || user?.name || 'Instructor';
  const totalReviews = profile.total_reviews || 0;
  const avgRating = profile.avg_rating > 0 ? profile.avg_rating.toFixed(1) : '5.0';
  const totalEarnings = profileData?.total_earnings || (totalReviews * 15000);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MotionRise className="space-y-8 pb-16">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] border border-blue-100">
              <AcademicCapIcon className="w-3.5 h-3.5 text-[#146ef5]" />
              Mentor Command Center
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {mentorName.split(' ')[0]}.
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            {profile.specialization || 'Technical Instructor'} · Review student submissions, run live cohort workshops, and track code review velocity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/classroom"
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <VideoCameraIcon className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            Live Classroom Studio
          </Link>
          <Link
            href="/mentor/reviews"
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <DocumentDuplicateIcon className="w-4 h-4" strokeWidth={2} />
            Review Queue ({submissions.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Reviews */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0b3882] rounded-[2rem] p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-sm font-semibold text-white/80">Pending Queue</h3>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <DocumentDuplicateIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="z-10 mt-6">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black tracking-tight">{submissions.length}</h2>
              <span className="text-xs text-white/70 font-medium">Projects</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {submissions.length > 0 ? 'Action required by mentor' : 'All student queues clear!'}
            </p>
          </div>
        </div>

        {/* Card 2: Total Reviews Completed */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-500">Evaluations Signed</h3>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{totalReviews}</h2>
              <span className="text-xs text-gray-400 font-medium">Approved</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Capstones signed off
            </p>
          </div>
        </div>

        {/* Card 3: Mentor Rating */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-500">Instructor Rating</h3>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <StarSolid className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{avgRating}</h2>
              <span className="text-xs text-amber-500 font-bold">★ / 5.0</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              From student evaluations
            </p>
          </div>
        </div>

        {/* Card 4: Total Earnings or Cohorts */}
        {payoutsEnabled ? (
          <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-gray-500">Tuition Bounties</h3>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BanknotesIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(totalEarnings)}</h2>
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                Cleared & Pending Escrow
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-gray-500">Active Cohorts</h3>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{cohortAssignments.length}</h2>
                <span className="text-xs text-gray-400 font-medium">Cohorts</span>
              </div>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                Under active mentorship
              </p>
            </div>
          </div>
        )}
      </MotionStagger>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Left Column: Submissions Queue Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xs border border-gray-100 p-6 md:p-7">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <DocumentDuplicateIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="font-bold text-gray-900 text-lg">Submissions Requiring Review</h3>
              </div>
              <Link 
                href="/mentor/reviews"
                className="text-xs font-bold text-[#146ef5] hover:underline flex items-center gap-1"
              >
                View Full Queue ({submissions.length}) <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>

            {loadingSubmissions ? (
              <div className="py-12 text-center text-xs text-gray-400">Loading pending submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Your Queue is Clean!</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  All submitted student code repositories and capstone blocks have been evaluated.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {submissions.slice(0, 4).map((sub) => (
                  <div 
                    key={sub.id}
                    className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-white">
                        <img 
                          src={sub.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.student_name || 'Student')}&background=146ef5&color=fff`} 
                          alt={sub.student_name || 'Student'} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {sub.project_title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {sub.student_name || 'Student'} · <span className="font-semibold text-gray-700">Stage {sub.stage_number}</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/mentor/reviews"
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#146ef5] hover:text-white text-[#146ef5] border border-blue-200 text-xs font-bold transition-all shrink-0 shadow-2xs"
                    >
                      Grade Now
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Cohorts Badge Cards */}
          <div className="bg-white rounded-[2rem] shadow-xs border border-gray-100 p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-gray-900 text-base">Assigned Mentorship Cohorts</h3>
              </div>
              <Link href="/mentor/cohorts" className="text-xs font-bold text-[#146ef5] hover:underline">
                Manage
              </Link>
            </div>

            {cohortAssignments.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No active cohort assignments currently.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {cohortAssignments.map((cohortName: string, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#146ef5] flex items-center justify-center shrink-0">
                      <AcademicCapIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 line-clamp-1">{cohortName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Sessions & Live Classroom */}
        <div className="lg:col-span-3 space-y-6">
          {/* Live Classes Card */}
          <div className="bg-white rounded-[2rem] shadow-xs border border-gray-100 p-6 md:p-7 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <VideoCameraIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-base">Live Cohort Sessions</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {sessions.length} Scheduled
              </span>
            </div>

            <div className="space-y-3.5">
              {loadingSessions ? (
                <div className="py-8 text-center text-xs text-gray-400">Loading schedule...</div>
              ) : sessions.length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-2 stroke-1" />
                  <p className="text-xs text-gray-400">No live workshops scheduled for this sprint.</p>
                </div>
              ) : (
                sessions.slice(0, 4).map((s, idx) => {
                  const d = new Date(s.live_date);
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-emerald-200 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{s.module_title}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{s.cohort_name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">
                          {d.toLocaleDateString()} @ {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {s.meeting_url ? (
                        <a 
                          href={s.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                        >
                          Join
                        </a>
                      ) : (
                        <Link
                          href="/dashboard/classroom"
                          className="px-3 py-1.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold shrink-0 hover:bg-gray-300"
                        >
                          Studio
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <Link
              href="/mentor/sessions"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              View Full Calendar & 1:1 Bookings →
            </Link>
          </div>

          {/* Quick Mentorship Tips Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-6 text-white shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4" />
              SLA Standard & Review Policy
            </div>
            <h4 className="text-sm font-bold leading-snug">
              24-Hour Code Review Commitment
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating submissions within 24 hours accelerates student graduation and qualifies you for maximum SLA bounty multipliers.
            </p>
            <div className="pt-2">
              <Link 
                href="/mentor/settings"
                className="text-xs font-bold text-blue-300 hover:text-white transition-colors"
              >
                Configure Availability & Calendar →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionRise>
  );
}
