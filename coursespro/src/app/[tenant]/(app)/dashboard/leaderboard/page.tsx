"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  TrophyIcon, 
  FireIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolid } from '@heroicons/react/24/solid';

interface Leader {
  rank: number;
  user_id: string;
  name: string;
  avatar: string;
  username?: string;
  headline?: string;
  cohort_id: string;
  cohort_title?: string;
  current_xp: number;
  streak_days: number;
  is_me: boolean;
}

interface CohortSummary {
  id: string;
  title: string;
  slug: string;
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedCohort, user?.id],
    queryFn: async () => {
      const url = selectedCohort && selectedCohort !== 'all' 
        ? `/api/leaderboard?cohort_id=${encodeURIComponent(selectedCohort)}` 
        : '/api/leaderboard';
      const res = await coursesApi.get(url);
      return res.data || { leaders: [], cohorts: [], my_streak: 0, my_rank: 0, my_xp: 0 };
    },
    enabled: !!user,
  });

  const leaders: Leader[] = data?.leaders || [];
  const cohorts: CohortSummary[] = data?.cohorts || [];
  const myStreak: number = data?.my_streak || 0;
  const myRank: number = data?.my_rank || 0;
  const myXP: number = data?.my_xp || 0;

  // Filter leaders by search query
  const filteredLeaders = leaders.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      (l.headline && l.headline.toLowerCase().includes(q)) ||
      (l.username && l.username.toLowerCase().includes(q)) ||
      (l.cohort_title && l.cohort_title.toLowerCase().includes(q))
    );
  });

  const topThree = leaders.slice(0, 3);
  const remainingLeaders = filteredLeaders.filter((l) => !searchQuery.trim() || true);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
              XP & Builder Hall of Fame
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cohort Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Rankings update in real time as you complete curriculum blocks, ship capstones, assist peers, and maintain your sprint coding streak.
          </p>
        </div>

        {/* Streak & XP Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 text-orange-700 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-orange-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FireIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Your Streak</p>
              <p className="font-extrabold text-sm">{myStreak} Day{myStreak === 1 ? '' : 's'}</p>
            </div>
          </div>

          <div className="bg-blue-50 text-[#146ef5] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-blue-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#146ef5]">
              <TrophySolid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Your Standing</p>
              <p className="font-extrabold text-sm">
                {myRank > 0 ? `#${myRank}` : 'Unranked'} · {myXP.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Silver - 2nd Place */}
          {topThree[1] && (
            <div className="relative bg-gradient-to-b from-gray-50/80 to-white rounded-[2rem] p-6 border border-gray-200 shadow-sm flex flex-col items-center text-center order-2 md:order-1 hover:shadow-md transition-all">
              <div className="absolute -top-3.5 bg-gray-200 text-gray-700 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-gray-300 shadow-xs flex items-center gap-1">
                <TrophySolid className="w-3.5 h-3.5 text-gray-500" />
                2nd Place
              </div>
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-300 to-gray-100 mt-2 mb-3">
                <img 
                  src={topThree[1].avatar} 
                  alt={topThree[1].name} 
                  className="w-full h-full rounded-full object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                  2
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{topThree[1].name} {topThree[1].is_me && '(You)'}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mb-3">{topThree[1].headline || 'Cohort Builder'}</p>
              <div className="w-full bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#146ef5] font-bold">{topThree[1].current_xp.toLocaleString()} XP</span>
                <span className="text-orange-500 flex items-center gap-1">
                  <FireIcon className="w-3.5 h-3.5" /> {topThree[1].streak_days}d Streak
                </span>
              </div>
              <div className="mt-4 flex gap-2 w-full">
                {topThree[1].username ? (
                  <Link 
                    href={`/portfolio/${topThree[1].username}`}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GlobeAltIcon className="w-3.5 h-3.5" /> Portfolio
                  </Link>
                ) : null}
                <Link 
                  href={`/dashboard/messages?user=${topThree[1].user_id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#146ef5] bg-blue-50 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" /> Message
                </Link>
              </div>
            </div>
          )}

          {/* Gold - 1st Place */}
          {topThree[0] && (
            <div className="relative bg-gradient-to-b from-amber-50/70 via-yellow-50/30 to-white rounded-[2rem] p-6 border-2 border-amber-300 shadow-md flex flex-col items-center text-center order-1 md:order-2 hover:shadow-lg transition-all scale-[1.02]">
              <div className="absolute -top-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 animate-bounce">
                <TrophySolid className="w-4 h-4 text-yellow-200" />
                Champion #1
              </div>
              <div className="relative w-24 h-24 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 mt-2 mb-3 shadow-md">
                <img 
                  src={topThree[0].avatar} 
                  alt={topThree[0].name} 
                  className="w-full h-full rounded-full object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                  1
                </span>
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">{topThree[0].name} {topThree[0].is_me && '(You)'}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mb-3">{topThree[0].headline || 'Lead Sprint Architect'}</p>
              <div className="w-full bg-amber-50/50 rounded-xl p-3 border border-amber-200/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-800 font-extrabold text-sm">{topThree[0].current_xp.toLocaleString()} XP</span>
                <span className="text-orange-600 flex items-center gap-1 font-bold">
                  <FireIcon className="w-4 h-4 text-orange-500" /> {topThree[0].streak_days}d Streak
                </span>
              </div>
              <div className="mt-4 flex gap-2 w-full">
                {topThree[0].username ? (
                  <Link 
                    href={`/portfolio/${topThree[0].username}`}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GlobeAltIcon className="w-3.5 h-3.5" /> Portfolio
                  </Link>
                ) : null}
                <Link 
                  href={`/dashboard/messages?user=${topThree[0].user_id}`}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" /> Message
                </Link>
              </div>
            </div>
          )}

          {/* Bronze - 3rd Place */}
          {topThree[2] && (
            <div className="relative bg-gradient-to-b from-orange-50/50 to-white rounded-[2rem] p-6 border border-orange-200 shadow-sm flex flex-col items-center text-center order-3 hover:shadow-md transition-all">
              <div className="absolute -top-3.5 bg-orange-100 text-orange-800 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-orange-300 shadow-xs flex items-center gap-1">
                <TrophySolid className="w-3.5 h-3.5 text-orange-500" />
                3rd Place
              </div>
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-orange-400 to-amber-200 mt-2 mb-3">
                <img 
                  src={topThree[2].avatar} 
                  alt={topThree[2].name} 
                  className="w-full h-full rounded-full object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                  3
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{topThree[2].name} {topThree[2].is_me && '(You)'}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mb-3">{topThree[2].headline || 'Cohort Builder'}</p>
              <div className="w-full bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#146ef5] font-bold">{topThree[2].current_xp.toLocaleString()} XP</span>
                <span className="text-orange-500 flex items-center gap-1">
                  <FireIcon className="w-3.5 h-3.5" /> {topThree[2].streak_days}d Streak
                </span>
              </div>
              <div className="mt-4 flex gap-2 w-full">
                {topThree[2].username ? (
                  <Link 
                    href={`/portfolio/${topThree[2].username}`}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GlobeAltIcon className="w-3.5 h-3.5" /> Portfolio
                  </Link>
                ) : null}
                <Link 
                  href={`/dashboard/messages?user=${topThree[2].user_id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#146ef5] bg-blue-50 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" /> Message
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Cohort Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCohort('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCohort === 'all'
                ? 'bg-[#146ef5] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Cohorts
          </button>
          {cohorts.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedCohort(ch.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCohort === ch.id
                  ? 'bg-[#146ef5] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>

        {/* Real-time Search Input */}
        <div className="relative min-w-[240px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search builders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
          />
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 font-medium text-sm">Calculating cohort rankings...</p>
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="py-24 text-center">
            <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-1" />
            <h3 className="text-base font-bold text-gray-900">No builders found</h3>
            <p className="text-gray-400 text-xs mt-1">
              {searchQuery ? 'Try adjusting your search query.' : 'Be the first student to ship work and earn XP!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">Builder</th>
                  <th className="py-4 px-6">Cohort</th>
                  <th className="py-4 px-6">Total XP</th>
                  <th className="py-4 px-6 text-center">Streak</th>
                  <th className="py-4 px-6 text-right">Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeaders.map((leader) => {
                  const isTopThree = leader.rank <= 3;
                  return (
                    <tr 
                      key={leader.user_id + leader.rank} 
                      className={`transition-colors ${
                        leader.is_me 
                          ? 'bg-blue-50/50 hover:bg-blue-50/70 font-medium' 
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6 text-center">
                        {leader.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs shadow-xs">
                            🥇 1
                          </span>
                        ) : leader.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-extrabold text-xs shadow-xs">
                            🥈 2
                          </span>
                        ) : leader.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs shadow-xs">
                            🥉 3
                          </span>
                        ) : (
                          <span className="text-gray-500 font-bold text-sm">#{leader.rank}</span>
                        )}
                      </td>

                      {/* Builder */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                            <img 
                              src={leader.avatar} 
                              alt={leader.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${leader.is_me ? 'text-blue-700' : 'text-gray-900'}`}>
                                {leader.name}
                              </span>
                              {leader.is_me && (
                                <span className="bg-[#146ef5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {leader.headline || (leader.username ? `@${leader.username}` : 'Student')}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cohort */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                          <AcademicCapIcon className="w-3.5 h-3.5 text-gray-500" />
                          {leader.cohort_title || 'General Cohort'}
                        </span>
                      </td>

                      {/* XP Progress */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#146ef5] text-sm">
                              {leader.current_xp.toLocaleString()} XP
                            </span>
                          </div>
                          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-[#146ef5] rounded-full" 
                              style={{ width: `${Math.min((leader.current_xp / 5000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100">
                          <FireIcon className="w-3.5 h-3.5 text-orange-500" /> {leader.streak_days}d
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {leader.username && (
                            <Link
                              href={`/portfolio/${leader.username}`}
                              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                              title="View Public Showcase"
                            >
                              <GlobeAltIcon className="w-4 h-4" />
                            </Link>
                          )}
                          {!leader.is_me && (
                            <Link
                              href={`/dashboard/messages?user=${leader.user_id}`}
                              className="p-2 text-[#146ef5] hover:bg-blue-50 rounded-xl transition-colors"
                              title="Send Message"
                            >
                              <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
