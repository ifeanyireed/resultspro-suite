'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  SparklesIcon, 
  BookOpenIcon, 
  ArrowRightIcon, 
  ClockIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';
import Cookies from 'js-cookie';

interface UnenrolledDashboardViewProps {
  user: any;
  tenantSlug?: string;
}

export default function UnenrolledDashboardView({ user, tenantSlug }: UnenrolledDashboardViewProps) {
  const router = useRouter();
  const firstName = user?.name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Learner';

  const { data: cohortsData, isLoading } = useQuery({
    queryKey: ['public-cohorts-for-dashboard', tenantSlug],
    queryFn: async () => {
      const res = await coursesApi.get('/api/public/cohorts');
      return res.data;
    }
  });

  const cohorts = cohortsData?.cohorts || [];

  const handleEnroll = (cohortId: string) => {
    Cookies.set('selected_cohort_id', cohortId, { expires: 1, path: '/' });
    router.push('/onboarding/orientation');
  };

  return (
    <div className="w-full py-4 space-y-10">
      {/* ── Welcome Banner ── */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0B1021] via-[#101735] to-[#1E1B4B] text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border border-blue-400/20">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            <span>Welcome to the Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Welcome, {firstName}.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-300">
              Let's choose your cohort.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            You are one step away from starting your hands-on journey. Enroll in an active cohort below to meet your dedicated mentor, collaborate with classmates, and unlock your daily curriculum.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#cohorts-grid"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 group"
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Browse Cohorts</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link 
              href="/the-standard"
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all flex items-center gap-2"
            >
              <span>Explore The Standard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Available Cohorts Section ── */}
      <div id="cohorts-grid" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              Available Learning Cohorts
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a cohort to initiate your orientation and join your learning room.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full w-fit">
            {cohorts.length} Active {cohorts.length === 1 ? 'Program' : 'Programs'}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-80 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-24 h-5 bg-gray-200 rounded-md" />
                  <div className="w-3/4 h-7 bg-gray-200 rounded-md" />
                  <div className="w-full h-12 bg-gray-100 rounded-md" />
                </div>
                <div className="w-full h-10 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : cohorts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No open cohorts at this moment</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              New cohorts are opening soon. You can explore learning resources in the store or read about our curriculum standards.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link 
                href="/dashboard/store"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Browse Store
              </Link>
              <Link 
                href="/the-standard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                The Standard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort: any) => {
              const priceNum = Number(cohort.price) || 0;
              const currency = cohort.currency === 'USD' ? '$' : '₦';
              const isFree = priceNum <= 0;

              return (
                <div 
                  key={cohort.id} 
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                        {cohort.difficulty_level || 'All Levels'}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {isFree ? (
                          <span className="text-emerald-600 uppercase">Free</span>
                        ) : (
                          `${currency}${priceNum.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5">
                        {cohort.title || cohort.program?.title}
                      </h3>
                      {cohort.subtitle && (
                        <p className="text-xs font-medium text-blue-600 mb-2">{cohort.subtitle}</p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {cohort.description || cohort.program?.description || 'Hands-on project-based cohort learning with industry mentors.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{cohort.duration_weeks || 12} Weeks Intensive</span>
                      </div>
                      {cohort.meeting_days && (
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          <span>{cohort.meeting_days} {cohort.meeting_time ? `@ ${cohort.meeting_time}` : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span>{cohort.enrolled_count || 0} students enrolled</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEnroll(cohort.id)}
                      className="w-full bg-[#146ef5] hover:bg-[#0f5bcc] text-white text-sm font-semibold py-3 px-4 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <span>Enroll in this Cohort</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
