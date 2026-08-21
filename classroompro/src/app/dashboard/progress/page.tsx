"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconTrendingUp as TrendingUp, IconBarChart3 as BarChart3, IconTarget as Target, IconAward as Award, IconChevronRight as ChevronRight, IconClock as Clock, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconArrowLeft as ArrowLeft, IconCalendar as Calendar, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/progress/overview");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => [
    { label: "Overall Mastery", value: `${data?.overallMastery || 0}%`, icon: <Target className="w-5 h-5" />, color: "text-blue", bg: "bg-blue/10" },
    { label: "Total Points", value: (data?.totalPoints || 0).toLocaleString(), icon: <Award className="w-5 h-5" />, color: "text-green", bg: "bg-green/10" },
    { label: "Study Streak", value: `${data?.streak || 0} Days`, icon: <TrendingUp className="w-5 h-5" />, color: "text-amber", bg: "bg-amber/10" },
    { label: "Hours Studied", value: "24h", icon: <Clock className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
  ], [data]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Learning Progress" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
          </div>
          <div className="grid lg:grid-cols-12 gap-8">
            <Skeleton className="lg:col-span-8 h-96 rounded-[40px]" />
            <Skeleton className="lg:col-span-4 h-96 rounded-[40px]" />
          </div>
          <Skeleton className="h-64 w-full rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Learning Progress" />
      
      <main className="p-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Performance Analytics</h2>
            <p className="text-muted-foreground text-sm">Detailed breakdown of your learning journey and mastery.</p>
          </div>
          <Button variant="outline" className="border-white/10 text-white h-11 px-6 rounded-xl font-bold">
            <Calendar className="w-4 h-4 mr-2" /> 1st Term 2024
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[32px] hover:border-white/20 transition-all group">
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                    {stat.icon}
                 </div>
                 <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</div>
              </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
           {/* Subject Progress */}
           <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[40px] p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-white font-display">Syllabus Completion</h3>
                 <div className="text-[10px] font-bold text-green uppercase tracking-widest bg-green/10 px-3 py-1 rounded-full">On Track</div>
              </div>
              
              <div className="space-y-8">
                 {(data?.subjectProgress || []).map((item: any, i: number) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-white/90">{item.name}</span>
                          <span className="text-muted-foreground font-mono">{item.percentage}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                             className={cn("h-full transition-all duration-1000", i % 3 === 0 ? "bg-blue" : i % 3 === 1 ? "bg-green" : "bg-amber")} 
                             style={{ width: `${item.percentage}%` }} 
                          />
                       </div>
                    </div>
                 ))}
                 {(data?.subjectProgress?.length === 0) && (
                   <div className="py-20 text-center text-muted-foreground italic text-sm">No subject data available yet.</div>
                 )}
              </div>
           </div>

           {/* Skills Radar / Recent Achievements */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 h-full">
                 <h3 className="text-xl font-bold text-white font-display mb-8">Recent Milestones</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                          <Award className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm text-white font-bold">Fast Learner</p>
                          <p className="text-xs text-muted-foreground">Completed 5 notes in one day.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                       <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
                          <BrainCircuit className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm text-white font-bold">Quiz Master</p>
                          <p className="text-xs text-muted-foreground">Score 100% in 10 unique quizzes.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                       <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0">
                          <TrendingUp className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm text-white font-bold">Top 10%</p>
                          <p className="text-xs text-muted-foreground">Rank in the top 10% of your class.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Activity Heatmap Area */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white font-display">Study Consistency</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 Less <div className="flex gap-1"><div className="w-2 h-2 bg-white/5 rounded-sm"/><div className="w-2 h-2 bg-green/20 rounded-sm"/><div className="w-2 h-2 bg-green/40 rounded-sm"/><div className="w-2 h-2 bg-green/60 rounded-sm"/><div className="w-2 h-2 bg-green rounded-sm"/></div> More
              </div>
           </div>
           
           <div className="h-32 w-full flex gap-1 overflow-hidden">
              {Array.from({ length: 52 }).map((_, i) => (
                 <div key={i} className="flex-1 flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, j) => {
                       const intensity = Math.random();
                       return (
                          <div 
                             key={j} 
                             className={cn("w-full aspect-square rounded-sm", 
                                intensity > 0.8 ? "bg-green" : 
                                intensity > 0.5 ? "bg-green/40" : 
                                intensity > 0.2 ? "bg-green/20" : "bg-white/5"
                             )} 
                          />
                       );
                    })}
                 </div>
              ))}
           </div>
           <div className="mt-4 flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
              <span>January</span>
              <span>March</span>
              <span>May</span>
              <span>July</span>
              <span>September</span>
              <span>November</span>
              <span>December</span>
           </div>
        </div>
      </main>
    </div>
  );
}
