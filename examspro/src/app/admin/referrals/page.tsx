"use client";

import { useState, useEffect } from 'react';
import { IconUsers as Users, IconTrendingUp as TrendingUp, IconCoins as Coins, IconDownload as Download, IconMousePointer2 as MousePointer2, IconLoader2 as Loader2, IconClock as Clock, IconCheckCircle2 as CheckCircle2, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReferralsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/referrals/stats');
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load referral analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Analytics...</p>
      </div>
    );
  }

  const summary = data?.summary || { total: 0, converted: 0, pending: 0, coinsAwarded: 0 };
  const topReferrers = data?.topReferrers || [];
  const recentReferrals = data?.recentReferrals || [];

  return (
    <>
      <AdminHeader title="Referral Analytics" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Referral Analytics</h1>
            <p className="text-sm text-gray-500">Track system growth and detect potential abuse.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-white/[0.05] border-t-white/[0.1] bg-white/5 text-white hover:bg-white/10 font-bold text-xs gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Invitations", value: summary.total, icon: MousePointer2, color: "text-blue-400" },
            { label: "Qualified Users", value: summary.converted, icon: CheckCircle2, color: "text-green" },
            { label: "Pending (In Progress)", value: summary.pending, icon: Clock, color: "text-amber-400" },
            { label: "Coins Awarded", value: summary.coinsAwarded.toLocaleString(), icon: Coins, color: "text-purple-400" },
          ].map((step, i) => (
            <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden group hover:border-white/10 transition-all">
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${step.color}`}>
                <step.icon className="w-16 h-16" />
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{step.label}</div>
              <div className="text-2xl font-display font-black text-white">{step.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Referrers */}
          <div className="lg:col-span-2 bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex justify-between items-center bg-white/5">
              <h3 className="font-display font-bold text-white text-lg">Top Performers</h3>
              <TrendingUp className="w-5 h-5 text-green" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/[0.05] border-t-white/[0.1]">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Invites</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topReferrers.map((ref: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-[10px] font-black text-white">
                            {ref.name?.charAt(0) || ref.email.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{ref.name || 'Anonymous'}</span>
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">{ref.referralCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-500 text-center">{ref._count?.referralsMade || 0}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-1 text-xs font-black text-amber-400">
                          <Coins className="w-3 h-3" /> {ref.totalEarned.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {topReferrers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-10 text-center text-gray-600 italic text-sm">No data available yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex justify-between items-center bg-white/5">
              <h3 className="font-display font-bold text-white text-lg">Live Activity</h3>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4 no-scrollbar">
              {recentReferrals.map((ref: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${ref.status === 'converted' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'}`}>
                      {ref.status}
                    </div>
                    <span className="text-[8px] text-gray-600 font-bold uppercase">{new Date(ref.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs leading-tight">
                    <span className="font-bold text-white truncate max-w-[80px]">{ref.referrer.name || ref.referrer.email}</span>
                    <span className="text-gray-600">invited</span>
                    <span className="font-bold text-white truncate max-w-[80px]">{ref.referee.name || ref.referee.email}</span>
                  </div>
                </div>
              ))}
              {recentReferrals.length === 0 && (
                <div className="py-20 text-center text-gray-600 text-xs italic">No recent activity</div>
              )}
            </div>
          </div>
        </div>

        {/* Monitoring Card */}
        <div className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Referral Protection Active</h4>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              System is currently requiring referees to complete 5 quizzes before awarding the referrer bonus. 
              This milestone significantly reduces the risk of coin farming through fake accounts.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
