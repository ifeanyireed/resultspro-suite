"use client";

import React from 'react';
import { 
  ArrowUpRightIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function AdminDashboardPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Global Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor total system revenue, agent performance, and platform growth.</p>
        </div>
        <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#eef5ff] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Card 1: Primary Dark */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          {/* Subtle Depth Effects */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Total Revenue</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <BanknotesIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">₦12.5M</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 18%</div>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Active Agents</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">48</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">+5</div>
              <span>New this month</span>
            </div>
          </div>
        </div>

        {/* Card 3: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Onboarded Schools</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
              <BuildingOfficeIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">342</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">+24</div>
              <span>New this month</span>
            </div>
          </div>
        </div>

        {/* Card 4: White */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Pending Payouts</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-orange-500 mb-2">₦850k</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Due for 12 agents</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
          <h3 className="text-xl font-normal text-gray-900 mb-6">Revenue Growth</h3>
          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2">
            {[
              { h: '40%', type: 'stripe' },
              { h: '55%', type: 'solid-dark' },
              { h: '50%', type: 'solid-light' },
              { h: '75%', type: 'solid-dark' },
              { h: '65%', type: 'stripe' },
              { h: '85%', type: 'solid-dark', tooltip: '₦3.2M' },
              { h: '100%', type: 'solid-dark', tooltip: '₦4.1M' },
            ].map((bar, i) => (
              <div key={i} className="w-[12%] flex flex-col items-center gap-3">
                <div className="w-full relative flex items-end h-[220px]">
                  {bar.tooltip && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white shadow-sm text-xs font-bold px-2 py-1 rounded">
                      {bar.tooltip}
                    </div>
                  )}
                  <div 
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                      bar.type === 'solid-dark' ? 'bg-[#146ef5]' : 
                      bar.type === 'solid-light' ? 'bg-[#6ba0f5]' : 
                      'bg-gray-200'
                    }`}
                    style={{ 
                      height: bar.h,
                      backgroundImage: bar.type === 'stripe' ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, #d1d5db 5px, #d1d5db 7px)' : 'none'
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-normal text-gray-900">Top Agents</h3>
            <button className="text-xs font-medium text-[#146ef5]">View All</button>
          </div>
          
          <div className="space-y-5">
            {/* Agent 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/character4.jpg" alt="Agent Avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-base font-normal text-gray-900">Totok Michael</h4>
                  <p className="text-sm text-gray-500">12 Schools Onboarded</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">₦1.2M</span>
            </div>
            
            {/* Agent 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/character5.jpg" alt="Agent Avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-base font-normal text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">9 Schools Onboarded</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">₦850k</span>
            </div>

            {/* Agent 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/character6.jpg" alt="Agent Avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-base font-normal text-gray-900">David Adebayo</h4>
                  <p className="text-sm text-gray-500">7 Schools Onboarded</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">₦600k</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
