'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  UserGroupIcon, 
  CreditCardIcon, 
  CheckmarkCircle02Icon, 
  AnalyticsUpIcon,
  Message01Icon,
  Calendar03Icon
} from 'hugeicons-react';
import WelcomeBanner from './WelcomeBanner';
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

  const { stats, children_progress, messages, events, future_events } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        <WelcomeBanner 
          title={`Welcome back, ${data.parent_name || 'Parent'}`} 
          description="Track your children's progress, manage fees, and stay updated with school events." 
          monsterSrc="/monster-reading.png" 
          backgroundColor="#6366f1"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="text-sm font-bold text-gray-500 mb-4">Children Enrolled</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-indigo-600 bg-indigo-50">
                <UserGroupIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.children_count}</h3>
            </div>
            <p className="text-xs font-semibold text-gray-400">{stats.children_names}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="text-sm font-bold text-gray-500 mb-4">School Fees</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-amber-500 bg-amber-50">
                <CreditCardIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending_fees}</h3>
            </div>
            <p className="text-xs font-semibold text-gray-400">Pending fees for Term 3</p>
            <a href="/parent/payments" className="text-xs font-bold mt-3 hover:underline text-amber-500">Pay Now</a>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="text-sm font-bold text-gray-500 mb-4">Attendance</div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-emerald-500 bg-emerald-50">
                <CheckmarkCircle02Icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.attendance}</h3>
            </div>
            <p className="text-xs font-semibold text-gray-400">Average Attendance</p>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <AnalyticsUpIcon size={20} color="#6366f1" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Academic Progress</h2>
              </div>
              <a href="/parent/reports" className="text-sm font-semibold text-[#146ef5] hover:underline">Full Reports</a>
            </div>
            <div className="flex flex-col gap-6">
              {children_progress.map((child: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden relative border border-gray-100">
                        <Image src={child.photo} alt={child.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{child.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{child.grade}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${child.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {child.trend}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${child.score}%`, background: child.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Progress: {child.score}%</span>
                    <span>Goal: 95%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Message01Icon size={20} color="#f59e0b" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Messages from School</h2>
              </div>
              <a href="/parent/communications" className="text-sm font-semibold text-[#146ef5] hover:underline">Inbox</a>
            </div>
            <div className="flex flex-col gap-3">
              {messages.map((msg: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: msg.color + '15', color: msg.color }}>
                    {msg.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{msg.subject}</h4>
                    <span className="text-xs font-medium text-gray-500">{msg.sender}</span>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <Calendar03Icon size={20} color="#6366f1" />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Upcoming Events</h2>
        </div>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">This Week</div>
        <div className="flex flex-col gap-4 mb-8">
          {events.map((event: any, i: number) => (
            <div key={i} className="relative h-[110px] rounded-xl overflow-hidden group shadow-sm border border-gray-100">
              <Image 
                src={event.img} 
                alt={event.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                sizes="(max-width: 768px) 100vw, 340px"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 flex flex-col items-center min-w-[36px] shadow-sm">
                <span className="text-[9px] font-bold text-gray-500 uppercase">{event.month}</span>
                <span className="text-sm font-black text-gray-900 leading-none mt-0.5">{event.day}</span>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight drop-shadow-md">{event.title}</h4>
                  <span className="text-[10px] font-medium text-white/80 mt-1 block">{event.time}</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors cursor-pointer">
                  Details
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Next Week</div>
        <div className="flex flex-col gap-4">
          {future_events.map((event: any, i: number) => (
            <div key={i} className="relative h-[110px] rounded-xl overflow-hidden group shadow-sm border border-gray-100">
              <Image 
                src={event.img} 
                alt={event.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                sizes="(max-width: 768px) 100vw, 340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 flex flex-col items-center min-w-[36px] shadow-sm">
                <span className="text-[9px] font-bold text-gray-500 uppercase">{event.month}</span>
                <span className="text-sm font-black text-gray-900 leading-none mt-0.5">{event.day}</span>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight drop-shadow-md">{event.title}</h4>
                  <span className="text-[10px] font-medium text-white/80 mt-1 block">{event.time}</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors cursor-pointer">
                  Details
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
