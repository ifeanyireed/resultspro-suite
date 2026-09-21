"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { CheckCircleIcon, DocumentDuplicateIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function MentorDashboard() {
  const { data: submissions = [] } = useQuery({
    queryKey: ['mentor-submissions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/submissions');
      return res.data.submissions || [];
    }
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/sessions');
      return res.data.sessions || [];
    }
  });

  
  const { data: profile } = useQuery({
    queryKey: ['mentor-profile-dashboard'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });
  
  const payoutsEnabled = profile?.payouts_enabled ?? true;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your cohorts and review builder submissions.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Pending Reviews</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><DocumentDuplicateIcon className="w-4 h-4"/></div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{submissions.length}</h2>
          </div>
        </div>)}
        {payoutsEnabled && (<div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Total Earnings</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><ArrowTrendingUpIcon className="w-4 h-4" /></div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">₦450k</h2>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Live Classes</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{sessions.length} Scheduled</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {sessions.length > 0 ? sessions.map((s: any, i: number) => {
              const d = new Date(s.live_date);
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                  <div className="flex items-center gap-4 overflow-hidden pr-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <VideoCameraIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{s.module_title}</h4>
                      <p className="text-xs text-gray-500 truncate">{s.cohort_name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d.toLocaleDateString()}</div>
                    <div className="text-sm font-bold text-emerald-600">{d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              );
            }) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6">
                <VideoCameraIcon className="w-8 h-8 mb-2 stroke-1 text-gray-300" />
                <p className="text-sm">No live classes scheduled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}