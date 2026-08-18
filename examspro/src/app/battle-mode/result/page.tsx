"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Coins, 
  Zap, 
  RefreshCcw, 
  Home,
  XCircle,
  Share2,
  Sword,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useBattle } from '@/hooks/useBattle';

function BattleResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const battleIdParam = searchParams.get('battleId');
  const { user, fetchUser } = useAuthStore();
  const { finalResult: wsResult, status } = useBattle(battleIdParam);

  const [finalResult, setFinalResult] = useState<any>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [myStats, setMyStats] = useState<any>(null);
  const [opponentStats, setOpponentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. WebSocket Result Sync
  useEffect(() => {
    if (wsResult) {
      console.log("WS Result received", wsResult);
      setFinalResult(wsResult);
      setLoading(false);
      fetchUser();
      // Persist for refresh
      localStorage.setItem(`result_${battleIdParam}`, JSON.stringify(wsResult));
    }
  }, [wsResult, fetchUser, battleIdParam]);

  // 2. Initial Data & Fallback Fetch
  useEffect(() => {
    const loadData = async () => {
      if (!battleIdParam) return;

      // Check localStorage first for instant load on refresh
      const cached = localStorage.getItem(`result_${battleIdParam}`);
      if (cached) {
        setFinalResult(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await api.get(`/battles/${battleIdParam}`);
        if (res.data.status === 'completed') {
           setFinalResult(res.data);
           fetchUser();
        }
      } catch (err) {
        console.error("Failed to fetch battle result", err);
      } finally {
        setLoading(false);
      }
    };

    if (!finalResult) loadData();
  }, [battleIdParam, fetchUser]);

  // 3. Safety Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    // If we land here but have no result and aren't finished after loading, go back to lobby
    if (!loading && !finalResult && status === 'idle') {
      router.push('/battle-mode');
    }
  }, [finalResult, status, router, loading]);

  useEffect(() => {
    if (finalResult && user) {
      const isBotBattle = finalResult.isBot === true || finalResult.IsBot === true;
      
      if (isBotBattle) {
        // Bot Battle Logic
        const uScore = finalResult.userScore ?? (finalResult.participants?.find((p: any) => (p.userId || p.UserID || p.user?.id) === user.id)?.score) ?? 0;
        const bScore = finalResult.botScore ?? finalResult.BotScore ?? 0;
        
        setIsWinner(uScore > bScore);
        setMyStats({ score: uScore, user: user });
        setOpponentStats({ score: bScore, user: { name: 'Computer' } });
      } else {
        // Human Battle Logic
        const participants = finalResult.participants || [];
        const me = participants.find((p: any) => (p.user?.id || p.userId || p.UserID) === user.id);
        
        const others = participants.filter((p: any) => (p.user?.id || p.userId || p.UserID) !== user.id);
        const them = others.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))[0];
        
        let winnerId = finalResult.winnerId || finalResult.WinnerID;
        if (!winnerId && participants.length > 0) {
            const sorted = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
            winnerId = sorted[0]?.userId || sorted[0]?.UserID || sorted[0]?.user?.id;
        }

        setIsWinner(winnerId === user.id);
        setMyStats(me || { score: 0, user: user });
        setOpponentStats(them || { score: 0, user: { name: 'Opponent' } });
      }
    }
  }, [finalResult, user]);

  if (loading || !finalResult || !myStats) {
    return (
       <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tallying Final Scores...</p>
      </div>
    );
  }

  const isBot = finalResult.isBot === true || finalResult.IsBot === true;
  const stake = finalResult.stakePerPlayer || finalResult.StakePerPlayer || 10;
  const pool = stake * (isBot ? 2 : (finalResult.participants?.length || 2));
  const eloChange = isWinner ? (isBot ? 12 : 24) : (isBot ? -8 : -18);

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isWinner ? 'bg-green/10' : 'bg-red-500/10'} rounded-full blur-[120px] animate-pulse`} />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Result Header */}
        <div className="mb-12 animate-in zoom-in duration-500">
          <div className={`
            w-24 h-24 rounded-[32px] mx-auto mb-6 flex items-center justify-center transition-all duration-1000
            ${isWinner ? 'bg-green text-navy rotate-12 shadow-[0_0_50px_rgba(0,200,83,0.5)]' : 'bg-red-500 text-white -rotate-12 shadow-[0_0_50px_rgba(239,68,68,0.5)]'}
          `}>
            {isWinner ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter text-white mb-2 uppercase">
            {isWinner ? 'VICTORY!' : 'DEFEAT'}
          </h1>
          <p className="text-gray-400 font-bold tracking-widest uppercase">
            {isWinner ? 'You dominated the arena' : 'Better luck next time'}
          </p>
        </div>

        {/* Players Comparison */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex flex-col items-center gap-3">
            <div className={`p-1 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold w-16 h-16 ${isWinner ? 'border-green bg-green/10 text-green' : 'border-white/[0.1] border-t-white/[0.15] bg-white/5'}`}>
              {(myStats.user?.name || user?.name || user?.email)?.[0]?.toUpperCase()}
            </div>
            <div className="text-[8px] text-gray-500 font-bold uppercase">Points: {myStats.score || 0}</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-display font-black text-white/10 italic">VS</div>
            <div className="h-px w-12 bg-white/10" />
          </div>

          <div className="flex flex-col items-center gap-3">
             <div className={`p-1 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold w-16 h-16 ${!isWinner && opponentStats ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/[0.1] border-t-white/[0.15] bg-white/5'}`}>
              {(opponentStats?.user?.name || opponentStats?.user?.email || '?')?.[0]?.toUpperCase()}
            </div>
            <div className="text-[8px] text-gray-500 font-bold uppercase">Points: {opponentStats?.score || 0}</div>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="grid grid-cols-2 gap-8 divide-x divide-white/5">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">Result</div>
              <div className={`flex items-center justify-center gap-2 text-3xl font-display font-black ${isWinner ? 'text-amber' : 'text-red-500'}`}>
                {isWinner ? <Coins className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                {isWinner ? `+${pool}` : `-${stake}`}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">ELO Rating</div>
              <div className={`flex items-center justify-center gap-2 text-3xl font-display font-black ${isWinner ? 'text-green' : 'text-red-500'}`}>
                <Zap className="w-6 h-6 fill-current" />
                {isWinner ? `+${eloChange}` : eloChange}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/battle-mode">
             <Button className="w-full sm:w-auto py-7 px-10 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center gap-2 group shadow-xl shadow-green/10">
               <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
               Play Again
             </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto py-7 px-10 rounded-2xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 font-bold text-lg flex items-center gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BattleResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Results...</p>
      </div>
    }>
      <BattleResultContent />
    </Suspense>
  );
}
