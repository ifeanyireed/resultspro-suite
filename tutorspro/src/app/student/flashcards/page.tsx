"use client";

import Navbar from '@/components/Navbar';
import { Zap, RotateCcw, Check, X, ChevronRight, Layers, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function Flashcards() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeckIdx, setActiveDeckIdx] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await api.get('/student/flashcards');
        setDecks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch flashcards");
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-amber animate-spin" />
      </main>
    );
  }

  const activeDeck = decks[activeDeckIdx];
  const activeCard = activeDeck?.items?.[activeCardIdx];

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                   Study <span className="text-amber">Flashcards</span>
                </h1>
                <p className="text-gray-400">Master concepts using spaced-repetition.</p>
             </div>
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                <Layers className="w-5 h-5" /> Create New Deck
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Active Card View (Large) */}
             <div className="lg:col-span-2">
                {activeCard ? (
                  <>
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="aspect-[16/9] w-full relative perspective-1000 cursor-pointer group"
                    >
                      <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                         {/* Front */}
                         <div className="absolute inset-0 backface-hidden rounded-[48px] bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center p-12 text-center">
                            <div className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-8">{activeDeck.subject} • Question {activeCardIdx + 1}/{activeDeck.cards}</div>
                            <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">
                               {activeCard.frontText}
                            </h2>
                            <div className="absolute bottom-10 text-gray-500 text-xs font-bold animate-bounce flex items-center gap-2">
                               <RotateCcw className="w-4 h-4" /> Click to reveal answer
                            </div>
                         </div>
                         {/* Back */}
                         <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[48px] bg-green/5 border border-green/20 flex flex-col items-center justify-center p-12 text-center">
                            <div className="text-xs font-bold text-green uppercase tracking-[0.2em] mb-8">Correct Answer</div>
                            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">{activeCard.backText}</h2>
                            {activeCard.explanation && (
                              <p className="text-gray-400 text-sm max-w-md">
                                 {activeCard.explanation}
                              </p>
                            )}
                         </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                       <button 
                         onClick={() => { setIsFlipped(false); setActiveCardIdx((activeCardIdx + 1) % activeDeck.items.length); }}
                         className="flex-1 max-w-[200px] py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                       >
                          <X className="w-5 h-5" /> Forgot
                       </button>
                       <button 
                         onClick={() => { setIsFlipped(false); setActiveCardIdx((activeCardIdx + 1) % activeDeck.items.length); }}
                         className="flex-1 max-w-[200px] py-4 rounded-2xl bg-blue/10 border border-blue/20 text-blue font-bold flex items-center justify-center gap-2 hover:bg-blue/20 transition-all"
                       >
                          <Zap className="w-5 h-5" /> Partial
                       </button>
                       <button 
                         onClick={() => { setIsFlipped(false); setActiveCardIdx((activeCardIdx + 1) % activeDeck.items.length); }}
                         className="flex-1 max-w-[200px] py-4 rounded-2xl bg-green/10 border border-green/20 text-green font-bold flex items-center justify-center gap-2 hover:bg-green/20 transition-all"
                       >
                          <Check className="w-5 h-5" /> Mastered
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="aspect-[16/9] w-full rounded-[48px] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center">
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Select a deck to start studying</p>
                  </div>
                )}
             </div>

             {/* Card Decks Sidebar */}
             <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white px-2">Your Decks</h3>
                {decks.length > 0 ? decks.map((set, i) => (
                  <div 
                    key={set.id} 
                    onClick={() => { setActiveDeckIdx(i); setActiveCardIdx(0); setIsFlipped(false); }}
                    className={`p-6 rounded-3xl border transition-all group cursor-pointer ${activeDeckIdx === i ? 'bg-amber/5 border-amber/30' : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'}`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-white mb-1">{set.title}</h4>
                           <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{set.subject}</div>
                        </div>
                        <div className="text-xs font-bold text-green">{set.mastery}</div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">{set.cards} Cards</div>
                        <ChevronRight className={`w-4 h-4 transition-colors ${activeDeckIdx === i ? 'text-amber' : 'text-gray-700 group-hover:text-white'}`} />
                     </div>
                  </div>
                )) : (
                  <p className="text-gray-600 text-sm italic px-2">No decks found.</p>
                )}
             </div>
          </div>
        </div>
        
        <style jsx global>{`
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
      </main>
    </RoleGate>
  );
}
