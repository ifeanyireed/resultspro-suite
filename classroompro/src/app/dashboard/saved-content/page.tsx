"use client";

import { IconBookmark as Bookmark, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconChevronRight as ChevronRight, IconTrash as Trash2, IconLoader2 as Loader2 } from '@tabler/icons-react';
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
      
      
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">My Bookmarks</h2>
            <p className="text-gray-500 text-sm">Access all your saved notes, quizzes and flashcards in one place.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
           <button 
             onClick={() => setFilter("")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "" ? "bg-emerald-600 text-white border-green" : "bg-white shadow-sm border border-gray-100 text-gray-500 border-gray-100 hover:text-gray-900"
             )}
           >
              All Items ({items.length})
           </button>
           <button 
             onClick={() => setFilter("NOTE")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "NOTE" ? "bg-emerald-600 text-white border-green" : "bg-white shadow-sm border border-gray-100 text-gray-500 border-gray-100 hover:text-gray-900"
             )}
           >
              Notes
           </button>
           <button 
             onClick={() => setFilter("QUIZ")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "QUIZ" ? "bg-emerald-600 text-white border-green" : "bg-white shadow-sm border border-gray-100 text-gray-500 border-gray-100 hover:text-gray-900"
             )}
           >
              Quizzes
           </button>
           <button 
             onClick={() => setFilter("FLASHCARD_SET")}
             className={cn(
               "px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
               filter === "FLASHCARD_SET" ? "bg-emerald-600 text-white border-green" : "bg-white shadow-sm border border-gray-100 text-gray-500 border-gray-100 hover:text-gray-900"
             )}
           >
              Flashcards
           </button>
        </div>

        {items.length === 0 ? (
           <div className="py-32 text-center bg-white shadow-sm border border-gray-100 rounded-[40px] border border-gray-100 border-dashed">
              <Bookmark className="w-12 h-12 text-gray-500/20 mx-auto mb-4" />
              <p className="text-gray-500">No bookmarks found in this category.</p>
           </div>
        ) : (
          <div className="space-y-4">
             {items.map((item) => (
                <div key={item.id} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/[0.05] hover:border-gray-200 transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", 
                         item.contentType === 'NOTE' ? 'bg-emerald-50 text-emerald-600' : 
                         item.contentType === 'QUIZ' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#146ef5]'
                      )}>
                         {item.contentType === 'NOTE' && <BookOpen className="w-6 h-6" />}
                         {item.contentType === 'QUIZ' && <BrainCircuit className="w-6 h-6" />}
                         {item.contentType === 'FLASHCARD_SET' && <Layers className="w-6 h-6" />}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                         <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                            Saved {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleBookmark(item.contentType, item.contentId)}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
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
