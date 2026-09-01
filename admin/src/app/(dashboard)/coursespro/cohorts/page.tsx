'use client';

import React from 'react';
import { 
  PlusIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function CohortsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cohort Configurator</h2>
          <p className="text-sm text-gray-500 mt-1">Schedule, assign mentors, and track cohort capacity.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          New Cohort
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-video relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <h3 className="text-xl font-normal text-white z-10">Active Cohorts</h3>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">4</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">Live</div>
              <span>Across 3 Programs</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Capacity</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">85%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> +5%</div>
              <span>Seat fill rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Upcoming & Active</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Cohort Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Mentors</th>
              <th className="px-6 py-4">Students</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'Fall 2026 - UX Design', status: 'Active', color: 'emerald', mentors: 3, students: 42 },
              { name: 'Fall 2026 - Frontend', status: 'Active', color: 'emerald', mentors: 4, students: 50 },
              { name: 'Winter 2026 - Backend', status: 'Onboarding', color: 'blue', mentors: 2, students: 28 },
            ].map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold bg-${c.color}-50 text-${c.color}-600`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.mentors} Assigned</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserGroupIcon className="w-4 h-4" />
                    {c.students} / 50
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
