"use client";

import { useState, useEffect, Suspense } from 'react';
import { IconTimer as Timer, IconUsers as Users, IconTrophy as Trophy, IconCheckCircle2 as CheckCircle2, IconZap as Zap, IconStar as Star, IconChevronRight as ChevronRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useLiveGame } from '@/hooks/useLiveGame';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

function LiveGamePlayContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    isConnected, 
    currentQuestion, 
    questionIndex, 
    leaderboard, 
    gameStatus, 
    playersCount, 
    submitAnswer 
  } = useLiveGame(roomId || "");

  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}`);
    audio.play().catch(err => console.log("Sound play error:", err));
  };

  // Reset for new question
  useEffect(() => {
    if (currentQuestion) {
      console.log('[Play] New question received:', currentQuestion.id);
      setTimeLeft(30);
      setSelectedOption(null);
      setHasAnswered(false);
      playSound('joined_game.mp3'); // Reuse as "question alert"
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0 && !hasAnswered && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      if (timeLeft === 6) playSound('47s_remaining.mp3'); // 5s warning
      return () => clearTimeout(timer);
    }
  }, [timeLeft, hasAnswered, currentQuestion]);

  useEffect(() => {
    if (gameStatus === 'finished' && roomId) {
      router.push(`/live/result?roomId=${roomId}`);
    }
  }, [gameStatus, roomId, router]);

  const handleConfirm = () => {
    if (!selectedOption || !currentQuestion) return;
    
    const correctOption = currentQuestion.options.find((o: any) => o.isCorrect);
    const isCorrect = selectedOption === correctOption?.id;
    
    if (isCorrect) playSound('correct_answer.mp3');
    else playSound('wrong_answer.mp3');

    submitAnswer(isCorrect, timeLeft);
    setHasAnswered(true);
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Room ID Provided</h1>
        <Button onClick={() => router.push('/live')} className="bg-green text-navy">Back to Lobby</Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Connecting to game server...</p>
      </div>
    );
  }

  if (gameStatus === 'pending') {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-green/10 flex items-center justify-center text-green mb-8 animate-pulse">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-display font-black text-white mb-4 uppercase">Waiting for host to start</h2>
        <p className="text-gray-500 mb-8 max-w-sm">The game will begin once the admin starts the match. Get ready!</p>
        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white font-bold">
          {playersCount} Players Joined
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
     return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Zap className="w-12 h-12 text-amber animate-pulse" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Waiting for next question...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue to-transparent" />
      </div>

      {/* Top HUD */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center font-display font-black text-navy text-sm">
              {questionIndex + 1}
            </div>
            <div className="hidden sm:block">
              <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Question</div>
              <div className="text-xs font-black">Live Game</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue" />
            <span className="text-xs font-black">{playersCount} Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${timeLeft < 5 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15]'}`}>
            <Timer className={`w-4 h-4 ${timeLeft < 5 ? 'animate-pulse' : ''}`} />
            <span className="text-lg font-mono font-black">{timeLeft}s</span>
          </div>
          
          <Button 
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            variant="outline" 
            className="rounded-2xl border-white/[0.1] border-t-white/[0.15] bg-white/5 hover:bg-white/10 px-4 py-2 hidden sm:flex gap-2"
          >
            <Trophy className="w-4 h-4 text-amber" />
            <span className="text-xs font-bold uppercase">Leaderboard</span>
          </Button>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full">
        <div className="w-full mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue tracking-widest uppercase">Live Challenge</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-center leading-tight">
            {currentQuestion.bodyText}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
          {currentQuestion.options.map((opt: any, i: number) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => !hasAnswered && setSelectedOption(opt.id)}
                disabled={hasAnswered}
                className={`
                  relative p-6 rounded-3xl border-2 text-left transition-all group overflow-hidden
                  ${isSelected ? 'border-green bg-green/10 shadow-[0_0_20px_rgba(0,200,83,0.2)]' : 'border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/5'}
                  ${hasAnswered && isSelected ? 'opacity-100' : hasAnswered ? 'opacity-40' : 'opacity-100'}
                `}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-lg transition-all
                    ${isSelected ? 'bg-green text-navy' : 'bg-white/5 text-gray-500 group-hover:bg-white/10'}
                  `}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-lg font-bold">{opt.optionText}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-0 right-0 p-4 animate-in fade-in zoom-in">
                    <CheckCircle2 className="w-6 h-6 text-green" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!hasAnswered ? (
          <Button 
            onClick={handleConfirm}
            disabled={selectedOption === null || timeLeft === 0}
            className="bg-green text-navy hover:bg-green/90 rounded-2xl px-16 py-8 text-xl font-black shadow-[0_0_30px_rgba(0,200,83,0.3)] disabled:opacity-50"
          >
            {timeLeft === 0 ? "TIME'S UP!" : "CONFIRM ANSWER"}
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
            <div className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber animate-pulse" />
              Waiting for other players...
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-green animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Mini Leaderboard Overlay */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-navy/95 backdrop-blur-xl border-l border-white/10 z-50 transition-transform duration-500
        ${showLeaderboard ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber fill-current" />
            <h3 className="font-bold text-lg">Top Players</h3>
          </div>
          <button onClick={() => setShowLeaderboard(false)} className="p-2 rounded-xl hover:bg-white/5">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic text-sm">No scores yet.</div>
          ) : leaderboard.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between p-3 rounded-2xl ${p.userId === user?.id ? 'bg-green/10 border border-green/20' : 'bg-white/[0.02]'}`}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-500 w-4">{i + 1}</span>
                <div className="w-8 h-8 rounded-full border border-white/[0.1] border-t-white/[0.15] overflow-hidden bg-white/5">
                  <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                </div>
                <span className={`text-sm font-bold ${p.userId === user?.id ? 'text-green' : 'text-white'} truncate max-w-[100px]`}>
                  {p.user?.name || p.user?.email || 'Anonymous Player'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">{p.score || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function LiveGamePlay() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading game...</p>
      </div>
    }>
      <LiveGamePlayContent />
    </Suspense>
  );
}
