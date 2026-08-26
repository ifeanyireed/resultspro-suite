"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconCalendar as Calendar, IconPlus as Plus, IconClock as Clock, IconSettings as Settings, IconDotsVertical as MoreVertical } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const termsData = [
  { id: 1, name: "1st Term", session: "2025/2026", status: "Active", dates: "Sept 12 - Dec 18", progress: 65 },
  { id: 2, name: "2nd Term", session: "2025/2026", status: "Upcoming", dates: "Jan 10 - April 15", progress: 0 },
  { id: 3, name: "3rd Term", session: "2025/2026", status: "Upcoming", dates: "May 5 - July 30", progress: 0 },
  { id: 4, name: "3rd Term", session: "2024/2025", status: "Completed", dates: "May 2 - July 28", progress: 100 },
];

export default function ManageTermsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Academic Terms" />
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
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-32 w-full rounded-[32px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Academic Terms" />
      
      <main className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Academic Calendar</h2>
            <p className="text-sm text-muted-foreground">Manage terms, academic sessions, and key dates.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                <Settings className="w-4 h-4 mr-2" /> Session Settings
             </Button>
             <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" /> Create New Term
             </Button>
          </div>
        </div>

        <div className="grid gap-4">
           {termsData.map((term) => (
              <div key={term.id} className={cn(
                 "p-6 rounded-[24px] border flex items-center justify-between transition-all",
                 term.status === "Active" ? "bg-white/5 border-green/30" : "bg-white/[0.02] border-white/10 opacity-70"
              )}>
                 <div className="flex items-center gap-6">
                    <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                       term.status === "Active" ? "bg-green/10 text-green" : "bg-white/5 text-muted-foreground"
                    )}>
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white">{term.name}</h3>
                          <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.2em]",
                             term.status === "Active" ? "bg-green-600 text-white" : "bg-white/10 text-muted-foreground"
                          )}>
                             {term.status}
                          </span>
                       </div>
                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-bold text-white/60">{term.session}</span>
                          <div className="flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {term.dates}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-8">
                    <div className="hidden md:block w-48">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                          <span className="text-muted-foreground">Term Progress</span>
                          <span className="text-white">{term.progress}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all", term.status === "Active" ? "bg-green" : "bg-muted-foreground")} style={{ width: `${term.progress}%` }} />
                       </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           ))}
        </div>

        <div className="bg-blue/10 border border-blue/20 p-8 rounded-[32px] flex items-center justify-between">
           <div>
              <h4 className="text-lg font-bold text-white mb-1">Automatic Promotion</h4>
              <p className="text-sm text-blue/80">Schedule student promotion to next class levels for the upcoming academic session.</p>
           </div>
           <Button className="bg-blue hover:bg-blue/80 text-white font-bold h-11 px-8 rounded-xl">
              Configure Promotion
           </Button>
        </div>
      </main>
    </div>
  );
}
