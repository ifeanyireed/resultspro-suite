import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Sparkles, Swords, BookOpen, Trophy, Plus, RefreshCw } from 'lucide-react';
import { fetchExamproExams, fetchExamproOverview } from '@/lib/api';

export default function OverviewTab() {
  const [exams, setExams] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [examsData, overviewData] = await Promise.all([
        fetchExamproExams(),
        fetchExamproOverview()
      ]);
      setExams(Array.isArray(examsData) ? examsData : []);
      setOverview(overviewData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-600 mb-2">
            <BookOpen className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Total Candidates</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">{overview?.totalUsers?.toLocaleString() || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Across all registered schools</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Swords className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Live Battle Arena</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">{overview?.activeBattles || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Active WebSocket multiplayer matches</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <Trophy className="w-5 h-5" />
            <h4 className="font-bold text-xs uppercase tracking-wider">New Registrations</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">+{overview?.newUsers24h || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Candidates joined in the last 24h</p>
        </div>
      </div>

      {/* Exam Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-slate-900">Standardized National Exam Catalogs</h3>
            <button onClick={loadData} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>
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
                  <td className="px-6 py-4 text-slate-600 font-semibold">{exam.category}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{exam.subjects?.length || 0} subjects</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{exam.yearRange || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Badge status={exam.status || 'ACTIVE'} />
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
