"use client";

import { IconTrendingUp as TrendingUp, IconTarget as Target, IconAward as Award, IconArrowLeft as ArrowLeft, IconCalendar as Calendar } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChildProgressReport() {
  const childName = "Jessica Alabi";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48 rounded" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
        <main className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] rounded-[40px]" />
            <Skeleton className="h-[400px] rounded-[40px]" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-48 rounded-[40px]" />
            <Skeleton className="h-48 rounded-[40px]" />
          </div>
        </main>
      </div>
    );
  }

  const subjectProgress = [
    { subject: "Mathematics", completion: 85, score: 78, color: "bg-blue" },
    { subject: "Biology", completion: 92, score: 95, color: "bg-emerald-600" },
    { subject: "Physics", completion: 45, score: 65, color: "bg-amber" },
    { subject: "Chemistry", completion: 70, score: 88, color: "bg-red-500" },
  ];

  return (
    <div className="flex-1 pb-12">
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/parent" className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </Link>
          <div className="h-6 w-px bg-gray-100 mx-2" />
          <h1 className="text-lg font-bold text-gray-900">{childName}'s Progress</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-gray-100 text-gray-900 hover:bg-gray-50 h-9">
            <Calendar className="w-4 h-4 mr-2" /> 1st Term 2025
          </Button>
          <Button className="bg-emerald-600 text-white font-bold h-9 text-xs">Download PDF</Button>
        </div>
      </div>
      
      <main className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] shadow-lg shadow-blue/5">
                 <Target className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Overall Mastery</p>
                 <h4 className="text-3xl font-bold text-gray-900">82%</h4>
              </div>
           </div>
           <div className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-lg shadow-green/5">
                 <Award className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Points</p>
                 <h4 className="text-3xl font-bold text-gray-900">15,840</h4>
              </div>
           </div>
           <div className="p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-lg shadow-amber/5">
                 <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Class Rank</p>
                 <h4 className="text-3xl font-bold text-gray-900">4th / 42</h4>
              </div>
           </div>
        </div>

        {/* Subject Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 font-display px-2">Syllabus Completion</h3>
              <div className="space-y-6 p-8 rounded-[40px] bg-white shadow-sm border border-gray-100">
                 {subjectProgress.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-900">{item.subject}</span>
                          <span className="text-gray-500 font-mono">{item.completion}%</span>
                       </div>
                       <div className="h-2 w-full bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                          <div 
                             className={`h-full ${item.color} transition-all duration-1000`} 
                             style={{ width: `${item.completion}%` }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 font-display px-2">Average Quiz Scores</h3>
              <div className="space-y-4 p-8 rounded-[40px] bg-white shadow-sm border border-gray-100">
                 <div className="flex items-end gap-3 h-48 px-4">
                    {subjectProgress.map((item, idx) => (
                       <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                          <div 
                             className={`w-full ${item.color} rounded-t-xl transition-all duration-1000 opacity-80 hover:opacity-100 relative group`}
                             style={{ height: `${item.score}%` }}
                          >
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.score}%
                             </div>
                             <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.subject.slice(0, 3)}</span>
                       </div>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Performance: <span className="text-emerald-600">Exceeding Expectations</span></span>
                    <span className="text-emerald-600">+8% from last month</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white shadow-sm border border-gray-100 rounded-[40px] p-8">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">Learning Streaks</h4>
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl font-black">14</div>
                 <div>
                    <p className="text-gray-900 font-bold mb-1">Consecutive Days Active</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Jessica has been active every day for the past two weeks. Keep up the great work!</p>
                 </div>
              </div>
           </div>
           <div className="bg-white shadow-sm border border-gray-100 rounded-[40px] p-8">
              <h4 className="text-xs font-black text-[#146ef5] uppercase tracking-[0.2em] mb-6">Topic Mastery</h4>
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] text-3xl font-black">28</div>
                 <div>
                    <p className="text-gray-900 font-bold mb-1">Topics Mastered</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Mastery is achieved by scoring 80% or higher in topic-specific quizzes.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
