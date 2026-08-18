"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  BrainCircuit,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const schoolStatsData = [
  { label: "Active Students", value: "1,240", trend: "+12%", positive: true, icon: <Users className="w-5 h-5" />, color: "text-blue", bg: "bg-blue/10" },
  { label: "Content Created", value: "458", trend: "+24", positive: true, icon: <BookOpen className="w-5 h-5" />, color: "text-green", bg: "bg-green/10" },
  { label: "Avg. Test Score", value: "76%", trend: "+3.4%", positive: true, icon: <BrainCircuit className="w-5 h-5" />, color: "text-amber", bg: "bg-amber/10" },
  { label: "Engagement Rate", value: "88%", trend: "-2%", positive: false, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
];

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="School Reports" />
        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <div className="flex gap-3">
               <Skeleton className="h-11 w-32 rounded-xl" />
               <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[500px] rounded-[32px]" />
            <Skeleton className="h-[500px] rounded-[32px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="School Reports" />
      
      <main className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Academic Analytics</h2>
            <p className="text-sm text-muted-foreground">Comprehensive insights into your school's performance.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                <Calendar className="w-4 h-4 mr-2" /> Annual Report
             </Button>
             <Button className="bg-green hover:bg-green/90 text-navy font-bold">
                <Download className="w-4 h-4 mr-2" /> Export PDF
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schoolStatsData.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                  stat.positive ? "bg-green/20 text-green" : "bg-red-400/20 text-red-400"
                )}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Performance by Class */}
           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-white font-display mb-8">Performance by Class</h3>
              <div className="space-y-6">
                 {[
                    { class: "SSS 3", score: 85, color: "bg-green" },
                    { class: "SSS 2", score: 72, color: "bg-blue" },
                    { class: "SSS 1", score: 78, color: "bg-amber" },
                    { class: "JSS 3", score: 92, color: "bg-purple-400" },
                    { class: "JSS 2", score: 65, color: "bg-red-400" },
                    { class: "JSS 1", score: 81, color: "bg-green" },
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-white/80">
                          <span>{item.class}</span>
                          <span>{item.score}%</span>
                       </div>
                       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.score}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Subject Distribution */}
           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-white font-display mb-8">Engagement by Subject</h3>
              <div className="aspect-square relative flex items-center justify-center mb-8">
                 {/* CSS Mock Pie Chart */}
                 <div className="w-48 h-48 rounded-full border-[16px] border-green/20 border-t-green border-r-blue/80 border-l-amber/60 flex items-center justify-center">
                    <div className="text-center">
                       <div className="text-2xl font-bold text-white">84%</div>
                       <div className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Global Avg.</div>
                    </div>
                 </div>
              </div>
              <div className="space-y-3">
                 {[
                    { label: "Science", val: "42%", color: "bg-green" },
                    { label: "Arts", val: "28%", color: "bg-blue" },
                    { label: "Commercial", val: "20%", color: "bg-amber" },
                    { label: "Vocational", val: "10%", color: "bg-purple-400" },
                 ].map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                       <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", it.color)} />
                          <span className="text-muted-foreground">{it.label}</span>
                       </div>
                       <span className="text-white">{it.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
