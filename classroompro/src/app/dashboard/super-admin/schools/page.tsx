"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconSchool as School, IconSearch as Search, IconPlus as Plus, IconFilter as Filter, IconDotsVertical as MoreVertical, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconGlobe as Globe, IconMail as Mail, IconPhone as Phone, IconCalendar as Calendar } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schoolsData = [
  { id: 1, name: "Lekki British School", slug: "lekki-british", location: "Lagos, Nigeria", admin: "Mr. Kunle Ade", email: "admin@lekkibritish.com", plan: "Premium", status: "Active", joined: "Oct 2024" },
  { id: 2, name: "Greenwood Hall", slug: "greenwood", location: "Abuja, Nigeria", admin: "Mrs. Sarah John", email: "info@greenwood.edu", plan: "Standard", status: "Pending", joined: "Jan 2025" },
  { id: 3, name: "Corona Schools", slug: "corona", location: "Lagos, Nigeria", admin: "Dr. Funmi Williams", email: "admin@corona.com", plan: "Premium", status: "Active", joined: "Sept 2024" },
  { id: 4, name: "Atlantic Hall", slug: "atlantic", location: "Epe, Lagos", admin: "Engr. Ben Okafor", email: "contact@atlantichall.org", plan: "Premium", status: "Active", joined: "Nov 2024" },
  { id: 5, name: "British International", slug: "bis", location: "Victoria Island, Lagos", admin: "Ms. Joy Eke", email: "bis.admin@bis.com", plan: "Enterprise", status: "Active", joined: "Dec 2024" },
];

export default function SchoolsOverview() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredSchools = useMemo(() => {
    return schoolsData.filter(school => 
      school.name.toLowerCase().includes(search.toLowerCase()) ||
      school.location.toLowerCase().includes(search.toLowerCase()) ||
      school.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Pagination Logic
  const totalItems = filteredSchools.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentSchools = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      <DashboardHeader title="Schools Overview" />
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 font-display">School Management</h2>
            <p className="text-sm text-muted-foreground">Monitor and manage all schools registered on the platform.</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-6 shadow-lg shadow-green/10">
            <Plus className="w-5 h-5 mr-2" /> Onboard New School
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search schools by name, location or slug..." 
                className="pl-10 h-12 bg-white/5 border-white/10 text-white rounded-xl focus:border-green transition-all" 
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-6 h-12 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10">
                 <Filter className="w-4 h-4" /> Filter
              </button>
              <select className="bg-white/5 border border-white/10 text-white text-sm font-bold px-4 h-12 rounded-xl outline-none focus:border-green">
                 <option>All Plans</option>
                 <option>Premium</option>
                 <option>Standard</option>
                 <option>Enterprise</option>
              </select>
           </div>
        </div>

        {/* Schools Table */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm border-collapse">
                <thead>
                   <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">School</th>
                      <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Administrator</th>
                      <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Subscription</th>
                      <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
                      <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i}>
                           <td className="p-6">
                              <div className="flex items-center gap-4">
                                 <Skeleton className="w-12 h-12 rounded-2xl" />
                                 <div>
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-48" />
                                 </div>
                              </div>
                           </td>
                           <td className="p-6">
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-3 w-32" />
                           </td>
                           <td className="p-6">
                              <Skeleton className="h-5 w-16 rounded mb-2" />
                              <Skeleton className="h-3 w-20" />
                           </td>
                           <td className="p-6">
                              <Skeleton className="h-6 w-20 rounded-full" />
                           </td>
                           <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Skeleton className="h-9 w-24 rounded-lg" />
                                 <Skeleton className="h-9 w-9 rounded-lg" />
                              </div>
                           </td>
                        </tr>
                      ))
                   ) : currentSchools.map((school) => (
                      <tr key={school.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="p-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-navy border border-white/10 flex items-center justify-center text-white font-bold">
                                  {school.name.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div>
                                  <h4 className="font-bold text-white group-hover:text-green transition-colors">{school.name}</h4>
                                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                                     <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {school.slug}.classroompro.com</span>
                                     <span className="w-1 h-1 bg-white/20 rounded-full" />
                                     <span>{school.location}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <p className="font-bold text-white mb-1">{school.admin}</p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                               <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>
                               <span className="w-1 h-1 bg-white/20 rounded-full" />
                               <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Contact</span>
                            </div>
                         </td>
                         <td className="p-6">
                            <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter", 
                               school.plan === 'Premium' ? 'bg-purple-400/10 text-purple-400' : 
                               school.plan === 'Enterprise' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue/10 text-blue'
                            )}>{school.plan}</span>
                            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                               <Calendar className="w-3 h-3" /> Joined {school.joined}
                            </p>
                         </td>
                         <td className="p-6">
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border", 
                               school.status === 'Active' ? 'bg-green/10 border-green/20 text-green' : 'bg-amber/10 border-amber/20 text-amber'
                            )}>
                               <div className={cn("w-1.5 h-1.5 rounded-full", school.status === 'Active' ? 'bg-green' : 'bg-amber')} />
                               {school.status}
                            </span>
                         </td>
                         <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <Button variant="outline" size="sm" className="h-9 border-white/10 text-white hover:bg-white/5 px-4 font-bold text-xs">
                                  Configure
                               </Button>
                               <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
                                  <MoreVertical className="w-5 h-5" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>

           {/* Pagination Footer */}
           {totalItems > limit && (
             <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Show</span>
                   <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="w-20 bg-navy border-white/10 text-white h-9 rounded-xl">
                         <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy border-white/10 text-white">
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
                     className="h-9 w-9 border-white/10 text-white disabled:opacity-30"
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
                              {i > 0 && arr[i-1] !== p - 1 && <span className="text-muted-foreground px-1">...</span>}
                              <Button
                                variant={currentPage === p ? "default" : "outline"}
                                className={cn(
                                   "h-9 w-9 rounded-xl font-bold text-xs",
                                   currentPage === p ? "bg-green-600 text-white hover:bg-green/90" : "border-white/10 text-white"
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
                     className="h-9 w-9 border-white/10 text-white disabled:opacity-30"
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                   >
                      <ChevronRight className="w-4 h-4" />
                   </Button>
                </div>

                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                   Page {currentPage} of {totalPages}
                </p>
             </div>
           )}

           {currentSchools.length === 0 && !loading && (
             <div className="py-20 text-center text-muted-foreground italic">
                No schools found matching your search.
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
