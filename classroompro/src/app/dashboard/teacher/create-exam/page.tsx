"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconPlus as Plus, IconTrash as Trash2, IconSettings as Settings, IconEye as Eye, IconDeviceFloppy as Save, IconChevronLeft as ChevronLeft, IconCalendar as Calendar, IconUsers as Users } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateExamPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <DashboardHeader title="Create New Exam" />
        <div className="p-8 max-w-5xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="flex gap-3">
                 <Skeleton className="h-10 w-24 rounded-xl" />
                 <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Skeleton className="h-48 w-full rounded-2xl" />
                 <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Create New Exam" />
      
      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard/teacher" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <div className="flex gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
              <Save className="w-4 h-4 mr-2" /> Publish Exam
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <Input 
                placeholder="Exam Title (e.g. SSS 2 Biology 1st Term Final)" 
                className="text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:opacity-30 text-white"
              />
              <textarea 
                placeholder="Exam instructions, duration details, and requirements..."
                className="w-full bg-transparent border-none focus:outline-none text-muted-foreground placeholder:opacity-30 resize-none h-20 text-sm"
              />
            </div>

            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
               <Plus className="w-12 h-12 text-white/10 mx-auto mb-4" />
               <h4 className="text-white font-bold mb-2">Import Questions</h4>
               <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-8">You can import questions from your existing quiz bank or upload an Excel/JSON file.</p>
               <div className="flex justify-center gap-4">
                  <Button variant="outline" className="border-white/10 text-white h-10 px-6">Select from Quizzes</Button>
                  <Button variant="outline" className="border-white/10 text-white h-10 px-6">Upload File</Button>
               </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Exam Setup
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold">Scheduled Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10 bg-navy border-white/10 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold">Duration (Minutes)</Label>
                  <Input type="number" defaultValue={60} className="bg-navy border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold block mb-2">Assign to Class</Label>
                  <select className="w-full bg-navy border border-white/10 rounded-lg h-10 px-3 text-sm text-white">
                    <option>SSS 1 Biology</option>
                    <option>SSS 2 Biology</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
