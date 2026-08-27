'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  PlusIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  UserPlusIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/teacher/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">Loading Teacher Dashboard...</div>;
  }

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teacher Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your classes, assignments, and students.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New Assignment
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            Grade Submissions
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
            <h3 className="text-xl font-normal text-white">Classes Today</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{data.stats.classes_today}</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">In progress</span>
            </div>
          </div>
        </div>

        {/* Card 2: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Total Students</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{data.stats.total_students}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Across all your active courses</span>
            </div>
          </div>
        </div>

        {/* Card 3: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Pending Grading</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{data.stats.pending_grading}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-orange-500 font-semibold">Needs attention today</span>
            </div>
          </div>
        </div>

        {/* Card 4: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Upcoming Tests</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <BookOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{data.stats.upcoming_assessments}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Scheduled for this week</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Side */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-normal text-gray-900 tracking-tight">Today's Schedule</h3>
              <button className="text-sm font-semibold text-[#146ef5] hover:underline">View Calendar</button>
            </div>
            <div className="flex flex-col gap-4">
              {data.schedule.map((cls: any, i: number) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 text-right">
                    <div className="text-sm font-bold text-gray-900">{cls.time}</div>
                  </div>
                  <div className={`flex-1 rounded-xl p-4 border-l-4 flex justify-between items-center ${i % 2 === 0 ? 'bg-blue-50/50 border-blue-500' : 'bg-purple-50/50 border-purple-500'}`}>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{cls.subject}</h4>
                      <p className="text-sm text-gray-600 font-medium">Grade {cls.grade} • {cls.students} students</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm">Room {cls.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Stack */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Action Items */}
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Action Items</h3>
            <div className="flex-1 flex flex-col gap-6">
              {data.action_items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'
                  }`}>
                    {item.priority === 'High' ? <StopIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.task}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">{item.class}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{item.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] p-6 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('/skies.jpeg')" }}
            ></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            
            <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Class Timer</h3>
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
              <div className="text-5xl font-medium tracking-tight mb-8 font-sans">00:45:00</div>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <PlayIcon className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
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
