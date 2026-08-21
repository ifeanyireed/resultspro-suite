"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconArrowLeft as ArrowLeft, IconClock as Clock, IconEye as Eye, IconBookmark as Bookmark, IconShare2 as Share2, IconDownload as Download, IconMessageCircle as MessageCircle, IconTrendingUp as TrendingUp, IconAward as Award, IconLock as Lock, IconBrain as BrainCircuit, IconStack2 as Layers } from '@tabler/icons-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import LoginPromptModal from "@/components/LoginPromptModal";

export default function PublicNoteDetailClient() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  const handleActionClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Note Not Found</h1>
        <Link href="/notes">
          <Button>Back to Notes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <LoginPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <Link href="/notes" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all notes
            </Link>

            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-green/5 blur-[100px] rounded-full -mr-48 -mt-48" />
               
               {/* Meta */}
               <div className="relative z-10 flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-green/10 text-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{note.topic?.title || "General"}</span>
                  <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    • {note.topic?.class?.name || "SSS 1"} • {note.topic?.subject?.name || "Biology"} • Term {note.topic?.term || 1} • Week {note.topic?.week || 1}
                  </span>
               </div>

               <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-display leading-tight">
                  {note.title}
               </h1>

               <div className="relative z-10 flex items-center gap-8 py-8 border-y border-white/5 mb-12">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                        {note.author?.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                     </div>
                     <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Teacher</p>
                        <p className="text-sm font-bold text-white">{note.author?.name || "Anonymous"}</p>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-white/5" />
                  <div className="flex items-center gap-6 text-muted-foreground">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Time</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1.5"><Clock className="w-4 h-4 text-green" /> 8 min</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Views</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1.5"><Eye className="w-4 h-4 text-green" /> 1,245</span>
                     </div>
                  </div>
               </div>

               {/* YouTube Video Section */}
               {note.youtubeId && (
                 <div className="relative z-10 mb-12 rounded-[32px] overflow-hidden border border-white/10 aspect-video bg-black/40">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${note.youtubeId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                 </div>
               )}

               {/* Note Content */}
               <article className="relative z-10 prose prose-invert prose-lg max-w-none">
                  <div className="text-xl text-white/80 leading-relaxed font-medium mb-10" dangerouslySetInnerHTML={{ __html: note.content }} />
               </article>

               {!isAuthenticated && (
                 <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/95 to-transparent z-10" />
                    <div className="relative z-20 pb-12">
                       <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] text-center max-w-xl mx-auto shadow-2xl">
                          <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center text-green mx-auto mb-6">
                             <Lock className="w-8 h-8" />
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-4">Unlock Full Access</h4>
                          <p className="text-muted-foreground mb-8">
                             Join ClassroomPRO to access this note, accompanying quizzes, and flashcards.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                             <Link href="/signup">
                                <Button className="w-full sm:w-auto bg-green-600 text-white hover:bg-green/90 font-bold h-12 px-8">
                                   Create Free Account
                                </Button>
                             </Link>
                             <Link href="/login">
                                <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white h-12 px-8">
                                   Log In
                                </Button>
                             </Link>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
               <h3 className="text-lg font-bold text-white font-display mb-6">Note Tools</h3>
               <div className="space-y-3">
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-white font-medium px-4">
                     <Bookmark className="w-4 h-4 mr-3 text-muted-foreground" /> Save to Library
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-white font-medium px-4">
                     <Share2 className="w-4 h-4 mr-3 text-muted-foreground" /> Share Note
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-white font-medium px-4">
                     <Download className="w-4 h-4 mr-3 text-muted-foreground" /> Download PDF
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-white font-medium px-4">
                     <MessageCircle className="w-4 h-4 mr-3 text-muted-foreground" /> Discuss (12)
                  </Button>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
               <h3 className="text-lg font-bold text-white font-display mb-6">Related Content</h3>
               <div className="space-y-6">
                  {note.quizzes?.map((quiz: any) => (
                    <Link key={quiz.id} href={`/dashboard/quizzes/${quiz.id}`} onClick={handleActionClick} className="block group">
                       <div className="text-[10px] font-bold text-amber uppercase tracking-widest mb-1">Practice Quiz</div>
                       <h4 className="text-sm font-bold text-white group-hover:text-amber transition-colors">{quiz.title}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <BrainCircuit className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-bold">Interactive Learning</span>
                       </div>
                    </Link>
                  ))}

                  {note.flashcards?.map((flashcard: any) => (
                    <Link key={flashcard.id} href={`/dashboard/flashcards/${flashcard.id}`} onClick={handleActionClick} className="block group">
                       <div className="text-[10px] font-bold text-blue uppercase tracking-widest mb-1">Flashcards</div>
                       <h4 className="text-sm font-bold text-white group-hover:text-blue transition-colors">{flashcard.title}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <Layers className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-bold">Memorization Tool</span>
                       </div>
                    </Link>
                  ))}

                  {(!note.quizzes?.length && !note.flashcards?.length) && (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No related content available yet.</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
