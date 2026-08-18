"use client";

import Navbar from '@/components/Navbar';
import { IconUsers as Users, IconShieldCheck as ShieldCheck, IconAlertCircle as AlertCircle, IconShieldAlert as ShieldAlert, IconDollarSign as DollarSign, IconTrendingUp as TrendingUp, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconChevronRight as ChevronRight, IconSearch as Search, IconBell as Bell, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function PlatformAdminDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/platform-admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch platform admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  const stats = data?.stats || [];
  const revenue = data?.revenue || { total: "$0", trend: "0%", data: [] };
  const alerts = data?.alerts || [];
  const queues = data?.queues || [];

  const getIcon = (label: string) => {
    switch (label) {
      case 'Active Users': return Users;
      case 'Pending Verifications': return ShieldCheck;
      case 'Open Disputes': return AlertCircle;
      case 'Flagged Content': return ShieldAlert;
      default: return AlertCircle;
    }
  };

  return (
    <RoleGate allowedRoles={['PLATFORM_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Operations <span className="text-green">Command</span>
              </h1>
              <p className="text-gray-400">Platform Admin • {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4">
               <div className="relative group hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-green transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Quick search..."
                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green/50 transition-all w-64"
                  />
               </div>
               <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
               </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat: any, i: number) => {
              const Icon = getIcon(stat.label);
              const colorClass = stat.role === 'blue' ? 'text-blue' : stat.role === 'green' ? 'text-green' : stat.role === 'rose' ? 'text-rose' : 'text-amber';
              const bgClass = stat.role === 'blue' ? 'bg-blue/10' : stat.role === 'green' ? 'bg-green/10' : stat.role === 'rose' ? 'bg-rose/10' : 'bg-amber/10';
              
              return (
                <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                         <Icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green' : 'text-rose'}`}>
                         {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </div>
                   </div>
                   <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue & Growth (Left) */}
            <div className="lg:col-span-2 space-y-8">
              <section className="p-8 rounded-[40px] bg-gradient-to-br from-green/5 to-transparent border border-green/10">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 text-green">Revenue Snapshot</h3>
                      <p className="text-sm text-gray-400">Current Billing Period</p>
                    </div>
                    <div className="text-right">
                       <div className="text-3xl font-display font-bold text-white">{revenue.total}</div>
                       <div className="text-xs text-green font-bold uppercase tracking-widest mt-1">{revenue.trend} vs last month</div>
                    </div>
                 </div>
                 <div className="h-48 flex items-end justify-between gap-4">
                    {revenue.data.map((h: number, i: number) => (
                      <div key={i} className="flex-1 bg-green/20 rounded-t-lg hover:bg-green/40 transition-all cursor-help relative group">
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-green text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Day {i+1}: ${(h * 150).toLocaleString()}
                         </div>
                         <div className="bg-green rounded-t-lg w-full" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                 </div>
              </section>

              <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-display font-bold text-white">Recent Operational Alerts</h2>
                   <button className="text-sm text-green font-medium hover:underline">View Log</button>
                 </div>
                 
                 {alerts.length > 0 ? (
                   <div className="space-y-4">
                     {alerts.map((alert: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${
                             alert.priority === 'High' ? 'text-rose' : alert.priority === 'Medium' ? 'text-amber' : 'text-blue'
                           }`}>
                              <AlertCircle className="w-5 h-5" />
                           </div>
                           <div>
                             <div className="text-white font-bold">{alert.title}</div>
                             <div className="text-xs text-gray-500">Actor: {alert.user} • {alert.time}</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              alert.priority === 'High' ? 'bg-rose/10 text-rose' : alert.priority === 'Medium' ? 'bg-amber/10 text-amber' : 'bg-blue/10 text-blue'
                            }`}>
                              {alert.priority}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 text-sm italic">No recent alerts found.</p>
                 )}
              </section>
            </div>

            {/* Quick Actions & Queues (Right) */}
            <div className="space-y-8">
               <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Queue Status</h3>
                  <div className="space-y-6">
                     {queues.map((item: any, i: number) => (
                       <div key={i}>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                             <span className="text-gray-500">{item.label}</span>
                             <span className="text-white">{item.count}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(item.count * 2, 100)}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                     Run Full Audit
                  </button>
               </section>

               <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Impersonate', icon: Users },
                       { label: 'Issue Refund', icon: DollarSign },
                       { label: 'Broadcast', icon: Bell },
                       { label: 'Moderation', icon: ShieldAlert },
                     ].map((action, i) => (
                       <button key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green/30 hover:bg-green/5 transition-all text-left group">
                          <action.icon className="w-5 h-5 text-green mb-3 group-hover:scale-110 transition-transform" />
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{action.label}</div>
                       </button>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
