"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';
import { IconFlame, IconCoins, IconTrophy, IconChevronRight, IconPlay, IconSword, IconBookOpen, IconLoader2, IconZap } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

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
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <IconLoader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <IconTrophy className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Track Your Progress
        </h1>
        <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
          Log in to view your learning dashboard, track your streaks, see your global ranking, and manage your coins.
        </p>
        <Link href="/login">
          <Button className="bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl px-12 py-6 text-lg font-bold">
            Sign In to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {data.user.name}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Targeting {data.user.target} • {data.user.daysToGo} days to go
          </p>
        </div>
        <Link href="/battle-mode">
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg font-bold gap-2">
            <IconPlay className="w-4 h-4 fill-current" /> QUICK BATTLE
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GradientMetricCard 
          title="Total Coins"
          value={(user?.coinBalance || 0).toLocaleString()}
          trend="+150 this week"
          icon={<IconCoins className="w-6 h-6 text-white" />}
          gradientFrom="from-amber-400"
          gradientTo="to-orange-500"
        />
        <WhiteMetricCard 
          title="Study Streak"
          value={`${data.user.streak} Days`}
          trend="🔥 Keep it up!"
          icon={<IconFlame className="w-6 h-6 text-orange-500" />}
        />
        <WhiteMetricCard 
          title="Overall Readiness"
          value="78%"
          trend="+5% from last week"
          icon={<IconBookOpen className="w-6 h-6 text-[#146ef5]" />}
        />
        <WhiteMetricCard 
          title="Global Rank"
          value="#42"
          trend="Top 1% of students"
          icon={<IconTrophy className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-6">
          
          <WidgetCard 
            title="Your Subjects" 
            action={
              <Link href="/practice" className="text-sm font-semibold text-[#146ef5] hover:text-[#105bd1] flex items-center">
                Browse All <IconChevronRight className="w-4 h-4 ml-1" />
              </Link>
            }
          >
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {data.subjects.length > 0 ? data.subjects.map((sub) => (
                <div key={sub.id} className="min-w-[240px] p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#146ef5]/30 transition-all cursor-pointer group shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm text-${sub.color}-500`}>
                      <IconBookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{sub.questions} Qs</div>
                  </div>
                  <div className="mb-3">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-[#146ef5] transition-colors">{sub.name}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-[#146ef5] transition-all duration-1000" style={{ width: `${sub.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{sub.progress}%</span>
                  </div>
                </div>
              )) : (
                <div className="w-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium mb-3">Select a Subject and Start Practicing</p>
                  <Link href="/practice">
                    <Button variant="outline" className="text-[#146ef5] border-[#146ef5] hover:bg-blue-50">Explore Subjects</Button>
                  </Link>
                </div>
              )}
            </div>
          </WidgetCard>

          <WidgetCard 
            title="Recent Battles" 
            action={
              <Link href="/battle-mode" className="text-sm font-semibold text-[#146ef5] hover:text-[#105bd1]">
                Battle Lobby
              </Link>
            }
          >
            {battleHistory && battleHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {battleHistory.slice(0, 4).map((entry) => {
                  const battle = entry.battle;
                  if (!battle) return null;

                  const isCompleted = battle.status === 'completed';
                  const isBot = battle.isBot === true || battle.IsBot === true;
                  const participants = battle.participants || [];
                  const others = participants.filter((p: any) => (p.userId || p.UserID) !== user.id);
                  
                  let opponentName = others[0]?.user?.name || others[0]?.user?.email || '?';
                  let opponentScore = others.reduce((max: number, p: any) => Math.max(max, p.score || 0), 0);
                  
                  if (isBot) { opponentName = "Computer"; opponentScore = battle.botScore || battle.BotScore || 0; }

                  let result = "In Progress";
                  let resultColor = "text-blue-500 bg-blue-50";

                  if (isCompleted) {
                    if (entry.score > opponentScore) { result = "VICTORY"; resultColor = "text-green-600 bg-green-50"; }
                    else if (entry.score < opponentScore) { result = "DEFEAT"; resultColor = "text-red-600 bg-red-50"; }
                    else { result = "DRAW"; resultColor = "text-amber-600 bg-amber-50"; }
                  }

                  return (
                    <Link 
                      href={isCompleted ? `/battle-mode/result?battleId=${battle.id}` : `/battle-mode/matchmaking?battleId=${battle.id}`}
                      key={entry.id}
                      className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {new Date(entry.joinedAt).toLocaleDateString()}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {battle.subject?.name || 'Subject'}
                          </h4>
                        </div>
                        <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${resultColor}`}>
                          {result}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">{entry.score}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">vs</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">{opponentScore}</span>
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden">
                              {isBot ? <IconZap className="w-3 h-3 text-amber-500 fill-current" /> : (opponentName[0] || '?')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <IconSword className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium mb-3">No battles yet. Ready to start your first one?</p>
                <Link href="/battle-mode">
                  <Button variant="outline" className="text-[#146ef5] border-[#146ef5]">Go to Battle Arena</Button>
                </Link>
              </div>
            )}
          </WidgetCard>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="lg:col-span-4 space-y-6">
          <WidgetCard title="Leaderboard" subtitle="Global Top 5">
            <div className="space-y-3">
              {data.leaderboard.map((u) => (
                <div key={u.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                      u.rank === 1 ? 'bg-amber-100 text-amber-600' : 
                      u.rank === 2 ? 'bg-gray-200 text-gray-600' : 
                      u.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-gray-400 bg-gray-50'
                    }`}>
                      {u.rank}
                    </div>
                    <img src={u.img} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt={u.name} />
                    <div className="text-sm font-bold text-gray-900">{u.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-gray-900">{u.score.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">ELO</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard">
              <Button variant="ghost" className="w-full mt-4 text-gray-500 hover:text-gray-900">
                View Full Rankings
              </Button>
            </Link>
          </WidgetCard>

          <WidgetCard title="Recent Activity">
            <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
              {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:border-[#146ef5]/30 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      item.type === 'study' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {item.type === 'study' ? <IconBookOpen className="w-4 h-4" /> : <IconCoins className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#146ef5] transition-colors line-clamp-1">{item.title}</div>
                      <div className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-2">
                    <div className={`text-xs font-black ${
                      (item.reward && item.reward > 0) || (item.amount && item.amount > 0) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {item.reward ? `+${item.reward}` : item.amount ? (item.amount > 0 ? `+${item.amount}` : item.amount) : item.status || 'Done'}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl">
                  <IconFlame className="w-6 h-6 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-xs font-bold">No recent activity yet.</p>
                </div>
              )}
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
