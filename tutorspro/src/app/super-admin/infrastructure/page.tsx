"use client";

import { IconDatabase as Database, IconHardDrive as HardDrive, IconShieldCheck as ShieldCheck, IconRefreshCw as RefreshCw, IconActivity as Activity, IconSearch as Search, IconChevronRight as ChevronRight, IconArrowUpRight as ArrowUpRight, IconClock as Clock, IconLayers as Layers, IconArchive as Archive, IconTrash2 as Trash2, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getInfrastructure } from '@/lib/superadmin.api';

export default function InfrastructureManagement() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getInfrastructure();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch infrastructure data');
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
          <p className="font-bold mb-2">Error Loading Infrastructure</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">Infrastructure & Storage</h1>
            <p className="text-gray-400">Manage database instances, storage buckets, and automated backup schedules.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
                <RefreshCw className="w-4 h-4" /> Trigger Migration
             </button>
             <button className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm">
                <Archive className="w-4 h-4" /> Force Backup
             </button>
          </div>
        </div>

        {/* Storage Buckets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           {data.storage.map((bucket: any, i: number) => (
             <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all group">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-colors`}>
                      <HardDrive className="w-6 h-6" />
                   </div>
                   <button className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all"><ArrowUpRight className="w-4 h-4" /></button>
                </div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">{bucket.id}</h4>
                <div className="flex items-end gap-2 mb-3">
                   <span className="text-2xl font-bold text-white">{bucket.usage}</span>
                   <span className="text-xs text-gray-600 mb-1">({bucket.files} files)</span>
                </div>
                <div className="text-[10px] text-gray-600 font-bold uppercase">Provider: {bucket.provider}</div>
             </div>
           ))}
        </div>

        {/* Database Instances */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-white">Database Clusters</h3>
              <button className="text-xs text-red-500 font-bold hover:underline">View Connection Pools</button>
           </div>
           
           <div className="rounded-[40px] bg-white/[0.02] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Instance ID</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Engine</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Size</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {data.databases.map((db: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.04] transition-colors group cursor-pointer">
                         <td className="px-8 py-6">
                            <div className="text-white font-bold group-hover:text-red-500 transition-colors">{db.id}</div>
                         </td>
                         <td className="px-8 py-6 text-sm text-gray-400">{db.type}</td>
                         <td className="px-8 py-6 text-sm text-gray-400">{db.size}</td>
                         <td className="px-8 py-6 text-right">
                            <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${
                              db.status === 'Active' ? 'bg-green/10 text-green border-green/20' : 'bg-amber/10 text-amber border-amber/20'
                            }`}>
                               {db.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Backups Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" /> Retention Policies
                 </h3>
                 <button className="text-xs text-gray-500 hover:text-white transition-colors">Edit Policy</button>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Daily Incremental', retention: '30 Days', next: 'Today, 23:00' },
                   { label: 'Weekly Full', retention: '12 Months', next: 'Sunday, 01:00' },
                   { label: 'Audit Trail Logs', retention: '7 Years', next: 'Continuous' },
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div>
                         <div className="text-sm text-white font-medium">{p.label}</div>
                         <div className="text-[10px] text-gray-500">Next run: {p.next}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Retention</div>
                         <div className="text-xs text-red-500 font-bold">{p.retention}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700 mb-6">
                 <Database className="w-8 h-8" />
              </div>
              <h3 className="text-white font-bold mb-2">Cross-Region DR</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto mb-8">Disaster recovery sync is currently active. RPO: 5m, RTO: 15m.</p>
              <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                 <Activity className="w-4 h-4 text-green" /> Check Replication Health
              </button>
           </section>
        </div>
      </div>
    </main>
  );
}
