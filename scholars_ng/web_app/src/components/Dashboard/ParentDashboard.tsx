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
  UserGroupIcon,
  CreditCardIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';

export default function ParentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/parent/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch parent dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">Loading Parent Portal...</div>;
  }

  const { stats, children_progress, messages, events } = data;

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parent Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your children's progress and stay updated.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4" />
            Make Payment
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" />
            Message School
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
            <h3 className="text-xl font-normal text-white">Outstanding Fees</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">₦{stats.outstanding_fees}</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span>Due by {stats.next_payment_due}</span>
            </div>
          </div>
        </div>

        {/* Card 2: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Enrolled Children</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{stats.active_children}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> Good standing</div>
            </div>
          </div>
        </div>

        {/* Card 3: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Unread Messages</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <EnvelopeIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{stats.unread_messages}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-orange-500 font-semibold">Important updates waiting</span>
            </div>
          </div>
        </div>

        {/* Card 4: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Upcoming Events</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{stats.upcoming_events}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Scheduled for this month</span>
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
              <h3 className="text-xl font-normal text-gray-900 tracking-tight">Children's Progress</h3>
              <button className="text-sm font-semibold text-[#146ef5] hover:underline">View Full Reports</button>
            </div>
            <div className="flex flex-col gap-4">
              {children_progress.map((child: any, i: number) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${i % 2 === 0 ? 'bg-blue-50/50 border-blue-500' : 'bg-purple-50/50 border-purple-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <Image src={child.avatar} alt={child.name} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{child.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{child.grade} • {child.school}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{child.attendance}</div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Attendance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Stack */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Recent Messages */}
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Recent Messages</h3>
            <div className="flex-1 flex flex-col gap-6">
              {messages.map((msg: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.unread ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center w-full gap-4">
                      <p className={`text-sm ${msg.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{msg.sender}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{msg.date}</p>
                    </div>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${msg.unread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{msg.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
