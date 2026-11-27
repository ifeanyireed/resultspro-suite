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
  ChartBarIcon,
  UserGroupIcon,
  BoltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function PrincipalDashboard() {
  const [pulseData, setPulseData] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [noticesList, setNoticesList] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/v1/campus/summary').catch(() => api.get('/campus/summary')),
      api.get('/v1/campus/staff').catch(() => api.get('/campus/staff')),
      api.get('/v1/campus/notices').catch(() => api.get('/campus/notices')),
    ])
      .then(([summaryRes, staffRes, noticesRes]) => {
        const s = summaryRes?.data || {};
        const staffArr = Array.isArray(staffRes?.data)
          ? staffRes.data
          : staffRes?.data?.staff || [];
        const noticesArr = Array.isArray(noticesRes?.data)
          ? noticesRes.data
          : noticesRes?.data?.notices || [];

        setStaffList(staffArr.slice(0, 4));
        setNoticesList(noticesArr.slice(0, 3));

        const totalCollected = Number(s.fee_collected || 0);
        const totalOutstanding = Number(s.fee_outstanding || 0);
        const totalBilled = totalCollected + totalOutstanding;
        const collectionPct =
          totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

        setPulseData({
          school_name: s.school_name || 'Greenwood High Academy',
          revenue: { mtd: totalCollected, yoy_growth: '+14.2%', collection_pct: collectionPct },
          admissions: { total_enrollment: Number(s.students || 0), yoy_growth: `+${s.inquiries || 0} inquiries` },
          academic_health: { average_gpa: 3.84 },
          engagement: { active_parents: Number(s.parents || 0) },
        });
      })
      .catch((err) => {
        console.error('Failed to load campus summary for Principal Pulse:', err);
        setPulseData({
          school_name: 'Greenwood High Academy',
          revenue: { mtd: 0, yoy_growth: '0%', collection_pct: 0 },
          admissions: { total_enrollment: 0, yoy_growth: '0' },
          academic_health: { average_gpa: 0 },
          engagement: { active_parents: 0 },
        });
      });
  }, []);

  if (!pulseData) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">
        Loading Institutional Intelligence...
      </div>
    );
  }

  const { admissions, academic_health, engagement, revenue, school_name } = pulseData;

  const formatNumber = (num: number | string, prefix: string = '') => {
    if (typeof num === 'string') {
      const parsed = parseFloat(num.replace(/[^0-9.]/g, ''));
      if (isNaN(parsed)) return num;
      num = parsed;
    }
    if (num >= 1000000) {
      return prefix + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return prefix + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return prefix + num.toString();
  };

  return (
    <MotionRise>
      {/* Dashboard Title & Actions */}
      <MotionRise delay={0.04} className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Principal Pulse</h1>
          <p className="text-sm text-gray-500 mt-1">Institutional health and operational overview for {school_name}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            Generate Report
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            View Analytics
          </button>
        </div>
      </MotionRise>

      {/* Top Metric Cards */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Card 1: Primary Dark */}
        <MotionRise delay={0.06} className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          {/* Subtle Depth Effects */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Revenue (MTD)</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{formatNumber(revenue.mtd, '₦')}</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> {revenue.yoy_growth}</div>
              <span>Term Fees Collected</span>
            </div>
          </div>
        </MotionRise>

        {/* Card 2: White */}
        <MotionRise delay={0.1} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Total Enrollment</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{formatNumber(admissions.total_enrollment)}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> {admissions.yoy_growth}</div>
              <span>Increased this year</span>
            </div>
          </div>
        </MotionRise>

        {/* Card 3: White */}
        <MotionRise delay={0.14} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Academic Health</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{academic_health.average_gpa}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">School-wide GPA</span>
            </div>
          </div>
        </MotionRise>

        {/* Card 4: White */}
        <MotionRise delay={0.18} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Parent Logins</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{formatNumber(engagement.active_parents)}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Active this week</span>
            </div>
          </div>
        </MotionRise>

      </MotionStagger>

      {/* Main Content Area */}
      <MotionStagger className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Side (Analytics, Reminders, Leads, etc) */}
        <MotionRise delay={0.1} className="lg:col-span-9 flex flex-col gap-3">
          
          {/* Top Row of Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
            
            {/* Quick Staff Roster List */}
            <div className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-normal text-gray-900">Staff Availability</h3>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between gap-4">
                {staffList.map((stf, idx) => (
                  <div key={stf.id || idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={`/photo0${(idx % 3) + 1}.jpeg`} alt={stf.full_name} className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
                      <div>
                        <h4 className="text-base font-normal text-gray-900">{stf.full_name}</h4>
                        <p className="text-sm text-gray-500">Department: <span className="font-medium text-gray-700">{stf.department}</span></p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">
                      {stf.leave_status === 'ON_DUTY' ? 'On Duty' : stf.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Progress Donut */}
            <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-normal text-gray-900 mb-6 self-start">Bursary Collection</h3>
              
              <div className="relative w-full aspect-[2/1] max-w-[260px] flex items-end justify-center mt-2 mb-4">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <defs>
                    <pattern id="stripes-arc" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke="#d1d5db" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="url(#stripes-arc)" strokeWidth="15" strokeLinecap="round" strokeDasharray="125.66 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#111827" strokeWidth="15" strokeLinecap="round" strokeDasharray="115.0 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#146ef5" strokeWidth="15" strokeLinecap="round" strokeDasharray={`${((revenue.collection_pct || 85) / 100) * 125.66} 125.66`} strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end translate-y-[15%]">
                  <span className="text-5xl font-normal tracking-tight text-gray-900">{revenue.collection_pct || 96}%</span>
                  <span className="text-xs font-medium text-gray-500 mt-1">Term Fees Settled</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto w-full justify-center pt-6">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#146ef5]"></div><span className="text-xs text-gray-500 font-medium">Collected</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#111827]"></div><span className="text-xs text-gray-500 font-medium">Invoiced</span></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, #d1d5db 1px, #d1d5db 3px)' }}></div>
                  <span className="text-xs text-gray-500 font-medium">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </MotionRise>

        {/* Right Sidebar Stack */}
        <MotionRise delay={0.14} className="lg:col-span-3 flex flex-col gap-3">
          
          {/* Recent Activity */}
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Campus Notices</h3>
            <div className="flex-1 flex flex-col gap-6 pb-2">
              {noticesList.map((not, idx) => (
                <div key={not.id || idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center shrink-0">
                    <CheckCircleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{not.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{not.category} · {not.event_date || 'Active'}</p>
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
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            
            <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Time Tracker</h3>
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

        </MotionRise>

      </MotionStagger>
    </MotionRise>
  );
}
