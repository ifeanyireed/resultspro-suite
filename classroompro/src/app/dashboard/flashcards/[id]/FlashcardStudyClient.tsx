"use client";

import { IconArrowLeft as ArrowLeft, IconRotate as RotateCcw, IconCheckCircle as CheckCircle, IconCircleX as XCircle, IconHelpCircle as HelpCircle, IconStack2 as Layers, IconLoader2 as Loader2, IconTrophy as Trophy, IconBolt as Zap } from '@tabler/icons-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function FlashcardStudyClient() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'due';
  
  const [cards, setCards] = useState<any[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [xpEarned, setXpEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/flashcards/${id}/queue?mode=${mode}`);
        setCards(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch queue:", error);
        setCards([]);
        toast.error("Failed to load cards");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQueue();
  }, [id, mode]);

  const handleEvaluation = async (rating: number) => {
    const card = (cards || [])[currentCardIdx];
    try {
      const res = await api.post('/flashcards/review', {
        flashcardItemId: card.id,
        rating
      });
      
      setXpEarned(prev => prev + res.data.xpEarned);
      
      if (currentCardIdx < (cards || []).length - 1) {
        setIsFlipped(false);
        setShowHint(false);
        setCurrentCardIdx(prev => prev + 1);
      } else {
        // Log study session for analytics
        try {
          await api.post('/gamification/session', {
            duration: Math.ceil((cards || []).length * 0.5), // Estimate 30s per card
            activity: "Flashcards"
          });
        } catch (e) {
          console.error("Failed to log session:", e);
        }
        
        toast.success(`Session complete! You earned ${xpEarned + res.data.xpEarned} XP! 🎉`);
        router.push('/dashboard/flashcards');
      }
    } catch (error) {
      console.error("Failed to record review:", error);
      toast.error("Connection error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center">
         <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-6">
            <CheckCircle className="w-12 h-12 opacity-20" />
         </div>
         <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
         <p className="text-muted-foreground max-w-sm mb-8">No cards are due for review in this set. Great job maintaining your memory!</p>
         <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/dashboard/flashcards/${id}?mode=all`}>
               <Button variant="outline" className="border-white/10 text-white font-bold px-8 h-12 rounded-xl hover:bg-white/5">
                 Practice All Cards
               </Button>
            </Link>
            <Link href="/dashboard/flashcards">
               <Button className="bg-green-600 text-white font-bold px-8 h-12 rounded-xl">Back to Dashboard</Button>
            </Link>
         </div>
      </div>
    );
  }

  const currentCard = (cards || [])[currentCardIdx];

  const evaluationButtons = [
    { label: "Again", color: "bg-red-500", rating: 1, delay: "1m" },
    { label: "Hard", color: "bg-amber-500", rating: 2, delay: "2d" },
    { label: "Good", color: "bg-blue-500", rating: 3, delay: "4d" },
    { label: "Easy", color: "bg-green", rating: 4, delay: "7d" },
  ];

  return (
    <div className="min-h-screen bg-navy flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-white/10 bg-navy/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/flashcards" className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-md">Study Session</h1>
            <p className="text-xs text-muted-foreground">Card {currentCardIdx + 1} of {cards.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-green">
                 <Zap className="w-4 h-4 fill-current" />
                 <span className="text-sm font-black">{xpEarned} XP</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Earned Today</p>
           </div>
           <Button variant="outline" className="border-white/10 text-white h-10 px-4 rounded-xl hidden md:flex" onClick={() => window.location.reload()}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
           </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/10 blur-[120px] rounded-full -z-10" />
        
        <div className="w-full max-w-xl perspective-1000 h-[450px]">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentCardIdx + (isFlipped ? '-back' : '-front')}
               initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0 }}
               animate={{ rotateY: 0, opacity: 1 }}
               exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
               transition={{ type: "spring", damping: 20, stiffness: 100 }}
               onClick={() => !isFlipped && setIsFlipped(true)}
               className={cn(
                 "w-full h-full rounded-[40px] border-2 cursor-pointer shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-12 text-center relative transition-all duration-500",
                 isFlipped ? "bg-navy border-blue/40" : "bg-white/5 border-white/10 hover:border-white/20"
               )}
             >
                <div className="absolute top-8 left-10 text-muted-foreground flex items-center gap-2">
                   <Layers className="w-5 h-5 opacity-20" />
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{currentCard.flashcard?.title || "SRS Flashcard"}</span>
                </div>
                
                <p className="text-[10px] font-bold text-blue uppercase tracking-[0.3em] mb-12">
                  {isFlipped ? 'Definition / Answer' : 'Question / Term'}
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
                   {isFlipped ? currentCard.back : currentCard.front}
                </h2>

                {showHint && !isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue/10 border border-blue/20 p-4 rounded-2xl mb-8"
                  >
                     <p className="text-sm text-blue italic">{currentCard.hint || "No hint available for this card."}</p>
                  </motion.div>
                )}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                   {!isFlipped ? (
                      <>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Tap to reveal answer</p>
                        {currentCard.hint && !showHint && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                            className="flex items-center gap-1 text-[10px] font-bold text-blue hover:text-white transition-colors"
                          >
                             <HelpCircle className="w-3 h-3" /> Show Hint
                          </button>
                        )}
                      </>
                   ) : (
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rate your memory below</p>
                   )}
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Evaluation Bar */}
        <AnimatePresence>
           {isFlipped && (
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4 w-full max-w-2xl"
             >
                {evaluationButtons.map((btn) => (
                   <button 
                     key={btn.rating}
                     onClick={() => handleEvaluation(btn.rating)}
                     className="flex-1 min-w-[100px] flex flex-col items-center gap-2 group"
                   >
                      <div className={cn(
                        "w-full h-14 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg",
                        "bg-white/5 border border-white/10 hover:border-white/30 group-hover:scale-105 active:scale-95"
                      )}>
                         <span className={cn("text-xs font-black uppercase tracking-wider", btn.rating === 4 ? "text-green" : "text-white")}>
                            {btn.label}
                         </span>
                         <span className="text-[9px] font-bold text-muted-foreground">{btn.delay}</span>
                      </div>
                   </button>
                ))}
             </motion.div>
           )}
        </AnimatePresence>
      </main>

      {/* Footer / Progress */}
      <footer className="p-8 flex flex-col gap-4">
         <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Session Progress</span>
            <span className="text-xs font-bold text-white">{Math.round(((currentCardIdx + 1) / cards.length) * 100)}%</span>
         </div>
         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentCardIdx + 1) / cards.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
         </div>
      </footer>
    </div>
  );
}
