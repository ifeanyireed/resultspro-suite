"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { coursesApi } from '@/lib/api';
import { 
  CalendarDaysIcon, 
  VideoCameraIcon, 
  LinkIcon, 
  CheckIcon, 
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface MentorSession {
  id: string;
  cohort_id: string;
  cohort_name: string;
  module_title: string;
  session_type: string;
  live_date: string;
  meeting_url: string;
  attendee_count: number;
}

export default function MentorSessions() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  const { data, isLoading } = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/sessions');
      return res.data;
    }
  });

  const sessions: MentorSession[] = data?.sessions || [];
  const bookingUrl: string = data?.booking_url || '';

  const handleCopyLink = () => {
    if (bookingUrl) {
      navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const now = new Date();
  const upcomingSessions = sessions.filter((s) => {
    const d = new Date(s.live_date);
    return isNaN(d.getTime()) || d >= now;
  });

  const pastSessions = sessions.filter((s) => {
    const d = new Date(s.live_date);
    return !isNaN(d.getTime()) && d < now;
  });

  const displaySessions = activeTab === 'UPCOMING' ? upcomingSessions : pastSessions;

  return (
    <MotionRise className="space-y-8 pb-16">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2 border border-emerald-100">
            <VideoCameraIcon className="w-3.5 h-3.5" />
            Live Teaching & 1:1 Office Hours
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sessions & Workshops</h1>
          <p className="text-sm text-gray-500 mt-1">
            Host live cohort coding workshops, architectural office hours, and 1:1 code pairing sessions.
          </p>
        </div>

        <Link
          href="/dashboard/classroom"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <VideoCameraIcon className="w-4 h-4" />
          Launch Live Classroom Studio
        </Link>
      </div>

      {/* 1:1 Office Hours Booking Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              1:1 Mentorship Office Hours
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Your Direct Student Booking Link</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            {bookingUrl 
              ? "Share your Calendly or Cal.com booking link with students to enable 1-on-1 private code reviews and career mentorship."
              : "Connect your personal Calendly or Cal.com URL in Settings so students can schedule 1:1 office hour appointments directly."
            }
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {bookingUrl ? (
            <>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold rounded-xl transition shadow-xs"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-emerald-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 text-[#146ef5]" />
                    Copy Booking Link
                  </>
                )}
              </button>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition border border-white/20"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Test Link
              </a>
              <Link
                href="/mentor/settings"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/20"
                title="Manage Booking URL"
              >
                <Cog6ToothIcon className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <Link
              href="/mentor/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#146ef5] hover:bg-blue-50 text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              Configure Booking Link in Settings
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`text-sm font-semibold transition pb-1 relative ${
              activeTab === 'UPCOMING'
                ? 'text-[#146ef5] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-[#146ef5]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Scheduled Workshops ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('PAST')}
            className={`text-sm font-semibold transition pb-1 relative ${
              activeTab === 'PAST'
                ? 'text-[#146ef5] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-[#146ef5]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Past Sessions ({pastSessions.length})
          </button>
        </div>
        <span className="text-xs text-gray-400">All times in West Africa Time (WAT)</span>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
        </div>
      ) : displaySessions.length > 0 ? (
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displaySessions.map((session, idx) => {
            const dateObj = new Date(session.live_date);
            const isValidDate = !isNaN(dateObj.getTime());
            const formattedDate = isValidDate 
              ? dateObj.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
              : session.live_date;
            const formattedTime = isValidDate
              ? dateObj.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
              : 'Scheduled Time';

            return (
              <div 
                key={session.id || idx} 
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon & Date Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                      <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {formattedTime}
                      </span>
                      <p className="text-xs font-semibold text-gray-500 mt-1">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Title & Cohort */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#146ef5]">
                        {session.session_type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
                      {session.module_title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {session.cohort_name}
                    </p>
                  </div>

                  {/* Cohort Attendee Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100 mb-6">
                    <span className="flex items-center gap-1.5">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      {session.attendee_count ?? 0} Mentees Enrolled
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                      <SparklesIcon className="w-4 h-4" />
                      Live Coworking
                    </span>
                  </div>
                </div>

                {/* Join CTA */}
                {session.meeting_url ? (
                  <a 
                    href={session.meeting_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Join Video Call (External) →
                  </a>
                ) : (
                  <Link
                    href="/dashboard/classroom"
                    className="block w-full py-2.5 text-center bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-bold rounded-xl text-xs transition-colors border border-blue-200"
                  >
                    Open Live Classroom Studio →
                  </Link>
                )}
              </div>
            );
          })}
        </MotionStagger>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeTab === 'PAST' ? "No Past Sessions" : "No Scheduled Sessions"}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            {activeTab === 'PAST' 
              ? "Completed live cohort workshops and historical recordings will appear here."
              : "You don't have any live cohort classes or mentorship workshops scheduled right now."}
          </p>
          <Link
            href="/dashboard/classroom"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-xl hover:bg-[#105bd1] transition"
          >
            <VideoCameraIcon className="w-4 h-4" />
            Start Instant Coworking Studio
          </Link>
        </div>
      )}
    </MotionRise>
  );
}
