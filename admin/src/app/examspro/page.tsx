'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Sparkles, Swords, BookOpen, Trophy, Plus, FileText } from 'lucide-react';

export default function ExamsProAdminPage() {
  const exams = [
    { id: '1', name: 'WASSCE (WAEC) May/June Mock', body: 'WAEC', questions: 1450, candidates: 3200, status: 'ACTIVE' },
    { id: '2', name: 'UTME (JAMB) CBT Simulation 2026', body: 'JAMB', questions: 2800, candidates: 5400, status: 'ACTIVE' },
    { id: '3', name: 'BECE Junior Secondary Exam', body: 'NECO', questions: 950, candidates: 1800, status: 'ACTIVE' },
    { id: '4', name: 'Cambridge IGCSE Mathematics', body: 'Cambridge', questions: 620, candidates: 450, status: 'ACTIVE' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="examsPRO CBT Command Center"
        subtitle="Oversight of computer-based testing, question banks, and live battle rooms"
      />

      <div className="p-8 space-y-8">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-purple-600 mb-2">
              <BookOpen className="w-5 h-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Total Question Bank</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">5,820 Questions</p>
            <p className="text-xs text-slate-500 mt-1">Across 18 WAEC & JAMB subjects</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <Swords className="w-5 h-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Live Battle Arena</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">42 Concurrent Matches</p>
            <p className="text-xs text-slate-500 mt-1">WebSocket multiplayer wager rooms</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600 mb-2">
              <Trophy className="w-5 h-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Leaderboard ELO</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">10,850 Candidates</p>
            <p className="text-xs text-slate-500 mt-1">Ranked dynamically by speed & accuracy</p>
          </div>
        </div>

        {/* Exam Catalog Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">Standardized National Exam Catalogs</h3>
            <button className="bg-purple-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors flex items-center space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>Add Exam Standard</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Examination Name</th>
                  <th className="px-4 py-3">Exam Body</th>
                  <th className="px-4 py-3">Question Pool</th>
                  <th className="px-4 py-3">Candidates Registered</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{exam.name}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-semibold">{exam.body}</td>
                    <td className="px-4 py-3.5 text-slate-900 font-bold">{exam.questions.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-600">{exam.candidates.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={exam.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
