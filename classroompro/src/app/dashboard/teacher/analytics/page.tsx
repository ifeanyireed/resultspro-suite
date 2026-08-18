"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  { label: "Content Engagement", value: "84%", trend: "+5.2%", positive: true, icon: <BookOpen className="w-5 h-5" />, color: "text-green", bg: "bg-green/10" },
  { label: "Avg. Quiz Score", value: "72%", trend: "-2.1%", positive: false, icon: <BrainCircuit className="w-5 h-5" />, color: "text-amber", bg: "bg-amber/10" },
  { label: "Completion Rate", value: "68%", trend: "+12.4%", positive: true, icon: <TrendingUp className="w-5 h-5" />, color: "text-blue", bg: "bg-blue/10" },
  { label: "Active Students", value: "112", trend: "+3", positive: true, icon: <Users className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const topicPerformance = [
  { topic: "Cell Structure", score: 88, status: "Excellent" },
  { topic: "Photosynthesis", score: 64, status: "Needs Review" },
  { topic: "Genetics", score: 76, status: "Good" },
  { topic: "Ecosystems", score: 92, status: "Excellent" },
];

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <DashboardHeader title="Performance Analytics" />
        <div className="p-8 space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-80 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[24px]" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[400px] rounded-[32px]" />
            <Skeleton className="h-[400px] rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Performance Analytics" />
      
      <main className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Teaching Insights</h2>
            <p className="text-sm text-muted-foreground">Detailed breakdown of how your students are performing.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                <Calendar className="w-4 h-4 mr-2" /> Last 30 Days
             </Button>
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                <Filter className="w-4 h-4 mr-2" /> All Classes
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div className={cn("flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full", 
                  stat.positive ? "bg-green/20 text-green" : "bg-red-400/20 text-red-400"
                )}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart Placeholder */}
           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-white font-display">Student Activity Over Time</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green" />
                       <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Notes Read</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue" />
                       <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Quizzes Taken</span>
                    </div>
                 </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                 {[45, 62, 38, 85, 74, 52, 90, 68, 42, 58, 77, 82].map((height, i) => (
                    <div key={i} className="flex-1 space-y-2 group">
                       <div className="relative w-full h-full flex items-end gap-1">
                          <div 
                            className="w-full bg-green/20 group-hover:bg-green/40 transition-all rounded-t-sm" 
                            style={{ height: `${height}%` }} 
                          />
                          <div 
                            className="w-full bg-blue/20 group-hover:bg-blue/40 transition-all rounded-t-sm" 
                            style={{ height: `${height - 10}%` }} 
                          />
                       </div>
                       <div className="text-[8px] text-center text-muted-foreground font-bold uppercase">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Topic performance */}
           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-white font-display mb-6">Topic Performance</h3>
              <div className="space-y-6">
                 {topicPerformance.map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white/80">{item.topic}</span>
                          <span className={cn("font-bold", 
                             item.status === "Excellent" ? "text-green" : 
                             item.status === "Good" ? "text-blue" : "text-amber"
                          )}>{item.score}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                             className={cn("h-full transition-all", 
                                item.status === "Excellent" ? "bg-green" : 
                                item.status === "Good" ? "bg-blue" : "bg-amber"
                             )} 
                             style={{ width: `${item.score}%` }} 
                          />
                       </div>
                       <div className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{item.status}</div>
                    </div>
                 ))}
              </div>
              <Button className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 h-11 font-bold text-xs">
                 Generate Full Report
              </Button>
           </div>
        </div>
      </main>
    </div>
  );
}
