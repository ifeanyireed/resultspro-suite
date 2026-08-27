"use client";

import { IconChartBar as BarChart3, IconTrendingUp as TrendingUp, IconCalendar as Calendar, IconCircleCheck as CheckCircle2, IconTrophy as Trophy, IconClock as Clock, IconBrain as Brain, IconChevronRight as ChevronRight, IconDownload as Download, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function StudentProgress() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/student/progress');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch progress data");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  const stats = data?.stats || [];
  const subjectMastery = data?.subject_mastery || [];
  const recentAssessments = data?.recent_assessments || [];
  const learningHours = data?.learning_hours || { total: "0h", trend: "0%", daily: [] };
  const milestones = data?.milestones || [];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Calendar': return Calendar;
      case 'BarChart3': return BarChart3;
      case 'CheckCircle2': return CheckCircle2;
      case 'Trophy': return Trophy;
      default: return Brain;
    }
  };

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                My <span className="text-green">Progress</span>
              </h1>
              <p className="text-gray-400">Track your learning journey and subject mastery.</p>
            </div>
            <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <Download className="w-5 h-5" /> EXPORT REPORT
            </button>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat: any, i: number) => {
               const Icon = getIcon(stat.icon || stat.label);
               return (
                  <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                     <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                        <Icon className="w-6 h-6" />
                     </div>
                     <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                     <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
                  </div>
               );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Mastery (Left) */}
            <div className="lg:col-span-2 space-y-8">
              <section className="p-8 md:p-10 rounded-[40px] bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green" /> Subject Mastery
                  </h2>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Target: 85% All</div>
                </div>
                
                <div className="space-y-8">
                  {subjectMastery.map((sub: any) => (
                    <div key={sub.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${sub.color}/20 ${sub.color.replace('bg-', 'text-')} flex items-center justify-center`}>
                             <Brain className="w-4 h-4" />
                          </div>
                          <span className="text-white font-bold">{sub.name}</span>
                        </div>
                        <span className="text-white font-black">{sub.score}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${sub.color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Assessment History */}
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6">Assessment History</h2>
                <div className="space-y-4">
                  {recentAssessments.map((item: any) => (
                    <div key={item.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.08] transition-all">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                        <div className="text-right">
                          <div className="text-xl font-display font-bold text-white">{item.score}</div>
                          <div className="text-[10px] font-bold uppercase text-green tracking-widest">{item.status}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
              {/* Study Time Stats */}
              <section className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/10">
                 <div className="flex items-center gap-3 text-blue font-bold mb-6">
                   <Clock className="w-5 h-5" /> Learning Hours
                 </div>
                 <div className="text-5xl font-display font-black text-white mb-2">{learningHours.total}</div>
                 <p className="text-sm text-gray-400 mb-8">You&apos;ve studied {learningHours.trend} more than last week!</p>
                 
                 <div className="grid grid-cols-7 gap-1 h-20 items-end">
                   {learningHours.daily.map((h: number, i: number) => (
                     <div key={i} className="bg-blue/30 rounded-t-lg hover:bg-blue transition-all cursor-pointer" style={{ height: `${h}%` }} />
                   ))}
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-600 font-bold mt-2">
                   <span>MON</span>
                   <span>SUN</span>
                 </div>
              </section>

              {/* Next Milestones */}
              <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                 <h3 className="text-xl font-display font-bold text-white mb-6">Upcoming Milestones</h3>
                 <div className="space-y-6">
                   {milestones.map((m: any, i: number) => (
                     <div key={i} className="flex gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber mt-2 shrink-0" />
                       <div>
                         <div className="text-sm text-white font-bold">{m.title}</div>
                         <div className="text-xs text-gray-500">{m.xp}</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
