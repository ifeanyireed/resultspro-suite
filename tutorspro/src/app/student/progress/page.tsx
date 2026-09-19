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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
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
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                My Progress
              </h1>
              <p className="text-sm text-gray-500">Track your learning journey and subject mastery.</p>
            </div>
            <button className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all">
              <Download className="w-4 h-4" /> EXPORT REPORT
            </button>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat: any, i: number) => {
               const Icon = getIcon(stat.icon || stat.label);
               return (
                  <div key={i} className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                     <div className={`w-12 h-12 rounded-2xl ${stat.bg?.replace('bg-white/5', 'bg-blue-50') || 'bg-gray-50'} ${stat.color?.replace('text-white', 'text-gray-900') || 'text-[#146ef5]'} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                     </div>
                     <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                     <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
               );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Mastery (Left) */}
            <div className="lg:col-span-2 space-y-6">
              <section className="p-8 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-normal text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Subject Mastery
                  </h2>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target: 85% All</div>
                </div>
                
                <div className="space-y-6">
                  {subjectMastery.map((sub: any) => (
                    <div key={sub.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${sub.color?.replace('bg-', 'text-') || 'text-[#146ef5]'} bg-gray-50 flex items-center justify-center`}>
                             <Brain className="w-4 h-4" />
                          </div>
                          <span className="text-gray-900 font-semibold text-sm">{sub.name}</span>
                        </div>
                        <span className="text-gray-900 font-bold text-sm">{sub.score}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${sub.color || 'bg-[#146ef5]'} rounded-full transition-all duration-1000`}
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Assessment History */}
              <section>
                <h2 className="text-xl font-normal text-gray-900 mb-4">Assessment History</h2>
                <div className="space-y-3">
                  {recentAssessments.map((item: any) => (
                    <div key={item.id} className="p-5 rounded-[1.25rem] bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-all">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{item.score}</div>
                          <div className="text-[10px] font-bold uppercase text-emerald-500 tracking-widest">{item.status}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-6">
              {/* Study Time Stats */}
              <section className="p-6 rounded-[1.5rem] bg-gradient-to-br from-[#146ef5]/5 to-transparent border border-[#146ef5]/10 shadow-sm">
                 <div className="flex items-center gap-2 text-[#146ef5] font-semibold text-sm mb-4">
                   <Clock className="w-4 h-4" /> Learning Hours
                 </div>
                 <div className="text-4xl font-bold tracking-tight text-gray-900 mb-2">{learningHours.total}</div>
                 <p className="text-xs text-gray-500 mb-8">You&apos;ve studied <span className="font-medium text-gray-700">{learningHours.trend}</span> more than last week!</p>
                 
                 <div className="grid grid-cols-7 gap-1.5 h-24 items-end">
                   {learningHours.daily.map((h: number, i: number) => (
                     <div key={i} className="bg-[#146ef5]/20 rounded-t-md hover:bg-[#146ef5] transition-all cursor-pointer" style={{ height: `${Math.max(h, 5)}%` }} />
                   ))}
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">
                   <span>Mon</span>
                   <span>Sun</span>
                 </div>
              </section>

              {/* Next Milestones */}
              <section className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm">
                 <h3 className="text-base font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
                 <div className="space-y-5">
                   {milestones.map((m: any, i: number) => (
                     <div key={i} className="flex gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                       <div>
                         <div className="text-sm text-gray-900 font-medium leading-snug mb-0.5">{m.title}</div>
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
