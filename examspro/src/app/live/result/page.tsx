"use client";

import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { IconTrophy as Trophy, IconShare2 as Share2, IconArrowRight as ArrowRight, IconMedal as Medal, IconStar as Star, IconHome as Home, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLiveGame } from '@/hooks/useLiveGame';
import { useAuthStore } from '@/store/useAuthStore';
import { useSearchParams, useRouter } from 'next/navigation';

function LiveGameResultContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const router = useRouter();
  const { user } = useAuthStore();
  const { winners, leaderboard, isConnected } = useLiveGame(roomId || "");
  const [myResult, setMyResult] = useState<any>(null);

  useEffect(() => {
    const found = leaderboard.find(p => p.userId === user?.id);
    if (found) setMyResult(found);
  }, [leaderboard, user]);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Room ID Provided</h1>
        <Button onClick={() => router.push('/live')} className="bg-green text-navy">Back to Lobby</Button>
      </div>
    );
  }

  if (!isConnected && winners.length === 0) {
    return (
       <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching final results...</p>
      </div>
    );
  }

  // Use leaderboard as fallback if winners not explicitly pushed yet
  const displayWinners = winners.length > 0 ? winners : leaderboard.slice(0, 3);

  return (
    <main className="min-h-screen bg-navy text-white pb-24">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 pt-12">
        {/* Podium Section */}
        <div className="flex flex-col items-center mb-20">
          <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-6 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-center mb-4">
            Game <span className="text-green">Results</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Room {roomId}</p>
        </div>

        {/* Podium Visual */}
        <div className="flex items-end justify-center gap-4 md:gap-8 mb-20 h-80">
          {/* 2nd Place */}
          {displayWinners[1] && (
            <div className="flex flex-col items-center flex-1 max-w-[120px] animate-in slide-in-from-bottom-12 duration-700 delay-200">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-white/5 flex items-center justify-center text-xl font-bold">
                  {displayWinners[1].user?.name?.[0] || displayWinners[1].user?.email?.[0] || 'P'}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-[10px] font-black text-navy">2</div>
              </div>
              <div className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-t-2xl p-4 text-center h-32 flex flex-col justify-center">
                <div className="text-xs font-bold text-gray-400 truncate mb-1">{displayWinners[1].user?.name || displayWinners[1].user?.email || 'Player'}</div>
                <div className="text-lg font-display font-black text-white">{displayWinners[1].score}</div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {displayWinners[0] && (
            <div className="flex flex-col items-center flex-1 max-w-[160px] animate-in slide-in-from-bottom-20 duration-1000">
              <div className="relative mb-6">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <Medal className="w-10 h-10 text-amber animate-pulse" />
                </div>
                <div className="w-24 h-24 rounded-[32px] border-4 border-amber shadow-[0_0_40px_rgba(255,111,0,0.3)] bg-amber/10 flex items-center justify-center text-3xl font-bold">
                   {displayWinners[0].user?.name?.[0] || displayWinners[0].user?.email?.[0] || 'W'}
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber rounded-full flex items-center justify-center text-sm font-black text-navy border-4 border-navy">1</div>
              </div>
              <div className="w-full bg-gradient-to-b from-amber/20 to-amber/5 border border-amber/30 rounded-t-[32px] p-6 text-center h-48 flex flex-col justify-center">
                <div className="text-sm font-bold text-amber truncate mb-1">{displayWinners[0].user?.name || displayWinners[0].user?.email || 'Winner'}</div>
                <div className="text-2xl font-display font-black text-white">{displayWinners[0].score}</div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {displayWinners[2] && (
            <div className="flex flex-col items-center flex-1 max-w-[120px] animate-in slide-in-from-bottom-8 duration-500 delay-500">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-white/5 flex items-center justify-center text-xl font-bold">
                   {displayWinners[2].user?.name?.[0] || displayWinners[2].user?.email?.[0] || 'P'}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-800 rounded-full flex items-center justify-center text-[10px] font-black text-white">3</div>
              </div>
              <div className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-t-2xl p-4 text-center h-24 flex flex-col justify-center">
                <div className="text-xs font-bold text-gray-400 truncate mb-1">{displayWinners[2].user?.name || displayWinners[2].user?.email || 'Player'}</div>
                <div className="text-lg font-display font-black text-white">{displayWinners[2].score}</div>
              </div>
            </div>
          )}
        </div>

        {/* User Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col gap-6">
            <h3 className="text-xl font-display font-bold">Your Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Score</div>
                <div className="text-xl font-black text-green">{myResult?.score || 0}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Rank</div>
                <div className="text-xl font-black text-blue">
                  #{leaderboard.findIndex(p => p.userId === user?.id) + 1 || '--'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue mb-6">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Game Summary</h3>
              <p className="text-gray-400">The match has concluded. Winners will receive their prizes automatically.</p>
            </div>
            <Button className="w-full bg-blue text-white hover:bg-blue/90 rounded-2xl py-6 font-bold flex gap-2">
              <Share2 className="w-4 h-4" /> SHARE RESULTS
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/live" className="flex-1">
            <Button className="w-full bg-green text-navy hover:bg-green/90 rounded-[24px] py-8 text-xl font-black flex gap-2">
              JOIN NEXT GAME <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 rounded-[24px] py-8 text-xl font-black flex gap-2">
              <Home className="w-6 h-6" /> BACK HOME
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LiveGameResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading results...</p>
      </div>
    }>
      <LiveGameResultContent />
    </Suspense>
  );
}
