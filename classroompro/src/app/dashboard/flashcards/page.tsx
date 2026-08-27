"use client";

import { IconStack2 as Layers, IconSearch as Search, IconLockOpen as Unlock, IconPlus as Plus, IconTrendingUp as TrendingUp, IconBrain as Brain, IconLoader2 as Loader2, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconClock as Clock, IconBolt as Zap } from '@tabler/icons-react';
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

export default function FlashcardsPage() {
  const user = useAuthStore((state) => state.user);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedCreator, setSelectedCreator] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const [gamificationProfile, setGamificationProfile] = useState<any>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("6");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetching all flashcards for client-side pagination
        const [setsRes, subjectsRes, profileRes] = await Promise.all([
          api.get(`/flashcards?${user?.class_id ? `classId=${user.class_id}` : ''}`),
          api.get("/subjects"),
          api.get("/gamification/profile")
        ]);
        
        // Defensive data access
        const setsData = setsRes.data?.data || [];
        const pagination = setsRes.data?.pagination || { total: 0 };
        const subjectsData = subjectsRes.data || [];

        setFlashcardSets(Array.isArray(setsData) ? setsData : []);
        setTotalCount(pagination.total || 0);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setGamificationProfile(profileRes.data?.profile || null);
      } catch (error) {
        console.error("Error fetching flashcards data:", error);
        setFlashcardSets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.class_id]);

  // Reset to page 1 when search, filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSubjectId, selectedTerm, selectedCreator, selectedStatus, itemsPerPage]);

  // Client-side filtering and sorting for search/term/creator/subject/status
  const filteredSets = useMemo(() => {
    return (flashcardSets || [])
      .filter(set => {
        if (!set) return false;
        const matchesSearch = (set.title || "").toLowerCase().includes(search.toLowerCase()) || 
                              (set.note?.topic?.subject?.name || "").toLowerCase().includes(search.toLowerCase());
        const matchesTerm = selectedTerm === "all" || set.note?.topic?.term?.toString() === selectedTerm;
        const matchesCreator = selectedCreator === "all" || (selectedCreator === "mine" ? set.authorId === user?.id : set.author?.role === "TEACHER");
        const matchesSubject = !selectedSubjectId || set.note?.topic?.subjectId === selectedSubjectId;
        
        // Status Filter Logic
        const mastery = Number(set.mastery || 0);
        const isNew = !set.lastStudied;
        const isMastered = mastery === 100;
        const isInProgress = !isNew && !isMastered;
        
        let matchesStatus = true;
        if (selectedStatus === "new") matchesStatus = isNew;
        else if (selectedStatus === "in_progress") matchesStatus = isInProgress;
        else if (selectedStatus === "mastered") matchesStatus = isMastered;
        
        return matchesSearch && matchesTerm && matchesCreator && matchesSubject && matchesStatus;
      })
      .sort((a, b) => {
        // 1. Priority: Due cards (SRS needs attention)
        const aDue = (a.dueCount || 0) > 0;
        const bDue = (b.dueCount || 0) > 0;
        if (aDue && !bDue) return -1;
        if (!aDue && bDue) return 1;
        
        // 2. Secondary: Recently studied
        const dateA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
        const dateB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
        if (dateA !== dateB) return dateB - dateA;
        
        // 3. Fallback: Title or Creation Date
        return (a.title || "").localeCompare(b.title || "");
      });
  }, [flashcardSets, search, selectedTerm, selectedCreator, selectedSubjectId, selectedStatus, user?.id]);

  // Calculate pagination
  const totalItems = filteredSets.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentSets = filteredSets.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
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
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-[32px]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">Study Sets</h2>
            <p className="text-gray-500 text-sm">Use active recall to master difficult topics faster.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard/flashcards/analytics">
                <Button variant="outline" className="border-gray-100 text-gray-900 font-bold h-11 px-6 rounded-xl">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#146ef5]" /> Analytics
                </Button>
             </Link>
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 rounded-xl">
               <Plus className="w-4 h-4 mr-2" /> Create New Set
             </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] group-hover:scale-110 transition-transform">
                 <Layers className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Cards</div>
              </div>
           </div>
           <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                 <Zap className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-900">
                   {flashcardSets.filter(s => s.lastStudied && Number(s.mastery || 0) < 100).length}
                 </div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">In Progress</div>
              </div>
           </div>
           <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                 <Brain className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-900">
                   {flashcardSets.filter(s => Number(s.mastery || 0) === 100).length}
                 </div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sets Mastered</div>
              </div>
           </div>
           <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-900">
                   {`${gamificationProfile?.longestStreak || 0} days`}
                 </div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Longest Streak</div>
              </div>
           </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white shadow-sm border border-gray-100 p-4 rounded-2xl border border-gray-100 backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search study sets..." 
              className="pl-10 h-12 bg-[#146ef5] border-gray-100 text-white focus:ring-0 ring-0"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select value={selectedTerm} onValueChange={(val) => { setSelectedTerm(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[130px] bg-[#146ef5] border-gray-100 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">1st Term</SelectItem>
                  <SelectItem value="2">2nd Term</SelectItem>
                  <SelectItem value="3">3rd Term</SelectItem>
                </SelectContent>
             </Select>

             <Select value={selectedCreator} onValueChange={(val) => { setSelectedCreator(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[130px] bg-[#146ef5] border-gray-100 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Creator" />
                </SelectTrigger>
                <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                  <SelectItem value="all">All Creators</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="mine">My Sets</SelectItem>
                </SelectContent>
             </Select>

             <Select value={selectedSubjectId || "all"} onValueChange={(val) => { setSelectedSubjectId(val === "all" ? null : val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[150px] bg-[#146ef5] border-gray-100 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
             </Select>

             <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px] bg-[#146ef5] border-gray-100 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">Unopened</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="mastered">Mastered</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        {/* Flashcards Grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSets.map((set) => (
              <div key={set.id} className={cn(
                "bg-white shadow-sm border border-gray-100 rounded-[32px] p-6 transition-all group relative overflow-hidden flex flex-col",
                set.dueCount === 0 && set.lastStudied ? "opacity-40 grayscale-[0.6]" : "hover:border-blue/50"
              )}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue/5 blur-[40px] rounded-full -z-10" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{set.items?.length || 0} Cards</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-100 w-fit uppercase tracking-wider",
                          set.author?.role === 'TEACHER' ? "bg-emerald-50 text-emerald-600 border-green/20" : "bg-blue-50 text-[#146ef5] border-blue/20"
                        )}>
                          {set.author?.name || 'Jane Doe'}
                        </span>
                        {set.dueCount === 0 && set.lastStudied && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber/20 uppercase tracking-wider">
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#146ef5] transition-colors">{set.title}</h3>
                <div className="flex flex-col gap-1 mb-6">
                  <p className="text-xs text-gray-500">
                    {set.note?.topic?.subject?.name || "General"} • {set.note?.topic?.term === 1 ? '1st' : set.note?.topic?.term === 2 ? '2nd' : '3rd'} Term
                  </p>
                  {set.lastStudied && (
                    <p className="text-[10px] text-emerald-600/60 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last studied {new Date(set.lastStudied).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-gray-500">Mastery</span>
                      <span className="text-[#146ef5]">{set.mastery || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue transition-all duration-500" style={{ width: `${set.mastery || 0}%` }} />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                      {(set.dueCount > 0 || !set.lastStudied) ? (
                        <Link href={`/dashboard/flashcards/${set.id}`} className="flex-1">
                          <Button className="w-full bg-blue hover:bg-blue/80 text-gray-900 font-bold text-xs h-10 rounded-xl shadow-lg shadow-blue/20">
                            Study Now
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button disabled className="flex-1 bg-gray-100 text-gray-500 font-bold text-xs h-10 rounded-xl border border-gray-100 cursor-not-allowed">
                            Practiced
                          </Button>
                          <Link href={`/dashboard/flashcards/${set.id}?mode=all`}>
                            <Button variant="outline" className="border-gray-100 hover:bg-gray-100 text-gray-900 h-10 w-10 p-0 rounded-xl" title="Bypass SRS">
                              <Unlock className="w-4 h-4" />
                            </Button>
                          </Link>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controller */}
          {totalItems > limit && (
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-sm border border-gray-100 p-6 rounded-[32px] border border-gray-100 backdrop-blur-xl">
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Items per page</span>
                  <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                    <SelectTrigger className="w-20 bg-gray-50 border-gray-100 text-gray-900 h-10 rounded-xl focus:ring-0 ring-0">
                      <SelectValue placeholder="6" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl border-gray-100 text-gray-900 hover:bg-gray-50 disabled:opacity-30"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                     {/* Smart Pagination */}
                     {Array.from({ length: totalPages }, (_, i) => i + 1)
                       .filter(pageNum => 
                         pageNum === 1 || 
                         pageNum === totalPages || 
                         (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                       )
                       .map((pageNum, idx, array) => (
                         <React.Fragment key={pageNum}>
                           {idx > 0 && array[idx-1] !== pageNum - 1 && (
                             <span className="text-gray-500 px-1">...</span>
                           )}
                           <Button
                             variant={currentPage === pageNum ? "default" : "outline"}
                             className={cn(
                               "w-10 h-10 rounded-xl font-bold",
                               currentPage === pageNum ? "bg-emerald-600 text-white hover:bg-emerald-600/90" : "border-gray-100 text-white hover:bg-gray-50"
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
                    className="w-10 h-10 rounded-xl border-gray-100 text-gray-900 hover:bg-gray-50 disabled:opacity-30"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                     <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>

               <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems}
               </div>
            </div>
          )}

          {filteredSets.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white shadow-sm border border-gray-100 rounded-[40px] border border-gray-100 border-dashed">
               <Layers className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-20" />
               <p className="text-gray-500">No study sets found matching your criteria.</p>
               <button 
                 onClick={() => { setSelectedSubjectId(null); setSelectedTerm("all"); setSelectedCreator("all"); setSelectedStatus("all"); setSearch(""); setCurrentPage(1); }}
                 className="mt-4 text-[#146ef5] text-sm font-bold hover:underline"
               >
                 Reset all filters
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
