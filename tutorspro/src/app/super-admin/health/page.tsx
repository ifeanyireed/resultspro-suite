"use client";

import { 
  Activity, 
  Server, 
  Cpu, 
  Database, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSystemHealth } from '@/lib/superadmin.api';

export default function SystemHealth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSystemHealth();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch system health');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-rose/10 text-rose p-6 rounded-3xl inline-block">
          <p className="font-bold mb-2">Error Loading System Health</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">System Health</h1>
            <p className="text-gray-400">Real-time service health, connection pools, and resource utilization.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh All Nodes
          </button>
        </div>

        {/* Resource Monitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data.infrastructure.map((stat: any, i: number) => (
            <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-500/10 transition-all" />
               <div className={`w-12 h-12 rounded-2xl bg-white/5 ${stat.status === 'HEALTHY' ? 'text-green' : 'text-amber'} flex items-center justify-center mb-6`}>
                  {stat.type === 'PostgreSQL' ? <Database className="w-6 h-6" /> : stat.type === 'Redis' ? <Zap className="w-6 h-6" /> : <Server className="w-6 h-6" />}
               </div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.name}</div>
               <div className="text-3xl font-display font-bold text-white mb-1">{stat.load}</div>
               <div className="text-[10px] text-gray-600 font-bold uppercase">{stat.type} Status: {stat.status}</div>
            </div>
          ))}
        </div>

        {/* Services Table */}
        <div className="rounded-[40px] bg-white/[0.02] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
             <h3 className="text-xl font-bold text-white">Microservice Status</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-green uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> Healthy
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> Degraded
                </div>
             </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service Name</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Uptime</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.services.map((svc: any, i: number) => (
                <tr key={i} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-white font-bold group-hover:text-red-500 transition-colors">{svc.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      svc.status === 'UP' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber animate-pulse'
                    }`}>
                      {svc.status === 'UP' ? 'Healthy' : 'Degraded'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400">{svc.uptime}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-xs text-white font-bold font-mono">{svc.version}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning Note */}
        <div className="mt-8 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
           <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
           <p className="text-xs text-gray-400 leading-relaxed">
             Node-02 (Classroom Engine) is experiencing high CPU load. Automated horizontal scaling has triggered 2 additional instances. 
             Current cluster size: <span className="text-white font-bold italic">6 nodes</span>.
           </p>
        </div>
      </div>
    </main>
  );
}
