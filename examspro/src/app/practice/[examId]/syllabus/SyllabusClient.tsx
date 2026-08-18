"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconChevronLeft as ChevronLeft, IconBookOpen as BookOpen, IconTarget as Target, IconSparkles as Sparkles, IconAlertCircle as AlertCircle, IconChevronDown as ChevronDown, IconChevronUp as ChevronUp } from '@tabler/icons-react';
import Link from "next/link";

export default function SyllabusClient({ syllabus, examId }: { syllabus: any, examId: string }) {
  const router = useRouter();
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});

  const toggleSubject = (id: number) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!syllabus || !syllabus.exam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
         <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-50" />
         <h1 className="text-3xl font-display font-black text-white mb-2">Syllabus Not Found</h1>
         <p className="text-gray-500 mb-8 max-w-md">We couldn't retrieve the syllabus for this exam. It might still be under construction.</p>
         <button onClick={() => router.back()} className="px-8 py-3 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white font-bold hover:bg-white/10 transition-all">
           Go Back
         </button>
      </div>
    );
  }

  const { exam } = syllabus;

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
      <Link href={`/practice/${examId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors font-bold text-sm">
        <ChevronLeft className="w-4 h-4" /> BACK TO EXAM
      </Link>

      <header className="mb-12">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
               <BookOpen className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-4xl font-display font-black text-white">{exam.name}</h1>
               <p className="text-green font-bold uppercase tracking-widest text-[10px]">Official 2026 Syllabus</p>
            </div>
         </div>
         <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
           Explore the complete structure of the {exam.name} examination. Master every topic to ensure your success.
         </p>
      </header>

      <div className="space-y-6">
         {exam.subjects?.map((subject: any) => {
           const isExpanded = expandedSubjects[subject.id];
           return (
             <section key={subject.id} className="rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden transition-all">
                <button 
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
                >
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-${subject.color || 'blue'}/10 flex items-center justify-center text-${subject.color || 'blue'}`}>
                         <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">{subject.name}</h2>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                           {subject.topics?.length || 0} Topics
                        </div>
                      </div>
                   </div>
                   <div className="p-2 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-gray-500">
                     {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                   </div>
                </button>

                {isExpanded && (
                  <div className="px-4 md:px-8 pb-8 pt-2 space-y-3">
                    {subject.topics?.map((topic: any, idx: number) => (
                      <div key={topic.id} className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:border-green/20 hover:bg-green/[0.02] transition-all group">
                         <div className="flex items-start gap-3 md:gap-4">
                            <span className="text-xs font-mono text-gray-600 font-bold mt-1">{String(idx + 1).padStart(2, '0')}</span>
                            <div className="flex-1">
                               <h3 className="text-base md:text-lg font-bold text-gray-300 group-hover:text-white transition-colors mb-2">{topic.name}</h3>
                               {topic.syllabusContent && (
                                 <div className="text-xs text-gray-500 leading-relaxed">
                                    {topic.syllabusContent}
                                 </div>
                               )}
                            </div>
                            <Link href={`/practice/study/${topic.id}`}>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green/10 text-green font-bold border border-green/20 hover:bg-green hover:text-navy transition-all shrink-0">
                                 <Sparkles className="w-4 h-4" />
                                 <span className="text-xs hidden md:inline">STUDY TOPIC</span>
                              </button>
                            </Link>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </section>
           );
         })}
      </div>
    </main>
  );
}
