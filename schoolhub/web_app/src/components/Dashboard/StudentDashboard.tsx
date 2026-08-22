'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  TimeQuarterIcon, 
  Home01Icon, 
  StarIcon, 
  Calendar03Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';
import HomeworkSidebar from './HomeworkSidebar';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        
        <WelcomeBanner
          title={`Hello, ${student.first_name}!`}
          description="Ready to learn? You have 4 classes today and 2 pending assignments. Keep up the great work!"
          monsterSrc="/monster-study.png"
          backgroundColor="#146ef5"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TimeQuarterIcon size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">4h 30m</div>
              <div className="text-xs font-medium text-gray-500 uppercase">Learning Time</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Home01Icon size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">85%</div>
              <div className="text-xs font-medium text-gray-500 uppercase">Homework</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
              <StarIcon size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">92%</div>
              <div className="text-xs font-medium text-gray-500 uppercase">Avg Score</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar03Icon size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{attendance.percentage}%</div>
              <div className="text-xs font-medium text-gray-500 uppercase">Attendance</div>
            </div>
          </div>
        </div>

        {/* Schedule & Tests Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Today's Schedule</h3>
              <button className="text-sm font-semibold text-[#146ef5] hover:underline">View Calendar</button>
            </div>
            <div className="flex flex-col gap-4">
              {schedule.today.map((cls: any, i: number) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 text-right">
                    <div className="text-sm font-bold text-gray-900">{cls.time}</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">{cls.duration}</div>
                  </div>
                  <div className={`flex-1 rounded-xl p-4 border-l-4 ${i % 2 === 0 ? 'bg-blue-50/50 border-blue-500' : 'bg-purple-50/50 border-purple-500'}`}>
                    <h4 className="text-sm font-bold text-gray-900">{cls.subject}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 font-medium">Room {cls.room}</span>
                      <span className="text-xs font-semibold text-gray-700">{cls.teacher}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance / Tests */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Academic Progress</h3>
              <button className="text-sm font-semibold text-[#146ef5] hover:underline">Full Report</button>
            </div>
            <div className="flex flex-col gap-5">
              {subjects.map((sub: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-800">{sub.name}</span>
                    <span className="font-bold text-gray-900">{sub.grade}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sub.grade >= 90 ? 'bg-emerald-500' : sub.grade >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${sub.grade}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Upcoming Assessments</h4>
              <div className="flex flex-col gap-3">
                {upcoming_tests.map((test: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{test.subject}</div>
                      <div className="text-xs text-gray-500">{test.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#146ef5]">{test.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Homework) */}
      <div className="lg:col-span-4 xl:col-span-3">
        <HomeworkSidebar />
      </div>

    </div>
  );
}
