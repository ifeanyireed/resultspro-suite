'use client';

import React from 'react';
import { 
  PlayIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  UsersIcon,
  VideoCameraIcon,
  SparklesIcon,
  BookOpenIcon,
  ClockIcon,
  CodeBracketSquareIcon
} from '@heroicons/react/24/outline';
import { FireIcon as FireSolid, StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { coursesApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

export default function LearnerDashboard() {
const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  const { data: dashboardData, isLoading: loading, error } = useQuery({
    queryKey: ['student-dashboard-summary', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/dashboard/summary');
      return res.data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (dashboardData && dashboardData.has_enrollment === false) {
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          const roles = payload.roles || [];
          
          if (roles.includes('tenant-admin') || roles.includes('superadmin') || roles.includes('platform-admin')) {
            router.push('/admin');
            return;
          } else if (roles.includes('mentor')) {
            router.push('/mentor');
            return;
          }
        } catch (e) {
          // Ignore
        }
      }
      router.push('/');
    } else if (dashboardData && dashboardData.has_enrollment === true) {
      Cookies.remove('selected_cohort_id');
    }
  }, [dashboardData, router, token]);

  if (!mounted || !user || loading || !dashboardData || dashboardData.has_enrollment === false) return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Student'}.</h1>
          <p className="text-sm text-gray-500 mt-1">{dashboardData.cohort_name || 'No Cohort'} • Stage {dashboardData.enrollment?.current_stage || 1}: {dashboardData.current_module?.title || 'Overview'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <VideoCameraIcon className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            Join Coworking Room
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-blue-600/20 transition-all flex items-center gap-2">
            <PlayIcon className="w-4 h-4" strokeWidth={2} />
            Resume Module
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Card 1: Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full filter blur-[3rem] opacity-60"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-medium text-white/90">Consistency</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <FireSolid className="w-5 h-5 text-yellow-300" />
            </div>
          </div>
          
          <div className="z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-bold tracking-tight text-white font-sans">{dashboardData.enrollment?.streak_days || 0}</h2>
              <span className="text-white/80 font-medium">Days</span>
            </div>
            <p className="text-sm text-white/70 mt-2 font-medium">Top 5% in your cohort</p>
          </div>
        </div>

        {/* Card 2: Progress */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-500">Journey</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpenIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">{Math.round(dashboardData.enrollment?.progress || 0)}%</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dashboardData.enrollment?.progress || 0}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">{dashboardData.enrollment?.completed_stages || 0}/{dashboardData.enrollment?.total_stages || 12} stages completed</p>
          </div>
        </div>

        {/* Card 3: Points/XP */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-500">Builder XP</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrophyIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">{(dashboardData.enrollment?.current_xp || 0).toLocaleString()}</h2>
            <div className="flex items-center gap-1.5 mt-3">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-bold text-gray-700">Level: {dashboardData.enrollment?.level || 'Novice'}</p>
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming */}
        <div className="bg-[#0B1021] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-[2rem]"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-lg font-medium text-blue-200">Next Milestone</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
              <CodeBracketSquareIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div className="z-10">
            <h4 className="text-xl font-bold text-white mb-1">{dashboardData.upcoming_milestone?.title || "No Upcoming Milestones"}</h4>
            <p className="text-sm text-slate-400 mb-4">{dashboardData.upcoming_milestone?.description || "Check back later."}</p>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              <ClockIcon className="w-4 h-4" strokeWidth={2} />
              {dashboardData.upcoming_milestone?.time || 'TBD'}
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Left Column: Up Next & AI Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Up Next</span>
              {dashboardData.current_module?.duration && (
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" strokeWidth={2} /> {dashboardData.current_module.duration}
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{dashboardData.current_module?.title || "Next Module Pending"}</h2>
            <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
              {dashboardData.current_module?.description || "No description available for the next module."}
            </p>
            

            
            <button className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <PlayIcon className="w-5 h-5" strokeWidth={2} />
              Start Lesson
            </button>
          </div>

          {/* Submission Feedback */}
                    {dashboardData.recent_feedback ? (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h3>
            <div className="border border-green-100 bg-green-50/50 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src="/avatars/mentor.jpg" alt="Mentor" className="w-8 h-8 rounded-full object-cover" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=Chidi&background=10B981&color=fff'} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{dashboardData.recent_feedback?.status === 'APPROVED' ? 'Approved by' : 'Reviewed by'} {dashboardData.recent_feedback?.mentor_name || 'Mentor'}</h4>
                    <p className="text-xs text-gray-500">{dashboardData.recent_feedback?.project_name || 'Project'}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${dashboardData.recent_feedback?.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>{dashboardData.recent_feedback?.status === 'APPROVED' ? 'Passed' : 'Revision'}</span>
              </div>
              <p className="text-sm text-gray-700 italic border-l-2 border-green-300 pl-3 py-1">
                "{dashboardData.recent_feedback?.content}"
              </p>
            </div>
          </div>
          ) : null}
        </div>

        {/* Right Column: Classroom & Cohort */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Live Classroom Status */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Classroom
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{dashboardData.classroom?.length || 0} Online</span>
            </div>

            <div className="space-y-4">
              {dashboardData.classroom?.length > 0 ? dashboardData.classroom.map((peer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={peer.avatar || "/avatars/character1.jpg"} alt={peer.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" onError={(e) => e.currentTarget.src='/avatars/character1.jpg'} />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{peer.name}</h4>
                      <p className="text-xs text-blue-600 font-medium">{peer.action}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">Join</button>
                </div>
              )) : (
                <div className="text-sm text-gray-500 italic py-4">No other peers online right now.</div>
              )}
            </div>
          </div>

          {/* Gamification / Leaderboard snippet */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
              Weekly Top Builders
              <UsersIcon className="w-5 h-5 text-gray-400" strokeWidth={2} />
            </h3>
            
            <div className="space-y-4">
              {dashboardData.leaderboard?.length > 0 ? dashboardData.leaderboard.map((student: any) => (
                <div key={student.rank} className={`flex items-center gap-4 p-3 rounded-xl ${student.is_me ? 'bg-blue-50/50 border border-blue-100' : ''} ${student.rank === 1 ? 'bg-yellow-50/50 border border-yellow-100' : ''}`}>
                  <span className={`text-lg font-bold w-4 text-center ${student.rank === 1 ? 'text-yellow-600' : student.rank === 2 ? 'text-gray-400' : student.rank === 3 ? 'text-orange-400' : 'text-gray-300'}`}>{student.rank}</span>
                  <img src={student.avatar || `/avatars/character${(student.rank % 4) + 1}.jpg`} alt={student.name} className={`w-8 h-8 rounded-full border object-cover ${student.rank === 1 ? 'border-yellow-200' : 'border-gray-200'}`} onError={(e) => e.currentTarget.src=`/avatars/character${(student.rank % 4) + 1}.jpg`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{student.name} {student.is_me && '(You)'}</h4>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{student.xp} XP</span>
                </div>
              )) : (
                <div className="text-sm text-gray-500 italic py-4">Leaderboard is empty.</div>
              )}
            </div>
            
            <button className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors py-2 text-center">
              View Full Leaderboard
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
