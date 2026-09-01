'use client';

import React from 'react';
import { 
  BellAlertIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function ParentDashboardPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Sarah</h1>
          <p className="text-sm text-gray-500 mt-1">Here is a quick overview of Alex's progress at Greenwood High.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
              <img src="/avatars/character4.jpg" alt="Child" className="w-full h-full object-cover" />
            </div>
            Alex (Grade 9)
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Attendance Ring */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center aspect-square relative group hover:-translate-y-1 transition-transform">
          <h3 className="text-base font-normal text-gray-900 absolute top-6 left-6">Attendance</h3>
          
          <div className="relative w-32 h-32 mt-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="12.56" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-medium tracking-tight text-gray-900">95%</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-wider">This Term</span>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-normal text-gray-900">Latest Result</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5]">
              <CheckBadgeIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-gray-900 mb-2">A-</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="font-bold text-gray-700">Mathematics</span> Mid-Term
            </div>
          </div>
        </div>

        {/* Future Skills Status */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-base font-normal text-white">Courses</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <DocumentTextIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-2">3 Day</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span>Coding Streak Active 🔥</span>
            </div>
          </div>
        </div>

        {/* Fees & Notices */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-normal text-gray-900">Next Payment</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <BellAlertIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-2">₦45,000</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-orange-500 font-bold">Due in 5 days</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Feed */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6 flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-6">School Notices & Feed</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <CalendarDaysIcon className="w-6 h-6 text-[#146ef5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Inter-House Sports Meeting</h4>
                    <span className="text-[10px] text-gray-400">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    Dear Parents, please be reminded that the annual Inter-House Sports meeting will hold this Friday. Ensure Alex comes in their sportswear (Blue House).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  <img src="/avatars/character2.jpg" alt="Teacher" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Mr. Davies (Science)</h4>
                    <span className="text-[10px] text-gray-400">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                    "Alex showed great improvement in the recent Chemistry practicals. Very attentive!"
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Upcoming Tasks</h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#146ef5] transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-[#146ef5] transition-colors">Math Assignment</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-600">Tomorrow</span>
                </div>
                <p className="text-xs text-gray-500">Algebra Chapter 4 exercises</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#146ef5] transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-[#146ef5] transition-colors">Courses Project</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#146ef5]">Friday</span>
                </div>
                <p className="text-xs text-gray-500">Submit CSS styled webpage</p>
              </div>
            </div>

            <button className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-full transition-colors border border-gray-200">
              View Full Calendar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
