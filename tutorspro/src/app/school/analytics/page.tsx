"use client";

import { IconTrendingUp as TrendingUp, IconUsers as Users, IconBookOpen as BookOpen, IconClock as Clock, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconFilter as Filter, IconCalendar as Calendar, IconDownload as Download } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAnalytics } from '@/lib/school.api';

interface AnalyticsData {
  totalLearningHours: number;
  activeStudents: number;
  completedClasses: number;
  avgMasteryScore: number;
  attendanceTrends: number[];
  subjectPerformance: { name: string; score: number }[];
  topPerformingClasses: { name: string; engagement: string; xp: string; completion: string }[];
}

export default function SchoolAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error("Failed to load analytics data.");
    } finally {
      setIsLoading(false);
    }
  };

  const overviewStats = analytics ? [
    { label: 'Total Learning Hours', value: analytics.totalLearningHours.toLocaleString(), trend: '+12%', icon: Clock, color: 'text-purple' },
    { label: 'Active Students', value: analytics.activeStudents.toLocaleString(), trend: '+5%', icon: Users, color: 'text-blue' },
    { label: 'Completed Classes', value: analytics.completedClasses.toLocaleString(), trend: '-2%', icon: BookOpen, color: 'text-green' },
    { label: 'Avg Mastery Score', value: `${analytics.avgMasteryScore}%`, trend: '+8%', icon: TrendingUp, color: 'text-amber' },
  ] : [];

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-8 text-center text-red-500">Could not load analytics data.</div>;
  }

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Usage Analytics</h1>
            <p className="text-gray-400">Deep dive into engagement trends and performance metrics across your school.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
               <Calendar className="w-5 h-5 text-gray-400" /> Last 30 Days
            </button>
            <button className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-sm">
               <Download className="w-5 h-5" /> Export Data
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {overviewStats.map((stat, i) => (
             <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green' : 'text-rose'}`}>
                      {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   </div>
                </div>
                <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-white">Attendance Trends</h3>
              </div>
              <div className="h-64 flex items-end justify-between gap-4">
                 {analytics.attendanceTrends.map((h, i) => (
                    <div key={i} className="flex-1 space-y-2 group cursor-help">
                       <div className="relative h-full flex flex-col justify-end">
                          <div className="bg-purple/20 rounded-t-lg w-full absolute bottom-0 transition-all group-hover:bg-purple/30" style={{ height: `${h}%` }} />
                          <div className="bg-purple rounded-t-lg w-full relative z-10 transition-all group-hover:scale-x-110" style={{ height: `${h - 15}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-white">Subject Performance</h3>
              </div>
              <div className="space-y-6">
                 {analytics.subjectPerformance.map((subject, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                         <span className="text-white font-medium">{subject.name}</span>
                         <span className="text-gray-400">{subject.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full bg-blue rounded-full transition-all duration-1000`} style={{ width: `${subject.score}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Engagement Table */}
        <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
           <h3 className="text-xl font-bold text-white mb-8">Top Performing Classes</h3>
           <div className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5">
                       <th className="py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Class Name</th>
                       <th className="py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Engagement</th>
                       <th className="py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Avg XP</th>
                       <th className="py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Completion</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {analytics.topPerformingClasses.map((row, i) => (
                      <tr key={i} className="group">
                         <td className="py-6 text-sm text-white font-medium group-hover:text-purple transition-colors">{row.name}</td>
                         <td className="py-6">
                            <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 font-bold uppercase">{row.engagement}</span>
                         </td>
                         <td className="py-6 text-sm text-gray-400 font-mono">{row.xp}</td>
                         <td className="py-6 text-sm text-white font-bold text-right">{row.completion}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </div>
    </main>
  );
}
