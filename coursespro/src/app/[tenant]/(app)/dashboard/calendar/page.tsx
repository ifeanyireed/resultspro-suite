"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  CalendarIcon, 
  VideoCameraIcon, 
  ClockIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  SparklesIcon as SparklesSolid 
} from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface EventItem {
  id: string;
  cohortId?: string;
  cohortTitle?: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  isGoing: boolean;
}

interface CohortSummary {
  id: string;
  title: string;
  slug: string;
}

type EventFilter = 'ALL' | 'LIVE_CLASS' | 'MENTOR_SYNC' | 'DEADLINE';
type ViewMode = 'TIMELINE' | 'CALENDAR';

export default function CalendarPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<EventFilter>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('TIMELINE');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // 1. Fetch events from service_coursespro
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['student-events', user?.id, selectedCohort],
    queryFn: async () => {
      const url = selectedCohort && selectedCohort !== 'ALL'
        ? `/api/student/events?cohort_id=${selectedCohort}`
        : '/api/student/events';
      const res = await coursesApi.get(url);
      return res.data;
    },
    enabled: !!user,
  });

  const rawEvents: EventItem[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.events || [];
  }, [data]);

  const cohorts: CohortSummary[] = useMemo(() => {
    if (!data || Array.isArray(data)) return [];
    return data.cohorts || [];
  }, [data]);

  // 2. RSVP Mutation
  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, currentStatus }: { eventId: string; currentStatus: boolean }) => {
      const newStatus = currentStatus ? "declined" : "going";
      const res = await coursesApi.post(`/api/student/events/${eventId}/rsvp`, { status: newStatus });
      return { eventId, newStatus, data: res.data };
    },
    onSuccess: ({ newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['student-events'] });
      toast.success(newStatus === 'going' ? 'RSVP confirmed! See you in class.' : 'RSVP removed.');
    },
    onError: () => toast.error('Failed to update RSVP status'),
  });

  const handleRsvp = (eventId: string, currentStatus: boolean) => {
    rsvpMutation.mutate({ eventId, currentStatus });
  };

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let list = [...rawEvents];

    // Category filter
    if (filterType === 'LIVE_CLASS') {
      list = list.filter((e) => {
        const t = (e.eventType || '').toLowerCase();
        return t.includes('class') || t.includes('lecture') || t.includes('workshop');
      });
    } else if (filterType === 'MENTOR_SYNC') {
      list = list.filter((e) => {
        const t = (e.eventType || '').toLowerCase();
        return t.includes('mentor') || t.includes('sync') || t.includes('office') || t.includes('review');
      });
    } else if (filterType === 'DEADLINE') {
      list = list.filter((e) => {
        const t = (e.eventType || '').toLowerCase();
        return t.includes('deadline') || t.includes('project') || t.includes('milestone');
      });
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q) ||
          (e.cohortTitle || '').toLowerCase().includes(q) ||
          (e.eventType || '').toLowerCase().includes(q)
      );
    }

    // Sort by chronological start time
    list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return list;
  }, [rawEvents, filterType, searchQuery]);

  // Next upcoming session
  const nextEvent = useMemo(() => {
    const now = new Date().getTime();
    return filteredEvents.find((e) => new Date(e.endTime).getTime() >= now) || filteredEvents[0] || null;
  }, [filteredEvents]);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getMonthAndDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.toLocaleDateString('en-US', { day: 'numeric' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  };

  const getTypeBadge = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('class') || t.includes('lecture')) {
      return <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">LIVE CLASS</span>;
    }
    if (t.includes('mentor') || t.includes('sync')) {
      return <span className="bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">Mentor Sync</span>;
    }
    if (t.includes('deadline') || t.includes('project')) {
      return <span className="bg-rose-50 text-rose-700 border border-rose-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">Milestone Deadline</span>;
    }
    return <span className="bg-slate-100 text-slate-700 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">{type?.replace(/LIVE_CLASS/g, 'LIVE CLASS')?.replace(/_/g, ' ') || 'Event'}</span>;
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = (event: EventItem) => {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(event.endTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.meetingUrl || 'CoursesPRO Live Classroom');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <MotionRise className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Schedule & Live Sessions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Interactive Timetable
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track weekly cohort lectures, 1-on-1 mentor syncs, and stage capstone submission deadlines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {cohorts.length > 1 && (
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Cohort Tracks</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('TIMELINE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'TIMELINE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListBulletIcon className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'CALENDAR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarDaysIcon className="w-3.5 h-3.5" />
              Month View
            </button>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
            title="Refresh Timetable"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Featured Next Session Hero Card */}
      {nextEvent && (
        <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-800/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0 text-white shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {getMonthAndDay(nextEvent.startTime).month}
                </span>
                <span className="text-2xl font-black">
                  {getMonthAndDay(nextEvent.startTime).day}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <SparklesSolid className="w-3.5 h-3.5" />
                    Next Scheduled Milestone
                  </span>
                  {nextEvent.cohortTitle && (
                    <span className="text-xs text-blue-200 font-medium">
                      · {nextEvent.cohortTitle}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1">
                  {nextEvent.title}
                </h3>

                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                  <span>
                    {formatTime(nextEvent.startTime)} - {formatTime(nextEvent.endTime)} WAT
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <Link
                href="/dashboard/classroom"
                className="inline-flex items-center gap-1.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <VideoCameraIcon className="w-4 h-4" />
                Join Live Classroom
              </Link>

              <a
                href={createGoogleCalendarUrl(nextEvent)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors border border-white/10"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Add to Google Calendar
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Scheduled' },
            { id: 'LIVE_CLASS', label: 'Live Lectures' },
            { id: 'MENTOR_SYNC', label: 'Mentor Reviews' },
            { id: 'DEADLINE', label: 'Project Deadlines' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as EventFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, topics..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
          />
        </div>
      </div>

      {/* Main Content Area: Timeline vs Month View */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-500">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Loading your cohort schedule...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No sessions matched "${searchQuery}".`
              : 'There are no upcoming live lectures or deadlines scheduled right now. Check back soon!'}
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
      ) : viewMode === 'TIMELINE' ? (
        /* Timeline Agenda View */
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const { month, day, weekday } = getMonthAndDay(event.startTime);

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-5">
                  {/* Date Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center shrink-0 text-slate-900 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {weekday}
                    </span>
                    <span className="text-xl font-black text-blue-600">{day}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{month}</span>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {event.title}
                      </h3>
                      {getTypeBadge(event.eventType)}
                      {event.isGoing && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircleSolid className="w-3.5 h-3.5" />
                          RSVP&apos;d
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mb-2.5 max-w-2xl leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>

                      {event.cohortTitle && (
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {event.cohortTitle}
                        </span>
                      )}

                      {event.meetingUrl && (
                        <Link
                          href={event.meetingUrl.startsWith('http') ? event.meetingUrl : '/dashboard/classroom'}
                          target={event.meetingUrl.startsWith('http') ? '_blank' : undefined}
                          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                        >
                          <VideoCameraIcon className="w-3.5 h-3.5" />
                          Classroom Room
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* RSVP Action */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <a
                    href={createGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                    title="Add to Google Calendar"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleRsvp(event.id, event.isGoing)}
                    disabled={rsvpMutation.isPending}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
                      event.isGoing
                        ? 'bg-[#146ef5] text-white border-[#146ef5] hover:bg-[#105bd1]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {event.isGoing ? 'Going ✓' : 'RSVP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Monthly Grid View */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Simple calendar days renderer */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = (i % 31) + 1;
              const hasEvents = filteredEvents.some((e) => new Date(e.startTime).getDate() === dayNum);

              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-2 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    hasEvents
                      ? 'bg-blue-50/30 border-blue-200'
                      : 'bg-slate-50/40 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className={`text-xs font-bold ${hasEvents ? 'text-blue-600' : 'text-slate-600'}`}>
                    {dayNum}
                  </span>

                  {hasEvents && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-blue-900 bg-blue-100/70 truncate rounded-md px-1 py-0.5">
                        Session Scheduled
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </MotionRise>
  );
}
