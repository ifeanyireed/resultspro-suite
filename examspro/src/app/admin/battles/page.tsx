"use client";

import { useState, useEffect } from 'react';
import { IconSword as Sword, IconUsers as Users, IconCoins as Coins, IconTrendingUp as TrendingUp, IconSearch as Search, IconFilter as Filter, IconArrowUpRight as ArrowUpRight, IconClock as Clock, IconShield as ShieldAlert, IconChevronRight as ChevronRight, IconActivity as Activity, IconBolt as Zap, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminBattleMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/battles/monitor-stats');
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch battle stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || { activeCount: 0, totalVolume: 0, avgStake: 0, disputes: 0 };
  const activeBattles = data?.activeBattles || [];
  const heatmap = data?.heatmap || Array(28).fill(0.1);

  return (
    <>
      <AdminHeader title="Battle Monitor" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Battles", value: stats.activeCount, trend: "Live", icon: Activity, color: "green" },
            { label: "Avg. Stake", value: stats.avgStake, trend: "Coins", icon: Coins, color: "amber" },
            { label: "Total Volume", value: stats.totalVolume >= 1000 ? (stats.totalVolume / 1000).toFixed(1) + 'k' : stats.totalVolume, trend: "Coins", icon: TrendingUp, color: "blue" },
            { label: "Disputes", value: stats.disputes, trend: "Pending", icon: ShieldAlert, color: "red" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-black ${stat.color === 'red' && stat.value > 0 ? 'text-red-500' : 'text-green'}`}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-display font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Battles Table */}
          <div className="lg:col-span-2 bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-display font-bold text-white text-lg">Active Synchronous Battles</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchStats} className="rounded-xl text-xs h-9 border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10">Refresh</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Match ID</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Players</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stake</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeBattles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-gray-500 text-sm">No active battles found</td>
                    </tr>
                  ) : activeBattles.map((battle: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-white uppercase">{battle.id}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{battle.p1}</span>
                          <span className="text-[10px] font-bold text-gray-500">vs</span>
                          <span className="text-xs font-bold text-white">{battle.p2}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-gray-400">{battle.subject}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                          <Coins className="w-3 h-3" /> {battle.stake}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase">
                            <span className="text-green">{battle.progress}</span>
                            <span className="text-gray-500">{battle.time}</span>
                          </div>
                          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-green" style={{ width: `${(parseInt(battle.progress.split('/')[0]) / 10) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${
                          battle.status === 'active' ? 'bg-green/10 text-green' : 'bg-amber-400/10 text-amber-400'
                        }`}>
                          {battle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Peak Time Heatmap */}
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-8">
            <h3 className="font-display font-bold text-white text-lg">Peak Activity Heatmap</h3>
            
            <div className="flex-1 grid grid-cols-7 gap-2">
              {heatmap.map((opacity: number, i: number) => {
                return (
                  <div 
                    key={i} 
                    className="aspect-square rounded-md bg-green transition-all hover:scale-110 cursor-help"
                    style={{ opacity: Math.max(opacity, 0.1) }}
                    title={`Activity level: ${Math.round(opacity * 100)}%`}
                  />
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Observation Window</span>
                </div>
                <span className="text-xs font-black text-blue-400">Last 28 Hours</span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Update Frequency</span>
                </div>
                <span className="text-xs font-black text-amber-400">30 Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
