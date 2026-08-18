"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  Layers, 
  Plus, 
  Search, 
  MoreVertical, 
  Users,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const classesData = [
  { id: 1, name: "SSS 3", level: "Senior Secondary", students: 45, teachers: 8 },
  { id: 2, name: "SSS 2", level: "Senior Secondary", students: 52, teachers: 8 },
  { id: 3, name: "SSS 1", level: "Senior Secondary", students: 48, teachers: 7 },
  { id: 4, name: "JSS 3", level: "Junior Secondary", students: 60, teachers: 6 },
  { id: 5, name: "JSS 2", level: "Junior Secondary", students: 55, teachers: 6 },
  { id: 6, name: "JSS 1", level: "Junior Secondary", students: 65, teachers: 5 },
];

export default function ManageClassesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Manage Classes" />
        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-[32px]" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Manage Classes" />
      
      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Academic Classes</h2>
            <p className="text-sm text-muted-foreground">Define and manage the grade levels and classes in your school.</p>
          </div>
          <Button className="bg-green hover:bg-green/90 text-navy font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Class
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classes..." 
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map((cls) => (
            <div key={cls.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-green/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                  <Layers className="w-6 h-6" />
                </div>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
              <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-bold">{cls.level}</p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Users className="w-4 h-4 text-muted-foreground" />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">{cls.students}</div>
                      <div className="text-[8px] text-muted-foreground uppercase font-bold">Students</div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">{cls.teachers}</div>
                      <div className="text-[8px] text-muted-foreground uppercase font-bold">Teachers</div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
