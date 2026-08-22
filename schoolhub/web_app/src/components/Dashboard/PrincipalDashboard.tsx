'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  AnalyticsUpIcon, 
  CreditCardIcon, 
  UserGroupIcon,
  Activity04Icon,
  Pulse01Icon,
  ArrowUp01Icon,
  Message01Icon,
  Calendar03Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';

export default function PrincipalDashboard() {
  const [pulseData, setPulseData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/pulse')
      .then(res => setPulseData(res.data))
      .catch(err => console.error('Failed to load pulse data:', err));
  }, []);

  if (!pulseData) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">
        Loading Institutional Intelligence...
      </div>
    );
  }

  const { admissions, academic_health, engagement, revenue, school_name } = pulseData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        <WelcomeBanner 
          title={`${school_name} Pulse`} 
          description="Real-time institutional intelligence and operations overview." 
          monsterSrc="/monster-reading.png" 
          backgroundColor="#111827"
        />

        {/* Executive Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-gray-300 transition-colors cursor-pointer">
            <div className="text-sm font-bold text-gray-500 mb-4">Admissions Funnel</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-blue-600 bg-blue-50 group-hover:scale-110 transition-transform">
                <UserGroupIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{admissions.total_applications}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded">
              <ArrowUp01Icon size={14} /> {admissions.growth} vs last year
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-gray-300 transition-colors cursor-pointer">
            <div className="text-sm font-bold text-gray-500 mb-4">Academic Health</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50 group-hover:scale-110 transition-transform">
                <AnalyticsUpIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{academic_health.average_gpa}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded">
              <ArrowUp01Icon size={14} /> +{academic_health.gpa_growth} pts
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-gray-300 transition-colors cursor-pointer">
            <div className="text-sm font-bold text-gray-500 mb-4">Parent Engagement</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-purple-600 bg-purple-50 group-hover:scale-110 transition-transform">
                <Activity04Icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{engagement.active_parents}</h3>
            </div>
            <p className="text-xs font-semibold text-gray-400">Weekly Active</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-gray-300 transition-colors cursor-pointer">
            <div className="text-sm font-bold text-gray-500 mb-4">Revenue & Fees</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-amber-600 bg-amber-50 group-hover:scale-110 transition-transform">
                <CreditCardIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{revenue.collected_percentage}</h3>
            </div>
            <p className="text-xs font-semibold text-gray-400">Term 3 Collection</p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Pulse01Icon size={20} color="#146ef5" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">System Pulse</h2>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-800">Teacher Attendance Today</span>
                  <span className="font-bold text-gray-900">98%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '98%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-800">Student Attendance Today</span>
                  <span className="font-bold text-gray-900">94%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-800">Timetable Execution</span>
                  <span className="font-bold text-gray-900">100%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Message01Icon size={20} color="#f59e0b" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Action Items</h2>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">Approve Q3 Budget</h4>
                  <span className="text-xs font-medium text-gray-500">Finance Dept</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">Review Disciplinary Report</h4>
                  <span className="text-xs font-medium text-gray-500">VP Admin</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">Sign Parent Newsletter</h4>
                  <span className="text-xs font-medium text-gray-500">Communications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <div className="bg-gray-900 rounded-[1.5rem] p-6 text-white shadow-sm relative overflow-hidden h-[300px] flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/abstract-blue-4.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Enrollment</h3>
            <div className="text-4xl font-bold text-white tracking-tight">1,248</div>
            <div className="text-emerald-400 text-sm font-bold mt-2">+42 this term</div>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-400">Primary</div>
              <div className="text-lg font-bold">580</div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-400">Secondary</div>
              <div className="text-lg font-bold">668</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
