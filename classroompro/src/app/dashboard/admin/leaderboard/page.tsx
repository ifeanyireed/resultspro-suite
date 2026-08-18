"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconTrophy as Trophy, IconCrown as Crown, IconTrendingUp as TrendingUp, IconTarget as Target } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Mock data reflecting the school admin context
const rankingData = [
  { id: 1, name: "Daniel Smith", class: "SSS 3", points: 12450, avatar: "DS", trend: "up" },
  { id: 2, name: "Jessica Alabi", class: "SSS 2", points: 11200, avatar: "JA", trend: "up" },
  { id: 3, name: "Fatima Yusuf", class: "SSS 1", points: 10850, avatar: "FY", trend: "down" },
  { id: 4, name: "Emeka Obi", class: "JSS 3", points: 9400, avatar: "EO", trend: "stable" },
  { id: 5, name: "Sarah Williams", class: "SSS 3", points: 8900, avatar: "SW", trend: "up" },
  { id: 6, name: "John Doe", class: "SSS 2", points: 8500, avatar: "JD", trend: "up" },
  { id: 7, name: "Aisha Bakare", class: "JSS 2", points: 7800, avatar: "AB", trend: "down" },
];

export default function SchoolLeaderboardPage() {
  const [activeTab, setActiveTab] = useState('Academic'); // Academic, Engagement, Streaks
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="School Leaderboard" />
        <main className="p-8 max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col items-center space-y-6">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-16 w-96 rounded-xl" />
            <Skeleton className="h-12 w-80 rounded-2xl" />
          </div>
          <div className="flex items-end justify-center gap-4 h-64">
            <Skeleton className="w-32 h-40 rounded-t-[32px]" />
            <Skeleton className="w-32 h-56 rounded-t-[32px]" />
            <Skeleton className="w-32 h-32 rounded-t-[32px]" />
          </div>
          <div className="space-y-3 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        </main>
      </div>
    );
  }

  const topThree = rankingData.slice(0, 3);
  // Re-order for podium display: [Rank 2, Rank 1, Rank 3]
  const podium = [
    topThree[1] || null,
    topThree[0] || null,
    topThree[2] || null
  ];

  const others = rankingData.slice(3);

  return (
    <div className="flex-1 bg-navy min-h-screen">
      <DashboardHeader title="School Leaderboard" />
      
      <main className="p-8 max-w-5xl mx-auto">
        {/* Header Section from Frontend UI */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 text-amber mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Hall of Fame</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase">
            {activeTab} <span className="text-blue">RANKINGS</span>
          </h1>
          
          {/* Tabs from Frontend UI */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto">
            {['Academic', 'Engagement', 'Streaks'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-gray-500 hover:text-white'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium from Frontend UI style */}
        <div className="flex items-end justify-center gap-4 mb-20 max-w-3xl mx-auto">
          {/* Rank 2 */}
          {podium[0] && (
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue overflow-hidden p-1 bg-navy flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-blue/20 flex items-center justify-center text-blue font-bold text-xl">
                    {podium[0].avatar}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-black text-white text-xs border-4 border-navy">
                  2
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-white mb-1 truncate w-24">{podium[0].name}</div>
                <div className="text-xs font-black text-blue">{podium[0].points.toLocaleString()} pts</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">{podium[0].class}</div>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-blue/20 to-blue/5 rounded-t-2xl border-t border-x border-blue/20" />
            </div>
          )}

          {/* Rank 1 */}
          {podium[1] && (
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px] -translate-y-8">
              <div className="relative">
                <Crown className="w-8 h-8 text-amber absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,179,0,0.5)]" />
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber overflow-hidden p-1 bg-navy flex items-center justify-center shadow-[0_0_30px_rgba(255,111,0,0.2)]">
                  <div className="w-full h-full rounded-full bg-amber/20 flex items-center justify-center text-amber font-bold text-2xl">
                    {podium[1].avatar}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber flex items-center justify-center font-black text-navy text-sm border-4 border-navy">
                  1
                </div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-white mb-1 truncate w-32">{podium[1].name}</div>
                <div className="text-sm font-black text-amber">{podium[1].points.toLocaleString()} pts</div>
                <div className="text-[10px] text-amber/60 font-bold uppercase tracking-wider">{podium[1].class}</div>
              </div>
              <div className="w-full h-40 bg-gradient-to-t from-amber/20 to-amber/5 rounded-t-2xl border-t border-x border-amber/20" />
            </div>
          )}

          {/* Rank 3 */}
          {podium[2] && (
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-green overflow-hidden p-1 bg-navy flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-green/20 flex items-center justify-center text-green font-bold text-xl">
                    {podium[2].avatar}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green flex items-center justify-center font-black text-navy text-xs border-4 border-navy">
                  3
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-white mb-1 truncate w-24">{podium[2].name}</div>
                <div className="text-xs font-black text-green">{podium[2].points.toLocaleString()} pts</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">{podium[2].class}</div>
              </div>
              <div className="w-full h-20 bg-gradient-to-t from-green/20 to-green/5 rounded-t-2xl border-t border-x border-green/20" />
            </div>
          )}
        </div>

        {/* List of others from Frontend UI style */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {others.map((student, index) => (
            <div 
              key={student.id}
              className="group p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-sm font-black text-gray-600">{index + 4}</div>
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                  {student.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{student.name}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{student.class}</span>
                    <span className="text-gray-700">•</span>
                    <TrendingUp className={`w-3 h-3 ${student.trend === 'up' ? 'text-green' : student.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-sm font-black text-white">{student.points.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Points</div>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-green group-hover:text-navy transition-colors">
                  <Target className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 flex justify-center">
           <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl px-8">
              Download Full Report
           </Button>
        </div>
      </main>
    </div>
  );
}
