import React, { useState, useEffect } from 'react';
import { Swords, Activity, Coins, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproBattles } from '@/lib/api';

export default function BattlesTab() {
  const [stats, setStats] = useState({ activeCount: 0, avgStake: 0, totalVolume: '0', disputes: 0 });
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproBattles();
      if (data) {
        setStats({
          activeCount: data.activeCount || 0,
          avgStake: data.avgStake || 0,
          totalVolume: data.totalVolume ? (data.totalVolume >= 1000 ? (data.totalVolume/1000).toFixed(1)+'k' : data.totalVolume.toString()) : '0',
          disputes: data.pendingDisputes || 0
        });
        setBattles(data.battles || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Battles', value: stats.activeCount, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Avg. Stake', value: stats.avgStake, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Total Volume', value: stats.totalVolume, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Disputes', value: stats.disputes, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-2xl border p-5 shadow-sm ${stat.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Battles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Swords className="w-5 h-5 text-blue-600" /> Live Battles Monitor
          </h3>
          <button onClick={loadData} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Match ID</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Players</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subject</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Stake</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Progress</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {battles.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-blue-600 font-bold text-[10px]">{b.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{b.p1}</span>
                      <span className="text-[10px] text-slate-400 font-bold">VS</span>
                      <span className="font-bold text-slate-800">{b.p2}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{b.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Coins className="w-3.5 h-3.5" /> {b.stake}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span className="text-blue-600">{b.progress}</span>
                      <span className="text-slate-400">{b.time}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(parseInt(b.progress.split('/')[0]) / 10) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
