"use client";

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
          <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-6">
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
      
      
      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Academic Subjects</h2>
            <p className="text-sm text-gray-500">Configure the subjects offered across all grade levels.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Subject
          </Button>
        </div>

        <div className="flex gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
             <Input 
               placeholder="Search subjects..." 
               className="pl-10 bg-white shadow-sm border border-gray-100 border-gray-100 text-gray-900"
             />
           </div>
           <Button variant="outline" className="border-gray-100 hover:bg-gray-50 text-gray-900">
             <Filter className="w-4 h-4 mr-2" /> All Categories
           </Button>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-6">
              {subjectsData.map((sub) => (
                 <div key={sub.id} className="bg-[#146ef5]/40 border border-white/5 rounded-2xl p-6 hover:border-green/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <BookOpen className="w-5 h-5" />
                       </div>
                       <button className="text-gray-500 hover:text-gray-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{sub.name}</h3>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{sub.category}</div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest">
                       <div className="text-gray-500">
                          <span className="text-gray-900">{sub.classes}</span> Classes
                       </div>
                       <div className="text-gray-500">
                          <span className="text-emerald-600">{sub.notes}</span> Notes
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
