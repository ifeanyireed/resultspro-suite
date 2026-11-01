'use client';

import React from 'react';
import { 
  AcademicCapIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function ParentClassroomPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Classes & Teachers</h1>
          <p className="text-sm text-gray-500 mt-1">Alex's current curriculum and teacher directory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Advanced Mathematics', teacher: 'Mr. Davies', time: 'Mon, Wed, Fri • 9:00 AM' },
          { name: 'Physics 101', teacher: 'Mrs. Roberts', time: 'Tue, Thu • 11:00 AM' },
          { name: 'World History', teacher: 'Dr. Smith', time: 'Mon, Wed • 1:00 PM' },
          { name: 'English Literature', teacher: 'Ms. Taylor', time: 'Tue, Thu • 2:30 PM' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <button className="text-xs font-bold text-[#146ef5] hover:text-[#105bd1] transition-colors flex items-center gap-1">
                View Syllabus
              </button>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">{c.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{c.teacher} • {c.time}</p>
            <button className="mt-auto w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
              <VideoCameraIcon className="w-4 h-4" /> Message Teacher
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
