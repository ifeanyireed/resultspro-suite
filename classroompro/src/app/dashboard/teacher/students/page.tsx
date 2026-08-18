"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconUsers as Users, IconSearch as Search, IconMessageSquare as MessageSquare, IconBarChart3 as BarChart3 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const myClassesData = [
  { id: 1, name: "JSS 2 Science", students: 32, performance: "82%" },
  { id: 2, name: "SSS 1 Biology", students: 28, performance: "75%" },
  { id: 3, name: "SSS 2 Biology", students: 24, performance: "88%" },
];

const topStudentsData = [
  { name: "Jessica Alabi", class: "SSS 2 Biology", score: "96%", avatar: "JA" },
  { name: "Fatima Yusuf", class: "JSS 2 Science", score: "94%", avatar: "FY" },
  { name: "Daniel Smith", class: "SSS 2 Biology", score: "92%", avatar: "DS" },
];

export default function TeacherStudentsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <DashboardHeader title="My Students" />
        <div className="p-8 space-y-8">
           <div className="flex justify-between items-center">
              <div className="space-y-3">
                 <Skeleton className="h-10 w-64 rounded-xl" />
                 <Skeleton className="h-4 w-80 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-48 rounded-xl" />
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[24px]" />)}
                 </div>
                 <Skeleton className="h-64 w-full rounded-[32px]" />
              </div>
              <div className="space-y-6">
                 <Skeleton className="h-96 rounded-[32px]" />
                 <Skeleton className="h-48 rounded-[32px]" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="My Students" />
      
      <main className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Classroom Overview</h2>
            <p className="text-sm text-muted-foreground">Monitor performance across your assigned classes.</p>
          </div>
          <Button className="bg-green hover:bg-green/90 text-navy font-bold">
            <MessageSquare className="w-4 h-4 mr-2" /> Message All Classes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class List */}
          <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myClassesData.map((cls) => (
                   <div key={cls.id} className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-green/50 transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
                            <Users className="w-5 h-5" />
                         </div>
                         <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                            {cls.students} Students
                         </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green transition-colors">{cls.name}</h3>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                         <div className="text-xs text-muted-foreground">Avg. Performance</div>
                         <div className="text-sm font-bold text-green">{cls.performance}</div>
                      </div>
                   </div>
                ))}
             </div>

             <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-white font-display">Student Search</h3>
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Find a student..." className="pl-9 h-9 text-xs bg-navy border-white/10" />
                   </div>
                </div>
                <div className="p-12 text-center">
                   <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-muted-foreground text-sm">Select a class above to view student details <br /> or use search to find a specific student.</p>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                <h3 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                   <BarChart3 className="w-5 h-5 text-amber" /> Top Performers
                </h3>
                <div className="space-y-4">
                   {topStudentsData.map((student, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber/10 text-amber flex items-center justify-center font-bold text-[10px]">
                               {student.avatar}
                            </div>
                            <div>
                               <div className="text-xs font-bold text-white">{student.name}</div>
                               <div className="text-[8px] text-muted-foreground uppercase">{student.class}</div>
                            </div>
                         </div>
                         <div className="text-xs font-bold text-green">{student.score}</div>
                      </div>
                   ))}
                </div>
                <Button variant="link" className="w-full text-green font-bold text-xs mt-4">View Full Leaderboard</Button>
             </div>

             <div className="bg-blue/10 border border-blue/20 p-6 rounded-[32px]">
                <h4 className="text-sm font-bold text-blue uppercase tracking-widest mb-2">Class Insights</h4>
                <p className="text-xs text-blue/80 leading-relaxed italic">
                  "JSS 2 Science is struggling with 'Cell Organelles' based on recent quiz results. Consider a revision session."
                </p>
                <div className="mt-4">
                   <Button size="sm" className="w-full bg-blue text-white hover:bg-blue/80 font-bold text-[10px]">
                      Generate Revision Note
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
