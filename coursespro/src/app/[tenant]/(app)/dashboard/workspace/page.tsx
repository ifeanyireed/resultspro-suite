"use client";
import React from 'react';
import { PlusIcon, ChatBubbleLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function WorkspacePage() {
  const columns = [
    { name: 'To Do', count: 3, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
    { name: 'In Progress', count: 2, color: 'bg-blue-50 text-[#146ef5]', dot: 'bg-[#146ef5]' },
    { name: 'In Review', count: 1, color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
    { name: 'Done', count: 5, color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  ];

  const tasks = [
    { title: 'Draft API Schema', col: 'In Progress', tags: ['Backend'], comments: 4, attachments: 2 },
    { title: 'Setup UI Library', col: 'To Do', tags: ['Frontend'], comments: 0, attachments: 1 },
    { title: 'Peer Review Auth', col: 'In Review', tags: ['Security'], comments: 12, attachments: 0 },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sprint tasks and project deliverables.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(col => (
          <div key={col.name} className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></div>
                <h3 className="font-medium text-gray-900">{col.name}</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${col.color}`}>{col.count}</span>
            </div>
            
            {tasks.filter(t => t.col === col.name).map((task, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer group">
                <h4 className="text-sm font-medium text-gray-900 mb-3">{task.title}</h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><ChatBubbleLeftIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.comments}</span></div>
                    <div className="flex items-center gap-1"><PaperClipIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.attachments}</span></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}