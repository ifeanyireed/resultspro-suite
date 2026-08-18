import React, { useState } from 'react';
import { BookOpen, Search, Filter, Plus, Upload, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/Badge';

export default function QuestionsTab() {
  const [questions] = useState([
    { id: 'QST-001', text: 'What is 2 + 2?', subject: 'Mathematics', exam: 'JAMB', type: 'MCQ', difficulty: 'Easy', status: 'Published' },
    { id: 'QST-002', text: 'Explain the process of photosynthesis.', subject: 'Biology', exam: 'WAEC', type: 'Theory', difficulty: 'Medium', status: 'Draft' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" /> Question Bank
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage and curate examination questions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search questions..." className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all" />
        </div>
        <div className="flex-1 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium">
            <option>All Exams</option>
            <option>JAMB</option>
            <option>WAEC</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Biology</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Question Details</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Metadata</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-purple-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-mono text-purple-600 text-[10px] font-bold mb-1">{q.id}</p>
                    <p className="font-bold text-slate-800 text-xs truncate max-w-sm">{q.text}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{q.exam}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{q.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{q.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
