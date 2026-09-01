'use client';

import React from 'react';
import { 
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function ParentEventsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Upcoming school events, holidays, and PTA meetings.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">This Month</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { title: 'Inter-House Sports', date: 'Oct 15', time: '9:00 AM - 3:00 PM', location: 'Main Field', type: 'Sports' },
            { title: 'PTA General Meeting', date: 'Oct 20', time: '10:00 AM - 12:00 PM', location: 'School Hall', type: 'Meeting' },
            { title: 'Mid-Term Break Begins', date: 'Oct 25', time: 'All Day', location: 'N/A', type: 'Holiday' },
          ].map((e, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-[#146ef5] shrink-0">
                  <span className="text-xs font-bold uppercase">{e.date.split(' ')[0]}</span>
                  <span className="text-xl font-bold">{e.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">{e.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {e.time}</span>
                    <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {e.location}</span>
                  </div>
                </div>
              </div>
              <button className="text-sm font-semibold text-[#146ef5] hover:text-[#105bd1] transition-colors border border-gray-200 px-4 py-2 rounded-full">
                Add to Calendar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
