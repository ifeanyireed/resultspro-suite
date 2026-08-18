"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBookOpen as BookOpen, IconBrainCircuit as BrainCircuit, IconLayers as Layers, IconChevronRight as ChevronRight, IconClock as Clock, IconTrophy as Trophy, IconFlame as Flame, IconZap as Zap, IconTarget as Target, IconAward as Award, IconEye as Eye, IconEyeOff as EyeOff } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { getStudentDashboard } from "@/lib/api";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (user) {
      if (user.role === 'PARENT') router.push('/dashboard/parent');
      else if (user.role === 'TEACHER') router.push('/dashboard/teacher');
      else if (user.role === 'SCHOOL_ADMIN') router.push('/dashboard/admin');
      else if (user.role === 'SUPERADMIN') router.push('/dashboard/super-admin');
    }
  }, [user, router]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'there';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await getStudentDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Student Dashboard" />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-2xl" />
              <Skeleton className="h-14 w-40 rounded-2xl" />
            </div>
          </div>
          
          <Skeleton className="h-48 w-full rounded-[32px]" />

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 rounded-[32px]" />
                <Skeleton className="h-64 rounded-[32px]" />
              </div>
              <Skeleton className="h-96 rounded-[32px]" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-[500px] rounded-[32px]" />
              <Skeleton className="h-64 rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeAllocationData = [
    { name: 'Quizzes', value: data?.timeAllocation?.Quiz || 0, color: '#3B82F6' },
    { name: 'Notes', value: data?.timeAllocation?.Note || 0, color: '#22C55E' },
    { name: 'Flashcards', value: data?.timeAllocation?.Flashcards || 0, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  // If no data, show placeholder
  const hasTimeData = timeAllocationData.length > 0;
  const placeholderData = [
    { name: 'No activity yet', value: 1, color: '#334155' }
  ];

  const totalTimeSpent = data?.stats?.totalTimeSpent || 0;
  const dailyGoal = data?.dailyGoal || 200;
  const progressPercent = Math.min(100, (totalTimeSpent / dailyGoal) * 100);

  const levelXP = data?.gamification?.xp || 0;
  const currentLevel = data?.gamification?.level || 1;
  const nextLevelXP = currentLevel * 500;
  const prevLevelXP = (currentLevel - 1) * 500;
  const xpInCurrentLevel = levelXP - prevLevelXP;
  const levelProgressPercent = Math.min(100, (xpInCurrentLevel / 500) * 100);

  return (
    <div className="flex-1 pb-12 transition-all duration-500">
      <DashboardHeader title="Student Dashboard" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section: My Journey */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">My Journey 🚀</h2>
            <p className="text-muted-foreground font-medium">Keep it up, {firstName}! You're making great progress.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center text-orange">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Current Streak</p>
                <p className="text-lg font-bold text-white">{data?.gamification?.currentStreak || 0} Days</p>
              </div>
            </div>

            <button 
              onClick={() => setStudyMode(!studyMode)}
              className={`flex items-center gap-3 border px-4 py-2 rounded-2xl transition-all ${
                studyMode 
                  ? "bg-green/10 border-green/30 text-green" 
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              {studyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="font-bold">{studyMode ? "Study Mode: ON" : "Study Mode: OFF"}</span>
            </button>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-2 h-full bg-green"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Daily Learning Goal <Target className="w-5 h-5 text-green" />
              </h3>
              <p className="text-muted-foreground">You've completed <span className="text-white font-bold">{totalTimeSpent} mins</span> of your <span className="text-white font-bold">{dailyGoal} mins</span> goal.</p>
            </div>
            <div className="text-right">
               <span className="text-3xl font-black text-white">{Math.round(progressPercent)}%</span>
            </div>
          </div>
          
          <div className="mt-6 h-4 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green/60 to-green transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Time Allocation & Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Time Allocation Chart */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <h4 className="font-bold text-white">Time Allocation</h4>
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hasTimeData ? timeAllocationData : placeholderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(hasTimeData ? timeAllocationData : placeholderData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-black text-white">{totalTimeSpent}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Mins</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue"></div>
                    <span className="text-xs text-muted-foreground">Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green"></div>
                    <span className="text-xs text-muted-foreground">Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber"></div>
                    <span className="text-xs text-muted-foreground">Flashcards</span>
                  </div>
                </div>
              </div>

              {/* Quick Resume / Recent Activity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">Recent Activity</h4>
                  <Link href="/dashboard/progress" className="text-xs text-green hover:underline">View History</Link>
                </div>
                <div className="space-y-3">
                  {data?.recentActivity?.map((activity: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'note' ? 'bg-green/10 text-green' : 
                        activity.type === 'quiz' ? 'bg-blue/10 text-blue' : 'bg-amber/10 text-amber'
                      }`}>
                        {activity.type === 'note' && <BookOpen className="w-5 h-5" />}
                        {activity.type === 'quiz' && <BrainCircuit className="w-5 h-5" />}
                        {activity.type === 'flashcard' && <Layers className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white truncate">{activity.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{activity.subject} • {activity.time}</p>
                      </div>
                      <Link href={`/dashboard/${activity.type === 'note' ? 'notes' : 'quizzes'}/${activity.id}`}>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 transition-colors">
                          Resume
                        </button>
                      </Link>
                    </div>
                  ))}
                  {(!data?.recentActivity || data.recentActivity.length === 0) && (
                    <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                       <p className="text-sm text-muted-foreground">No recent activity. Start learning today!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations / Tasks */}
            {!studyMode && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-3xl bg-blue/5 border border-blue/10 relative overflow-hidden">
                  <Zap className="absolute -top-4 -right-4 w-24 h-24 text-blue/5" />
                  <h4 className="font-bold text-white mb-4">Recommended for You</h4>
                  {data?.recommendations?.weakSubject ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-blue font-bold uppercase tracking-wider mb-1">Focus Needed</p>
                        <h5 className="font-bold text-white">{data.recommendations.weakSubject.subject}</h5>
                        <p className="text-sm text-muted-foreground mt-1">You struggled with "{data.recommendations.weakSubject.title}" recently. A quick review would help!</p>
                      </div>
                      <Link href={`/dashboard/quizzes/${data.recommendations.weakSubject.id}`}>
                        <button className="w-full py-3 bg-blue text-white rounded-xl font-bold text-sm hover:bg-blue/90 transition-all">
                          Review Now
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">All caught up! Check back later for new recommendations.</p>
                  )}
                </div>

                <div className="p-6 rounded-3xl bg-green/5 border border-green/10 relative overflow-hidden">
                  <Award className="absolute -top-4 -right-4 w-24 h-24 text-green/5" />
                  <h4 className="font-bold text-white mb-4">Upcoming Milestone</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green/20 border border-green/30 flex items-center justify-center text-green">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">Deep Reader</h5>
                        <p className="text-xs text-muted-foreground">Spend 3 hours reading notes</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-muted-foreground">2.4 / 3.0 Hours</span>
                          <span className="text-green">80%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-green transition-all" style={{ width: '80%' }}></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column: Gamification */}
          {!studyMode ? (
            <div className="lg:col-span-4 space-y-8">
              
              {/* Level & XP Tracker */}
              <div className="p-8 rounded-3xl bg-navy border border-white/10 text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364}
                        strokeDashoffset={364 - (364 * levelProgressPercent) / 100}
                        className="text-green transition-all duration-1000"
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Level</span>
                      <span className="text-4xl font-black text-white">{currentLevel}</span>
                   </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">XP PROGRESS</span>
                    <span className="text-white">{xpInCurrentLevel} / 500 XP</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green transition-all duration-1000" style={{ width: `${levelProgressPercent}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">Badges</h4>
                  <span className="text-[10px] bg-green/20 text-green px-2 py-0.5 rounded-full font-bold">
                    {data?.gamification?.badges?.length || 0} Earned
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {data?.gamification?.badges?.map((badge: any, idx: number) => (
                    <div key={idx} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 transition-all cursor-help" title={badge.description}>
                      <span className="text-xl">{badge.icon}</span>
                    </div>
                  ))}
                  {(data?.gamification?.badges?.length || 0) < 5 && Array(5 - (data?.gamification?.badges?.length || 0)).fill(0).map((_, i) => (
                    <div key={`empty-${i}`} className="w-12 h-12 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center grayscale opacity-30">
                      <Award className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Leaderboard */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="font-bold text-white">Weekly Effort</h4>
                   <Link href="/dashboard/leaderboard" className="text-[10px] text-muted-foreground hover:text-white transition-colors">View All</Link>
                </div>
                <div className="space-y-4">
                   {data?.leaderboard?.map((entry: any, idx: number) => (
                      <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${entry.isMe ? 'bg-green/10 border border-green/20' : ''}`}>
                         <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                           idx === 0 ? 'bg-amber text-navy' : 
                           idx === 1 ? 'bg-slate-300 text-navy' :
                           idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/5 text-muted-foreground'
                         }`}>
                           {idx + 1}
                         </span>
                         <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-navy flex items-center justify-center font-bold text-white shrink-0">
                           {entry.avatar_url ? (
                             <img src={entry.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             entry.full_name?.split(' ').map((n: string) => n[0]).join('')
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h5 className={`text-sm font-bold truncate ${entry.isMe ? 'text-green' : 'text-white'}`}>
                              {entry.full_name} {entry.isMe && "(You)"}
                            </h5>
                            <p className="text-[10px] text-muted-foreground">Level {entry.level}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-xs font-bold text-white">{entry.xp.toLocaleString()} XP</span>
                         </div>
                      </div>
                   ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-green/5 border border-dashed border-green/20 rounded-3xl">
               <div className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center text-green">
                  <EyeOff className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="text-xl font-bold text-white">Focus Mode Active</h4>
                  <p className="text-sm text-muted-foreground mt-2">Gamification and distractions are hidden to help you concentrate. Keep going!</p>
               </div>
               <button 
                onClick={() => setStudyMode(false)}
                className="px-6 py-2 bg-green text-navy font-bold rounded-xl hover:bg-green/90 transition-all"
               >
                 Exit Study Mode
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

