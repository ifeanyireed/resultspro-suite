'use client';

import React from 'react';
import { 
  ChartPieIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function ParentResultsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academics & Results</h1>
          <p className="text-sm text-gray-500 mt-1">Review Alex's latest grades and term reports.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download Latest Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-normal text-gray-900 mb-6">Recent Assessments</h3>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', score: '92%', grade: 'A', date: 'Oct 12' },
              { subject: 'Physics', score: '88%', grade: 'B+', date: 'Oct 10' },
              { subject: 'English Lit.', score: '95%', grade: 'A+', date: 'Oct 05' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#146ef5] transition-colors cursor-pointer group">
                <div>
                  <h4 className="font-medium text-gray-900">{r.subject}</h4>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-gray-900">{r.score}</span>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    {r.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm border border-gray-100 text-white relative overflow-hidden flex flex-col justify-between aspect-video">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="relative z-10 flex justify-between items-start">
            <h3 className="text-xl font-normal">Term GPA Target</h3>
            <ChartPieIcon className="w-6 h-6 text-white/50" />
          </div>
          <div className="relative z-10">
            <h2 className="text-6xl font-medium tracking-tight mb-2">3.8</h2>
            <p className="text-sm text-white/80">Currently on track for Honor Roll.</p>
          </div>
        </div>
      </div>
    </>
  );
}
