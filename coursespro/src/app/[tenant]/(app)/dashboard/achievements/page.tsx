"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  TrophyIcon, 
  LockClosedIcon, 
  SparklesIcon, 
  FireIcon,
  CheckBadgeIcon,
  StarIcon,
  AcademicCapIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophySolid, 
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid 
} from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  icon_url?: string;
  earned: boolean;
  earned_at?: string;
}

export default function AchievementsPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'certificate'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/achievements');
      return res.data || { achievements: [], stats: { total: 0, earned: 0, locked: 0, streak_days: 0, current_xp: 0 } };
    },
    enabled: !!user,
  });

  const achievements: Achievement[] = data?.achievements || [];
  const stats = data?.stats || { 
    total: achievements.length, 
    earned: achievements.filter(a => a.earned).length, 
    locked: achievements.filter(a => !a.earned).length,
    streak_days: 0,
    current_xp: 0
  };

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.earned;
    if (filter === 'locked') return !a.earned;
    if (filter === 'certificate') return a.type === 'CERTIFICATE';
    return true;
  });

  const completionPct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;

  return (
    <MotionRise className="space-y-8 pb-16">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
              Builder Milestones & Honors
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Achievements & Badges</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Track key milestones, sprint streaks, and professional commendations earned across your curriculum projects.
          </p>
        </div>

        {/* Milestone Progress KPI */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-900 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-amber-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <TrophySolid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Badges Unlocked</p>
              <p className="font-extrabold text-sm">{stats.earned} of {stats.total} ({completionPct}%)</p>
            </div>
          </div>

          <div className="bg-orange-50 text-orange-800 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-orange-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FireIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Active Streak</p>
              <p className="font-extrabold text-sm">{stats.streak_days} Day{stats.streak_days === 1 ? '' : 's'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Banner */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
          <div className="flex items-center gap-2">
            <StarSolid className="w-4 h-4 text-amber-400" />
            <span>Overall Milestone Progress</span>
          </div>
          <span className="text-[#146ef5] font-extrabold">{completionPct}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-[#146ef5] rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          ></div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto hide-scrollbar self-start">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'all' 
              ? 'bg-white text-gray-900 shadow-xs' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          All Badges ({achievements.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'unlocked' 
              ? 'bg-white text-gray-900 shadow-xs' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Unlocked ({stats.earned})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'locked' 
              ? 'bg-white text-gray-900 shadow-xs' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          In Progress ({stats.locked})
        </button>
        <button
          onClick={() => setFilter('certificate')}
          className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'certificate' 
              ? 'bg-white text-gray-900 shadow-xs' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Diplomas & Certificates
        </button>
      </div>

      {/* Grid of Badges */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 font-medium text-xs">Loading achievement credentials...</p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center shadow-xs">
          <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-gray-900">No achievements in this view</h3>
          <p className="text-gray-400 text-xs mt-1">Try switching to the 'All Badges' filter.</p>
        </div>
      ) : (
        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredAchievements.map((a) => (
            <div 
              key={a.id} 
              className={`bg-white rounded-[2rem] p-6 border shadow-xs flex flex-col justify-between transition-all ${
                a.earned 
                  ? 'border-amber-200/80 hover:shadow-md hover:border-amber-300 bg-gradient-to-b from-amber-50/20 to-white' 
                  : 'border-gray-100 opacity-70 hover:opacity-90'
              }`}
            >
              <div>
                {/* Header Icon & Status Stamp */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    a.earned 
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 shadow-md shadow-amber-200/50' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {a.icon_url ? (
                      <img src={a.icon_url} alt={a.title} className="w-8 h-8 object-contain" />
                    ) : a.type === 'CERTIFICATE' ? (
                      <AcademicCapIcon className="w-7 h-7" />
                    ) : a.earned ? (
                      <CheckBadgeSolid className="w-7 h-7 text-amber-950/80" />
                    ) : (
                      <LockClosedIcon className="w-6 h-6" />
                    )}
                  </div>

                  {a.earned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckBadgeSolid className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                      <LockClosedIcon className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1.5">{a.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{a.description}</p>
              </div>

              {/* Footer Meta */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {a.earned ? (
                  <span className="text-[11px] font-semibold text-gray-500">
                    Earned {a.earned_at ? new Date(a.earned_at).toLocaleDateString() : 'Active'}
                  </span>
                ) : (
                  <Link 
                    href="/dashboard/journey" 
                    className="text-[11px] font-bold text-[#146ef5] hover:underline"
                  >
                    View Curriculum Stage →
                  </Link>
                )}

                {a.type === 'CERTIFICATE' && (
                  <Link 
                    href="/dashboard/certificates" 
                    className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    <CheckBadgeIcon className="w-3.5 h-3.5" /> Diploma
                  </Link>
                )}
              </div>
            </div>
          ))}
        </MotionStagger>
      )}
    </MotionRise>
  );
}
