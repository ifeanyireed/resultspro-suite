"use client";

import { IconArrowLeft as ArrowLeft, IconBook as BookOpen, IconShare2 as Share2, IconDownload as Download, IconBrain as BrainCircuit, IconStack2 as Layers, IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconCircleCheck as CheckCircle2, IconClock as Clock, IconEye as Eye, IconLoader2 as Loader2, IconBookmark as Bookmark, IconBookmark as BookmarkCheck } from '@tabler/icons-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function DashboardNoteDetailClient() {
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);

        // Check if bookmarked
        const bookmarksRes = await api.get('/bookmarks?type=NOTE');
        const bookmarks = Array.isArray(bookmarksRes.data) ? bookmarksRes.data : [];
        setIsBookmarked(bookmarks.some((b: any) => b.contentId === id));
      } catch (error) {
        console.error("Error fetching note details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const res = await api.post('/bookmarks/toggle', { contentType: 'NOTE', contentId: id });
      setIsBookmarked(res.data.status === 'marked');
      toast.success(res.data.status === 'marked' ? "Saved to your collection" : "Removed from collection");
    } catch (error) {
      toast.error("Action failed");
    }
  };


  if (loading) {
    return (
      <div className="flex-1 pb-12 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex-1 pb-12 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Note Not Found</h1>
        <Link href="/dashboard/notes">
          <Button>Back to Notes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-navy/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notes" className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <h1 className="text-lg font-bold text-white truncate max-w-md">{note.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleBookmark}
            className={`border-white/10 text-white hover:bg-white/5 transition-all ${isBookmarked ? 'bg-green/10 text-green border-green/20' : ''}`}
          >
            {isBookmarked ? (
              <><BookmarkCheck className="w-4 h-4 mr-2" /> Saved</>
            ) : (
              <><Bookmark className="w-4 h-4 mr-2" /> Save</>
            )}
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5 hidden md:flex">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" /> Save Offline
          </Button>
          <Button className="bg-green-600 text-white font-bold" size="sm">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8 grid lg:grid-cols-4 gap-8">
        {/* Main Content: The Note */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 min-h-[600px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-green/5 blur-[100px] rounded-full -mr-48 -mt-48 opacity-50" />
             
             {/* Note Meta */}
             <div className="relative z-10 flex items-center gap-3 mb-8">
                <span className="bg-green/10 text-green text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{note.topic?.subject?.name || "Biology"}</span>
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">{note.topic?.class?.name || "SSS 1"} • {note.topic?.term === 1 ? '1st Term' : note.topic?.term === 2 ? '2nd Term' : '3rd Term'} • Week {note.topic?.week}</span>
             </div>

             {/* Note Content */}
             <article className="relative z-10 prose prose-invert max-w-none">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-display leading-tight">{note.title}</h1>
                
                <div className="flex items-center gap-6 py-6 border-y border-white/5 mb-10 text-muted-foreground">
                   <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green" />
                      <span className="text-xs font-bold uppercase tracking-widest">8 Mins Read</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green" />
                      <span className="text-xs font-bold uppercase tracking-widest">1,245 Students</span>
                   </div>
                </div>

                <div className="text-white/80 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: note.content }} />
             </article>

             {/* Pagination */}
             <div className="relative z-10 mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" /> Previous Topic
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-green hover:underline transition-colors">
                  Next Topic <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar: Related Activities */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-blue/10 transition-colors" />
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
              <BrainCircuit className="w-5 h-5 text-blue" /> Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-4 relative z-10">Test your understanding of this topic with a quick quiz.</p>
            {note.quizzes?.[0] ? (
              <Link href={`/dashboard/quizzes/${note.quizzes[0].id}`}>
                 <Button className="w-full bg-blue hover:bg-blue/90 text-white font-bold h-11 relative z-10 shadow-lg shadow-blue/20">
                    Start Topic Quiz
                 </Button>
              </Link>
            ) : (
              <Button disabled className="w-full border border-white/10 bg-white/5 text-muted-foreground font-bold h-11 relative z-10">
                No Quiz Available
              </Button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-amber/10 transition-colors" />
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
              <Layers className="w-5 h-5 text-amber" /> Revision
            </h4>
            <p className="text-xs text-muted-foreground mb-4 relative z-10">Use flashcards to memorize key terms and definitions.</p>
            {note.flashcards?.[0] ? (
              <Link href={`/dashboard/flashcards/${note.flashcards[0].id}`}>
                 <Button className="w-full bg-amber hover:bg-amber/90 text-white font-bold h-11 relative z-10 shadow-lg shadow-amber/20">
                    Study Flashcards
                 </Button>
              </Link>
            ) : (
              <Button disabled className="w-full border border-white/10 bg-white/5 text-muted-foreground font-bold h-11 relative z-10">
                No Cards Available
              </Button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-[10px]">Topic Progress</h4>
            <div className="w-full h-2 bg-navy rounded-full overflow-hidden mb-2">
               <div className="w-1/3 h-full bg-green" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">33% Mastered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
