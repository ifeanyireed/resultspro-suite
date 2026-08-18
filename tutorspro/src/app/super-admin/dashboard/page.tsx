"use client";

import Navbar from '@/components/Navbar';
import { 
  Server, 
  Activity, 
  ShieldAlert, 
  Settings, 
  Database, 
  Globe, 
  Terminal,
  Cpu,
  Lock,
  LineChart,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/super-admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch super admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </main>
    );
  }

  const health = data?.health || [];
  const clusters = data?.clusters || [];
  const storage = data?.storage || { total_tb: 0, used_tb: 0, recordings_tb: 0, assets_tb: 0 };

  return (
    <RoleGate allowedRoles={['SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-black">
                  Infrastructure <span className="text-red-500">Control</span>
                </h1>
                <p className="text-gray-400 text-sm">System-wide monitoring and resource management.</p>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> SSH Console
               </button>
               <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                  <Lock className="w-4 h-4" /> Emergency Lockdown
               </button>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {health.map((stat: any, i: number) => {
              const Icon = stat.label === 'API Latency' ? Activity : stat.label === 'CPU Usage' ? Cpu : stat.label === 'DB Connections' ? Database : ShieldAlert;
              return (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                         <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        stat.status === 'Healthy' || stat.status === 'Stable' || stat.status === 'Optimal' ? 'bg-green/10 text-green' : 'bg-blue/10 text-blue'
                      }`}>
                        {stat.status}
                      </span>
                   </div>
                   <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="text-2xl font-display font-bold">{stat.value}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real-time Logs (Left) */}
            <div className="lg:col-span-2 space-y-6">
               <section className="p-8 rounded-[40px] bg-black/40 border border-white/5 font-mono relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="relative flex items-center justify-between mb-6">
                     <h2 className="text-lg font-bold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-gray-500" />
                        Live System Logs
                     </h2>
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                     </div>
                  </div>
                  <div className="relative space-y-2 text-xs">
                     <div className="text-green-500/80">[{new Date().toISOString()}] INFO: Payment gateway heartbeat received.</div>
                     <div className="text-blue-500/80">[{new Date().toISOString()}] AUTH: New user session initialized.</div>
                     <div className="text-gray-500">[{new Date().toISOString()}] DEBUG: Cache hit for resource 'tutor_list_all'.</div>
                     <div className="text-amber-500/80">[{new Date().toISOString()}] WARN: High disk I/O detected on Node-04.</div>
                     <div className="text-green-500/80">[{new Date().toISOString()}] INFO: Automated backup completed.</div>
                     <div className="animate-pulse text-white">_</div>
                  </div>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section className="p-6 rounded-3xl bg-white/5 border border-white/10">
                     <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue" />
                        Traffic Distribution
                     </h3>
                     <div className="space-y-3">
                        {[
                          { label: 'Nigeria', value: '65%' },
                          { label: 'United Kingdom', value: '15%' },
                          { label: 'United States', value: '10%' },
                          { label: 'Other', value: '10%' },
                        ].map((item, i) => (
                          <div key={i}>
                             <div className="flex justify-between text-[10px] mb-1">
                                <span>{item.label}</span>
                                <span className="text-gray-500">{item.value}</span>
                             </div>
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue rounded-full" style={{ width: item.value }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </section>
                  <section className="p-6 rounded-3xl bg-white/5 border border-white/10">
                     <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-amber-500">
                        <Settings className="w-4 h-4" />
                        Active Feature Flags
                     </h3>
                     <div className="space-y-2">
                        {[
                          { name: 'global_live_classes', status: 'Enabled' },
                          { name: 'ai_tutor_beta', status: 'Enabled' },
                          { name: 'maintenance_mode', status: 'Disabled' },
                          { name: 'signup_v2_flow', status: 'Testing' },
                        ].map((flag, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                             <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors">{flag.name}</span>
                             <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                               flag.status === 'Enabled' ? 'bg-green/10 text-green' : flag.status === 'Disabled' ? 'bg-red-500/10 text-red-500' : 'bg-blue/10 text-blue'
                             }`}>
                               {flag.status}
                             </span>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>

            {/* Infrastructure Health (Right) */}
            <div className="space-y-6">
               <section className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Server className="w-5 h-5 text-red-500" />
                     Clusters
                  </h3>
                  <div className="space-y-4">
                     {clusters.map((node: any, i: number) => (
                       <div key={i} className="flex items-center justify-between group cursor-help">
                          <div>
                             <div className="text-xs font-bold group-hover:text-red-500 transition-colors">{node.name}</div>
                             <div className="text-[10px] text-gray-500">Uptime: {node.status}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-xs font-mono">{node.load}</div>
                             <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: node.load }} />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>

               <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple/10 transition-all" />
                  <h3 className="text-xl font-display font-bold mb-4 relative z-10">Storage Usage</h3>
                  <div className="flex items-end gap-2 mb-2 relative z-10">
                     <span className="text-3xl font-black">{storage.used_tb}</span>
                     <span className="text-gray-500 text-sm mb-1 font-bold">TB / {storage.total_tb}TB</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6 relative z-10">
                     <div className="h-full bg-gradient-to-r from-blue to-purple rounded-full" style={{ width: `${(storage.used_tb / storage.total_tb) * 100}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                     <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Recordings</div>
                        <div className="text-sm font-bold">{storage.recordings_tb} TB</div>
                     </div>
                     <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Assets</div>
                        <div className="text-sm font-bold">{storage.assets_tb} TB</div>
                     </div>
                  </div>
               </section>

               <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  <LineChart className="w-4 h-4 text-green" /> View Resource Funnels
               </button>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
