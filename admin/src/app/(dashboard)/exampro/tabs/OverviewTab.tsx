import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Sparkles, Swords, BookOpen, Trophy, Plus, RefreshCw } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';
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
    <div className="flex flex-col gap-6 w-full">
      {/* Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <GradientMetricCard
          title="Total Candidates"
          value={overview?.totalUsers?.toLocaleString() || 0}
          subtitle="Registered test-takers"
          trend="+15%"
          icon={BookOpen}
        />
        <WhiteMetricCard
          title="Live Arena"
          value={overview?.activeBattles || 0}
          subtitle="Multiplayer matches"
          trend="+5%"
          trendColor="green"
          icon={Swords}
        />
        <WhiteMetricCard
          title="New Registrations"
          value={`+${overview?.newUsers24h || 0}`}
          subtitle="Joined in last 24h"
          trend="+2%"
          trendColor="green"
          icon={Trophy}
        />
        <WhiteMetricCard
          title="Active Exams"
          value={exams?.length || 0}
          subtitle="Catalogs available"
          trend="+0%"
          trendColor="gray"
          icon={Sparkles}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Standardized National Exam Catalogs" action={
            <div className="flex items-center gap-3">
              <button onClick={loadData} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
              </button>
              <button className="bg-[#146ef5] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#105bd1] transition-colors flex items-center space-x-1.5 shadow-sm">
                <Plus className="w-4 h-4" />
                <span>Add Exam Standard</span>
              </button>
            </div>
          }>
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
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
