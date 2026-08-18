"use client";

import { 
  Coins, 
  Download, 
  Users, 
  Target, 
  TrendingUp, 
  Search, 
  Filter,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminLiveGameSummaryContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const finalRankings = [
    { rank: 1, name: "Chidi E.", score: 9200, accuracy: "10/10", speed: "3.2s", coins: 2500, img: "https://i.pravatar.cc/100?u=3" },
    { rank: 2, name: "Oluwaseun A.", score: 8500, accuracy: "9/10", speed: "3.8s", coins: 500, img: "https://i.pravatar.cc/100?u=1" },
    { rank: 3, name: "Ifeanyi Chuks", score: 8200, accuracy: "8/10", speed: "4.2s", coins: 200, img: "https://i.pravatar.cc/100?u=4" },
    { rank: 4, name: "Sarah Smith", score: 7800, accuracy: "8/10", speed: "4.5s", coins: 0, img: "https://i.pravatar.cc/100?u=2" },
  ];

  if (!roomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8">
        <h1 className="text-2xl font-bold mb-4">No Room ID provided</h1>
      </div>
    );
  }

  return (
    <>
      <AdminHeader title={`Post-Game Report: ${roomId}`} />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto w-full no-scrollbar">
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" className="rounded-xl font-bold text-xs gap-2 border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> EXPORT CSV
          </Button>
          <Button variant="outline" className="rounded-xl font-bold text-xs gap-2 border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> PDF SUMMARY
          </Button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Players", value: "124", icon: Users, color: "blue" },
            { label: "Avg. Score", value: "6,450", icon: Target, color: "green" },
            { label: "Completion Rate", value: "92%", icon: TrendingUp, color: "purple" },
            { label: "Coins Distributed", value: "3,200", icon: Coins, color: "amber" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-display font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accuracy Breakdown */}
          <div className="lg:col-span-2 bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex justify-between items-center bg-white/5">
              <h3 className="font-display font-bold text-white text-lg">Question Performance</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Sorted by difficulty</span>
            </div>
            <div className="p-4 grid grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => {
                const acc = [85, 72, 45, 12, 68, 94, 33, 58, 77, 61][i];
                return (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] text-center hover:bg-white/10 transition-colors group">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Q{i+1}</div>
                    <div className={`text-xl font-black ${acc > 70 ? 'text-green' : acc > 40 ? 'text-amber-400' : 'text-red-500'}`}>
                      {acc}%
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full ${acc > 70 ? 'bg-green' : acc > 40 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${acc}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="font-display font-bold text-white text-lg mb-6">Coin Economy</h3>
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-amber-400/10 border border-amber-400/20 shadow-sm shadow-amber-900/10">
                <div className="flex items-center gap-3 text-amber-400 mb-4">
                  <Coins className="w-5 h-5" />
                  <h4 className="font-bold">Total Stakes</h4>
                </div>
                <div className="text-3xl font-display font-black text-white">2,480 Coins</div>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">124 Players x 20 Coins</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Platform Fee (10%)</span>
                  <span className="font-bold text-white">-248</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Prize Pool</span>
                  <span className="font-bold text-green">2,232</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Admin Bonus Added</span>
                  <span className="font-bold text-blue-400">+1,000</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-black text-lg">
                  <span className="text-white">Total Paid Out</span>
                  <span className="text-white">3,232</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Rankings Table */}
        <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex justify-between items-center bg-white/5">
            <h3 className="font-display font-bold text-white text-lg">Final Player Rankings</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search players..." className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-green/50 transition-colors" />
              </div>
              <Button variant="outline" className="rounded-xl text-xs border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 transition-colors"><Filter className="w-3 h-3" /></Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Player</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accuracy</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg Speed</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Final Score</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {finalRankings.map((p) => (
                  <tr key={p.rank} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${p.rank === 1 ? 'bg-amber-400 text-navy' : 'bg-white/5 text-gray-400 group-hover:text-white transition-colors'}`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={p.img} className="w-8 h-8 rounded-lg border border-white/10" alt="" />
                        <span className="text-sm font-bold text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-green">{p.accuracy}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors">{p.speed}</td>
                    <td className="px-8 py-5 text-sm font-black text-white">{p.score.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                        <Coins className="w-3 h-3" /> {p.coins > 0 ? `+${p.coins}` : '0'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLiveGameSummary() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-10 h-10 animate-spin text-green" />
      </div>
    }>
      <AdminLiveGameSummaryContent />
    </Suspense>
  );
}
