"use client";

import Navbar from '@/components/Navbar';
import { 
  Trophy, 
  Crown, 
  TrendingUp, 
  Target
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Global'); // Global = ELO, Friends = Coins (placeholder mapping), Exam-Specific = Streak (placeholder)
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let type = 'elo';
      if (activeTab === 'Friends') type = 'coins';
      if (activeTab === 'Exam-Specific') type = 'streak';

      const response = await api.get(`/user/leaderboard?type=${type}`);
      setLeaderboard(response.data);

      if (currentUser) {
        const rankResponse = await api.get('/user/rank');
        setMyRank(rankResponse.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, currentUser]);

  const topThree = leaderboard.slice(0, 3);
  // Re-order for podium display: [Rank 2, Rank 1, Rank 3]
  const podium = [
    topThree[1] || null,
    topThree[0] || null,
    topThree[2] || null
  ];

  const others = leaderboard.slice(3);

  const getScoreLabel = () => {
    if (activeTab === 'Friends') return 'Coins';
    if (activeTab === 'Exam-Specific') return 'Streak';
    return 'ELO';
  };

  const getScoreValue = (user: any) => {
    if (activeTab === 'Friends') return user.coinBalance;
    if (activeTab === 'Exam-Specific') return user.streakCurrent;
    return user.eloRating;
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 text-amber mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Hall of Fame</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
            {activeTab.toUpperCase()} <span className="text-blue">RANKINGS</span>
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] w-fit mx-auto">
            {['Global', 'Friends', 'Exam-Specific'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-gray-500 hover:text-white'}
                `}
              >
                {tab === 'Global' ? 'Global' : tab === 'Friends' ? 'Wealth' : 'Streaks'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 mb-20">
              {/* Rank 2 */}
              {podium[0] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue overflow-hidden p-1 bg-navy">
                      <img src={`https://i.pravatar.cc/150?u=${podium[0].id}`} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-black text-white text-xs border-4 border-navy">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white mb-1 truncate w-24">{podium[0].name || 'Anonymous'}</div>
                    <div className="text-xs font-black text-blue">{getScoreValue(podium[0]).toLocaleString()}</div>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-blue/20 to-blue/5 rounded-t-2xl border-t border-x border-blue/20" />
                </div>
              )}

              {/* Rank 1 */}
              {podium[1] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px] -translate-y-8">
                  <div className="relative">
                    <Crown className="w-8 h-8 text-amber absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,179,0,0.5)]" />
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber overflow-hidden p-1 bg-navy shadow-[0_0_30px_rgba(255,111,0,0.2)]">
                      <img src={`https://i.pravatar.cc/150?u=${podium[1].id}`} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber flex items-center justify-center font-black text-navy text-sm border-4 border-navy">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-white mb-1 truncate w-32">{podium[1].name || 'Anonymous'}</div>
                    <div className="text-sm font-black text-amber">{getScoreValue(podium[1]).toLocaleString()}</div>
                  </div>
                  <div className="w-full h-40 bg-gradient-to-t from-amber/20 to-amber/5 rounded-t-2xl border-t border-x border-amber/20" />
                </div>
              )}

              {/* Rank 3 */}
              {podium[2] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-green overflow-hidden p-1 bg-navy">
                      <img src={`https://i.pravatar.cc/150?u=${podium[2].id}`} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green flex items-center justify-center font-black text-navy text-xs border-4 border-navy">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white mb-1 truncate w-24">{podium[2].name || 'Anonymous'}</div>
                    <div className="text-xs font-black text-green">{getScoreValue(podium[2]).toLocaleString()}</div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-green/20 to-green/5 rounded-t-2xl border-t border-x border-green/20" />
                </div>
              )}
            </div>

            {/* List of others */}
            <div className="space-y-3">
              {others.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic">No more players found.</div>
              )}
              {others.map((user, index) => (
                <div 
                  key={user.id}
                  className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-sm font-black text-gray-600">{index + 4}</div>
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name || 'Anonymous'}</div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-green" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Climbing</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-black text-white">{getScoreValue(user).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{getScoreLabel()}</div>
                    </div>
                    <div className="w-px h-8 bg-white/5" />
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-green group-hover:text-navy transition-colors">
                      <Target className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* User's own rank sticky or login prompt */}
            <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
              {currentUser && myRank ? (
                <div className="p-4 rounded-2xl bg-blue border border-white/20 shadow-2xl shadow-blue/50 flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-navy/30 flex items-center justify-center font-black text-white">{myRank.rank}</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${currentUser.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">You ({currentUser.name})</div>
                      <div className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                        {myRank.nextRankGap > 0 ? `Next Rank in ${myRank.nextRankGap} pts` : 'Top Ranked!'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      {(activeTab === 'Global' ? myRank.user.eloRating : 
                        activeTab === 'Friends' ? myRank.user.coinBalance : 
                        activeTab === 'Exam-Specific' ? myRank.user.streakCurrent : 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-white/70 font-bold uppercase">{getScoreLabel()}</div>
                  </div>
                </div>
              ) : !currentUser && (
                <div className="p-4 rounded-2xl bg-navy/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between group cursor-pointer" onClick={() => window.location.href = '/login'}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500">?</div>
                    <div>
                      <div className="text-sm font-bold text-white">Track Your Progress</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sign in to see your global rank</div>
                    </div>
                  </div>
                  <button className="px-6 py-2 rounded-xl bg-blue text-white text-xs font-black uppercase hover:bg-blue/90 transition-colors">
                    Login
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
