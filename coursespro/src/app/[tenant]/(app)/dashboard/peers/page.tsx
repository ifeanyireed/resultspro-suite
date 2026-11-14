"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  FireIcon,
  TrophyIcon,
  ArrowTopRightOnSquareIcon,
  VideoCameraIcon,
  ArrowPathIcon,
  UserPlusIcon,
  BookOpenIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { 
  CheckBadgeIcon as CheckBadgeSolid,
  SparklesIcon as SparklesSolid,
  FireIcon as FireSolid
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface Peer {
  user_id: string;
  cohort_id: string;
  cohort_title?: string;
  name: string;
  avatar?: string;
  role: string;
  username?: string;
  current_xp: number;
  streak_days: number;
  status: 'Online' | 'In Session' | 'Offline';
  activity?: string;
  is_partner?: boolean;
}

interface PartnerData {
  peer: Peer;
  sprint_number: number;
  shared_notes?: string;
  pairing_id: string;
}

interface CohortSummary {
  id: string;
  title: string;
  slug: string;
}

type StatusFilter = 'ALL' | 'ONLINE' | 'IN_SESSION' | 'TOP_BUILDERS';

export default function PeersPage() {
  const { user } = useAuthStore();
  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch peers and active sprint pairing from service_coursespro
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['cohort-peers', user?.id, selectedCohort],
    queryFn: async () => {
      const url = selectedCohort && selectedCohort !== 'ALL'
        ? `/api/peers/roster?cohort_id=${selectedCohort}`
        : '/api/peers/roster';
      const res = await coursesApi.get(url);
      return res.data;
    },
    enabled: !!user,
  });

  const rawPeers: Peer[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.peers || [];
  }, [data]);

  const partner: PartnerData | null = useMemo(() => {
    if (!data || Array.isArray(data)) return null;
    return data.partner || null;
  }, [data]);

  const cohorts: CohortSummary[] = useMemo(() => {
    if (!data || Array.isArray(data)) return [];
    return data.cohorts || [];
  }, [data]);

  // Aggregate stats
  const stats = useMemo(() => {
    let online = 0;
    let inSession = 0;
    let totalXp = 0;

    rawPeers.forEach((p) => {
      if (p.status === 'Online') online++;
      if (p.status === 'In Session') inSession++;
      totalXp += p.current_xp || 0;
    });

    return {
      total: rawPeers.length,
      online,
      inSession,
      activeNow: online + inSession,
    };
  }, [rawPeers]);

  // Filtered and sorted peers
  const filteredPeers = useMemo(() => {
    let list = [...rawPeers];

    // Status filter
    if (statusFilter === 'ONLINE') {
      list = list.filter((p) => p.status === 'Online' || p.status === 'In Session');
    } else if (statusFilter === 'IN_SESSION') {
      list = list.filter((p) => p.status === 'In Session');
    } else if (statusFilter === 'TOP_BUILDERS') {
      list.sort((a, b) => (b.current_xp || 0) - (a.current_xp || 0));
      list = list.slice(0, 10);
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          (p.cohort_title || '').toLowerCase().includes(q) ||
          (p.username || '').toLowerCase().includes(q)
      );
    }

    // Sort: Online/In Session first, then by XP
    if (statusFilter !== 'TOP_BUILDERS') {
      list.sort((a, b) => {
        if (a.is_partner && !b.is_partner) return -1;
        if (!a.is_partner && b.is_partner) return 1;

        const aActive = a.status === 'Online' || a.status === 'In Session' ? 1 : 0;
        const bActive = b.status === 'Online' || b.status === 'In Session' ? 1 : 0;
        if (aActive !== bActive) return bActive - aActive;

        return (b.current_xp || 0) - (a.current_xp || 0);
      });
    }

    return list;
  }, [rawPeers, statusFilter, searchQuery]);

  return (
    <MotionRise className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cohort Peers & Coworkers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Builder Network
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Connect with fellow builders, code in sync, and review each other&apos;s architectural pull requests.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {cohorts.length > 1 && (
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Cohort Peers</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
            title="Refresh Peer Presence"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Sprint Accountability Partner Banner */}
      {partner && partner.peer && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-800/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                {partner.peer.avatar ? (
                  <img
                    src={partner.peer.avatar}
                    alt={partner.peer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/30 bg-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                    {partner.peer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Active Partner" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <SparklesSolid className="w-3.5 h-3.5" />
                    Sprint {partner.sprint_number} Study Buddy Partner
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {partner.peer.name}
                </h3>
                <p className="text-xs text-blue-200 font-medium">
                  {partner.peer.role} {partner.peer.cohort_title ? `· ${partner.peer.cohort_title}` : ''}
                </p>
                {partner.shared_notes && (
                  <p className="text-xs text-slate-300 mt-2 italic bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 inline-block">
                    &ldquo;{partner.shared_notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <Link
                href={`/dashboard/messages?user=${partner.peer.user_id}`}
                className="inline-flex items-center gap-1.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Direct Message Partner
              </Link>
              {partner.peer.username && (
                <Link
                  href={`/portfolio/${partner.peer.username}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors border border-white/10"
                >
                  View Portfolio
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Metrics */}
      <MotionStagger className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 font-medium">Cohort Peers</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.online}</div>
            <div className="text-xs text-slate-500 font-medium">Online Right Now</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <VideoCameraIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.inSession}</div>
            <div className="text-xs text-slate-500 font-medium">In Live Session</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrophyIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{rawPeers.length > 0 ? (rawPeers[0]?.current_xp || 0).toLocaleString() : 0}</div>
            <div className="text-xs text-slate-500 font-medium">Top Cohort XP</div>
          </div>
        </div>
      </MotionStagger>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Peers' },
            { id: 'ONLINE', label: 'Active Now' },
            { id: 'IN_SESSION', label: 'In Studio' },
            { id: 'TOP_BUILDERS', label: 'Top 10 Leaders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as StatusFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, handle..."
            className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
          />
        </div>
      </div>

      {/* Main Peer Cards Grid */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-500">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Synchronizing cohort peer roster...</p>
        </div>
      ) : filteredPeers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Peers Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No cohort members matched "${searchQuery}".`
              : 'There are no other active learners registered in this track yet. When new students join, they will appear here automatically!'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPeers.map((peer) => (
            <div
              key={peer.user_id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between text-center relative hover:-translate-y-1 hover:shadow-md ${
                peer.is_partner
                  ? 'border-blue-300 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80'
              }`}
            >
              {/* Presence Dot Top-Right */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {peer.is_partner && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Buddy
                  </span>
                )}
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    peer.status === 'Online'
                      ? 'bg-emerald-500 ring-4 ring-emerald-50'
                      : peer.status === 'In Session'
                      ? 'bg-amber-500 ring-4 ring-amber-50 animate-pulse'
                      : 'bg-slate-300'
                  }`}
                  title={peer.status}
                />
              </div>

              {/* Profile Avatar */}
              <div>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 mb-4 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-slate-800 text-2xl font-bold">
                  {peer.avatar ? (
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                      {peer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 truncate px-1 tracking-tight">
                  {peer.name}
                </h3>
                {peer.username && (
                  <p className="text-[11px] font-mono text-slate-400 mb-1">
                    @{peer.username}
                  </p>
                )}
                <p className="text-xs text-[#146ef5] font-semibold mb-2 truncate px-1">
                  {peer.role}
                </p>

                {peer.cohort_title && (
                  <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full truncate max-w-[90%] mb-4">
                    {peer.cohort_title}
                  </span>
                )}

                {/* XP & Streak stats */}
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 mb-5 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-amber-600" title="Experience Points">
                    <TrophyIcon className="w-3.5 h-3.5" />
                    {(peer.current_xp || 0).toLocaleString()} XP
                  </span>
                  <span className="flex items-center gap-1 text-rose-600" title="Daily Streak">
                    <FireSolid className="w-3.5 h-3.5" />
                    {peer.streak_days || 0}d
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href={`/dashboard/messages?user=${peer.user_id}`}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1.5 border border-slate-200/80 shadow-xs"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                  Direct Message
                </Link>

                {peer.username && (
                  <Link
                    href={`/portfolio/${peer.username}`}
                    target="_blank"
                    className="w-full bg-white hover:bg-blue-50/50 text-blue-600 text-[11px] font-semibold py-1.5 rounded-xl transition-colors flex justify-center items-center gap-1"
                  >
                    View Portfolio
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
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
