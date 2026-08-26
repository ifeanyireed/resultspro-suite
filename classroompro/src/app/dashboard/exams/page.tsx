"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconCertificate as GraduationCap, IconSearch as Search, IconFilter as Filter, IconChevronRight as ChevronRight, IconClock as Clock, IconCalendar as Calendar, IconAlertCircle as AlertCircle, IconLoader2 as Loader2, IconChevronLeft as ChevronLeft, IconCircleCheck as CheckCircle, IconTrophy as Trophy, IconActivity as Activity, IconHelpCircle as HelpCircle } from '@tabler/icons-react';
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

export default function ExamsPage() {
  const user = useAuthStore((state) => state.user);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("6");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/exams${user?.class_id ? `?classId=${user.class_id}` : ''}`);
        setExams(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching exams data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.class_id]);

  // Reset to page 1 when search, filters or limit change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStatus, itemsPerPage]);

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) || 
                            (exam.class?.name || "").toLowerCase().includes(search.toLowerCase());
      
      // Status Filter Logic
      let matchesStatus = true;
      if (selectedStatus === "upcoming") matchesStatus = exam.status === "UPCOMING";
      else if (selectedStatus === "completed") matchesStatus = exam.status === "COMPLETED";
      
      return matchesSearch && matchesStatus;
    });
  }, [exams, search, selectedStatus]);

  // Calculate pagination
  const totalItems = filteredExams.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Practice Exams" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-[32px]" />)}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-[32px]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="My Exams" />
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Academic Assessments</h2>
            <p className="text-muted-foreground text-sm">Track your scheduled exams and past performance.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                 <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">{exams.length}</div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Exams</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                 <Clock className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {exams.filter(e => e.status === "UPCOMING").length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Upcoming</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center text-green group-hover:scale-110 transition-transform">
                 <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {exams.filter(e => e.status === "COMPLETED").length}
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Completed</div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full" />
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                 <Trophy className="w-7 h-7" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">
                   {Math.round(exams.filter(e => e.bestScore > 0).reduce((acc, curr) => acc + (curr.bestScore/curr.totalQuestions), 0) / (exams.filter(e => e.bestScore > 0).length || 1) * 100)}%
                 </div>
                 <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg. Score</div>
              </div>
           </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search exams..." 
              className="pl-10 h-12 bg-navy border-white/10 text-white focus:ring-0 ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[160px] bg-navy border-white/10 text-white h-12 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentExams.map((exam) => (
              <div key={exam.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-green/50 transition-all group flex flex-col md:flex-row gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 blur-[40px] rounded-full -z-10" />
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform shadow-xl">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green transition-colors">{exam.title}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{exam.class?.name || "General"}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue" /> {exam.duration}m</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Questions</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-blue" /> {exam.totalQuestions}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Best Score</p>
                      <p className="text-sm font-bold text-green flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {exam.bestScore || 0}%</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-white/5">
                    {exam.status === "UPCOMING" ? (
                      <Link href={`/dashboard/exams/${exam.id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-green/10">
                          Start Exam
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="flex-1 bg-white/10 text-muted-foreground font-bold h-11 rounded-xl border border-white/10 cursor-not-allowed">
                        Already Taken
                      </Button>
                    )}
                    <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white h-11 px-6 rounded-xl font-bold text-xs">
                      View Guidelines
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentExams.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-[40px] border border-white/10 border-dashed">
               <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
               <p className="text-muted-foreground">No exams found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalItems > limit && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems}
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
