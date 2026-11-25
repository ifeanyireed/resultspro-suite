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
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center text-gray-900">
        <h1 className="text-2xl font-bold mb-4">Note Not Found</h1>
        <Link href="/notes">
          <Button>Back to Notes</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light flex flex-col" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />
      <LoginPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      
      <div className="flex-1 pt-12 pb-20 px-4">
        <MotionStagger className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <MotionRise className="lg:col-span-3 space-y-8">
            <Link href="/notes" className="inline-flex items-center text-sm text-gray-500 hover:text-navy font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all notes
            </Link>

            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8 md:p-16 relative overflow-hidden">
               {/* Meta */}
               <div className="relative z-10 flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{note.topic?.title || "General"}</span>
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    • {note.topic?.class?.name || "SSS 1"} • {note.topic?.subject?.name || "Biology"} • Term {note.topic?.term || 1} • Week {note.topic?.week || 1}
                  </span>
               </div>

               <h1 className="relative z-10 text-3xl md:text-5xl font-bold text-gray-900 mb-8 font-display leading-tight">
                  {note.title}
               </h1>

               <div className="relative z-10 flex items-center gap-8 py-6 border-y border-gray-100 mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue">
                        {note.author?.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Teacher</p>
                        <p className="text-sm font-bold text-gray-900">{note.author?.name || "Anonymous"}</p>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div className="flex items-center gap-6 text-gray-500">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Time</span>
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue" /> 8 min</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Views</span>
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Eye className="w-4 h-4 text-emerald-600" /> 1,245</span>
                     </div>
                  </div>
               </div>

               {/* YouTube Video Section */}
               {note.youtubeId && (
                 <div className="relative z-10 mb-12 rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-900">
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
               <article className="relative z-10 prose prose-lg max-w-none">
                  <div className="text-lg text-gray-700 leading-relaxed font-normal mb-10" dangerouslySetInnerHTML={{ __html: note.content }} />
               </article>

               {!isAuthenticated && (
                 <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent z-10" />
                    <div className="relative z-20 pb-6 pt-12">
                       <div className="bg-navy text-white p-10 rounded-2xl text-center max-w-xl mx-auto shadow-xl" style={{ background: "var(--color-nets-navy-dark)" }}>
                          <div className="w-16 h-16 rounded-2xl bg-green/15 flex items-center justify-center text-green mx-auto mb-6">
                             <Lock className="w-8 h-8" />
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-4">Unlock Full Access</h4>
                          <p className="text-white/75 mb-8 text-sm">
                             Join ClassroomPRO to access this note, accompanying quizzes, and flashcards.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                             <Link href="/signup">
                                <Button className="w-full sm:w-auto bg-green text-navy hover:bg-[#E5A800] font-bold h-12 px-8">
                                   Create Free Account
                                </Button>
                             </Link>
                             <Link href="/login">
                                <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white h-12 px-8">
                                   Log In
                                </Button>
                             </Link>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </MotionRise>

          {/* Sidebar */}
          <MotionRise delay={0.1} className="space-y-8">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
               <h3 className="text-lg font-bold text-gray-900 font-display mb-6">Note Tools</h3>
               <div className="space-y-3">
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50 text-gray-800 font-medium px-4">
                     <Bookmark className="w-4 h-4 mr-3 text-gray-500" /> Save to Library
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50 text-gray-800 font-medium px-4">
                     <Share2 className="w-4 h-4 mr-3 text-gray-500" /> Share Note
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50 text-gray-800 font-medium px-4">
                     <Download className="w-4 h-4 mr-3 text-gray-500" /> Download PDF
                  </Button>
                  <Button onClick={handleActionClick} variant="outline" className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50 text-gray-800 font-medium px-4">
                     <MessageCircle className="w-4 h-4 mr-3 text-gray-500" /> Discuss (12)
                  </Button>
               </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
               <h3 className="text-lg font-bold text-gray-900 font-display mb-6">Related Content</h3>
               <div className="space-y-6">
                  {note.quizzes?.map((quiz: any) => (
                    <Link key={quiz.id} href={`/dashboard/quizzes/${quiz.id}`} onClick={handleActionClick} className="block group">
                       <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Practice Quiz</div>
                       <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue transition-colors">{quiz.title}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <BrainCircuit className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500 font-bold">Interactive Learning</span>
                       </div>
                    </Link>
                  ))}

                  {note.flashcards?.map((flashcard: any) => (
                    <Link key={flashcard.id} href={`/dashboard/flashcards/${flashcard.id}`} onClick={handleActionClick} className="block group">
                       <div className="text-[10px] font-bold text-blue uppercase tracking-widest mb-1">Flashcards</div>
                       <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue transition-colors">{flashcard.title}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <Layers className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500 font-bold">Memorization Tool</span>
                       </div>
                    </Link>
                  ))}

                  {(!note.quizzes?.length && !note.flashcards?.length) && (
                    <p className="text-xs text-gray-500 italic text-center py-4">No related content available yet.</p>
                  )}
               </div>
            </div>
          </MotionRise>
        </MotionStagger>
      </div>

      <Footer />
    </main>
  );
}
