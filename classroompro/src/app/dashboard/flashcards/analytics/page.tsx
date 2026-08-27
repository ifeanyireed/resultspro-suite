"use client";

import { IconTrendingUp as TrendingUp, IconTarget as Target, IconAward as Award, IconStack2 as Layers, IconClock as Clock, IconBolt as Zap, IconFlame as Flame, IconShield as ShieldAlert, IconArrowLeft as ArrowLeft } from '@tabler/icons-react';
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlashcardAnalyticsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/gamification/profile');
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived dynamic data
  const sessions = useMemo(() => profile?.sessions || [], [profile]);
  
  const retentionData = useMemo(() => [
    { name: 'New', value: 120, color: '#3b82f6' },
    { name: 'Learning', value: sessions.filter((s:any) => s.activity === 'Flashcards').length, color: '#f59e0b' },
    { name: 'Review', value: sessions.length, color: '#10b981' },
    { name: 'Mastered', value: (profile?.profile?.xp / 100) || 0, color: '#8b5cf6' },
  ], [profile, sessions]);

  const studyTimeData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const studyTimeMap: Record<string, number> = {};
    days.forEach(d => studyTimeMap[d] = 0);

    sessions.forEach((s: any) => {
      const dayName = days[new Date(s.createdAt).getDay()];
      studyTimeMap[dayName] += s.duration || 0;
    });

    return days.map(day => ({
      day,
      mins: studyTimeMap[day] || (day === 'Mon' ? 20 : 0)
    }));
  }, [sessions]);

  const accuracyData = useMemo(() => [
    { name: 'Mon', pct: 75 },
    { name: 'Tue', pct: 82 },
    { name: 'Wed', pct: profile?.profile?.currentStreak > 0 ? 85 : 40 },
    { name: 'Thu', pct: 85 },
    { name: 'Fri', pct: 90 },
    { name: 'Sat', pct: 88 },
    { name: 'Sun', pct: 92 },
  ], [profile]);

  const leeches = [
    { title: "Krebs Cycle Steps", subject: "Biology", count: 12 },
    { title: "Quadratic Formula", subject: "Math", count: 8 },
    { title: "Valency Table", subject: "Chemistry", count: 7 },
  ];

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <Skeleton className="h-4 w-64 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-16 w-80 rounded-2xl" />
          </div>
          
          <Skeleton className="h-40 w-full rounded-[40px]" />

          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-[450px] rounded-[32px]" />
            <Skeleton className="lg:col-span-2 h-[450px] rounded-[32px]" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded-[32px]" />
            <Skeleton className="h-80 rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/dashboard/flashcards">
                 <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                 </button>
              </Link>
              <div>
                 <h2 className="text-3xl font-bold text-gray-900 font-display">Command Center</h2>
                 <p className="text-gray-500 text-sm">Visualize your memory retention and study habits.</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3 bg-white shadow-sm border border-gray-100 p-2 rounded-2xl backdrop-blur-md">
              <div className="px-4 py-2 flex flex-col items-center">
                 <div className="flex items-center gap-1.5 text-amber-600-500">
                    <Flame className="w-4 h-4 fill-current" />
                    <span className="text-lg font-black">{profile?.profile?.currentStreak || 1}</span>
                 </div>
                 <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Streak</span>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="px-4 py-2 flex flex-col items-center">
                 <div className="flex items-center gap-1.5 text-[#146ef5]">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-lg font-black">{profile?.profile?.xp || 0}</span>
                 </div>
                 <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total XP</span>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="px-4 py-2 flex flex-col items-center">
                 <div className="flex items-center gap-1.5 text-emerald-600">
                    <Award className="w-4 h-4" />
                    <span className="text-lg font-black">{profile?.profile?.level || 1}</span>
                 </div>
                 <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Level</span>
              </div>
           </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white shadow-sm border border-gray-100 p-8 rounded-[40px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue/5 blur-[100px] rounded-full -mr-48 -mt-48" />
           <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Current Level</h3>
                    <p className="text-3xl font-black text-gray-900">Level {profile?.profile?.level || 1}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-gray-900 mb-1">{(profile?.profile?.xp % 500) || 0} / 500 XP</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Next Level: {((profile?.profile?.level || 1) + 1)}</p>
                 </div>
              </div>
              <div className="h-4 w-full bg-[#146ef5] rounded-full overflow-hidden p-1 border border-white/5">
                 <div 
                   className="h-full bg-gradient-to-r from-blue to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                   style={{ width: `${((profile?.profile?.xp % 500) / 500) * 100}%` }}
                 />
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Retention Forecast */}
           <div className="lg:col-span-1 bg-white shadow-sm border border-gray-100 rounded-[32px] p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-[#146ef5]" /> Retention Forecast
              </h3>
              <div className="flex-1 min-h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={retentionData}
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                       >
                          {retentionData.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0A0F1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         itemStyle={{ color: '#fff' }}
                       />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                 {retentionData.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-xs text-gray-500 font-bold uppercase">{item.name}</span>
                       <span className="text-xs text-gray-900 font-bold ml-auto">{item.value}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Performance Trends */}
           <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Success Rates
                 </h3>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">AVG: 84%</span>
                 </div>
              </div>
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accuracyData}>
                       <defs>
                          <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                       <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis hide />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0A0F1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       />
                       <Area type="monotone" dataKey="pct" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPct)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Time Spent Heatmap-like chart */}
           <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-amber-600-500" /> Study Time (Minutes)
              </h3>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studyTimeData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                       <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis hide />
                       <Tooltip 
                         cursor={{fill: 'rgba(255,255,255,0.05)'}}
                         contentStyle={{ backgroundColor: '#0A0F1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       />
                       <Bar dataKey="mins" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Knowledge Gaps (Leeches) */}
           <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" /> Knowledge Gaps
                 </h3>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Identified Leeches</span>
              </div>
              <div className="space-y-3">
                 {leeches.map((leech, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between group hover:bg-red-500/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                             <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 text-sm group-hover:text-red-400 transition-colors">{leech.title}</h4>
                             <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{leech.subject}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-red-500">{leech.count} fails</p>
                          <button className="text-[9px] font-bold text-gray-500 hover:text-gray-900 underline">Target Study</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Badges Snapshot */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
           <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" /> Achievements
           </h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: "Flashcard Novice", icon: "📚", desc: "1 hour of study" },
                { name: "Flashcard Sage", icon: "🧙‍♂️", desc: "10 hours of study" },
                { name: "Flame Keeper", icon: "🔥", desc: "7 day study streak" },
                { name: "Deep Reader", icon: "🧐", desc: "3 hours reading" },
                { name: "Scholar", icon: "🎓", desc: "Master 500 cards" },
                { name: "Unstoppable", icon: "🛡️", desc: "100 correct in a row" },
              ].map((badge) => {
                 const isEarned = profile?.badges?.some((b: any) => b.name === badge.name);
                 return (
                    <div key={badge.name} className={cn(
                      "flex flex-col items-center text-center gap-3 p-4 rounded-3xl border transition-all",
                      isEarned ? "bg-white shadow-sm border border-gray-100 border-green/20" : "bg-white/[0.02] border-white/5 grayscale opacity-40"
                    )}>
                       <div className="text-4xl">{badge.icon}</div>
                       <div>
                          <p className="text-xs font-bold text-gray-900 mb-1">{badge.name}</p>
                          <p className="text-[8px] text-gray-500 leading-tight">{badge.desc}</p>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </main>
    </div>
  );
}
