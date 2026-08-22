"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconPlus as Plus, IconSearch as Search, IconTrash as Trash2, IconEdit as Edit, IconBook as BookOpen, IconCircleCheck as CheckCircle2, IconFilter as Filter, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SuperAdminSyllabusPage() {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: "",
    classId: "",
    subjectId: "",
    term: "1"
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, subjectsRes, classesRes] = await Promise.all([
        api.get("/topics"),
        api.get("/subjects"),
        api.get("/classes")
      ]);
      setTopics(Array.isArray(topicsRes.data) ? topicsRes.data : []);
      setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
    } catch (err) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = useMemo(() => {
    return topics.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.name.toLowerCase().includes(search.toLowerCase()) ||
      t.class?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [topics, search]);

  // Pagination Logic
  const totalItems = filteredTopics.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentTopics = filteredTopics.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/topics", {
        ...newTopic,
        term: parseInt(newTopic.term)
      });
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create topic");
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;
    try {
      await api.delete(`/admin/topics/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete topic");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Curriculum Management" />
        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-96 rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-[32px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 animate-in fade-in duration-500">
      <DashboardHeader title="Curriculum Management" />
      
      <main className="p-8 space-y-8">
        {/* Stats / Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
                    <BookOpen className="w-5 h-5" />
                 </div>
                 <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Topics</span>
              </div>
              <div className="text-3xl font-bold text-white font-display">
                {topics.length}
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Subjects</span>
              </div>
              <div className="text-3xl font-bold text-white font-display">
                {subjects.length}
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
                    <Filter className="w-5 h-5" />
                 </div>
                 <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Global Classes</span>
              </div>
              <div className="text-3xl font-bold text-white font-display">
                {classes.length}
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search syllabus topics..." 
              className="pl-10 bg-white/5 border-white/10 text-white rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-green/10">
            <Plus className="w-4 h-4 mr-2" /> Add New Topic
          </Button>
        </div>

        {/* Topics Table */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Topic Title</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subject</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Class</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Term</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {currentTopics.map((topic) => (
                      <tr key={topic.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-white">{topic.title}</div>
                            <div className="text-[10px] text-muted-foreground">{topic.notes?.length || 0} Attached Notes</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded bg-blue/10 text-blue text-[10px] font-bold uppercase tracking-widest">
                               {topic.subject?.name || "General"}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-400">
                            {topic.class?.name}
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-white font-medium">Term {topic.term}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                  <Edit className="w-4 h-4" />
                                </Button>
                               <Button onClick={() => handleDeleteTopic(topic.id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                               </Button>
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
        </div>
      </main>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
           <div className="bg-navy border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Topic</h2>
              <form onSubmit={handleAddTopic} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Topic Title</label>
                    <Input 
                      required
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                      placeholder="e.g. Quantum Physics" 
                      className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
                       <Select value={newTopic.subjectId} onValueChange={(val) => setNewTopic({...newTopic, subjectId: val})}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                             <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy border-white/10 text-white">
                             {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Class</label>
                       <Select value={newTopic.classId} onValueChange={(val) => setNewTopic({...newTopic, classId: val})}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                             <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy border-white/10 text-white">
                             {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Term</label>
                    <Select value={newTopic.term} onValueChange={(val) => setNewTopic({...newTopic, term: val})}>
                       <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                          <SelectValue placeholder="Select Term" />
                       </SelectTrigger>
                       <SelectContent className="bg-navy border-white/10 text-white">
                          <SelectItem value="1">1st Term</SelectItem>
                          <SelectItem value="2">2nd Term</SelectItem>
                          <SelectItem value="3">3rd Term</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <Button type="button" onClick={() => setShowAddModal(false)} variant="outline" className="flex-1 border-white/10 text-white h-12 rounded-xl hover:bg-white/5">
                       Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl">
                       Save Topic
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
