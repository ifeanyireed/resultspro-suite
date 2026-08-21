"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBook as BookOpen, IconChevronRight as ChevronRight, IconCircleCheck as CheckCircle2, IconCircle as Circle, IconPlay as Play, IconArrowLeft as ArrowLeft, IconFilter as Filter, IconBrain as BrainCircuit, IconStack2 as Layers } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSubjectSyllabus } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function SyllabusPage() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") || "Biology";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const syllabusData = await getSubjectSyllabus(subjectParam);
        setData(syllabusData);
      } catch (error) {
        console.error("Failed to fetch syllabus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectParam]);

  const ordinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Course Syllabus" />
        <div className="p-8 max-w-4xl space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          <div className="space-y-12">
            {[1, 2].map(term => (
              <div key={term} className="space-y-6">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(topic => (
                    <Skeleton key={topic} className="h-24 rounded-[24px]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Course Syllabus" />
      
      <main className="p-8 max-w-4xl space-y-10">
        <div className="flex justify-between items-center">
           <div>
              <Link href="/dashboard/subjects" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-white transition-colors mb-4 uppercase tracking-widest">
                 <ArrowLeft className="w-3 h-3 mr-1" /> All Subjects
              </Link>
              <h2 className="text-4xl font-bold text-white mb-2 font-display">{data?.subject?.name || subjectParam}</h2>
              <p className="text-muted-foreground text-sm font-medium">Full academic curriculum and learning path.</p>
           </div>
           
           <Button variant="outline" className="border-white/10 text-white h-11 px-6 rounded-xl font-bold">
              <Filter className="w-4 h-4 mr-2" /> All Terms
           </Button>
        </div>

        <div className="space-y-16">
          {(data?.terms || []).map((term: any) => (
            <div key={term.number} className="space-y-8 relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-14 bottom-0 w-px bg-white/5" />
              
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue font-black text-sm relative z-10">
                    {term.number}
                 </div>
                 <h3 className="text-2xl font-bold text-white font-display">{ordinalSuffix(term.number)} Term</h3>
              </div>

              <div className="space-y-4 pl-12">
                {(term.topics || []).map((topic: any) => (
                  <div key={topic.id} className="group relative">
                    <Link href={`/dashboard/topic-hub?topicId=${topic.id}`}>
                      <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-navy border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-green group-hover:border-green/30 transition-all">
                               {topic.isCompleted ? <CheckCircle2 className="w-6 h-6 text-green" /> : <Circle className="w-5 h-5 opacity-20" />}
                            </div>
                            <div>
                               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Week {topic.week}</div>
                               <h4 className="text-lg font-bold text-white group-hover:text-green transition-colors">{topic.title}</h4>
                            </div>
                         </div>

                         <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-2">
                               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground" title="Notes">
                                  <BookOpen className="w-4 h-4" />
                               </div>
                               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground" title="Quizzes">
                                  <BrainCircuit className="w-4 h-4" />
                               </div>
                               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground" title="Flashcards">
                                  <Layers className="w-4 h-4" />
                               </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-green group-hover:text-navy transition-all">
                               <Play className="w-4 h-4 ml-0.5" />
                            </div>
                         </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {(!data?.terms || data.terms.length === 0) && (
            <p className="text-muted-foreground italic text-center py-20">No syllabus items found for this subject.</p>
          )}
        </div>
      </main>
    </div>
  );
}
