"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBookmark as Bookmark, IconBookOpen as BookOpen, IconBrainCircuit as BrainCircuit, IconLayers as Layers, IconChevronRight as ChevronRight, IconTrash2 as Trash2, IconLoader2 as Loader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedContentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookmarks${filter ? `?type=${filter}` : ""}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Saved Content" />
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="flex gap-3 overflow-x-auto">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-32 rounded-full" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const toggleBookmark = async (type: string, id: string) => {
    try {
      await api.post("/bookmarks/toggle", { contentType: type, contentId: id });
      toast.success("Bookmark updated");
      fetchBookmarks();
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Saved Content" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">My Bookmarks</h2>
            <p className="text-muted-foreground text-sm">Access all your saved notes, quizzes and flashcards in one place.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
           <button 
             onClick={() => setFilter("")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "" ? "bg-green text-navy border-green" : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
             )}
           >
              All Items ({items.length})
           </button>
           <button 
             onClick={() => setFilter("NOTE")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "NOTE" ? "bg-green text-navy border-green" : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
             )}
           >
              Notes
           </button>
           <button 
             onClick={() => setFilter("QUIZ")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "QUIZ" ? "bg-green text-navy border-green" : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
             )}
           >
              Quizzes
           </button>
           <button 
             onClick={() => setFilter("FLASHCARD_SET")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "FLASHCARD_SET" ? "bg-green text-navy border-green" : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
             )}
           >
              Flashcards
           </button>
        </div>

        {items.length === 0 ? (
           <div className="py-32 text-center bg-white/5 rounded-[40px] border border-white/10 border-dashed">
              <Bookmark className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No bookmarks found in this category.</p>
           </div>
        ) : (
          <div className="space-y-4">
             {items.map((item) => (
                <div key={item.id} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/[0.05] hover:border-white/20 transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", 
                         item.contentType === 'NOTE' ? 'bg-green/10 text-green' : 
                         item.contentType === 'QUIZ' ? 'bg-amber/10 text-amber' : 'bg-blue/10 text-blue'
                      )}>
                         {item.contentType === 'NOTE' && <BookOpen className="w-6 h-6" />}
                         {item.contentType === 'QUIZ' && <BrainCircuit className="w-6 h-6" />}
                         {item.contentType === 'FLASHCARD_SET' && <Layers className="w-6 h-6" />}
                      </div>
                      <div>
                         <h4 className="font-bold text-white group-hover:text-green transition-colors">{item.title}</h4>
                         <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                            Saved {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleBookmark(item.contentType, item.contentId)}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
