"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconPlus as Plus, IconTrash as Trash2, IconDeviceFloppy as Save, IconChevronLeft as ChevronLeft, IconBook as BookOpen, IconSparkles as Sparkles, IconFileText as FileText } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateNotePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <DashboardHeader title="Create Note" />
        <div className="p-8 max-w-5xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-10 w-32 rounded-xl" />
           </div>
           <div className="space-y-6">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Create Note" />
      
      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard/teacher" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> Publish Note
          </Button>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
                  <FileText className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <Input 
                    placeholder="Note Title (e.g. Introduction to Mammals)" 
                    className="text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:opacity-30 text-white"
                  />
                  <p className="text-xs text-muted-foreground">This title will be visible to your students.</p>
               </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Subject</Label>
                  <select className="w-full bg-navy border border-white/10 rounded-xl h-12 px-4 text-sm text-white">
                    <option>Biology</option>
                    <option>Chemistry</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Class</Label>
                  <select className="w-full bg-navy border border-white/10 rounded-xl h-12 px-4 text-sm text-white">
                    <option>SSS 1</option>
                    <option>SSS 2</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Week</Label>
                  <select className="w-full bg-navy border border-white/10 rounded-xl h-12 px-4 text-sm text-white">
                    <option>Week 1</option>
                    <option>Week 2</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 min-h-[400px]">
             <textarea 
               placeholder="Start writing your note content here... Support for Markdown and KaTeX is enabled."
               className="w-full h-full min-h-[300px] bg-transparent border-none focus:outline-none text-white leading-relaxed resize-none"
             />
          </div>
        </div>
      </main>
    </div>
  );
}
