"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconSword as Sword, IconUsers as Users, IconShield as Shield, IconBolt as Zap, IconCoins as Coins, IconChevronRight as ChevronRight, IconUser as User, IconSearch as Search, IconSparkles as Sparkles, IconLoader2 as Loader2, IconCopy as Copy, IconCheck as Check, IconTrophy as Trophy } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useBattle } from '@/hooks/useBattle';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function MatchmakingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const battleIdParam = searchParams.get('battleId');
  const subjectId = searchParams.get('subjectId') || '1';
  const stake = parseInt(searchParams.get('stake') || '10');
  const subjectName = searchParams.get('subjectName') || "General Knowledge";
  
  const { status, battleId, opponent, participants, joinQueue, startBattle } = useBattle(battleIdParam);
  const [seconds, setSeconds] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);

  useEffect(() => {
    if (participants.length > 0 && roomDetails?.soundActivated !== false) {
      const audio = new Audio('/sounds/joined_game.mp3');
      audio.play().catch(() => {});
    }
  }, [participants.length, roomDetails?.soundActivated]);

  const copyToClipboard = () => {
    const codeToCopy = roomDetails?.roomCode || (battleIdParam ? battleIdParam.split('-')[0].toUpperCase() : '');
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      toast.success("Room Code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (battleIdParam) {
      const fetchRoom = async () => {
        try {
          const res = await api.get(`/battles/${battleIdParam}`);
          setRoomDetails(res.data);
        } catch (err) {
          console.error("Failed to fetch room details");
        }
      };
      fetchRoom();
    }
  }, [battleIdParam]);

  useEffect(() => {
    if (mounted && user && !battleIdParam) {
      joinQueue(subjectId, stake).catch(() => {
        toast.error("Failed to join matchmaking. Please try again.");
        router.push('/battle-mode');
      });
    }
  }, [mounted, user, battleIdParam]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'searching') {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
     if (status === 'active' && battleId) {
       router.push(`/battle-mode/screen?battleId=${battleId}`);
     }
  }, [status, router, battleId]);

  const isHost = roomDetails?.creatorId === user?.id;
  const displayParticipants = participants.length > 0 ? participants : (roomDetails?.participants || []);
  const participantCount = displayParticipants.length;
  const maxPlayers = roomDetails?.maxParticipants || 2;
  const canStart = participantCount >= 2;

  const handleLeave = async () => {
    const msg = isHost ? "Delete this room? All participants will be removed." : "Leave this match?";
    if (!confirm(msg)) return;
    
    try {
      await api.post(`/battles/${battleIdParam}/leave`);
      toast.success(isHost ? "Room deleted" : "Left match");
      router.push('/battle-mode');
    } catch (err) {
      toast.error("Failed to leave room");
    }
  };

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue/10 rounded-full blur-[120px] transition-all duration-1000 ${(status === 'found' || status === 'ready') ? 'bg-green/20 scale-125' : ''}`} />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-16 opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stake</div>
              <div className="text-sm font-bold text-white">{stake} Coins</div>
            </div>
          </div>
          
          <div className="text-center flex flex-col items-center gap-2">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Subject</div>
              <div className="text-sm font-bold text-white uppercase tracking-tighter">{subjectName}</div>
            </div>
            
            {battleIdParam && (
              <div className="mt-2 p-2 px-4 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
                <div className="text-[8px] font-bold text-blue uppercase tracking-[0.2em] mb-1">Room Code</div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 group hover:text-green transition-colors"
                >
                  <span className="text-2xl font-display font-black tracking-[0.2em] text-white group-hover:text-green">
                    {roomDetails?.roomCode || battleIdParam.split('-')[0].toUpperCase()}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-green" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 group-hover:text-green" />
                  )}
                </button>
                <div className="text-[8px] text-gray-500 mt-1 font-medium">Share this 6-digit code with your friend</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your ELO</div>
              <div className="text-sm font-bold text-white">{mounted ? (user?.eloRating || 1000) : '---'}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Matchmaking Arena: Dynamic Grid System */}
        <div className="flex flex-col items-center justify-center gap-12 mb-12 w-full animate-in fade-in duration-1000">
          <div className={`grid gap-8 md:gap-12 w-full max-w-6xl ${
            maxPlayers === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : 
            maxPlayers === 4 ? 'grid-cols-2 max-w-3xl mx-auto' : 
            maxPlayers === 6 ? 'grid-cols-2 md:grid-cols-3' : 
            'grid-cols-2 md:grid-cols-4'
          }`}>
            {/* Joined Players */}
            {displayParticipants.map((p: any, i: number) => {
              const isMe = p.userId === user?.id;
              const isHost = p.userId === roomDetails?.creatorId;
              
              return (
                <div key={p.userId || i} className="flex flex-col items-center gap-5 animate-in zoom-in duration-500">
                  <div className="relative group">
                    {/* Animated Glow for Current User */}
                    {isMe && (
                      <div className="absolute -inset-4 bg-blue/20 rounded-[48px] blur-2xl animate-pulse" />
                    )}
                    
                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[40px] p-1.5 flex items-center justify-center transition-all duration-700 border-4 relative z-10 overflow-hidden ${
                      isMe ? 'bg-blue/20 border-blue rotate-3 scale-105 shadow-[0_0_40px_rgba(21,101,192,0.4)]' : 
                      'bg-white/5 border-white/[0.1] border-t-white/[0.15] group-hover:border-white/20 group-hover:bg-white/10 -rotate-3'
                    }`}>
                      <img 
                        src={`https://i.pravatar.cc/150?u=${p.userId || i}`} 
                        className={`w-full h-full object-cover rounded-[32px] ${isMe ? '' : 'grayscale-[0.3] group-hover:grayscale-0 transition-all'}`}
                        alt="Avatar"
                      />
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-2xl font-black text-[10px] border-2 border-navy shadow-xl z-20 whitespace-nowrap transition-all ${
                      isMe ? 'bg-blue text-white scale-110' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {isMe ? 'YOU' : 'CONTENDER'}
                    </div>

                    {/* Host Indicator */}
                    {isHost && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber rounded-2xl flex items-center justify-center border-4 border-navy shadow-2xl z-20 rotate-12" title="Room Host">
                        <Trophy className="w-5 h-5 text-navy fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-1 relative z-10">
                    <h2 className={`text-xl font-display font-black tracking-tight transition-colors ${isMe ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {p.user?.name || p.user?.email?.split('@')[0] || "Joining..."}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${isMe ? 'bg-blue/10 border-blue/30 text-blue' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-600'}`}>
                        ELO {p.user?.eloRating || 1000}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, maxPlayers - displayParticipants.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex flex-col items-center gap-5 opacity-20 group">
                <div className="relative">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-[40px] border-4 border-dashed border-white/[0.1] border-t-white/[0.15] flex items-center justify-center bg-white/[0.02] transition-all group-hover:border-white/20">
                    <Users className="w-12 h-12 text-white/5" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-gray-600 uppercase tracking-widest animate-pulse">Waiting...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status & Host Controls */}
        {battleIdParam && status === 'idle' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 mt-12">
            <div className="p-6 rounded-[32px] bg-white/5 border border-white/[0.1] border-t-white/[0.15] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center min-w-[320px]">
              <div className="text-xl font-display font-bold text-white mb-2">{participantCount} Players Joined</div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                {participantCount < 2 
                  ? "Waiting for opponents to join..." 
                  : `Ready to start! ${participantCount} players in room. (Max: ${maxPlayers})`}
              </p>
              
              {isHost ? (
                <Button
                  onClick={startBattle}
                  disabled={!canStart}
                  className={`w-full py-8 rounded-2xl font-black text-xl shadow-2xl transition-all ${canStart ? 'bg-green text-navy hover:scale-105 shadow-green/20' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                >
                  {canStart ? 'START MATCH NOW' : 'WAITING FOR PLAYERS'}
                </Button>
              ) : (
                <div className="w-full py-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex flex-col items-center justify-center gap-2">
                   <div className="flex items-center gap-2 text-blue font-bold text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      WAITING FOR HOST
                   </div>
                   <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Match will begin shortly</div>
                </div>
              )}

              <button 
                onClick={handleLeave}
                className="mt-4 text-[10px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
              >
                {isHost ? 'Cancel & Delete Room' : 'Leave Match'}
              </button>
            </div>
          </div>
        )}

        {/* Footer Announcement (For Auto-Matchmaking fallback) */}
        {!battleIdParam && (
          <div className="mt-24 text-center h-20 flex flex-col items-center justify-center">
            {status === 'searching' && (
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Matching you with an available student in the <span className="text-white">{subjectName}</span> queue...
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MatchmakingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    }>
      <MatchmakingContent />
    </Suspense>
  );
}
