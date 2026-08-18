"use client";

import React from 'react';
import { 
  PlusIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function LeadRegistrationPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">Register new schools and track their onboarding progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Registration Form */}
        <div className="lg:col-span-1 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Register New School</h3>
            <p className="text-xs text-gray-500 mt-1">Generate a unique tracking link.</p>
          </div>
          
          <form className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">School Name</label>
              <div className="relative">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="e.g. Greenwood High" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact Person</label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Principal's Name" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" placeholder="admin@school.com" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400" />
              </div>
            </div>

            <button type="button" className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-4">
              <LinkIcon className="w-4 h-4" />
              Generate Invite Link
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-[#111827] rounded-[1.5rem] p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,20 Q25,10 50,30 T100,20 L100,100 L0,100 Z" fill="#146ef5" />
                <path d="M0,40 Q25,30 50,50 T100,40 L100,100 L0,100 Z" fill="#0e4aad" opacity="0.6" />
                <path d="M0,60 Q25,50 50,70 T100,60 L100,100 L0,100 Z" fill="#0a3273" opacity="0.8" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-300 relative z-10">Conversion Rate</h3>
            <div className="relative z-10 mt-4">
              <div className="text-5xl font-medium tracking-wider mb-2 font-mono">68%</div>
              <p className="text-xs text-gray-400">Invited to Completed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-gray-600">Pending Bounties</h3>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">₦250k</h2>
              <p className="text-xs text-gray-500">From 5 schools in 'Completed' stage</p>
            </div>
          </div>
        </div>

      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Lead Status Board</h3>
          <button className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-full flex items-center gap-1 hover:bg-gray-50">
            View Past Wins
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
          
          {/* Column 1: Invited */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col h-full border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-700">Invited</h4>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </div>
            <div className="space-y-3">
              {/* Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-[#146ef5] transition-colors">
                <h5 className="font-bold text-sm text-gray-900">Harvard Int'l</h5>
                <p className="text-[10px] text-gray-500 mt-1">Contact: Dr. Smith</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] font-medium text-gray-400">Sent 2d ago</span>
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[10px]">📧</div>
                </div>
              </div>
              {/* Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-[#146ef5] transition-colors">
                <h5 className="font-bold text-sm text-gray-900">Kings College</h5>
                <p className="text-[10px] text-gray-500 mt-1">Contact: Mrs. Adeyemi</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] font-medium text-gray-400">Sent 5d ago</span>
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[10px]">📧</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form Started */}
          <div className="bg-[#f0f5ff] rounded-xl p-4 flex flex-col h-full border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-[#146ef5]">Form Started</h4>
              <span className="bg-blue-100 text-[#146ef5] text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </div>
            <div className="space-y-3">
              {/* Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-[#146ef5] transition-colors">
                <h5 className="font-bold text-sm text-gray-900">Lighthouse Academy</h5>
                <p className="text-[10px] text-gray-500 mt-1">Setup: 45% Complete</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-[#146ef5] h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-[#fdf8e6] rounded-xl p-4 flex flex-col h-full border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-yellow-600">Completed</h4>
              <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="space-y-3">
              {/* Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-yellow-400 transition-colors">
                <h5 className="font-bold text-sm text-gray-900">Greenwood High</h5>
                <p className="text-[10px] text-gray-500 mt-1">Pending verification</p>
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Awaiting Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Bounty Paid */}
          <div className="bg-[#eefcf5] rounded-xl p-4 flex flex-col h-full border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-emerald-600">Bounty Paid</h4>
              <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="space-y-3">
              {/* Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 opacity-70">
                <h5 className="font-bold text-sm text-gray-900 line-through decoration-emerald-500">Excel Academy</h5>
                <p className="text-[10px] text-gray-500 mt-1">₦50,000 Credited</p>
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Archived</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
