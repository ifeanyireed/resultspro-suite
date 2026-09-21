"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { CalendarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function MentorSessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/sessions');
      return res.data.sessions || [];
    }
  });

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">1:1 & Live Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">Your upcoming booked mentorship calls and live cohort classes.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
        </div>
      ) : sessions?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sessions.map((session: any, idx: number) => {
            const dateObj = new Date(session.live_date);
            return (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <VideoCameraIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dateObj.toLocaleDateString()}</p>
                    <p className="text-sm font-medium text-emerald-600">{dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{session.module_title}</h3>
                  <p className="text-sm text-gray-500">{session.cohort_name}</p>
                </div>
                
                {session.meeting_url ? (
                  <a 
                    href={session.meeting_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium rounded-lg text-sm transition-colors border border-gray-200"
                  >
                    Join Meeting
                  </a>
                ) : (
                  <button disabled className="block w-full py-2.5 text-center bg-gray-50 text-gray-400 font-medium rounded-lg text-sm border border-gray-100">
                    No Link Provided
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[1.5rem] p-12 border border-gray-100 shadow-sm text-center">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Upcoming Sessions</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">You don't have any scheduled live classes or mentorship sessions right now.</p>
        </div>
      )}
    </>
  );
}