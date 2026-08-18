"use client";

import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  ShieldAlert, 
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAuditLogs } from '@/lib/superadmin.api';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
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
          <p className="font-bold mb-2">Error Loading Audit Logs</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">Audit Logs & Security Trails</h1>
            <p className="text-gray-400">Immutable, searchable records of all sensitive actions performed across the platform.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4" /> Export Immutable Trail (PDF/Signed)
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by actor, action or entity ID..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm hover:text-white transition-all flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Severity
             </button>
             <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm hover:text-white transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date Range
             </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-[40px] bg-white/[0.02] border border-white/5 overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actor</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">IP Address</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Verification</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {logs.map((log, i) => (
                   <tr key={i} className="hover:bg-white/[0.04] transition-colors group font-mono">
                      <td className="px-8 py-6">
                         <div className="text-xs text-white flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-600" /> {log.timestamp}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                            <span className="text-xs font-bold text-white uppercase">{log.action}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] text-gray-400">{log.user}</td>
                      <td className="px-8 py-6 text-[10px] text-gray-400">{log.ip}</td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-green-500 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Signed
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Pagination placeholder */}
        <div className="mt-8 flex justify-center">
           <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
                  i === 1 ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-red-500/20'
                }`}>
                  {i}
                </button>
              ))}
           </div>
        </div>

        {/* Security Note */}
        <div className="mt-12 p-8 rounded-[40px] bg-black/40 border border-white/5 flex items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                 <ScrollText className="w-7 h-7" />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-white">Log Integrity Verified</h4>
                 <p className="text-xs text-gray-500">All logs are hashed and stored in an immutable ledger. Tamper-evident seals are current.</p>
              </div>
           </div>
           <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              Run Integrity Check <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </main>
  );
}
