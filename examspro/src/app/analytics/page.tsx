"use client";

import Navbar from '@/components/Navbar';
import { 
  Target, 
  Coins, 
  Trophy, 
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface UserAnalytics {
  stats: {
    accuracy: string;
    questionsSolved: string;
    coinEarnings: string;
    globalRank: string;
    streak: number;
  };
  subjectPerformance: Array<{ subject: string, score: number, trend: string }>;
  weakTopics: Array<{ topic: string, accuracy: string, subject: string }>;
  scoreTrend: number[];
  activity: string[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/user/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch user analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Performance <span className="text-blue">Insights</span>
          </h1>
          <p className="text-gray-500">Track your progress and identify areas for improvement.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Overall Accuracy", value: data.stats.accuracy, sub: "Based on all attempts", icon: Target, color: "green" },
            { label: "Questions Solved", value: data.stats.questionsSolved, sub: "Total lifetime", icon: Brain, color: "blue" },
            { label: "Coin Balance", value: data.stats.coinEarnings, sub: "Current available", icon: Coins, color: "amber" },
            { label: "Global Rank", value: data.stats.globalRank, sub: "Based on ELO Rating", icon: Trophy, color: "purple" },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden group">
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-${stat.color}/10 group-hover:scale-150 transition-transform`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-${stat.color} mb-6`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-display font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Chart Section */}
          <div className="lg:col-span-2 p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-display font-bold text-white">Accuracy Trend</h3>
              <div className="flex gap-2">
                {['Week'].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold bg-white/10 text-white`}>
                    Last 7 Days
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-4">
              {data.scoreTrend.map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-blue/20 to-blue/40 rounded-t-xl group-hover:from-green/20 group-hover:to-green/40 transition-all cursor-pointer" 
                    style={{ height: `${Math.max(h, 5)}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-white text-[10px] font-bold text-navy opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">
              <span>Day 1</span><span>Day 2</span><span>Day 3</span><span>Day 4</span><span>Day 5</span><span>Day 6</span><span>Today</span>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="text-xl font-display font-bold text-white mb-8">Subject Progress</h3>
            <div className="space-y-6">
              {data.subjectPerformance.length > 0 ? data.subjectPerformance.map((sub, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-white">{sub.subject}</span>
                      <div className="flex items-center gap-1 text-[10px] font-black">
                        {sub.trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-green" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        <span className={sub.trend === 'up' ? 'text-green' : 'text-red-500'}>{sub.score}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue transition-all" style={{ width: `${sub.score}%` }} />
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-12">No subject data available yet.</p>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-12 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl">
              View Detailed Breakdown
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weak Topics */}
          <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-display font-bold text-white">Focus Areas</h3>
            </div>
            <div className="space-y-4">
              {data.weakTopics.length > 0 ? data.weakTopics.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:border-red-500/30 transition-all cursor-pointer">
                  <div>
                    <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">{item.subject}</div>
                    <div className="text-sm font-bold text-white">{item.topic}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500">Accuracy</div>
                    <div className="text-sm font-black text-red-500">{item.accuracy}</div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-8">Keep practicing to identify focus areas!</p>
              )}
            </div>
          </div>

          {/* Activity / Streak */}
          <div className="p-8 rounded-[32px] bg-green/5 border border-green/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-green" />
                <h3 className="text-xl font-display font-bold text-white">Study Activity</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-green text-navy text-[10px] font-bold uppercase">
                {data.stats.streak} DAY STREAK
              </div>
            </div>
            
            {/* Calendar Visualization */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (27 - i));
                const hasActivity = data.activity.some(a => new Date(a).toDateString() === date.toDateString());
                
                return (
                  <div 
                    key={i} 
                    className={`
                      aspect-square rounded-md transition-colors
                      ${hasActivity ? 'bg-green shadow-[0_0_10px_rgba(0,200,83,0.2)]' : 'bg-white/5'}
                    `} 
                  />
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
              <span>Last 28 Days</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
