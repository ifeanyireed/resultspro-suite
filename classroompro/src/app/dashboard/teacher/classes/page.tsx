"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconUsers as Users, IconSearch as Search, IconPlus as Plus, IconBarChart3 as BarChart3 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const classesData = [
  { id: 1, name: "SS3 Biology", students: 42, performance: "82%", term: "1st Term" },
  { id: 2, name: "SS2 Biology", students: 38, performance: "75%", term: "1st Term" },
  { id: 3, name: "SS1 Biology", students: 45, performance: "68%", term: "1st Term" },
  { id: 4, name: "JSS3 General Science", students: 31, performance: "88%", term: "1st Term" },
];

export default function MyClassesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="My Classes" />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 rounded-[32px]" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="My Classes" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Manage Your Classes</h2>
            <p className="text-sm text-muted-foreground">View performance and manage students for each of your assigned classes.</p>
          </div>
          <Button className="bg-green-600 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Request New Class
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search classes..." className="pl-10 h-12 bg-white/5 border-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map((cls) => (
            <div key={cls.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                    <Users className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cls.term}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue transition-colors">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{cls.students} Enrolled Students</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="text-center p-2 rounded-xl bg-white/5">
                    <div className="text-lg font-bold text-white">{cls.performance}</div>
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Perf.</div>
                 </div>
                 <div className="text-center p-2 rounded-xl bg-white/5">
                    <div className="text-lg font-bold text-white">12</div>
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Notes</div>
                 </div>
                 <div className="text-center p-2 rounded-xl bg-white/5">
                    <div className="text-lg font-bold text-white">4</div>
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Quizzes</div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <Link href={`/dashboard/teacher/classes/${cls.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-white/10 text-white text-xs h-10">
                       Manage
                    </Button>
                 </Link>
                 <Link href={`/dashboard/teacher/analytics?classId=${cls.id}`}>
                    <Button variant="outline" className="border-white/10 text-white h-10 px-3">
                       <BarChart3 className="w-4 h-4" />
                    </Button>
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
