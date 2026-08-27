"use client";

import { useState, useEffect } from "react";
import { IconPlus as Plus, IconTrash as Trash2, IconDeviceFloppy as Save, IconChevronLeft as ChevronLeft, IconStack2 as Layers, IconSparkles as Sparkles } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateFlashcardsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        
        <div className="p-8 max-w-5xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-10 w-32 rounded-xl" />
           </div>
           <div className="space-y-6">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="grid md:grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      
      
      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard/teacher" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <Button className="bg-blue hover:bg-blue/90 text-gray-900 font-bold">
            <Save className="w-4 h-4 mr-2" /> Save Deck
          </Button>
        </div>

        <div className="space-y-8">
          <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                  <Layers className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <Input 
                    placeholder="Deck Title (e.g. Organic Chemistry Nomenclature)" 
                    className="text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:opacity-30 text-gray-900"
                  />
                  <p className="text-xs text-gray-500">Give your flashcard deck a descriptive name.</p>
               </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</Label>
                  <select className="w-full bg-[#146ef5] border border-gray-100 rounded-xl h-12 px-4 text-sm text-white">
                    <option>Chemistry</option>
                    <option>Physics</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Topic</Label>
                  <select className="w-full bg-[#146ef5] border border-gray-100 rounded-xl h-12 px-4 text-sm text-white">
                    <option>Organic Compounds</option>
                    <option>Chemical Bonding</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02] flex flex-col items-center justify-center group hover:border-blue/30 transition-all cursor-pointer">
                <Plus className="w-10 h-10 text-gray-900/10 mb-4 group-hover:text-[#146ef5] group-hover:scale-110 transition-all" />
                <h4 className="text-gray-900 font-bold mb-1">Add Card Manually</h4>
                <p className="text-[10px] text-gray-500">Create cards one by one</p>
             </div>
             
             <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-blue/5 flex flex-col items-center justify-center group hover:bg-blue-50 transition-all cursor-pointer">
                <Sparkles className="w-10 h-10 text-[#146ef5]/40 mb-4 group-hover:scale-110 transition-all" />
                <h4 className="text-[#146ef5] font-bold mb-1">AI Deck Generator</h4>
                <p className="text-[10px] text-[#146ef5]/60 uppercase font-black tracking-tighter">Premium</p>
                <p className="text-[10px] text-[#146ef5]/40 mt-2">Generate deck from your notes</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
