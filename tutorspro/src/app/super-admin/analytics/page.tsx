"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  PieChart,
  Layout,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSystemAnalytics } from '@/lib/superadmin.api';

export default function SystemWideAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSystemAnalytics();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-rose/10 text-rose p-6 rounded-3xl inline-block">
          <p className="font-bold mb-2">Error Loading Analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Global Analytics</h1>
            <p className="text-gray-400">Aggregate platform performance, revenue trends, and user growth across all tenants.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
                <Calendar className="w-4 h-4 text-gray-500" /> Year to Date
             </button>
             <button className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm">
                <Download className="w-4 h-4" /> Export Datasets
             </button>
          </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Active Daily', value: data.engagement.active_daily, trend: '+22%', icon: Users, color: 'text-green-500' },
             { label: 'Avg Session', value: data.engagement.avg_session, trend: '+15%', icon: BarChart3, color: 'text-blue-500' },
             { label: 'Retention Rate', value: data.engagement.retention, trend: '+40%', icon: Globe, color: 'text-purple-500' },
             { label: 'Latest Month Users', value: data.growth[data.growth.length - 1].users, trend: '+5%', icon: TrendingUp, color: 'text-amber-500' },
           ].map((stat, i) => (
             <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:border-red-500/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                      {stat.trend} <ArrowUpRight className="w-3 h-3" />
                   </div>
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
           <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-white">Monthly User & Revenue Growth</h3>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                 {data.growth.map((g: any, i: number) => (
                    <div key={i} className="flex-1 bg-red-500/20 rounded-t-lg relative group cursor-pointer hover:bg-red-500/30 transition-all">
                       <div className="bg-red-500 rounded-t-lg w-full absolute bottom-0 transition-all group-hover:brightness-125" style={{ height: `${(g.users / 15000) * 100}%` }} />
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-bold bg-navy px-2 py-1 rounded shadow-xl">
                          {g.users} users / ${g.revenue}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-6 px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                 {data.growth.map((g: any, i: number) => (
                   <span key={i}>{g.month}</span>
                 ))}
              </div>
           </section>
        </div>

        {/* Global Activity Table */}
        <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Top Regional Growth</h3>
              <button className="text-xs text-red-500 font-bold hover:underline">View Heatmap</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { country: 'Nigeria', users: '640k', growth: '+15%', status: 'Primary' },
                { country: 'United Kingdom', users: '180k', growth: '+24%', status: 'Expanding' },
                { country: 'United States', users: '120k', growth: '+8%', status: 'Stable' },
              ].map((region, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                         {region.country === 'Nigeria' ? '🇳🇬' : region.country === 'United Kingdom' ? '🇬🇧' : '🇺🇸'}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-white">{region.country}</div>
                         <div className="text-[10px] text-gray-500">{region.users} Active</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-green-500">{region.growth}</div>
                      <div className="text-[8px] text-gray-600 font-bold uppercase">{region.status}</div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </main>
  );
}
