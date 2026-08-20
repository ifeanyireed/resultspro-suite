"use client";

import { useState, useEffect, Suspense } from 'react';
import { IconPlayerPlay as Play, IconSquare as Square, IconMessage as MessageSquare, IconActivity as Activity, IconChartBar as BarChart2, IconAlertCircle as AlertCircle, IconArrowRight as ArrowRight, IconShieldCheck as ShieldCheck, IconLoader2 as Loader2, IconUserX as UserX, IconTrophy as Trophy } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import { useLiveGame } from '@/hooks/useLiveGame';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

function AdminLiveControlContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [questions, setQuestions] = useState<any[]>([]);

  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { 
    isConnected, 
    gameStatus, 
    playersCount, 
    leaderboard, 
    questionIndex, 
    pushQuestion, 
    startMatch, 
    endMatch,
    broadcast
  } = useLiveGame(roomId || "");

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    } else {
      setLoading(false);
    }
  }, [roomId]);

  // Sync sounds
  useEffect(() => {
    if (gameStatus === 'active') {
      const audio = new Audio('/sounds/game_starts.mp3');
      audio.play().catch(err => console.log("Sound play error:", err));
    }
  }, [gameStatus]);

  const currentActiveQuestion = questions[questionIndex];

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}`);
    audio.play().catch(err => console.log("Sound play error:", err));
  };

  const fetchRoomData = async () => {
    try {
      const res = await api.get(`/live/rooms/${roomId}`);
      setRoomDetails(res.data);
      
      // Fetch questions for the subject
      const qRes = await api.get(`/exams/subjects/${res.data.subjectId}/questions`);
      
      // Shuffle and take 10
      const shuffled = [...qRes.data].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 10)); 
    } catch (err) {
      toast.error("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    startMatch();
    // Automatically push the first question with a small delay
    if (questions.length > 0) {
      setTimeout(() => {
        pushQuestion(0, questions[0]);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = questionIndex + 1;
    if (nextIdx < questions.length) {
      pushQuestion(nextIdx, questions[nextIdx]);
      playSound('joined_game.mp3'); 
    } else {
      toast.success("No more questions!");
    }
  };

  const handleBroadcast = () => {
    const msg = prompt("Enter message to broadcast to all players:");
    if (msg) {
      broadcast(msg);
      toast.success("Message broadcasted");
    }
  };

  const handleEndGame = async () => {
    if (!confirm("Are you sure you want to end the game? This will distribute prizes.")) return;
    
    try {
      setLoading(true);
      await api.post(`/live/rooms/${roomId}/end`);
      toast.success("Game ended and prizes distributed!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to end game");
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateRoom = async () => {
    if (!confirm("TERMINATE ROOM? This will REFUND all entry fees and delete the room. This cannot be undone.")) return;
    
    try {
      setLoading(true);
      await api.post(`/live/rooms/${roomId}/terminate`);
      toast.success("Room terminated and refunds processed");
      window.location.href = '/admin/live';
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to terminate room");
    } finally {
      setLoading(false);
    }
  };

  if (!roomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8">
        <h1 className="text-2xl font-bold mb-4">No Room ID provided</h1>
        <Link href="/admin/live" className="text-green hover:underline">Back to Live Dashboard</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <>
        <AdminHeader title={roomDetails?.subject?.name || "Game Finished"} />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
           <div className="w-24 h-24 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-8">
              <Trophy className="w-12 h-12" />
           </div>
           <h2 className="text-4xl font-display font-black text-white mb-4">GAME COMPLETED</h2>
           <p className="text-gray-500 mb-12 max-w-md">Prizes have been distributed to the winners and the room is now closed.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
              {leaderboard.slice(0, 3).map((p, i) => (
                <div key={p.id} className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] p-6 rounded-3xl relative overflow-hidden">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Rank #{i+1}</div>
                   <div className="text-xl font-bold text-white mb-1">{p.user?.name || p.user?.email || 'Anonymous'}</div>
                   <div className="text-amber font-black">{p.score} Points</div>
                </div>
              ))}
           </div>

           <Link href="/admin/live">
              <Button className="px-12 py-6 rounded-2xl bg-white/10 text-white hover:bg-white/20 font-bold">
                 BACK TO LIVE DASHBOARD
              </Button>
           </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={roomDetails?.subject?.name || "Live Control"} />

      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto no-scrollbar">
        {/* Main Control Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Question Master */}
          <section className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="font-display font-bold text-white text-xl mb-1">Question Queue</h3>
                 <p className="text-sm text-gray-500">Manage the flow of the game</p>
               </div>
               <div className="text-right">
                 <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Progress</div>
                 <div className="text-2xl font-display font-black text-white">{gameStatus === 'pending' ? 0 : questionIndex + 1} / {questions.length}</div>
               </div>
             </div>

             {gameStatus === 'pending' ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center text-green mb-6">
                      <Play className="w-10 h-10 fill-current" />
                   </div>
                   <h4 className="text-2xl font-bold text-white mb-2 uppercase">Ready to Begin</h4>
                   <p className="text-gray-500 mb-8">{playersCount} players waiting in the lobby</p>
                   <Button 
                    onClick={handleStartGame}
                    className="px-12 py-8 rounded-3xl bg-green text-navy font-black text-xl shadow-xl shadow-green/20"
                   >
                     START LIVE MATCH
                   </Button>
                </div>
             ) : (
                <>
                  <div className="p-6 rounded-3xl bg-white/5 text-white mb-8 border border-white/[0.1] border-t-white/[0.15] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <ShieldCheck className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-[10px] font-bold text-green uppercase tracking-widest mb-2">Current Active Question</div>
                      <h4 className="text-xl font-bold mb-4">{currentActiveQuestion?.bodyText}</h4>
                      <div className="grid grid-cols-2 gap-4">
                          {currentActiveQuestion?.options.map((opt: any, i: number) => (
                            <div key={opt.id} className={`px-4 py-2 rounded-xl border text-xs font-medium ${opt.isCorrect ? 'bg-green/10 border-green/30 text-green' : 'bg-white/5 border-white/[0.05] border-t-white/[0.1]'}`}>
                              {String.fromCharCode(65+i)}: {opt.optionText}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                      {questionIndex < questions.length - 1 ? (
                        <Button 
                          onClick={handleNextQuestion}
                          className="flex-1 rounded-2xl bg-green text-navy hover:bg-green/90 font-black h-16 text-lg gap-2 shadow-[0_0_20px_rgba(0,200,83,0.2)]"
                        >
                          PUSH NEXT QUESTION <ArrowRight className="w-6 h-6" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleEndGame}
                          className="flex-1 rounded-2xl bg-amber text-navy hover:bg-amber/90 font-black h-16 text-lg gap-2"
                        >
                          COMPLETE & DISTRIBUTE PRIZES <Trophy className="w-6 h-6" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={handleEndGame}
                        className="rounded-2xl border-red-500/20 h-16 px-8 bg-red-500/5 text-red-500 hover:bg-red-500/10"
                      >
                        <Square className="w-6 h-6 fill-current" />
                      </Button>
                  </div>
                </>
             )}
          </section>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart2 className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white">Current Standings</h4>
                </div>
                <div className="space-y-4">
                  {leaderboard.slice(0, 4).map((item, i) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <span className="text-xs font-black text-gray-500 w-4">{i+1}</span>
                      <div className="w-8 h-8 rounded-lg border border-white/[0.05] border-t-white/[0.1] overflow-hidden bg-white/5">
                        <img src={`https://i.pravatar.cc/150?u=${item.userId}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">{item.user?.name || item.user?.email || 'Anonymous'}</div>
                        <div className="h-1 bg-white/5 rounded-full mt-1">
                           <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, (item.score / 2000) * 100)}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-black text-white">{item.score}</span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && <p className="text-xs text-gray-600 italic">No activity yet</p>}
                </div>
             </div>

             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white">Game Info</h4>
                </div>
                <div className="space-y-3 py-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-tighter">Entry Fee</span>
                      <span className="text-white font-black">{roomDetails?.entryFee} Coins</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-tighter">Players Connected</span>
                      <span className="text-green font-black">{playersCount}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-tighter">Total Pot</span>
                      <span className="text-amber font-black">{(roomDetails?.entryFee || 0) * playersCount} Coins</span>
                   </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-full" />
                </div>
             </div>
          </div>
        </div>

        {/* Player Management Column */}
        <div className="space-y-8">
          <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-display font-bold text-white">Lobby</h3>
              <span className="text-xs font-bold text-gray-500">{playersCount} Total</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {leaderboard.map((p, i) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.1] border-t-white/[0.15] overflow-hidden bg-white/5">
                      <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">{p.user?.name || p.user?.email || 'Anonymous'}</div>
                      <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{p.score} pts</div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {leaderboard.length === 0 && <p className="text-center py-10 text-xs text-gray-600 italic">Waiting for players...</p>}
            </div>
            <div className="p-6 border-t border-white/5">
               <Button 
                onClick={handleBroadcast}
                variant="outline" 
                className="w-full rounded-xl text-xs font-bold gap-2 border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10"
               >
                  <MessageSquare className="w-4 h-4" /> ROOM BROADCAST
               </Button>
            </div>
          </section>

          <div className="p-8 rounded-[40px] bg-red-500/10 border border-red-500/20 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold">Room Maintenance</h4>
            </div>
            <p className="text-xs text-red-400/70">Ensure all players have joined before starting. Once started, no new players can join.</p>
            <Button 
              variant="outline" 
              onClick={handleTerminateRoom}
              className="w-full rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold"
            >
              TERMINATE ROOM
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLiveControlPanel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    }>
      <AdminLiveControlContent />
    </Suspense>
  );
}
