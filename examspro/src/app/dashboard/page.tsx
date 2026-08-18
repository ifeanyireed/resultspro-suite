"use client";

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Coins, 
  Trophy, 
  ChevronRight, 
  Play, 
  Sword,
  BookOpen,
  Loader2,
  Zap
  } from 'lucide-react';import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface DashboardData {
  user: {
    name: string;
    coins: number;
    streak: number;
    target: string;
    daysToGo: number;
  };
  subjects: Array<{ id: number, name: string, progress: number, color: string, questions: number }>;
  exams: Array<{ id: number, slug: string, name: string, readiness: number, category: string }>;
  leaderboard: Array<{ name: string, score: number, rank: number, img: string }>;
  recentActivity: Array<{ title: string, type: string, status?: string, timestamp: string, reward?: number, amount?: number, desc?: string }>;
}


export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [battleHistory, setBattleHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const [dashRes, historyRes, _] = await Promise.all([
          api.get('/user/dashboard'),
          api.get('/battles/history'),
          fetchUser()
        ]);
        setData(dashRes.data);
        setBattleHistory(historyRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/[0.1] border-t-white/[0.15]">
            <Trophy className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
            Track Your Progress
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Log in to view your learning dashboard, track your streaks, see your global ranking, and manage your coins.
          </p>
          <Link href="/login">
            <Button className="bg-green text-navy hover:bg-green/90 rounded-xl px-12 py-6 text-lg font-bold">
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header / Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
              Welcome back, <span className="text-green">{data.user.name}!</span>
            </h1>
            <p className="text-gray-500 text-sm">Targeting {data.user.target} • {data.user.daysToGo} days to go</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase leading-none">Coins</div>
                <div className="text-sm font-bold text-white">{(user?.coinBalance || 0).toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase leading-none">Streak</div>
                <div className="text-sm font-bold text-white">{data.user.streak} Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Battle CTA */}
        <div className="relative w-full p-8 md:p-12 rounded-3xl bg-gradient-to-r from-green to-blue overflow-hidden mb-12 group cursor-pointer">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
            <Sword className="w-32 h-32 text-white -rotate-12" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-display font-black text-navy mb-4">
              READY FOR A BATTLE?
            </h2>
            <p className="text-navy/70 font-medium mb-8 max-w-md">
              Stake 10 coins and challenge a random opponent. 
              The winner takes the full pool!
            </p>
            <Link href="/battle-mode">
              <Button className="bg-navy text-white hover:bg-navy/90 rounded-xl px-8 py-6 text-lg font-bold flex gap-2">
                <Play className="w-5 h-5 fill-current" />
                QUICK MATCH
              </Button>
            </Link>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white">Your Subjects</h3>
            <Link href="/practice" className="text-green text-sm font-medium flex items-center gap-1 hover:underline">
              Browse All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {data.subjects.length > 0 ? data.subjects.map((sub) => (
              <div 
                key={sub.id} 
                className="min-w-[280px] p-6 rounded-2xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${sub.color === 'green' ? 'green/20 text-green' : sub.color === 'blue' ? 'blue/20 text-blue' : 'amber/20 text-amber'}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{sub.questions} Questions</div>
                </div>
                <div className="mb-1">
                  <div className="text-[10px] text-green font-bold uppercase tracking-widest">Mastery Level</div>
                  <h4 className="text-lg font-bold text-white group-hover:text-green transition-colors">{sub.name}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-green transition-all duration-1000" 
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">{sub.progress}%</span>
                </div>
              </div>
            )) : (
              <div className="w-full py-12 px-6 rounded-2xl border border-dashed border-white/[0.1] border-t-white/[0.15] bg-white/[0.02] text-center">
                <p className="text-gray-500 font-medium mb-4">Select a Subject and Start Practicing</p>
                <Link href="/practice">
                  <Button variant="outline" className="border-green/20 text-green hover:bg-green/5 text-xs">Explore Subjects</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Exams Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white">Your Exams</h3>
            <Link href="/practice" className="text-blue text-sm font-medium flex items-center gap-1 hover:underline">
              All Exams <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {data.exams && data.exams.length > 0 ? data.exams.map((exam) => (
              <Link 
                href={`/practice/${exam.slug}`} 
                key={exam.id}
                className="min-w-[280px] p-6 rounded-2xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue/20 text-blue">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 font-bold uppercase">{exam.category}</div>
                </div>
                <div className="mb-4">
                  <div className="text-[10px] text-blue font-bold uppercase tracking-widest">Readiness %</div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue transition-colors">{exam.name}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-blue transition-all duration-1000" 
                      style={{ width: `${exam.readiness}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-white">{exam.readiness}%</span>
                </div>
              </Link>
            )) : (
              <div className="w-full py-12 px-6 rounded-2xl border border-dashed border-white/[0.1] border-t-white/[0.15] bg-white/[0.02] text-center">
                <p className="text-gray-500 font-medium mb-4">Select an Exam and Start Practicing</p>
                <Link href="/practice">
                  <Button variant="outline" className="border-blue/20 text-blue hover:bg-blue/5 text-xs">Choose an Exam</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Battle History Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-500" />
              Recent Battles
            </h3>
            <Link href="/battle-mode" className="text-gray-500 text-sm font-medium hover:text-white transition-colors">
              Battle Lobby
            </Link>
          </div>

          {battleHistory && battleHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {battleHistory.map((entry) => {
                const battle = entry.battle;
                if (!battle) return null;

                const isCompleted = battle.status === 'completed';
                const isBot = battle.isBot === true || battle.IsBot === true;
                const participants = battle.participants || [];
                const others = participants.filter((p: any) => (p.userId || p.UserID) !== user.id);
                
                let opponentName = others[0]?.user?.name || others[0]?.user?.email || '?';
                let opponentScore = others.reduce((max: number, p: any) => Math.max(max, p.score || 0), 0);
                
                if (isBot) {
                  opponentName = "Computer";
                  opponentScore = battle.botScore || battle.BotScore || 0;
                }

                let result = "In Progress";
                let resultColor = "text-blue";

                if (isCompleted) {
                  const myScore = entry.score;
                  
                  if (myScore > opponentScore) {
                    result = "VICTORY";
                    resultColor = "text-green";
                  } else if (myScore < opponentScore) {
                    result = "DEFEAT";
                    resultColor = "text-red-500";
                  } else {
                    result = "DRAW";
                    resultColor = "text-amber";
                  }
                }

                return (
                  <Link 
                    href={isCompleted ? `/battle-mode/result?battleId=${battle.id}` : `/battle-mode/matchmaking?battleId=${battle.id}`}
                    key={entry.id}
                    className="p-5 rounded-2xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:bg-white/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                          {new Date(entry.joinedAt).toLocaleDateString()}
                        </div>
                        <h4 className="font-bold text-white group-hover:text-green transition-colors">
                          {battle.subject?.name || 'Subject'}
                        </h4>
                      </div>
                      <div className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-white/5 ${resultColor}`}>
                        {result}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-[10px] font-bold text-gray-400">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div className="text-xs font-bold text-white">{entry.score}</div>
                        <div className="text-[10px] text-gray-600">vs</div>
                        <div className="text-xs font-bold text-gray-400">{opponentScore}</div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden">
                          {isBot ? <Zap className="w-4 h-4 text-blue fill-current" /> : (opponentName[0] || '?')}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 rounded-3xl border border-dashed border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] text-center">
              <Sword className="w-12 h-12 text-white/5 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-medium">No battles yet. Ready to start your first one?</p>
              <Link href="/battle-mode">
                <Button variant="ghost" className="mt-4 text-green hover:bg-green/5">Go to Battle Arena</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Leaderboard Snippet */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[440px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber" />
                <h3 className="text-xl font-display font-bold text-white">Leaderboard</h3>
              </div>
              <span className="text-xs text-amber font-bold uppercase tracking-widest">Global Top 5</span>
            </div>
            
            <div className="space-y-4 flex-1">
              {data.leaderboard.map((u) => (
                <div key={u.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/[0.05] border-t-white/[0.1] group">
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                      u.rank === 1 ? 'bg-amber text-navy' : 
                      u.rank === 2 ? 'bg-blue text-white' : 
                      u.rank === 3 ? 'bg-green text-navy' : 'text-gray-500'
                    }`}>
                      {u.rank}
                    </div>
                    <img src={u.img} className="w-8 h-8 rounded-full border border-white/10" alt={u.name} />
                    <div className="text-sm font-medium text-white group-hover:text-blue transition-colors">{u.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">{u.score.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">ELO</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/leaderboard">
              <Button variant="ghost" className="w-full mt-6 text-gray-400 hover:text-white hover:bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                View Full Hall of Fame
              </Button>
            </Link>
          </div>

          {/* Recent Activity Section */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[440px] flex flex-col">
            <h3 className="text-xl font-display font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-1">
              {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] border-t-white/[0.1] bg-navy/50 hover:border-blue/30 hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === 'study' ? 'bg-blue/20 text-blue' : 'bg-amber/20 text-amber'
                    }`}>
                      {item.type === 'study' ? <BookOpen className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-blue transition-colors">{item.title}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black ${
                      (item.reward && item.reward > 0) || (item.amount && item.amount > 0) ? 'text-green' : 'text-gray-500'
                    }`}>
                      {item.reward ? `+${item.reward}` : item.amount ? (item.amount > 0 ? `+${item.amount}` : item.amount) : item.status || 'Done'}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                      {item.type === 'study' ? 'Reward' : 'Coins'}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <Flame className="w-8 h-8 text-gray-800" />
                  </div>
                  <p className="text-gray-500 font-bold">No recent activity yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Start practicing to see your progress here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
