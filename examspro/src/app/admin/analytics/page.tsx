"use client";

import { 
  TrendingUp, 
  Target, 
  Download,
  Clock,
  Brain,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface AnalyticsData {
  engagement: Array<{ label: string, total: number, correct: number, percentage: number }>;
  popularSubjects: Array<{ name: string, count: number, percentage: number, color: string }>;
  stats: {
    avgSessionTime: string;
    questionsToday: number;
    aiExplanations: number;
    totalUsers: number;
  };
  acquisition: number[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/analytics/stats');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <AdminHeader title="Detailed Analytics" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/[0.1] border-t-white/[0.15]">
            <button className="px-4 py-1.5 text-xs font-bold bg-white/10 shadow-sm rounded-lg text-white">7 Days</button>
            <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">30 Days</button>
            <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">1 Year</button>
          </div>
          <Button variant="outline" className="rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white font-bold text-xs gap-2 hover:bg-white/10">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[450px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-display font-bold text-white text-lg">Question Engagement</h3>
                <p className="text-xs text-gray-500">Total answers vs correctly answered ratio</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Incorrect</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2">
              {data.engagement.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-64">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-green transition-all duration-1000 group-hover:bg-green/80" 
                      style={{ height: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: "Avg. Session Time", value: data.stats.avgSessionTime, trend: "+2.1%", icon: Clock, color: "blue" },
              { label: "Questions / Today", value: data.stats.questionsToday.toLocaleString(), trend: "+12.4%", icon: Target, color: "green" },
              { label: "AI Explanations", value: data.stats.aiExplanations.toLocaleString(), trend: "+5.8%", icon: Brain, color: "purple" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:border-white/10 group">
                <div className="flex justify-between items-center mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 text-gray-400 group-hover:text-white transition-colors flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-black text-green flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-display font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Top Subjects */}
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="font-display font-bold text-white text-lg mb-6">Popular Subjects</h3>
            <div className="space-y-6">
              {data.popularSubjects.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                    <span className="text-xs text-gray-500 font-bold">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Acquisition Sources */}
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col">
            <h3 className="font-display font-bold text-white text-lg mb-8">Acquisition</h3>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-48 h-48 rounded-full border-[16px] border-white/5 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-green border-t-transparent border-r-transparent border-b-transparent rotate-[45deg]" />
                <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-l-transparent border-r-transparent border-b-transparent rotate-[180deg]" />
                <div className="text-center">
                  <div className="text-2xl font-display font-black text-white">{data.stats.totalUsers.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Total Users</div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Organic", value: "45%", color: "bg-green" },
                { label: "Referral", value: "30%", color: "bg-blue-500" },
                { label: "Social", value: "20%", color: "bg-purple-500" },
                { label: "Other", value: "5%", color: "bg-white/10" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{s.label} {s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Table - Kept Mocked for now as backend doesn't calculate cohorts yet */}
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="font-display font-bold text-white text-lg mb-6">User Retention</h3>
            <div className="space-y-4">
              {[
                { cohort: "March 1-7", size: "1,200", d1: "65%", d7: "42%", d30: "28%" },
                { cohort: "Feb 22-28", size: "1,050", d1: "60%", d7: "38%", d30: "25%" },
                { cohort: "Feb 15-21", size: "980", d1: "62%", d7: "40%", d30: "26%" },
                { cohort: "Feb 8-14", size: "1,150", d1: "68%", d7: "45%", d30: "30%" },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div>
                    <div className="text-xs font-bold text-white">{c.cohort}</div>
                    <div className="text-[10px] text-gray-500 font-medium">n={c.size}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">D1</div>
                      <div className="text-xs font-black text-green">{c.d1}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">D7</div>
                      <div className="text-xs font-black text-blue-400">{c.d7}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
