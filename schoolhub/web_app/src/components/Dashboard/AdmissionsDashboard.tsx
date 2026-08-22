'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Calendar03Icon,
  StarIcon,
  ArrowUp01Icon,
  Activity04Icon,
  Mail01Icon,
  Task01Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';

export default function AdmissionsDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/admissions/inquiries'),
      api.get('/admin/admissions/pipeline')
    ])
      .then(([inquiriesRes, pipelineRes]) => {
        setInquiries(inquiriesRes.data || []);
        setPipelineData(pipelineRes.data);
      })
      .catch(err => console.error('Failed to load admissions data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !pipelineData) {
    return <div className="flex items-center justify-center p-8 text-gray-500 min-h-[50vh]">Loading Admissions Insights...</div>;
  }

  const stats = [
    { label: 'Total Inquiries', value: pipelineData.total_inquiries, icon: Mail01Icon, color: '#3b82f6', bg: '#eff6ff', trend: '+12%' },
    { label: 'Tours Scheduled', value: pipelineData.tours_scheduled, icon: Calendar03Icon, color: '#8b5cf6', bg: '#f3e8ff', trend: '+5%' },
    { label: 'Applications', value: pipelineData.applications_submitted, icon: Task01Icon, color: '#f59e0b', bg: '#fffbeb', trend: '+18%' },
    { label: 'Enrolled', value: pipelineData.enrolled, icon: StarIcon, color: '#10b981', bg: '#ecfdf5', trend: '+2%' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        <WelcomeBanner 
          title="Admissions Command Center" 
          description="Manage your prospective student pipeline and enrollment metrics." 
          monsterSrc="/monster-reading.png" 
          backgroundColor="#4f46e5"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-gray-300 transition-colors cursor-pointer">
              <div className="text-sm font-bold text-gray-500 mb-4">{stat.label}</div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ color: stat.color, background: stat.bg }}>
                  <stat.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded">
                <ArrowUp01Icon size={14} /> {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline & Inquiries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Inquiries</h2>
              <a href="#" className="text-sm font-semibold text-[#146ef5] hover:underline">View All</a>
            </div>
            <div className="flex flex-col gap-3">
              {inquiries.slice(0, 4).map((inquiry: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-sm font-bold">
                    {inquiry.student_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{inquiry.student_name}</h4>
                    <span className="text-xs font-medium text-gray-500">{inquiry.parent_name} • {inquiry.grade_interested}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">{inquiry.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
             <Activity04Icon size={48} className="text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-gray-900 mb-2">Funnel Analytics</h3>
             <p className="text-sm text-gray-500 max-w-sm">Detailed conversion rates and pipeline insights will appear here once more data is collected this term.</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Upcoming Tours</h2>
        
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors cursor-pointer">
            <h4 className="text-sm font-bold text-gray-900 mb-1">The Smith Family</h4>
            <div className="text-xs font-semibold text-gray-500 mb-3">Grade 9 • Transfer</div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-max">
              <Calendar03Icon size={14} /> Today, 2:00 PM
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors cursor-pointer">
            <h4 className="text-sm font-bold text-gray-900 mb-1">Johnson Twins</h4>
            <div className="text-xs font-semibold text-gray-500 mb-3">Grade 6 • New</div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-max">
              <Calendar03Icon size={14} /> Tomorrow, 10:30 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
