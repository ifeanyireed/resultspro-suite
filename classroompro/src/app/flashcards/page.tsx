"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Search, 
  Filter, 
  Layers, 
  Brain, 
  Eye,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Loader2
} from "lucide-react";
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

export default function PublicFlashcardsIndex() {
  const [search, setSearch] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
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
  const [itemsPerPage, setItemsPerPage] = useState("8");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flashcardsRes, subjectsRes, classesRes] = await Promise.all([
          api.get("/flashcards"),
          api.get("/subjects"),
          api.get("/classes")
        ]);
        setFlashcards(flashcardsRes.data);
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

  const filteredFlashcards = flashcards.filter(set => {
    const topic = set.note?.topic;
    const matchesSearch = set.title.toLowerCase().includes(search.toLowerCase()) ||
                         topic?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "all" || topic?.classId === selectedClass;
    const matchesSubject = selectedSubject === "all" || topic?.subjectId === selectedSubject;
    const matchesCurriculum = selectedCurriculum === "all" || topic?.class?.school?.curriculum === selectedCurriculum;
    const matchesTerm = selectedTerm === "all" || topic?.term.toString() === selectedTerm;
    
    return matchesSearch && matchesClass && matchesSubject && matchesCurriculum && matchesTerm;
  });

  // Calculate pagination
  const totalItems = filteredFlashcards.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentItems = filteredFlashcards.slice(indexOfFirstItem, indexOfLastItem);

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
              Smart <span className="text-blue">Flashcards</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master complex concepts with active recall. Browse community-curated 
              study sets and accelerate your learning.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-12 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search flashcards by topic or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 bg-navy/50 border-white/10 text-white focus:border-blue/50 focus:ring-blue/50 text-lg rounded-2xl"
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

          {/* Flashcards Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 text-blue animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
              {currentItems.map((set) => (
                <div 
                  key={set.id} 
                  className="group bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-blue/50 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-[30px] rounded-full -z-10" />
                  
                  <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6 text-blue" />
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-green/10 text-green uppercase tracking-tighter border border-green/10">
                         {set.note?.topic?.class?.school?.curriculum}
                       </span>
                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue/10 text-blue uppercase tracking-tighter border border-blue/10">
                         {set.note?.topic?.class?.name}
                       </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber/10 text-amber uppercase tracking-tighter border border-amber/10">
                         {set.note?.topic?.subject?.name}
                       </span>
                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white uppercase tracking-tighter border border-white/10">
                         Term {set.note?.topic?.term}
                       </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 min-h-[56px] group-hover:text-blue transition-colors">
                    {set.title}
                  </h3>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-3 h-3" /> Medium
                      </div>
                      <div className="flex items-center gap-1.5 text-blue">
                        <TrendingUp className="w-3 h-3" /> 1.2k saves
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/flashcards/${set.id}`}>
                      <Button className="w-full bg-blue hover:bg-blue/60 text-white font-bold h-10 rounded-xl">
                        Study Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredFlashcards.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10">
               <p className="text-white text-xl font-display mb-2">No flashcards found</p>
               <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
               <Button 
                variant="link" 
                className="text-blue mt-4 font-bold"
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
          {!loading && filteredFlashcards.length > 0 && (
            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Items per page</span>
                  <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                    <SelectTrigger className="w-20 bg-navy/50 border-white/10 text-white h-10 rounded-xl">
                      <SelectValue placeholder="8" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
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
                               currentPage === pageNum ? "bg-green text-navy hover:bg-green/90" : "border-white/10 text-white hover:bg-white/5"
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
