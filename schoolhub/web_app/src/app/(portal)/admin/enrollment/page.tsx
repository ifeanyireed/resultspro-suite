
'use client';

import React from 'react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpRightIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function EnrollmentDashboard() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enrollment CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor admissions and student growth.</p>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Total Students</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">1,248</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> +12%</div>
              <span>vs Last Month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">New Admissions</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">94%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> +2.4%</div>
              <span>vs Last Month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Retention Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">342</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Total this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Capacity</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">89%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Overall average</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        <div className="lg:col-span-9 flex flex-col gap-3">
          
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
            
            <div className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-normal text-gray-900">Recent Activity</h3>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                        <img src="/photo01.jpeg" alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
                    <div>
                      <h4 className="text-base font-normal text-gray-900">System Update</h4>
                      <p className="text-sm text-gray-500">Processed <span className="font-medium text-gray-700">Records</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                        <img src="/photo02.jpeg" alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
                    <div>
                      <h4 className="text-base font-normal text-gray-900">Data Sync</h4>
                      <p className="text-sm text-gray-500">Connecting <span className="font-medium text-gray-700">API</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-md">Pending</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-normal text-gray-900 mb-6 self-start">Target Progress</h3>
              
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
                  <span className="text-xs font-medium text-gray-500 mt-1">Target Reached</span>
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

        <div className="lg:col-span-3 flex flex-col gap-3">
          
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Alerts</h3>
            <div className="flex-1 flex flex-col gap-8 pb-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">Sync Complete</p>
                  <p className="text-sm text-gray-500 mt-0.5">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center shrink-0">
                  <UserPlusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">New Target</p>
                  <p className="text-sm text-gray-500 mt-0.5">Assigned to team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
