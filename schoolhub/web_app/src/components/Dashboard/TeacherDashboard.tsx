'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Book02Icon, 
  Task01Icon, 
  UserGroupIcon,
  Calendar03Icon,
  Tick02Icon,
  AlertCircleIcon
} from 'hugeicons-react';
import WelcomeBanner from './WelcomeBanner';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        <WelcomeBanner 
          title={`Good morning, ${data.teacher_name || 'Teacher'}`} 
          description={`You have ${data.today_classes?.length || 0} classes today. Your first class starts in 15 minutes. Have a great day teaching!`} 
          monsterSrc="/monster_meditating.png" 
          backgroundColor="#10b981"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.stats?.map((stat: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="text-sm font-bold text-gray-500 mb-4">{stat.label}</div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ color: stat.color, background: stat.bg }}>
                  {stat.icon === 'book' && <Book02Icon size={24} />}
                  {stat.icon === 'task' && <Task01Icon size={24} />}
                  {stat.icon === 'users' && <UserGroupIcon size={24} />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <p className="text-xs font-semibold text-gray-400">{stat.sub}</p>
              {stat.link && <a href="#" className="text-xs font-bold mt-3 hover:underline" style={{ color: stat.color }}>{stat.link}</a>}
            </div>
          ))}
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Calendar03Icon size={20} color="#10b981" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Today's Classes</h2>
              </div>
              <span className="text-sm font-semibold text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            <div className="relative pt-4">
              {/* Hours Grid */}
              {['08:00', '09:00', '10:00', '11:00', '12:00'].map((hour) => (
                <div key={hour} className="flex gap-4 mb-12 relative group">
                  <span className="text-xs font-bold text-gray-400 w-10 text-right shrink-0">{hour}</span>
                  <div className="flex-1 border-b border-gray-100 group-hover:border-gray-200 transition-colors" />
                </div>
              ))}

              {/* Events Overlay (Simplified to basic list for Tailwind refactor since absolute positioning relies on exact heights) */}
              <div className="absolute inset-0 pl-14 pt-4 pb-4">
                <div className="flex flex-col gap-4">
                  {data.today_classes?.map((cls: any) => (
                    <div 
                      key={cls.id} 
                      className="rounded-xl p-4 border-l-4 shadow-sm"
                      style={{ background: cls.bg || '#f0fdf4', borderColor: cls.border || '#10b981' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{cls.name}</span>
                          <span className="text-xs font-semibold text-gray-500">{cls.time}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-white px-2 py-1 rounded-md" style={{ background: cls.color || '#10b981' }}>{cls.status} • {cls.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Task01Icon size={20} color="#f59e0b" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Assessments</h2>
              </div>
              <a href="#" className="text-sm font-semibold text-[#146ef5] hover:underline">View All</a>
            </div>
            <div className="flex flex-col gap-4">
              {data.assessments?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Task01Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                    <span className="text-xs font-medium text-gray-500">{item.class} • {item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-gray-900">{item.graded}</span>
                    <span className="block text-[10px] font-semibold text-gray-400 uppercase">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Teacher Tasks</h2>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">High Priority</div>
        <div className="flex flex-col gap-4 mb-6">
          {data.tasks?.high_priority?.map((task: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md border border-gray-200 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-800 leading-snug truncate">{task.title}</h4>
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-red-500">
                  <AlertCircleIcon size={12} color="currentColor" />
                  <span>Due</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</div>
        <div className="flex flex-col gap-4 mb-6">
          {data.tasks?.general?.map((task: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md border border-gray-200 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-800 leading-snug truncate">{task.title}</h4>
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                  <Calendar03Icon size={12} color="currentColor" />
                  <span>{task.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Completed</div>
        <div className="flex flex-col gap-4">
          {data.tasks?.completed?.map((task: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center mt-0.5 shrink-0">
                <Tick02Icon size={12} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-400 leading-snug truncate line-through">{task.title}</h4>
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                  <Tick02Icon size={12} color="currentColor" />
                  <span>Done</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
