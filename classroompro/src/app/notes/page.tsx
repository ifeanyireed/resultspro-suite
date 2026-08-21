"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconSearch as Search, IconFilter as Filter, IconBook as BookOpen, IconUser as User, IconClock as Clock, IconTrendingUp as TrendingUp, IconLoader2 as Loader2, IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconChevronDown as ChevronDown } from '@tabler/icons-react';
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

export default function PublicNotesIndex() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("6");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, subjectsRes, classesRes] = await Promise.all([
          api.get("/notes"),
          api.get("/subjects"),
          api.get("/classes")
        ]);
        setNotes(notesRes.data);
        setSubjects(subjectsRes.data);
        setClasses(classesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNotes = notes.filter(note => {
    const topic = note.topic;
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                         topic?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "all" || topic?.classId === selectedClass;
    const matchesSubject = selectedSubject === "all" || topic?.subjectId === selectedSubject;
    const matchesCurriculum = selectedCurriculum === "all" || topic?.class?.school?.curriculum === selectedCurriculum;
    const matchesTerm = selectedTerm === "all" || topic?.term.toString() === selectedTerm;
    
    return matchesSearch && matchesClass && matchesSubject && matchesCurriculum && matchesTerm;
  });

  // Calculate pagination
  const totalItems = filteredNotes.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentItems = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClass, selectedSubject, selectedCurriculum, selectedTerm, itemsPerPage]);

  const curriculums = Array.from(new Set(classes.map(c => c.school?.curriculum).filter(Boolean)));

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Explore <span className="text-green">Class Notes</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access high-quality notes across all subjects and grade levels, 
              written by expert teachers.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-12 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search notes by topic or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 bg-navy/50 border-white/10 text-white focus:border-green/50 focus:ring-green/50 text-lg rounded-2xl"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Class Level</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Subject</label>
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
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Term</label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Terms" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Terms</SelectItem>
                      <SelectItem value="1">1st Term</SelectItem>
                      <SelectItem value="2">2nd Term</SelectItem>
                      <SelectItem value="3">3rd Term</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Curriculum</label>
                  <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                    <SelectTrigger className="bg-navy/50 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="All Curriculums" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="all">All Curriculums</SelectItem>
                      {curriculums.map((curr: any) => (
                        <SelectItem key={curr} value={curr}>{curr} Curriculum</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </div>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 text-green animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 min-h-[400px]">
              {currentItems.map((note) => (
                <Link 
                  key={note.id} 
                  href={`/notes/${note.id}`}
                  className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-green/50 transition-all duration-300 flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-48 h-48 rounded-2xl bg-gradient-to-br from-green/20 to-blue/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-16 h-16 text-green" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="text-[10px] font-black px-2 py-1 rounded bg-green/10 text-green uppercase tracking-widest border border-green/10">
                         {note.topic?.class?.school?.curriculum}
                       </span>
                       <span className="text-[10px] font-black px-2 py-1 rounded bg-blue/10 text-blue uppercase tracking-widest border border-blue/10">
                         {note.topic?.class?.name}
                       </span>
                       <span className="text-[10px] font-black px-2 py-1 rounded bg-amber/10 text-amber uppercase tracking-widest border border-amber/10">
                         {note.topic?.subject?.name}
                       </span>
                       <span className="text-[10px] font-black px-2 py-1 rounded bg-white/10 text-white uppercase tracking-widest border border-white/10">
                         Term {note.topic?.term}
                       </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green transition-colors leading-tight">
                      {note.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {note.content.substring(0, 150)}...
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3" /> {note.author?.name || "Teacher"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> 5 min
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-green">
                        <TrendingUp className="w-3 h-3" /> 
                        <span className="text-[10px] font-bold">1.2k views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredNotes.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10">
               <p className="text-white text-xl font-display mb-2">No notes found</p>
               <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
               <Button 
                variant="link" 
                className="text-green mt-4 font-bold"
                onClick={() => {
                  setSearch("");
                  setSelectedClass("all");
                  setSelectedSubject("all");
                  setSelectedCurriculum("all");
                  setSelectedTerm("all");
                }}
               >
                 Clear All Filters
               </Button>
            </div>
          )}

          {/* Pagination Controller */}
          {!loading && filteredNotes.length > 0 && (
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
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                               currentPage === pageNum ? "bg-green-600 text-white hover:bg-green/90" : "border-white/10 text-white hover:bg-white/5"
                             )}
                             onClick={() => setCurrentPage(pageNum)}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
      </main>

      <Footer />
    </div>
  );
}
