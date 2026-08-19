"use client";

import React, { useState } from 'react';
import { 
  PlusIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  TicketIcon,
  FaceSmileIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tickets, resolve issues, and delight our users.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New Ticket
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            My Queue
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
            <h3 className="text-xl font-normal text-white">Resolved Tickets</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">245</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 12%</div>
              <span>Increased from last week</span>
            </div>
          </div>
        </div>

        {/* Card 2: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Open Tickets</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">12</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-green-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700 flex items-center gap-1"><ArrowTrendingDownIcon className="w-3 h-3"/> 8%</div>
              <span>Decreased from last week</span>
            </div>
          </div>
        </div>

        {/* Card 3: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Avg Response Time</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">1.5h</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 2%</div>
              <span>Higher than average</span>
            </div>
          </div>
        </div>

        {/* Card 4: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Customer CSAT</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">98%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Top performer status</span>
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
            {/* Analytics Bar Chart (Mock) */}
            <div className="lg:col-span-6 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-normal text-gray-900 mb-6">Ticket Volume</h3>
              <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2">
                {[
                  { h: '40%', type: 'stripe' },
                  { h: '60%', type: 'solid-dark' },
                  { h: '85%', type: 'solid-light', tooltip: '120 Tickets' },
                  { h: '50%', type: 'solid-dark' },
                  { h: '70%', type: 'stripe' },
                  { h: '35%', type: 'stripe' },
                  { h: '45%', type: 'stripe' },
                ].map((bar, i) => (
                  <div key={i} className="w-[12%] flex flex-col items-center gap-3">
                    <div className="w-full relative flex items-end h-[140px]">
                      {bar.tooltip && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-sm text-xs font-bold px-2 py-1 rounded">
                          {bar.tooltip}
                        </div>
                      )}
                      <div 
                        className={`w-full rounded-full transition-all hover:opacity-80 ${
                          bar.type === 'solid-dark' ? 'bg-[#146ef5]' : 
                          bar.type === 'solid-light' ? 'bg-[#6ba0f5]' : 
                          'bg-gray-100'
                        }`}
                        style={{ 
                          height: bar.h,
                          backgroundImage: bar.type === 'stripe' ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, #d1d5db 5px, #d1d5db 7px)' : 'none'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {['S','M','T','W','T','F','S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders / Next Actions */}
            <div className="lg:col-span-3 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
              <div>
                <h3 className="text-xl font-normal text-gray-900 mb-6">Urgent Action</h3>
                <h4 className="text-xl font-normal text-gray-900 leading-tight mb-2">Kings College<br/>API Downtime</h4>
                <p className="text-sm text-gray-500 mb-8 flex items-center gap-2">
                  SLA Breach in 30 mins
                </p>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
                <PlayIcon className="w-5 h-5 fill-current" />
                Resolve Now
              </button>
            </div>

          </div>

          {/* Bottom Row of Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
            
            {/* Active Tickets List */}
            <div className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-normal text-gray-900">Active Tickets</h3>
                <button className="text-[#146ef5] text-xs font-semibold px-3 py-1.5 border border-[#146ef5] rounded-full flex items-center gap-1 hover:bg-[#eef5ff] transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center border border-white shadow-sm group-hover:bg-[#146ef5] group-hover:text-white transition-colors">
                      <TicketIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-normal text-gray-900">Billing issue for Term 3</h4>
                      <p className="text-sm text-gray-500">Greenwood High • <span className="font-medium text-gray-700">Waiting for Reply</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-md">Pending</span>
                </div>
                
                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-white shadow-sm group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <TicketIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-normal text-gray-900">System 500 Error</h4>
                      <p className="text-sm text-gray-500">Excel Academy • <span className="font-medium text-gray-700">Investigating</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">In Progress</span>
                </div>

                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-white shadow-sm group-hover:bg-gray-500 group-hover:text-white transition-colors">
                      <TicketIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-normal text-gray-900">Feature Request: Reports</h4>
                      <p className="text-sm text-gray-500">Springfield High • <span className="font-medium text-gray-700">Logged</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">Open</span>
                </div>
              </div>
            </div>

            {/* SLA Progress Donut */}
            <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-normal text-gray-900 mb-6 self-start">SLA Compliance</h3>
              
              <div className="relative w-full aspect-[2/1] max-w-[260px] flex items-end justify-center mt-2 mb-4">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <defs>
                    <pattern id="stripes-arc" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke="#d1d5db" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="url(#stripes-arc)" strokeWidth="15" strokeLinecap="round" strokeDasharray="125.66 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#111827" strokeWidth="15" strokeLinecap="round" strokeDasharray="115 125.66" strokeDashoffset="0" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#146ef5" strokeWidth="15" strokeLinecap="round" strokeDasharray="100 125.66" strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end translate-y-[15%]">
                  <span className="text-5xl font-normal tracking-tight text-gray-900">92%</span>
                  <span className="text-xs font-medium text-gray-500 mt-1">Within SLA</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto w-full justify-center pt-6">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#146ef5]"></div><span className="text-xs text-gray-500 font-medium">Met SLA</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#111827]"></div><span className="text-xs text-gray-500 font-medium">At Risk</span></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, #d1d5db 1px, #d1d5db 3px)' }}></div>
                  <span className="text-xs text-gray-500 font-medium">Breached</span>
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
                  <p className="text-base font-normal text-gray-900">Ticket Resolved</p>
                  <p className="text-sm text-gray-500 mt-0.5">Lighthouse Academy password reset</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center shrink-0">
                  <UserGroupIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">Ticket Escalated</p>
                  <p className="text-sm text-gray-500 mt-0.5">Assigned to Tech Team</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <FaceSmileIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-normal text-gray-900">CSAT Received</p>
                  <p className="text-sm text-gray-500 mt-0.5">5 stars from Excel Academy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] p-6 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('/abstract-blue-4.jpg')" }}
            ></div>
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            
            <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Shift Status</h3>
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
              <div className="text-5xl font-medium tracking-tight mb-8 font-sans">04:12:33</div>
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
