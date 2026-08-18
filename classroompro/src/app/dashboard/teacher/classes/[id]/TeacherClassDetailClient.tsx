"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconUsers as Users, IconArrowLeft as ArrowLeft, IconBookOpen as BookOpen, IconBrainCircuit as BrainCircuit, IconGraduationCap as GraduationCap, IconBarChart3 as BarChart3, IconSearch as Search, IconMoreVertical as MoreVertical, IconMail as Mail, IconFilePlus as FilePlus } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const studentsData = [
  { id: 1, name: "Jessica Alabi", email: "jessica.alabi@school.com", score: "96%", status: "Active" },
  { id: 2, name: "Daniel Smith", email: "daniel.smith@school.com", score: "92%", status: "Active" },
  { id: 3, name: "Fatima Yusuf", email: "fatima.yusuf@school.com", score: "88%", status: "Active" },
  { id: 4, name: "Chidi Okafor", email: "chidi.okafor@school.com", score: "85%", status: "Away" },
  { id: 5, name: "Grace Emmanuel", email: "grace.e@school.com", score: "82%", status: "Active" },
];

export function TeacherClassDetailClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Class Details" />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Skeleton className="h-10 w-10 rounded-full" />
                 <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                 </div>
              </div>
              <div className="flex gap-3">
                 <Skeleton className="h-10 w-32 rounded-xl" />
                 <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
           </div>
           <div className="grid lg:grid-cols-3 gap-8">
              <Skeleton className="lg:col-span-2 h-[500px] rounded-[32px]" />
              <Skeleton className="h-[500px] rounded-[32px]" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Class Details" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/dashboard/teacher/classes" className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                 <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                 <h2 className="text-2xl font-bold text-white mb-1">SSS 1 - Mathematics</h2>
                 <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> 32 Students Enrolled
                 </p>
              </div>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="border-white/10 text-white">
                 <Mail className="w-4 h-4 mr-2" /> Message All
              </Button>
              <Button className="bg-green text-navy font-bold">
                 <FilePlus className="w-4 h-4 mr-2" /> Add Material
              </Button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue mb-4">
                 <BarChart3 className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Avg. Performance</p>
              <h4 className="text-2xl font-bold text-white">78%</h4>
           </div>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green mb-4">
                 <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Notes Assigned</p>
              <h4 className="text-2xl font-bold text-white">12</h4>
           </div>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber mb-4">
                 <BrainCircuit className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Active Quizzes</p>
              <h4 className="text-2xl font-bold text-white">4</h4>
           </div>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                 <GraduationCap className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Next Assessment</p>
              <h4 className="text-2xl font-bold text-white">May 15</h4>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Student List */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-white">Student Roster</h3>
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-9 bg-white/5 border-white/10 text-white" />
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Avg. Score</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {studentsData.map((student) => (
                          <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-navy border border-white/10 flex items-center justify-center text-xs font-bold text-green uppercase">
                                      {student.name.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-white">{student.name}</div>
                                      <div className="text-[10px] text-muted-foreground">{student.email}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-navy rounded-full overflow-hidden">
                                      <div className="h-full bg-green" style={{ width: student.score }} />
                                   </div>
                                   <span className="text-xs font-bold text-white">{student.score}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className={cn(
                                   "px-2 py-0.5 rounded text-[10px] font-bold",
                                   student.status === "Active" ? "bg-green/10 text-green" : "bg-white/5 text-muted-foreground"
                                )}>
                                   {student.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                                   <MoreVertical className="w-4 h-4" />
                                </Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Quick Actions / Activity */}
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Class Activity</h3>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                 {[
                    { student: "Jessica Alabi", action: "completed 'Calculus III' note", time: "2m ago" },
                    { student: "Daniel Smith", action: "scored 92% in 'Limits' quiz", time: "15m ago" },
                    { student: "Fatima Yusuf", action: "started studying flashcards", time: "1h ago" },
                 ].map((activity, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-green mt-1.5 shrink-0" />
                       <div>
                          <p className="text-xs text-white/90">
                             <span className="font-bold text-white">{activity.student}</span> {activity.action}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{activity.time}</p>
                       </div>
                    </div>
                 ))}
                 <div className="pt-4 mt-2 border-t border-white/5">
                    <Button variant="ghost" className="w-full text-xs text-blue font-bold">Create new assessment</Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
