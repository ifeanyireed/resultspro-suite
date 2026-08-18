"use client";

import Navbar from '@/components/Navbar';
import { 
  Trophy, 
  Users, 
  Timer, 
  ChevronRight, 
  Sword,
  Target,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TournamentPage() {
  const bracket = [
    {
      round: "Quarter-Finals",
      matches: [
        { p1: "Ifeanyi", p2: "Sarah", s1: 15, s2: 12, winner: 1 },
        { p1: "Olu", p2: "Chidi", s1: 10, s2: 14, winner: 2 },
        { p1: "Fatima", p2: "Michael", s1: 18, s2: 17, winner: 1 },
        { p1: "Grace", p2: "Emeka", s1: 12, s2: 13, winner: 2 },
      ]
    },
    {
      round: "Semi-Finals",
      matches: [
        { p1: "Ifeanyi", p2: "Chidi", s1: null, s2: null },
        { p1: "Fatima", p2: "Emeka", s1: null, s2: null },
      ]
    },
    {
      round: "Final",
      matches: [
        { p1: "TBD", p2: "TBD", s1: null, s2: null },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Section */}
        <div className="relative p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-green/20 via-blue/10 to-transparent border border-white/10 overflow-hidden mb-12">
          <div className="absolute top-0 right-0 p-12 opacity-10 hidden lg:block">
            <Trophy className="w-64 h-64 text-green" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-green text-navy font-bold text-[10px] uppercase tracking-widest">Live Now</span>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <Users className="w-4 h-4" /> 512 Registered
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tight">
              Weekly <span className="text-green">JAMB</span> Tournament
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
              Compete in high-stakes synchronous battles across the full JAMB syllabus. 
              Top 8 players from qualifying rounds enter the live knockout bracket.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button className="w-full sm:w-auto bg-green text-navy hover:bg-green/90 rounded-2xl px-12 py-8 text-xl font-bold flex gap-3 shadow-[0_0_30px_rgba(0,200,83,0.3)]">
                <Sword className="w-6 h-6 fill-current" />
                JOIN TOURNAMENT
              </Button>
              
              <div className="flex items-center gap-6">
                <div className="text-center px-6 py-2 border-l border-white/10">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Prize Pool</div>
                  <div className="text-2xl font-display font-black text-amber">5,000 Coins</div>
                </div>
                <div className="text-center px-6 py-2 border-l border-white/10">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Time Left</div>
                  <div className="text-2xl font-display font-black text-white">02:45:12</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bracket Diagram */}
        <div className="mb-20 overflow-x-auto pb-8 scrollbar-hide no-scrollbar">
          <div className="min-w-[1000px] flex justify-between gap-12">
            {bracket.map((round, rIndex) => (
              <div key={round.round} className="flex-1 space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 text-center mb-12">
                  {round.round}
                </h3>
                
                <div className="space-y-12">
                  {round.matches.map((match: any, mIndex) => (
                    <div key={mIndex} className="relative">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-2">
                        {[
                          { name: match.p1, score: match.s1, isWinner: match.winner === 1 },
                          { name: match.p2, score: match.s2, isWinner: match.winner === 2 }
                        ].map((player, pIndex) => (
                          <div key={pIndex} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${player.isWinner ? 'bg-green' : 'bg-white/10'}`} />
                              <span className={`text-sm font-bold ${player.isWinner ? 'text-white' : 'text-gray-500'}`}>
                                {player.name}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-black ${player.isWinner ? 'text-green' : 'text-gray-600'}`}>
                              {player.score !== null ? player.score : '--'}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Connector Lines */}
                      {rIndex < bracket.length - 1 && (
                        <div className="absolute top-1/2 -right-12 w-12 h-px bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Rules / Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Qualification</h4>
            <p className="text-sm text-gray-400">Complete at least 5 practice sessions with 85%+ score in the tournament subject during the week.</p>
          </div>
          
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Format</h4>
            <p className="text-sm text-gray-400">Synchronous 10-question battles. Speed and accuracy both count toward the final round score.</p>
          </div>

          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Rewards</h4>
            <p className="text-sm text-gray-400 text-balance">Winner: 2,500 Coins + Elite Badge. Semi-finalists: 500 Coins. Quarter-finalists: 100 Coins.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
