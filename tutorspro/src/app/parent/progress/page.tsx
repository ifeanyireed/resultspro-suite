"use client";

import api from '@/lib/api';
import { IconTrendingUp as TrendingUp, IconUser as User, IconBrain as Brain, IconChartBar as BarChart3, IconChevronRight as ChevronRight, IconArrowUpRight as ArrowUpRight, IconTarget as Target, IconClock as Clock, IconLayoutDashboard as LayoutDashboard, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentProgress() {
  const [mounted, setMounted] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await api.get('/parent/children');
      setChildren(res.data);
      if (res.data.length > 0) {
        setSelectedChildId(res.data[0].id);
        fetchProgress(res.data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load children');
      setLoading(false);
    }
  };

  const fetchProgress = async (childId: string) => {
    setLoadingProgress(true);
    try {
      const res = await api.get(`/parent/progress/${childId}`);
      setProgressData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchProgress(selectedChildId);
    }
  }, [selectedChildId]);

  if (!mounted) return null;

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Progress <span className="text-blue">Analytics</span>
            </h1>
            <p className="text-gray-400">Deep-dive into subject mastery and learning trends.</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedChildId === child.id ? 'bg-blue text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {child.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
            <p className="text-white font-bold">Loading dashboard...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="mt-12 py-20 text-center rounded-[40px] border-2 border-dashed border-white/5">
             <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-gray-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No children linked</h3>
             <p className="text-sm text-gray-500">Link a child account to see their progress analytics.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loadingProgress ? 'opacity-50' : 'opacity-100'}`}>
            {/* Main Analytics (Left) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Subject Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {progressData?.subject_mastery.map((data: any, i: number) => (
                   <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                         <Brain className="w-24 h-24" />
                      </div>
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h3 className="text-xl font-bold text-white mb-1">{data.name}</h3>
                            <div className={`text-xs font-bold flex items-center gap-1 ${data.trend.startsWith('+') ? 'text-green' : 'text-red-400'}`}>
                               <ArrowUpRight className="w-3 h-3" /> {data.trend} this month
                            </div>
                         </div>
                         <div className="text-3xl font-display font-black text-white">{data.score}%</div>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className={`h-full ${data.color || 'bg-blue'} rounded-full transition-all duration-1000`} 
                           style={{ width: `${data.score}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>

              {/* Learning Velocity Chart Placeholder */}
              <section className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                       <TrendingUp className="w-6 h-6 text-green" /> Learning Velocity
                    </h2>
                    <div className="flex gap-2">
                       {['1W', '1M', '3M', '1Y'].map(t => (
                          <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-black ${t === '1M' ? 'bg-white/10 text-white' : 'text-gray-600'}`}>{t}</button>
                       ))}
                    </div>
                 </div>
                 <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[30, 45, 35, 60, 55, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                       <div key={i} className="flex-1 bg-gradient-to-t from-blue/20 to-blue/60 rounded-t-xl hover:to-blue transition-all cursor-help relative group" style={{ height: `${h}%` }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-navy text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {h}%
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <span>Jan</span>
                    <span>Dec</span>
                 </div>
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
               {/* Target Goals */}
               <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-amber/10 text-amber flex items-center justify-center mb-6">
                     <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-4">Current Goals</h3>
                  <div className="space-y-6">
                     {progressData?.goals.map((goal: any, i: number) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                             <span className="text-white">{goal.title}</span>
                             <span className="text-gray-500">{goal.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-amber rounded-full" style={{ width: `${goal.progress}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </section>

               {/* Activity Snapshot */}
               <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                     {progressData?.recent_activity.map((act: any, i: number) => (
                       <div key={i} className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${act.color}`}>
                             {act.type === 'quiz' ? <Brain className="w-5 h-5" /> : act.type === 'class' ? <Clock className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                          </div>
                          <div>
                             <div className="text-sm text-white font-bold">{act.msg}</div>
                             <div className="text-[10px] text-gray-500 uppercase font-black">{act.time}</div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-all">
                     Full Activity Log
                  </button>
               </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
