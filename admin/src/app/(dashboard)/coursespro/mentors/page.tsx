'use client';

import React from 'react';
import { 
  PlusIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function MentorsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Mentor Management</h2>
          <p className="text-sm text-gray-500 mt-1">Onboarding, assignment, and performance tracking.</p>
        </div>
        <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Invite Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Mentors</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">24</h2>
            <p className="text-xs text-gray-500">Across all programs</p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Avg Rating</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-[#146ef5] mb-2">4.8</h2>
            <p className="text-xs text-gray-500">Based on student feedback</p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Pending Reviews</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-orange-500 mb-2">12</h2>
            <p className="text-xs text-gray-500">Awaiting mentor feedback</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                <img src={`/avatars/character${i + 1}.jpg`} alt="Mentor" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Mentor Name {i}</h4>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <StarIcon className="w-4 h-4 text-orange-400 fill-orange-400" />
                    4.9
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">UX/UI Design • Fall Cohort</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
