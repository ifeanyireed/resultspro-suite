"use client";
import React from 'react';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/outline';

export default function LeaderboardPage() {
  const leaders = [
    { rank: 1, name: 'David K.', xp: 4520, streak: 14, avatar: 'david' },
    { rank: 2, name: 'Sarah M.', xp: 4100, streak: 12, avatar: 'sarah' },
    { rank: 3, name: 'Tunde B.', xp: 3950, streak: 8, avatar: 'tunde' },
    { rank: 4, name: 'Amaka O.', xp: 3800, streak: 5, avatar: 'amaka' },
    { rank: 5, name: 'John D.', xp: 3420, streak: 2, avatar: 'john' },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cohort Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1">Earn XP by completing modules, helping peers, and shipping projects.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-orange-100">
           <FireIcon className="w-5 h-5" />
           <span className="font-bold text-sm">12 Day Streak!</span>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Rank</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Builder</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">XP Earned</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Active Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaders.map((leader) => (
              <tr key={leader.rank} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-center">
                  {leader.rank === 1 ? <TrophyIcon className="w-6 h-6 mx-auto text-amber-500" /> : 
                   leader.rank === 2 ? <TrophyIcon className="w-6 h-6 mx-auto text-gray-400" /> :
                   leader.rank === 3 ? <TrophyIcon className="w-6 h-6 mx-auto text-orange-400" /> :
                   <span className="text-gray-500 font-bold">{leader.rank}</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/150?u=${leader.avatar}`} alt={leader.name} /></div>
                    <span className="font-medium text-gray-900">{leader.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#146ef5]">{leader.xp.toLocaleString()} XP</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-[#146ef5]" style={{ width: `${(leader.xp/5000)*100}%`}}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg"><FireIcon className="w-4 h-4"/> {leader.streak} Days</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}