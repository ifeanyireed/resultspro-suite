'use client';

import React, { useEffect, useState } from 'react';
import { 
  PlusIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error('Failed to load student dashboard:', err));
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">
        Loading Student Portal...
      </div>
    );
  }

  const { student, schedule, attendance, upcoming_tests, subjects } = dashboardData;

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {student.first_name}</h1>
          <p className="text-sm text-gray-500 mt-1">Ready to learn? You have {schedule.today.length} classes today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <PlayIcon className="w-4 h-4" />
            Join Next Class
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" />
            Library
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Card 1: Primary Dark */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          {/* Subtle Depth Effects */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Average Score</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">92%</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 5%</div>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Attendance</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <AcademicCapIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{attendance.percentage}%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 2%</div>
              <span>Above class average</span>
            </div>
          </div>
        </div>

        {/* Card 3: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Homework Done</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <BookOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">85%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 4%</div>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Learning Time</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">12h</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Total this week</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Side (Analytics, Reminders, Leads, etc) */}
        <div className="lg:col-span-9 flex flex-col gap-3">
          
          {/* Top Row of Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
            
            {/* Today's Classes */}
            <div className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-normal text-gray-900">Today's Schedule</h3>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between gap-4">
                {schedule.today.slice(0,3).map((cls: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white shadow-sm ${i % 2 === 0 ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                        <AcademicCapIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-normal text-gray-900">{cls.subject}</h4>
                        <p className="text-sm text-gray-500">{cls.time} <span className="font-medium text-gray-700">({cls.duration})</span></p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>Room {cls.room}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Progress Donut */}
            <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-normal text-gray-900 mb-6 self-start">Term Progress</h3>
              
              <div className="relative w-full aspect-[2/1] max-w-[260px] flex items-end justify-center mt-2 mb-4">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <defs>
                    <pattern id="stripes-arc" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke="#d1d5db" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="url(#stripes-arc)" strokeWidth="15" strokeLinecap="round" strokeDasharray="125.66 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#111827" strokeWidth="15" strokeLinecap="round" strokeDasharray="82.93 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#146ef5" strokeWidth="15" strokeLinecap="round" strokeDasharray="51.52 125.66" strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end translate-y-[15%]">
                  <span className="text-5xl font-normal tracking-tight text-gray-900">41%</span>
                  <span className="text-xs font-medium text-gray-500 mt-1">Syllabus Covered</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto w-full justify-center pt-6">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#146ef5]"></div><span className="text-xs text-gray-500 font-medium">Completed</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#111827]"></div><span className="text-xs text-gray-500 font-medium">In Progress</span></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, #d1d5db 1px, #d1d5db 3px)' }}></div>
                  <span className="text-xs text-gray-500 font-medium">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Stack */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          
          {/* Recent Activity */}
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Recent Activity</h3>
            <div className="flex-1 flex flex-col gap-8 pb-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">Assignment Graded</p>
                  <p className="text-sm text-gray-500 mt-0.5">Math - Algebra (A+)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center shrink-0">
                  <BookOpenIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">New Topic Started</p>
                  <p className="text-sm text-gray-500 mt-0.5">Physics - Motion</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <PlayIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">Tutor Session</p>
                  <p className="text-sm text-gray-500 mt-0.5">Completed 1hr English</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] p-6 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('/skies.jpeg')" }}
            ></div>
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            
            <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Focus Timer</h3>
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
              <div className="text-5xl font-medium tracking-tight mb-8 font-sans">01:24:08</div>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <PauseIcon className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                </button>
                <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <StopIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
