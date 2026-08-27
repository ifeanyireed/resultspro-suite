"use client";
import React from 'react';
import { CalendarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function CalendarPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Schedule & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Upcoming live sessions, mentor syncs, and project deadlines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-col items-center justify-center shrink-0 text-[#146ef5]">
              <span className="text-xs font-bold uppercase">Oct</span>
              <span className="text-xl font-black">12</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Weekly Cohort Sync</h3>
              <p className="text-sm text-gray-500 mb-2">Live Q&A covering state management and React hooks.</p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> 4:00 PM - 5:30 PM (WAT)</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Live Class</span>
              </div>
            </div>
            <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              RSVP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}