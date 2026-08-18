import React from 'react';
import { Badge } from '@/components/Badge';
import { Sparkles, Swords, BookOpen, Trophy, Plus } from 'lucide-react';

export default function OverviewTab() {
  const exams = [
    { id: '1', name: 'WASSCE (WAEC) May/June Mock', body: 'WAEC', questions: 1450, candidates: 3200, status: 'ACTIVE' },
    { id: '2', name: 'UTME (JAMB) CBT Simulation 2026', body: 'JAMB', questions: 2800, candidates: 5400, status: 'ACTIVE' },
    { id: '3', name: 'BECE Junior Secondary Exam', body: 'NECO', questions: 950, candidates: 1800, status: 'ACTIVE' },
    { id: '4', name: 'Cambridge IGCSE Mathematics', body: 'Cambridge', questions: 620, candidates: 450, status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-600 mb-2">
            <BookOpen className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Total Question Bank</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">5,820</p>
          <p className="text-xs text-slate-500 mt-1">Across 18 WAEC & JAMB subjects</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Swords className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Live Battle Arena</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">42</p>
          <p className="text-xs text-slate-500 mt-1">Active WebSocket multiplayer matches</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <Trophy className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Leaderboard ELO</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">10,850</p>
          <p className="text-xs text-slate-500 mt-1">Ranked dynamically by speed & accuracy</p>
        </div>
      </div>

      {/* Exam Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-base text-slate-900">Standardized National Exam Catalogs</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-700 transition-colors flex items-center space-x-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Exam Standard</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Examination Name</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Exam Body</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Question Pool</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Candidates</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">{exam.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{exam.body}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{exam.questions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{exam.candidates.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge status={exam.status} />
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
