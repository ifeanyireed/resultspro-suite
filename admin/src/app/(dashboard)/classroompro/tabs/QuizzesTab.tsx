import React from 'react';
import { Badge } from '@/components/Badge';
import { FileText, Search, Plus, Play } from 'lucide-react';

export default function QuizzesTab() {
  const quizzes = [
    { id: '1', title: 'Calculus Integration Final', subject: 'Mathematics', questions: 25, duration: 45, status: 'PUBLISHED' },
    { id: '2', title: 'Cell Biology Weekly Assessment', subject: 'Biology', questions: 15, duration: 20, status: 'DRAFT' },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <button className="bg-emerald-600 text-white px-3.5 py-2 rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Quiz Title</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Time Limit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{quiz.title}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold">{quiz.subject}</td>
                <td className="px-4 py-3.5 text-slate-800">{quiz.questions} Qs</td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{quiz.duration} mins</td>
                <td className="px-4 py-3.5">
                  <Badge status={quiz.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full transition-colors inline-flex items-center">
                    <Play className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
