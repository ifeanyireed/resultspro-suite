"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconSearch as Search, IconBookOpen as BookOpen, IconLoader2 as Loader2, IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconCheckCircle2 as CheckCircle2, IconCircle as Circle, IconCalendar as Calendar, IconLayers as Layers, IconBrainCircuit as BrainCircuit, IconLock as Lock, IconArrowRight as ArrowRight, IconClock as Clock, IconSparkles as Sparkles, IconChevronDown as ChevronDown, IconChevronUp as ChevronUp } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export default function PublicSyllabusPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("6");

  // Filters
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, subjectsRes, classesRes] = await Promise.all([
          api.get("/topics"),
          api.get("/subjects"),
          api.get("/classes")
        ]);
        setTopics(topicsRes.data);
        setSubjects(subjectsRes.data);
        setClasses(classesRes.data);
      } catch (error) {
        console.error("Error fetching syllabus data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "all" || topic.classId === selectedClass;
    const matchesSubject = selectedSubject === "all" || topic.subjectId === selectedSubject;
    const matchesCurriculum = selectedCurriculum === "all" || topic.class?.school?.curriculum === selectedCurriculum;
    const matchesTerm = selectedTerm === "all" || topic.term.toString() === selectedTerm;
    
    return matchesSearch && matchesClass && matchesSubject && matchesCurriculum && matchesTerm;
  });

  const curriculums = Array.from(new Set(classes.map(c => c.school?.curriculum).filter(Boolean)));

  // Group filtered topics by syllabus key: Curriculum-Class-Subject-Term
  const syllabusGroups = filteredTopics.reduce((acc: any, topic) => {
    const key = `${topic.class?.school?.curriculum}-${topic.class?.name}-${topic.subject?.name}-Term ${topic.term}`;
    if (!acc[key]) {
      acc[key] = {
        key: key,
        curriculum: topic.class?.school?.curriculum,
        className: topic.class?.name,
        subject: topic.subject?.name,
        term: topic.term,
        topics: []
      };
    }
    acc[key].topics.push(topic);
    return acc;
  }, {});

  const syllabusList = Object.values(syllabusGroups);

  // Calculate pagination
  const totalItems = syllabusList.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentSyllabusList = syllabusList.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClass, selectedSubject, selectedCurriculum, selectedTerm, itemsPerPage]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-4 tracking-tight">
              Study <span className="text-green">Syllabus</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A structured 12-week learning path designed for academic mastery.
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-16 bg-white/5 p-6 rounded-[40px] border border-white/10 backdrop-blur-2xl shadow-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search subjects or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 bg-navy/50 border-white/10 text-white focus:border-green/50 focus:ring-green/50 text-lg rounded-2xl"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Grade Level</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Grades</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Term</label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Terms" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">Full Session</SelectItem>
                      <SelectItem value="1">1st Term</SelectItem>
                      <SelectItem value="2">2nd Term</SelectItem>
                      <SelectItem value="3">3rd Term</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Curriculum</label>
                  <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Curriculums" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Systems</SelectItem>
                      {curriculums.map((curr: any) => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </div>
          </div>

          {/* Syllabus Timeline */}
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 text-green animate-spin" />
            </div>
          ) : currentSyllabusList.length > 0 ? (
            <div className="space-y-12">
              {currentSyllabusList.map((syllabus: any) => {
                const isExpanded = !!expandedGroups[syllabus.key];
                
                return (
                  <div key={syllabus.key} className="space-y-6">
                    {/* Syllabus Header Item - Clickable to Toggle */}
                    <button 
                      onClick={() => toggleGroup(syllabus.key)}
                      className="flex items-center justify-between w-full bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-green/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green" />
                         </div>
                         <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs font-black text-green uppercase tracking-widest">{syllabus.curriculum}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                            <span className="text-xs font-black text-blue uppercase tracking-widest">{syllabus.className}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                            <span className="text-xs font-black text-amber uppercase tracking-widest">{syllabus.subject}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Term {syllabus.term}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
                           {isExpanded ? "Collapse" : "View Timeline"}
                         </span>
                         {isExpanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="relative pl-8 md:pl-0 mt-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green/50 via-blue/50 to-transparent md:-translate-x-1/2" />

                        <div className="space-y-16">
                          {[...Array(12)].map((_, i) => {
                            const week = i + 1;
                            const weekTopics = syllabus.topics.filter((t: any) => t.week === week);
                            const isEven = week % 2 === 0;
                            
                            // Public view: no progress shown by default
                            const isWeekCompleted = false;

                            return (
                              <div key={week} className="relative">
                                {/* Week Bubble */}
                                <div className="absolute left-0 md:left-1/2 top-0 -translate-x-1/2 flex flex-col items-center z-10">
                                   <div className={cn(
                                     "w-10 h-10 rounded-full flex items-center justify-center border-4 border-navy shadow-lg transition-all duration-500",
                                     weekTopics.length > 0 ? "bg-green text-navy" : "bg-white/5 text-white/20"
                                   )}>
                                      <span className="text-xs font-black">{week}</span>
                                   </div>
                                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 bg-navy px-2">Week</div>
                                </div>

                                {/* Content Card */}
                                <div className={cn(
                                  "flex flex-col md:w-[calc(50%-40px)] gap-4 transition-all duration-500",
                                  isEven ? "md:ml-auto md:pl-8 pl-12" : "md:mr-auto md:pr-8 md:text-right items-start md:items-end pl-12 md:pl-0"
                                )}>
                                   {weekTopics.length > 0 ? (
                                      weekTopics.map((topic: any) => {
                                        return (
                                          <div 
                                            key={topic.id}
                                            className={cn(
                                              "w-full group bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-green/30 transition-all relative overflow-hidden",
                                              isWeekCompleted && "bg-green/[0.02] border-green/20"
                                            )}
                                          >
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green transition-colors">{topic.title}</h3>
                                            
                                            <p className={cn(
                                              "text-xs text-muted-foreground mb-6 line-clamp-3 leading-relaxed",
                                              !isEven && "md:text-right"
                                            )}>
                                              {topic.notes?.[0]?.content || "In this week, we explore the fundamental principles and key structures of this topic through detailed explanations and visual aids."}
                                            </p>
                                            
                                            <div className={cn(
                                              "flex flex-wrap gap-2 mb-6",
                                              !isEven && "md:justify-end"
                                            )}>
                                               {topic.notes?.map((note: any) => (
                                                  <React.Fragment key={note.id}>
                                                     <Link 
                                                       href={`/notes/${note.id}`}
                                                       className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white hover:bg-green/10 hover:text-green transition-all"
                                                     >
                                                        <BookOpen className="w-3 h-3" /> Note
                                                     </Link>
                                                     {note.quizzes?.map((quiz: any) => (
                                                        <Link 
                                                          key={quiz.id}
                                                          href={`/dashboard/quizzes/${quiz.id}`}
                                                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white hover:bg-amber/10 hover:text-amber transition-all"
                                                        >
                                                           <BrainCircuit className="w-3 h-3" /> Quiz
                                                        </Link>
                                                     ))}
                                                     {note.flashcards?.map((flashcard: any) => (
                                                        <Link 
                                                          key={flashcard.id}
                                                          href={`/dashboard/flashcards/${flashcard.id}`}
                                                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white hover:bg-blue/10 hover:text-blue transition-all"
                                                        >
                                                           <Layers className="w-3 h-3" /> Cards
                                                        </Link>
                                                     ))}
                                                  </React.Fragment>
                                               ))}
                                            </div>

                                            <div className={cn(
                                              "flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
                                              !isEven && "md:justify-end"
                                            )}>
                                               <div className="flex items-center gap-1.5">
                                                  <Clock className="w-3 h-3" /> 45 Mins
                                               </div>
                                               <div className="w-1 h-1 rounded-full bg-white/10" />
                                               <div className="flex items-center gap-1.5 text-green">
                                                  <Sparkles className="w-3 h-3" /> Mastery
                                               </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                   ) : (
                                      <div className="py-8 opacity-20">
                                         <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                                         <div className="h-2 w-48 bg-white/10 rounded-full" />
                                      </div>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination Controller */}
              {!loading && syllabusList.length > 0 && (
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Items per page</span>
                      <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                        <SelectTrigger className="w-20 bg-navy/50 border-white/10 text-white h-10 rounded-xl">
                          <SelectValue placeholder="6" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy border-white/10 text-white">
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>

                   <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-10 h-10 rounded-xl border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                         <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                         {/* Smart Pagination: Show limited pages */}
                         {Array.from({ length: totalPages }, (_, i) => i + 1)
                           .filter(pageNum => 
                             pageNum === 1 || 
                             pageNum === totalPages || 
                             (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                           )
                           .map((pageNum, idx, array) => (
                             <React.Fragment key={pageNum}>
                               {idx > 0 && array[idx-1] !== pageNum - 1 && (
                                 <span className="text-muted-foreground px-1">...</span>
                               )}
                               <Button
                                 variant={currentPage === pageNum ? "default" : "outline"}
                                 className={cn(
                                   "w-10 h-10 rounded-xl font-bold",
                                   currentPage === pageNum ? "bg-green text-navy hover:bg-green/90" : "border-white/10 text-white hover:bg-white/5"
                                 )}
                                 onClick={() => {
                                   setCurrentPage(pageNum);
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                 }}
                               >
                                  {pageNum}
                               </Button>
                             </React.Fragment>
                           ))}
                      </div>

                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-10 h-10 rounded-xl border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
                        disabled={currentPage === totalPages}
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                         <ChevronRight className="w-4 h-4" />
                      </Button>
                   </div>

                   <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-[40px] border border-white/10 border-dashed">
               <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
               <p className="text-white text-2xl font-display mb-2">No Syllabus Found</p>
               <p className="text-muted-foreground">Adjust your filters to see the 12-week learning path.</p>
               <Button 
                variant="link" 
                className="text-green mt-6 font-black uppercase tracking-widest text-xs"
                onClick={() => {
                  setSearch("");
                  setSelectedClass("all");
                  setSelectedSubject("all");
                  setSelectedCurriculum("all");
                  setSelectedTerm("all");
                }}
               >
                 Reset All Filters
               </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
