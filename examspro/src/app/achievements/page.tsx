"use client";

import Navbar from '@/components/Navbar';
import { IconTrophy as Trophy, IconAward as Award, IconStar as Star, IconZap as Zap, IconTarget as Target, IconLock as Lock, IconCheckCircle2 as CheckCircle2, IconTrendingUp as TrendingUp, IconCrown as Crown } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export default function AchievementsPage() {
  const badges = [
    { id: 1, name: "Early Bird", desc: "Answer 10 questions before 7 AM.", progress: 100, status: 'unlocked', icon: Zap, color: 'amber' },
    { id: 2, name: "Optics Master", desc: "Get 100% in 5 Optics quizzes.", progress: 100, status: 'unlocked', icon: Target, color: 'blue' },
    { id: 3, name: "Battle King", desc: "Win 50 head-to-head battles.", progress: 48, status: 'locked', icon: Trophy, color: 'red' },
    { id: 4, name: "Streak Legend", desc: "Maintain a 30-day login streak.", progress: 70, status: 'locked', icon: Star, color: 'green' },
    { id: 5, name: "Scholar", desc: "Complete 1,000 total questions.", progress: 85, status: 'locked', icon: Award, color: 'purple' },
    { id: 6, name: "Night Owl", desc: "Practice for 2 hours after midnight.", progress: 100, status: 'unlocked', icon: Zap, color: 'indigo' },
  ];

  return (
    <main className="min-h-screen bg-navy pb-24 text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-12">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 p-10 rounded-[48px] bg-gradient-to-br from-blue/20 to-purple-500/10 border border-white/10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue flex items-center justify-center bg-blue/10">
                <Crown className="w-16 h-16 text-blue" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-navy flex items-center justify-center font-black shadow-xl">
                12
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="text-xs font-bold text-blue uppercase tracking-[0.3em] mb-2">Current Rank</div>
              <h1 className="text-4xl font-display font-black mb-2 italic">MASTER SCHOLAR</h1>
              <p className="text-gray-400 text-sm mb-6">You are in the top 2% of all students this month. Keep winning to reach Grandmaster!</p>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue to-purple-500" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span>1,240 XP</span>
                <span>Next Rank: 1,500 XP</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-display font-black text-white mb-2">24</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Badges Unlocked</div>
            <Button className="w-full bg-white text-navy hover:bg-white/90 rounded-2xl font-bold">
              View Leaderboard
            </Button>
          </div>
        </div>

        {/* Badges Grid */}
        <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
          <Award className="w-6 h-6 text-green" />
          Achievement Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`
                p-8 rounded-[40px] border transition-all relative overflow-hidden group
                ${badge.status === 'unlocked' ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] opacity-60'}
              `}
            >
              {badge.status === 'locked' && (
                <div className="absolute top-6 right-8">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              )}
              
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                ${badge.status === 'unlocked' ? `bg-${badge.color}-500/20 text-${badge.color}-500` : 'bg-white/5 text-gray-600'}
              `}>
                <badge.icon className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">{badge.desc}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className={badge.status === 'unlocked' ? 'text-green' : 'text-gray-500'}>
                    {badge.status === 'unlocked' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-white">{badge.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${badge.status === 'unlocked' ? 'bg-green' : 'bg-blue'}`} 
                    style={{ width: `${badge.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
