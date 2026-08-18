"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  BookOpen, 
  Search,
  Filter,
  ChevronRight,
  Loader2,
  ChevronLeft,
  Clock,
  CheckCircle,
  Activity,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesListPage() {
  const user = useAuthStore((state) => state.user);
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [notesRes, subjectsRes] = await Promise.all([
          api.get(`/notes${user?.class_id ? `?classId=${user.class_id}` : ''}`),
          api.get("/subjects")
        ]);
        setNotes(Array.isArray(notesRes.data) ? notesRes.data : []);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      } catch (error) {
        console.error("Error fetching notes data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.class_id]);

  const getSubjectStyle = (name: string) => {
    const styles: Record<string, string> = {
      "Mathematics": "📐",
      "Biology": "🧬",
      "Physics": "⚛️",
      "Chemistry": "🧪",
      "English Language": "📚",
      "Geography": "🌍",
      "Civic Education": "🏛️",
      "Economics": "📈",
    };
    return styles[name] || "📖";
  };

  // Group notes by subject for counts
  const subjectStats = subjects.map(s => ({
    id: s.id,
    name: s.name,
    icon: getSubjectStyle(s.name),
    count: notes.filter(n => n.topic?.subjectId === s.id).length
  })).filter(s => s.count > 0);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                          note.topic?.subject?.name.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !selectedSubjectId || note.topic?.subjectId === selectedSubjectId;
    const matchesTerm = selectedTerm === "all" || note.topic?.term.toString() === selectedTerm;
    const matchesCurriculum = selectedCurriculum === "all" || note.topic?.class?.school?.curriculum === selectedCurriculum;
    
    // Status Filter Logic
    let matchesStatus = true;
    if (selectedStatus === "new") matchesStatus = note.isNew;
    else if (selectedStatus === "in_progress") matchesStatus = !note.isNew && !note.completed;
    else if (selectedStatus === "completed") matchesStatus = note.completed;

    return matchesSearch && matchesSubject && matchesTerm && matchesCurriculum && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredNotes.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentNotes = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search, filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSubjectId, selectedTerm, selectedCurriculum, selectedStatus, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Class Notes" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-[32px]" />)}
          </div>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 space-y-8">
              <Skeleton className="h-64 rounded-[32px]" />
              <Skeleton className="h-96 rounded-[32px]" />
            </div>
            <div className="lg:col-span-9 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-12 flex-1 rounded-2xl" />
                <Skeleton className="h-12 w-40 rounded-2xl" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 rounded-[32px]" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Class Notes" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                 <BookOpen className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">{notes.length}</div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Notes</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                 <Activity className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {notes.filter(n => !n.isNew && !n.completed).length}
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
                   {notes.filter(n => n.completed).length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Completed</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                 <Layers className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">{subjects.length}</div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Subjects</div>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
           {/* Sidebar Filters */}
           <div className="lg:col-span-3 space-y-8">
              {/* Subject Quick Filter */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-sm">Subjects</h3>
                    <Filter className="w-3 h-3 text-muted-foreground" />
                 </div>
                 <div className="space-y-1">
                    <button 
                      onClick={() => setSelectedSubjectId(null)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all",
                        !selectedSubjectId ? "bg-green text-navy shadow-lg shadow-green/10" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                       <span>All Subjects</span>
                       <span>{notes.length}</span>
                    </button>
                    {subjectStats.map((stat: any) => (
                      <button 
                        key={stat.id}
                        onClick={() => setSelectedSubjectId(stat.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all",
                          selectedSubjectId === stat.id ? "bg-green text-navy shadow-lg shadow-green/10" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                      >
                         <div className="flex items-center gap-3">
                            <span>{stat.icon}</span>
                            <span className="truncate w-24 text-left">{stat.name}</span>
                         </div>
                         <span>{stat.count}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 blur-3xl rounded-full -mr-16 -mt-16" />
                 <h3 className="font-bold text-white text-sm mb-6">Your Progress</h3>
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-green/20 flex items-center justify-center text-green font-black text-xs">
                          {notes.length > 0 ? Math.round((notes.filter(n => n.completed).length / notes.length) * 100) : 0}%
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Overall Mastery</p>
                          <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                             <div 
                               className="h-full bg-green transition-all duration-1000" 
                               style={{ width: `${notes.length > 0 ? Math.round((notes.filter(n => n.completed).length / notes.length) * 100) : 0}%` }}
                             />
                          </div>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Complete notes and their associated quizzes to increase your overall mastery score.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <div className="lg:col-span-9 space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                 <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search through your notes..." 
                      className="pl-11 h-12 bg-white/5 border-white/10 rounded-2xl text-white" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 
                 <div className="flex gap-2 w-full md:w-auto">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                       <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl text-white px-6 w-full md:w-40">
                          <SelectValue placeholder="Status" />
                       </SelectTrigger>
                       <SelectContent className="bg-navy border-white/10 text-white">
                          <SelectItem value="all">All Notes</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              {/* Notes Grid/List */}
              <div className="space-y-4">
                 {currentNotes.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[40px] border border-white/10 border-dashed">
                       <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                          <BookOpen className="w-10 h-10" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">No notes found</h3>
                          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                             We couldn't find any notes matching your current filters. Try changing your search or category.
                          </p>
                       </div>
                       <Button 
                         variant="outline" 
                         className="border-white/10 text-white font-bold h-11 px-8 rounded-xl"
                         onClick={() => {
                           setSearch("");
                           setSelectedSubjectId(null);
                           setSelectedStatus("all");
                         }}
                       >
                          Clear all filters
                       </Button>
                    </div>
                 ) : (
                    currentNotes.map((note) => (
                      <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                        <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/[0.05] hover:border-white/20 transition-all group flex items-center justify-between relative overflow-hidden">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                 {getSubjectStyle(note.topic?.subject?.name || "")}
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-white group-hover:text-green transition-colors">{note.title}</h4>
                                    {note.isNew && <span className="px-2 py-0.5 rounded-full bg-blue/20 text-blue text-[8px] font-black uppercase tracking-tighter">New</span>}
                                    {note.completed && <span className="px-2 py-0.5 rounded-full bg-green/20 text-green text-[8px] font-black uppercase tracking-tighter">Mastered</span>}
                                 </div>
                                 <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    <span>{note.topic?.subject?.name}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                    <span>{note.topic?.title}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-8">
                              <div className="hidden md:flex items-center gap-4">
                                 <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Mastery</p>
                                    <div className="flex items-center gap-2">
                                       <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-green transition-all duration-1000" 
                                            style={{ width: note.completed ? "100%" : "40%" }}
                                          />
                                       </div>
                                       <span className="text-[10px] font-bold text-white">{note.completed ? "100%" : "40%"}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-green group-hover:text-navy transition-all">
                                 <ChevronRight className="w-5 h-5" />
                              </div>
                           </div>
                        </div>
                      </Link>
                    ))
                 )}
              </div>

              {/* Pagination */}
              {totalItems > limit && (
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} notes
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
        </div>
      </div>
    </div>
  );
}
