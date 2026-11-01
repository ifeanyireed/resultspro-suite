'use client';

import React from 'react';
import { 
  ArrowUpRightIcon,
  CodeBracketIcon,
  TrophyIcon,
  DocumentCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function AdminCohortsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Future Skills & Cohorts</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor Courses coding, AI, and project outcomes across the school.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Total Enrolled Learners */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Enrolled Learners</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">145</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> +12</div>
              <span>New this term</span>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Active Portfolios</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <CodeBracketIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">82</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">Live</div>
              <span>Projects published</span>
            </div>
          </div>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Certificates</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <DocumentCheckIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">56</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Issued this academic year</span>
            </div>
          </div>
        </div>

        {/* Competitions / Hackathons */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Awards</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              <TrophyIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">3</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Hackathon wins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Table Area */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Program Health</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Cohort Name</th>
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Enrollment</th>
                  <th className="px-6 py-4">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Grade 8 - Robotics Core', mentor: 'David E.', students: 42, completion: 85 },
                  { name: 'Grade 9 - Intro to AI', mentor: 'Sarah M.', students: 38, completion: 92 },
                  { name: 'Grade 10 - Web Dev', mentor: 'Michael T.', students: 45, completion: 60 },
                  { name: 'Grade 7 - Scratch Basic', mentor: 'Anna K.', students: 20, completion: 100 },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.mentor}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5]">
                        {c.students} Students
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm text-gray-900">
                        <span>{c.completion}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${c.completion >= 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} 
                            style={{ width: `${c.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spotlight Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <h3 className="text-xl font-normal text-gray-900 mb-6">Student Spotlight</h3>
            <div className="flex-1 flex flex-col gap-6">
              {[
                { name: 'Chidi Okoro', project: 'Smart Home IoT Kit', level: 'Grade 10' },
                { name: 'Aisha Bello', project: 'Python Chatbot', level: 'Grade 9' },
                { name: 'Tomiwa Ade', project: '3D Unity Game', level: 'Grade 8' }
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    <img src={`/avatars/character${i + 4}.jpg`} alt={s.name} className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div>
                    <h4 className="text-base font-normal text-gray-900">{s.name}</h4>
                    <p className="text-sm text-[#146ef5] font-medium mt-0.5">{s.project}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.level}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm font-semibold text-[#146ef5] hover:text-[#105bd1] transition-colors py-2">
              View All Portfolios &rarr;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
