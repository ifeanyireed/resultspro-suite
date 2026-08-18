"use client";

import { useState, useEffect, Suspense } from 'react';
import { IconUsers as Users, IconMessageSquare as MessageSquare, IconClock as Clock, IconZap as Zap, IconSend as Send, IconShieldCheck as ShieldCheck, IconChevronLeft as ChevronLeft, IconLoader2 as Loader2, IconTrophy as Trophy } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLiveGame } from '@/hooks/useLiveGame';
import toast from 'react-hot-toast';

function SpectatorViewContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  
  const {
    isConnected,
    currentQuestion,
    questionIndex,
    leaderboard,
    gameStatus,
    playersCount,
    chatMessages,
    sendChatMessage,
    isTerminated
  } = useLiveGame(roomId || "");

  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (isTerminated) {
      toast.error("This room has been terminated by the admin.");
    }
  }, [isTerminated]);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Room ID Provided</h1>
        <Link href="/spectate">
          <Button className="bg-blue text-white">Back to Lobby</Button>
        </Link>
      </div>
    );
  }

  if (!isConnected && gameStatus !== 'finished') {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Connecting to Stream...</p>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
        <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-8">
                <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-display font-black mb-4">MATCH FINISHED</h2>
            <p className="text-gray-500 mb-12 max-w-md">The live game has concluded. Here are the final results.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
                {leaderboard.slice(0, 3).map((p, i) => (
                    <div key={p.id} className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] p-8 rounded-3xl relative overflow-hidden group">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Rank #{i+1}</div>
                        <div className="w-16 h-16 rounded-full border-2 border-white/[0.1] border-t-white/[0.15] overflow-hidden mx-auto mb-4 bg-white/5">
                          <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{p.user?.name || p.user?.email}</div>
                        <div className="text-blue font-black">{p.score} Points</div>
                    </div>
                ))}
            </div>

            <Link href="/spectate">
                <Button className="px-10 py-6 rounded-2xl bg-white/10 text-white hover:bg-white/20 font-bold">
                    RETURN TO LOBBY
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Feed Section */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/spectate" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-bold">Leave Stream</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue/10 border border-blue/20">
                  <span className="w-2 h-2 bg-blue rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-blue uppercase">Spectating</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Real-time Feed</span>
                </div>
              </div>
            </div>

            {/* Question Card (Delayed Feed) */}
            {gameStatus === 'active' && currentQuestion ? (
              <div className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-[40px] p-8 md:p-12 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <div className="h-full bg-blue" style={{ animation: 'progress 30s linear infinite' }} />
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question {questionIndex + 1}</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-12 text-center">
                  {currentQuestion.bodyText}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options?.map((opt: any, i: number) => (
                      <div key={opt.id} className={`p-6 rounded-3xl border flex items-center justify-between ${opt.isCorrect ? 'bg-green/5 border-green/20' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] opacity-60'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black ${opt.isCorrect ? 'bg-green text-navy' : 'bg-white/5 text-gray-500'}`}>
                            {String.fromCharCode(65+i)}
                          </div>
                          <span className={`font-bold ${opt.isCorrect ? 'text-green' : 'text-white'}`}>{opt.optionText}</span>
                        </div>
                        {opt.isCorrect && (
                          <ShieldCheck className="w-5 h-5 text-green" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="py-40 text-center bg-white/[0.02] rounded-[40px] border border-dashed border-white/[0.1] border-t-white/[0.15] flex flex-col items-center gap-6 mb-12">
                 <Zap className="w-16 h-16 text-blue/20 animate-pulse" />
                 <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Waiting for Host</h3>
                    <p className="text-gray-500 max-w-sm">The game hasn't started yet. You'll see questions here as soon as the admin begins the match.</p>
                 </div>
              </div>
            )}

            {/* Player Reaction Feed */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
               {leaderboard.map((p, i) => (
                 <div key={p.id} className="flex-shrink-0 flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] p-3 rounded-2xl">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl border border-white/[0.1] border-t-white/[0.15] overflow-hidden bg-white/5">
                        <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green rounded-full border-2 border-navy flex items-center justify-center text-[8px] font-black text-navy">✓</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold truncate w-24 text-white">{p.user?.name || p.user?.email}</div>
                      <div className="text-[10px] text-blue font-black tracking-widest">{p.score} PTS</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Spectator Sidebar */}
        <aside className="w-full lg:w-96 bg-white/[0.02] border-l border-white/[0.05] border-t-white/[0.1] flex flex-col h-[500px] lg:h-auto backdrop-blur-xl">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue" />
                <h3 className="font-bold">Live Lobby</h3>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{playersCount} Players Connected</span>
            </div>
            
            {/* Mini Leaderboard */}
            <div className="space-y-2 mb-2">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Top Standings</h4>
              {leaderboard.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-500 w-4 text-center">{i+1}</span>
                    <div className="w-8 h-8 rounded-lg border border-white/[0.1] border-t-white/[0.15] overflow-hidden bg-white/5">
                      <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{p.user?.name || p.user?.email || 'Player'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue">{p.score || 0}</span>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-[10px] text-gray-600 italic py-4 text-center">No participants yet</p>
              )}
            </div>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className="group">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className={`text-[10px] font-black ${msg.user === 'You' ? 'text-green' : 'text-blue'}`}>{msg.user}</span>
                  <span className="text-[8px] text-gray-600 uppercase">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{msg.text}</p>
              </div>
            ))}
            {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <MessageSquare className="w-8 h-8 mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No messages yet</p>
                </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say something..."
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue text-white"
                />
              </div>
              <button 
                type="submit"
                className="p-3 bg-blue text-white rounded-xl hover:bg-blue/90 transition-colors disabled:opacity-50"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </aside>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </main>
  );
}

export default function SpectatorRoom() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </div>
    }>
      <SpectatorViewContent />
    </Suspense>
  );
}
