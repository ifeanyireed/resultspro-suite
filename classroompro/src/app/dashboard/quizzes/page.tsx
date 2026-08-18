"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBrainCircuit as BrainCircuit, IconClock as Clock, IconTrophy as Trophy, IconSearch as Search, IconPlay as Play, IconLoader2 as Loader2, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconActivity as Activity, IconCheckCircle as CheckCircle, IconHelpCircle as HelpCircle } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizzesPage() {
  const user = useAuthStore((state) => state.user);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("9");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quizzesRes, subjectsRes] = await Promise.all([
          api.get(`/quizzes${user?.class_id ? `?classId=${user.class_id}` : ''}`),
          api.get("/subjects")
        ]);
        setQuizzes(Array.isArray(quizzesRes.data) ? quizzesRes.data : []);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      } catch (error) {
        console.error("Error fetching quizzes data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.class_id]);

  // Reset to page 1 when search, filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSubjectId, selectedTerm, selectedCurriculum, selectedStatus, itemsPerPage]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase()) || 
                            quiz.note?.topic?.subject?.name.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = !selectedSubjectId || quiz.note?.topic?.subjectId === selectedSubjectId;
      const matchesTerm = selectedTerm === "all" || quiz.note?.topic?.term.toString() === selectedTerm;
      const matchesCurriculum = selectedCurriculum === "all" || quiz.note?.topic?.class?.school?.curriculum === selectedCurriculum;
      
      // Status Filter Logic
      let matchesStatus = true;
      if (selectedStatus === "new") matchesStatus = quiz.isNew;
      else if (selectedStatus === "in_progress") matchesStatus = !quiz.isNew && !quiz.isMastered;
      else if (selectedStatus === "mastered") matchesStatus = quiz.isMastered;
      
      return matchesSearch && matchesSubject && matchesTerm && matchesCurriculum && matchesStatus;
    });
  }, [quizzes, search, selectedSubjectId, selectedTerm, selectedCurriculum, selectedStatus]);

  // Calculate pagination
  const totalItems = filteredQuizzes.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="My Quizzes" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-[32px]" />)}
          </div>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-12 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-[32px]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="My Quizzes" />
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Practice Quizzes</h2>
            <p className="text-muted-foreground text-sm">Test your knowledge and prepare for your exams.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber" />
              <div className="text-xs">
                <span className="text-muted-foreground">Total Points:</span>
                <span className="text-white font-bold ml-1">2,450</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                 <HelpCircle className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">{quizzes.length}</div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Quizzes</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                 <Activity className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {quizzes.filter(q => !q.isNew && !q.isMastered).length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">In Progress</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center text-green group-hover:scale-110 transition-transform">
                 <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {quizzes.filter(q => q.isMastered).length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Mastered (80%+)</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                 <Trophy className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {subjects.length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Subjects</div>
              </div>
           </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search quizzes..." 
              className="pl-10 h-12 bg-navy border-white/10 text-white focus:ring-0 ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="w-[130px] bg-navy border-white/10 text-white h-12 rounded-xl focus:ring-0 ring-0">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">1st Term</SelectItem>
                  <SelectItem value="2">2nd Term</SelectItem>
                  <SelectItem value="3">3rd Term</SelectItem>
                </SelectContent>
             </Select>

             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px] bg-navy border-white/10 text-white h-12 rounded-xl focus:ring-0 ring-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="mastered">Mastered</SelectItem>
                </SelectContent>
             </Select>

             <Select value={selectedSubjectId || "all"} onValueChange={(val) => setSelectedSubjectId(val === "all" ? null : val)}>
                <SelectTrigger className="w-[150px] bg-navy border-white/10 text-white h-12 rounded-xl focus:ring-0 ring-0">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
             </Select>

             <button 
                onClick={() => {
                  setSelectedSubjectId(null);
                  setSelectedTerm("all");
                  setSelectedCurriculum("all");
                  setSelectedStatus("all");
                  setSearch("");
                }}
                className={cn(
                  "flex items-center justify-center px-4 h-12 rounded-xl border border-white/10 transition-all text-xs font-bold",
                  !selectedSubjectId && selectedTerm === "all" && selectedCurriculum === "all" && selectedStatus === "all" && !search ? "bg-white/5 text-muted-foreground" : "bg-green text-navy hover:bg-green/90"
                )}
              >
                Clear
              </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentQuizzes.map((quiz) => (
              <div key={quiz.id} className={cn(
                "bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-green/50 transition-all group",
                quiz.isMastered ? "opacity-60 grayscale-[0.5]" : ""
              )}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {quiz.isNew && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue/10 text-blue border border-blue/20 uppercase tracking-widest">New</span>
                    )}
                    {!quiz.isNew && !quiz.isMastered && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber/10 text-amber border border-amber/20 uppercase tracking-widest animate-pulse">Practiced</span>
                    )}
                    {quiz.isMastered && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green/10 text-green border border-green/20 uppercase tracking-widest">Mastered</span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-green transition-colors">{quiz.title}</h3>
                <p className="text-xs text-muted-foreground mb-6">
                    {quiz.note?.topic?.subject?.name || "General"} • {quiz.questions?.length || 0} Questions
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                      <Clock className="w-3 h-3" /> 15 min
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-bold",
                      quiz.isMastered ? "text-green" : "text-amber"
                    )}>
                      <Trophy className="w-3 h-3" /> {quiz.bestTotal > 0 ? Math.round((quiz.bestScore / quiz.bestTotal) * 100) : 0}%
                    </div>
                  </div>
                  <Link href={`/dashboard/quizzes/${quiz.id}`}>
                    <Button size="sm" className="bg-green hover:bg-green/90 text-navy font-bold rounded-full w-8 h-8 p-0">
                      <Play className="w-3 h-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {currentQuizzes.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-[40px] border border-white/10 border-dashed">
                  <p className="text-muted-foreground">No quizzes found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination Controller */}
          {totalItems > limit && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} quizzes
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 border-white/10 rounded-xl text-white disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                      <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white">
                      Page {currentPage} of {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 border-white/10 rounded-xl text-white disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                      <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
