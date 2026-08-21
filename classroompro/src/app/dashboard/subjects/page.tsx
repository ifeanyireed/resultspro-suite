"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBook as BookOpen, IconSearch as Search, IconChevronRight as ChevronRight, IconTrendingUp as TrendingUp, IconBrain as BrainCircuit, IconStack2 as Layers } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudentSubjects } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await getStudentSubjects();
        setData(subjectsData);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="My Subjects" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="space-y-3">
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-80 rounded-lg" />
             </div>
             <Skeleton className="h-11 w-full md:w-72 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-80 rounded-[32px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getSubjectStyle = (name: string) => {
    const styles: Record<string, { icon: any, color: string, bg: string, shadow: string }> = {
      "Mathematics": { icon: "📐", color: "text-blue", bg: "bg-blue/10", shadow: "shadow-blue/10" },
      "Biology": { icon: "🧬", color: "text-green", bg: "bg-green/10", shadow: "shadow-green/10" },
      "Physics": { icon: "⚛️", color: "text-amber", bg: "bg-amber/10", shadow: "shadow-amber/10" },
      "Chemistry": { icon: "🧪", color: "text-emerald", bg: "bg-emerald/10", shadow: "shadow-emerald/10" },
      "English Language": { icon: "📚", color: "text-purple-400", bg: "bg-purple-400/10", shadow: "shadow-purple-400/10" },
      "Geography": { icon: "🌍", color: "text-blue", bg: "bg-blue/10", shadow: "shadow-blue/10" },
      "Civic Education": { icon: "🏛️", color: "text-amber", bg: "bg-amber/10", shadow: "shadow-amber/10" },
      "Economics": { icon: "📈", color: "text-green", bg: "bg-green/10", shadow: "shadow-green/10" },
    };
    return styles[name] || { icon: "📖", color: "text-gray-400", bg: "bg-white/5", shadow: "shadow-white/5" };
  };

  const filteredSubjects = (data?.subjects || []).filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="My Subjects" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Academic Subjects</h2>
            <p className="text-muted-foreground text-sm">Explore your curriculum and master every topic.</p>
          </div>

          <div className="relative w-full md:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
               placeholder="Search subjects..." 
               className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl text-white" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject: any) => {
            const style = getSubjectStyle(subject.name);
            return (
              <div key={subject.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-white/20 transition-all group flex flex-col relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} blur-[40px] rounded-full -z-10`} />
                
                <div className="flex justify-between items-start mb-8">
                   <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl ${style.shadow}`}>
                      {style.icon}
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-white/5">
                      {subject.topicsCount || 0} Topics
                   </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green transition-colors">{subject.name}</h3>
                <p className="text-xs text-muted-foreground mb-8">Comprehensive secondary curriculum</p>

                <div className="mt-auto space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-muted-foreground">Mastery</span>
                         <span className="text-white">{subject.mastery || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className={`h-full ${style.bg.replace('/10', '')} transition-all duration-1000`} 
                           style={{ width: `${subject.mastery || 0}%` }}
                         />
                      </div>
                   </div>

                   <Link href={`/dashboard/syllabus?subject=${subject.name}`} className="block">
                      <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                         Explore Syllabus <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
           <div className="py-32 text-center bg-white/5 rounded-[40px] border border-white/10 border-dashed">
              <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No subjects found matching "{search}"</p>
           </div>
        )}

        {/* Recent Topic Teaser */}
        {data?.lastTopic && (
          <div className="mt-12 bg-gradient-to-r from-blue/20 to-green/10 border border-white/10 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-blue/20 flex items-center justify-center text-blue shadow-2xl">
                   <BrainCircuit className="w-10 h-10" />
                </div>
                <div>
                   <div className="text-[10px] font-black text-blue uppercase tracking-[0.2em] mb-2">Continue Learning</div>
                   <h4 className="text-2xl font-bold text-white mb-1">{data.lastTopic.title}</h4>
                   <p className="text-sm text-muted-foreground">{data.lastTopic.subject.name} • {data.lastTopic.week}</p>
                </div>
             </div>
             <Link href={`/dashboard/topic-hub?topicId=${data.lastTopic.id}`}>
                <button className="px-10 py-4 bg-white text-navy font-black rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-blue/20">
                   Resume Topic
                </button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
