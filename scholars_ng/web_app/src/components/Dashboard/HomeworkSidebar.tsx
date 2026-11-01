'use client';

import React from 'react';
import { Tick02Icon, AlertCircleIcon } from 'hugeicons-react';

export default function HomeworkSidebar() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Homework progress</h2>
        <select className="border-none font-bold text-gray-900 outline-none bg-transparent cursor-pointer text-sm">
          <option>All</option>
        </select>
      </div>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">To do</div>
      <div className="flex flex-col gap-4 mb-6">
        {[
          { title: 'Rational inequalities. AI Assessment #5', date: '30 Mar, 2024' },
          { title: 'All about Homestas. Quize', date: '28 Mar, 2024' },
          { title: 'Shapes and Structures', date: '03 Apr, 2024' },
          { title: 'Word Wonders: Unraveling Language', date: '03 Apr, 2024' },
        ].map((task, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md border border-gray-200 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-800 leading-snug truncate">{task.title}</h4>
                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-red-500">
                <AlertCircleIcon size={12} color="currentColor" />
                <span>Deadline</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On review</div>
      <div className="flex flex-col gap-4 mb-6">
        {[
          { title: 'Historical Chronicles: Exploring the Past', date: '30 Mar, 2024' },
          { title: 'Epoch Explorations: Unraveling Timelines', date: '30 Mar, 2024' },
        ].map((task, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md border border-gray-200 mt-0.5 shrink-0 bg-gray-50" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-800 leading-snug truncate">{task.title}</h4>
                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-yellow-500">
                <AlertCircleIcon size={12} color="currentColor" />
                <span>Under Review</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Completed</div>
      <div className="flex flex-col gap-4">
        {[
          { title: 'Physics Phantoms: Unraveling the Laws of Nature', date: '25 Mar, 2024' },
          { title: 'Language Landscapes: Exploring Vocabulary', date: '24 Mar, 2024' },
        ].map((task, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center mt-0.5 shrink-0">
              <Tick02Icon size={12} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-400 leading-snug truncate line-through">{task.title}</h4>
                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{task.date}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                <Tick02Icon size={12} color="currentColor" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
