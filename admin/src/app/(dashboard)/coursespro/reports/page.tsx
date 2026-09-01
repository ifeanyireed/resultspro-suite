'use client';

import React from 'react';
import { 
  ArrowUpRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Cohort-level and program-level analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart Mock */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Cohort Engagement</h3>
          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2 h-[200px]">
            {[
              { h: '60%', type: 'solid-dark' },
              { h: '80%', type: 'solid-dark' },
              { h: '65%', type: 'solid-light' },
              { h: '90%', type: 'solid-dark' },
              { h: '70%', type: 'solid-light' },
              { h: '45%', type: 'solid-light' },
              { h: '55%', type: 'solid-dark' },
            ].map((bar, i) => (
              <div key={i} className="w-[12%] flex flex-col items-center gap-3">
                <div className="w-full relative flex items-end h-[160px]">
                  <div 
                    className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                      bar.type === 'solid-dark' ? 'bg-[#146ef5]' : 'bg-[#6ba0f5]'
                    }`}
                    style={{ height: bar.h }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  W{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rates */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Completion Rates</h3>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">UX Design Fall '26</span>
                <span className="text-gray-500">82%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#146ef5] h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">Frontend Web Spring '26</span>
                <span className="text-gray-500">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#146ef5] h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">Backend API Winter '25</span>
                <span className="text-gray-500">91%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
