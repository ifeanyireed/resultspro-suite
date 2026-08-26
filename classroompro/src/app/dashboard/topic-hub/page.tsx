"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconChevronRight as ChevronRight, IconPlayerPlay as Play, IconCircleCheck as CheckCircle2, IconClock as Clock, IconArrowLeft as ArrowLeft, IconDownload as Download } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicHubPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const topic = {
    title: "Cell Structure and Functions",
    subject: "Biology",
    class: "JSS 2",
    term: "1st Term",
    week: "Week 3",
    description: "In this topic, we'll explore the fundamental unit of life, the differences between plant and animal cells, and the functions of various organelles.",
    progress: 65,
  };

  const resources = [
    {
      type: "Note",
      title: "Introduction to Cells",
      status: "Completed",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-green",
      bg: "bg-green/10",
      link: "/dashboard/notes/1"
    },
    {
      type: "Note",
      title: "Plant vs Animal Cells",
      status: "In Progress",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-green",
      bg: "bg-green/10",
      link: "/dashboard/notes/2"
    },
    {
      type: "Flashcards",
      title: "Cell Organelles & Functions",
      status: "Not Started",
      icon: <Layers className="w-5 h-5" />,
      color: "text-blue",
      bg: "bg-blue/10",
      link: "/dashboard/flashcards/1"
    },
    {
      type: "Quiz",
      title: "Cell Structure Quiz",
      status: "Not Started",
      icon: <BrainCircuit className="w-5 h-5" />,
      color: "text-amber",
      bg: "bg-amber/10",
      link: "/dashboard/quizzes/1"
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <DashboardHeader title="Topic Hub" />
        <div className="p-8 space-y-8">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-64 w-full rounded-[32px]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-48 rounded-lg mb-4" />
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Topic Hub" />
      
      <main className="p-8 space-y-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy to-navy/40 border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-[10px] font-bold text-green uppercase tracking-[0.2em] mb-4">
                <span>{topic.subject}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{topic.term}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{topic.week}</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-display">{topic.title}</h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">{topic.description}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shrink-0 w-full md:w-64">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Overall Progress</span>
                <span className="text-lg font-bold text-green">{topic.progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-green transition-all" style={{ width: `${topic.progress}%` }} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-10 text-xs">
                   Resume Learning
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white h-10 w-10 p-0">
                   <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resource List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white font-display mb-2">Learning Resources</h3>
            {resources.map((res, i) => (
              <Link 
                key={i} 
                href={res.link}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", res.bg, res.color)}>
                    {res.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{res.type}</div>
                    <div className="text-white font-bold group-hover:text-green transition-colors">{res.title}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="hidden sm:flex items-center gap-2">
                      {res.status === "Completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green" />
                      ) : res.status === "In Progress" ? (
                        <Clock className="w-4 h-4 text-blue" />
                      ) : null}
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", 
                        res.status === "Completed" ? "text-green" : 
                        res.status === "In Progress" ? "text-blue" : "text-muted-foreground"
                      )}>
                        {res.status}
                      </span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-green group-hover:text-navy transition-all">
                      <Play className="w-3 h-3 ml-0.5" />
                   </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Related Content */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white font-display mb-4">Exam Connections</h3>
               <p className="text-xs text-muted-foreground mb-4">This topic frequently appears in these past exams:</p>
               <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-navy/40 border border-white/5 hover:border-green/30 transition-colors cursor-pointer group">
                     <div className="text-[8px] text-green font-bold uppercase tracking-widest mb-1">BECE 2023</div>
                     <div className="text-sm text-white font-bold group-hover:text-green transition-colors">Section B: Biology Q4</div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy/40 border border-white/5 hover:border-green/30 transition-colors cursor-pointer group">
                     <div className="text-[8px] text-green font-bold uppercase tracking-widest mb-1">Lekki British School</div>
                     <div className="text-sm text-white font-bold group-hover:text-green transition-colors">2023 1st Term Mock</div>
                  </div>
               </div>
               <Button variant="link" className="w-full text-green font-bold text-xs mt-4">View All Related Exams</Button>
            </div>

            <div className="bg-amber/10 border border-amber/20 p-6 rounded-2xl">
               <h4 className="text-sm font-bold text-amber uppercase tracking-widest mb-2">Teacher's Note</h4>
               <p className="text-xs text-amber/80 leading-relaxed italic">
                 "Focus heavily on the difference between cell wall and cell membrane. This is a common area for confusion in exams."
               </p>
               <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber/20" />
                  <span className="text-[10px] font-bold text-amber">Mr. Adeniyi</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
