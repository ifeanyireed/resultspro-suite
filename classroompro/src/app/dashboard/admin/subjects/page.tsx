"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBook as BookOpen, IconPlus as Plus, IconSearch as Search, IconDotsVertical as MoreVertical, IconFilter as Filter } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const subjectsData = [
  { id: 1, name: "Mathematics", category: "Science", classes: 12, notes: 145 },
  { id: 2, name: "English Language", category: "Arts", classes: 12, notes: 132 },
  { id: 3, name: "Biology", category: "Science", classes: 6, notes: 98 },
  { id: 4, name: "Physics", category: "Science", classes: 3, notes: 76 },
  { id: 5, name: "Chemistry", category: "Science", classes: 3, notes: 82 },
  { id: 6, name: "Economics", category: "Commercial", classes: 6, notes: 65 },
  { id: 7, name: "Civic Education", category: "General", classes: 12, notes: 45 },
];

export default function ManageSubjectsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Manage Subjects" />
        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
          <div className="flex gap-4">
             <Skeleton className="h-12 flex-1 max-w-md rounded-xl" />
             <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
             </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Manage Subjects" />
      
      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Academic Subjects</h2>
            <p className="text-sm text-muted-foreground">Configure the subjects offered across all grade levels.</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Subject
          </Button>
        </div>

        <div className="flex gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search subjects..." 
               className="pl-10 bg-white/5 border-white/10 text-white"
             />
           </div>
           <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
             <Filter className="w-4 h-4 mr-2" /> All Categories
           </Button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-6">
              {subjectsData.map((sub) => (
                 <div key={sub.id} className="bg-navy/40 border border-white/5 rounded-2xl p-6 hover:border-green/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
                          <BookOpen className="w-5 h-5" />
                       </div>
                       <button className="text-muted-foreground hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green transition-colors">{sub.name}</h3>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{sub.category}</div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest">
                       <div className="text-muted-foreground">
                          <span className="text-white">{sub.classes}</span> Classes
                       </div>
                       <div className="text-muted-foreground">
                          <span className="text-green">{sub.notes}</span> Notes
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
