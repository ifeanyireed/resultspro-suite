"use client";
import React, { useEffect, useState } from 'react';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myStreak, setMyStreak] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // 1. Fetch leaderboard from coursespro
        const res = await api.get('/api/leaderboard');
        const enrollments = res.data.leaders || [];

        if (enrollments.length === 0) {
          setLeaders([]);
          setLoading(false);
          return;
        }

        // Extract my streak
        const me = enrollments.find((e: any) => e.is_me);
        if (me) {
          setMyStreak(me.streak_days || 0);
        }

        const userIds = enrollments.map((e: any) => e.user_id);

        // 2. Fetch rich profiles from users service
        const profilesRes = await api.post('/api/v1/users/profiles/bulk', { user_ids: userIds });
        const profiles = profilesRes.data.profiles || [];

        // 3. Merge data
        const mergedLeaders = enrollments.map((e: any) => {
          const profile = profiles.find((prof: any) => prof.id === e.user_id) || {};
          
          return {
            rank: e.rank,
            user_id: e.user_id,
            name: profile.full_name || profile.first_name || 'Anonymous Builder',
            xp: e.current_xp,
            streak: e.streak_days,
            avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'Anonymous')}&background=random`,
            is_me: e.is_me
          };
        });

        setLeaders(mergedLeaders);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cohort Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1">Earn XP by completing modules, helping peers, and shipping projects.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-orange-100">
           <FireIcon className="w-5 h-5" />
           <span className="font-bold text-sm">{myStreak} Day Streak!</span>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium">Loading leaderboard...</div>
        ) : leaders.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-medium">No leaderboard data found.</div>
        ) : (
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
                <tr key={leader.rank} className={`transition-colors ${leader.is_me ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-4 px-6 text-center">
                    {leader.rank === 1 ? <TrophyIcon className="w-6 h-6 mx-auto text-amber-500" /> : 
                     leader.rank === 2 ? <TrophyIcon className="w-6 h-6 mx-auto text-gray-400" /> :
                     leader.rank === 3 ? <TrophyIcon className="w-6 h-6 mx-auto text-orange-400" /> :
                     <span className="text-gray-500 font-bold">{leader.rank}</span>}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                         <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`font-medium ${leader.is_me ? 'text-blue-700' : 'text-gray-900'}`}>{leader.name} {leader.is_me && '(You)'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#146ef5]">{leader.xp.toLocaleString()} XP</span>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                         <div className="h-full bg-[#146ef5]" style={{ width: `${Math.min((leader.xp/5000)*100, 100)}%`}}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                      <FireIcon className="w-4 h-4"/> {leader.streak} Days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
