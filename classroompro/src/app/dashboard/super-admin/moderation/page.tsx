"use client";

import { IconShield as ShieldAlert, IconCircleCheck as CheckCircle, IconCircleX as XCircle, IconEye as Eye, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconFlag as Flag, IconSearch as Search, IconFilter as Filter, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const moderationItems = [
  { id: 1, type: "note", title: "Human Reproduction (Advanced)", author: "Mr. Adeniyi", school: "Lekki British School", reason: "Flagged: Sensitive Content", status: "Pending", date: "1 hour ago" },
  { id: 2, type: "quiz", title: "Chemistry Mock Test #2", author: "Mrs. Olatunji", school: "Corona Schools", reason: "Auto-review: High View Count", status: "Pending", date: "3 hours ago" },
  { id: 3, type: "note", title: "Political Science Introduction", author: "Dr. Okoro", school: "Greenwood Hall", reason: "User Reported: Accuracy", status: "Pending", date: "Yesterday" },
  { id: 4, type: "flashcard", title: "Spanish Verbs", author: "Ms. Sarah", school: "Public Content", reason: "New Submission", status: "Pending", date: "Yesterday" },
  // Duplicate for pagination testing
  { id: 5, type: "note", title: "Advanced Physics", author: "Prof. Ade", school: "Global Academy", reason: "Flagged: Accuracy", status: "Pending", date: "2 days ago" },
  { id: 6, type: "quiz", title: "Math Logic", author: "Mr. Ben", school: "Lekki British School", reason: "New Submission", status: "Pending", date: "3 days ago" },
];

export default function ContentModeration() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    return moderationItems.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.school.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Pagination Logic
  const totalItems = filteredItems.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <main className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-80 rounded-xl" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
             <Skeleton className="h-12 flex-1 rounded-xl" />
             <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Moderation Queue</h2>
            <p className="text-sm text-gray-500">Review and approve content submitted to the public library or flagged items.</p>
          </div>
          <div className="flex gap-2 p-1 bg-white shadow-sm border border-gray-100 rounded-xl">
             <button className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm">Pending (42)</button>
             <button className="px-6 py-2 rounded-lg text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors">Approved</button>
             <button className="px-6 py-2 rounded-lg text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors">Rejected</button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search queue..." 
                 className="w-full pl-10 h-12 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green transition-colors"
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-6 h-12 rounded-xl border border-gray-100 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 hover:bg-gray-100">
                 <Filter className="w-4 h-4" /> Filter
              </button>
           </div>
        </div>

        {/* Queue List */}
        <div className="grid gap-4">
           {currentItems.map((item) => (
              <div key={item.id} className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center gap-6 group">
                 <div className="w-14 h-14 rounded-2xl bg-[#146ef5] border border-gray-100 flex items-center justify-center text-gray-500 group-hover:text-emerald-600 transition-colors shrink-0">
                    {item.type === 'note' && <BookOpen className="w-7 h-7" />}
                    {item.type === 'quiz' && <BrainCircuit className="w-7 h-7" />}
                    {item.type === 'flashcard' && <Layers className="w-7 h-7" />}
                 </div>
                 
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                       <span className="px-2 py-0.5 rounded bg-white shadow-sm border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.type}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                       by <span className="text-gray-900 font-bold">{item.author}</span> • {item.school} • Submitted {item.date}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-2 text-amber-600">
                       <ShieldAlert className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{item.reason}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-gray-100 text-gray-900 hover:bg-gray-50 h-11 px-6 font-bold text-xs">
                       <Eye className="w-4 h-4 mr-2" /> Review
                    </Button>
                    <div className="flex gap-2">
                       <button className="w-11 h-11 rounded-xl bg-emerald-50 border border-green/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                          <CheckCircle className="w-5 h-5" />
                       </button>
                       <button className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                          <XCircle className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
           ))}

           {currentItems.length === 0 && (
              <div className="py-20 text-center space-y-4">
                 <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto text-gray-500 opacity-20">
                    <Flag className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-bold text-gray-900">No items found</h4>
                 <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
           )}
        </div>

        {/* Pagination Footer */}
        {totalItems > limit && (
           <div className="mt-8 bg-white shadow-sm border border-gray-100 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Show</span>
                 <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                    <SelectTrigger className="w-20 bg-[#146ef5] border-gray-100 text-white h-9 rounded-xl">
                       <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                       <SelectItem value="10">10</SelectItem>
                       <SelectItem value="25">25</SelectItem>
                       <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="flex items-center gap-2">
                 <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 border-gray-100 text-gray-900 disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                 >
                    <ChevronLeft className="w-4 h-4" />
                 </Button>
                 
                 <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                      .map((p, i, arr) => (
                         <span key={p} className="flex items-center gap-1">
                            {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-500 px-1">...</span>}
                            <Button
                              variant={currentPage === p ? "default" : "outline"}
                              className={cn(
                                 "h-9 w-9 rounded-xl font-bold text-xs",
                                 currentPage === p ? "bg-emerald-600 text-white hover:bg-emerald-600/90" : "border-gray-100 text-white"
                              )}
                              onClick={() => setCurrentPage(p)}
                            >
                               {p}
                            </Button>
                         </span>
                      ))
                    }
                 </div>

                 <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 border-gray-100 text-gray-900 disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                 >
                    <ChevronRight className="w-4 h-4" />
                 </Button>
              </div>

              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                 Page {currentPage} of {totalPages}
              </p>
           </div>
        )}
      </main>
    </div>
  );
}
