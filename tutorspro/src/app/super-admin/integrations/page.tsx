"use client";

import { IconLink2 as Link2, IconRefreshCw as RefreshCw, IconSearch as Search, IconFilter as Filter, IconMoreVertical as MoreVertical, IconCheckCircle2 as CheckCircle2, IconXCircle as XCircle, IconExternalLink as ExternalLink, IconShieldAlert as ShieldAlert, IconKey as Key, IconGlobe as Globe, IconSettings as Settings, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getIntegrations } from '@/lib/superadmin.api';

export default function ExternalIntegrations() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await getIntegrations();
        setIntegrations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch integrations');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
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
          <p className="font-bold mb-2">Error Loading Integrations</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">External Integrations</h1>
            <p className="text-gray-400">Manage 3rd-party API credentials, webhook endpoints, and integration health.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm">
            <RefreshCw className="w-4 h-4" /> Global Health Check
          </button>
        </div>

        {/* Integration List */}
        <div className="grid grid-cols-1 gap-4">
           {integrations.map((int, i) => (
             <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all flex flex-col lg:flex-row items-center justify-between gap-8 group">
                <div className="flex items-center gap-6 w-full lg:w-auto">
                   <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-red-500 transition-colors">
                      <Link2 className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-1">{int.name}</h3>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                         <span className={int.status === 'Connected' ? 'text-green' : 'text-amber'}>{int.status}</span>
                      </div>
                   </div>
                </div>

                <div className="flex grid grid-cols-1 gap-8 flex-1 w-full lg:w-auto px-8 lg:px-12 border-l border-r border-white/5">
                   <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Last Sync</div>
                      <div className="text-lg font-bold text-white">{int.last_sync}</div>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                   <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">Configure</button>
                   <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                </div>
             </div>
           ))}
        </div>

        {/* Webhooks Section */}
        <div className="mt-12">
           <h3 className="text-xl font-bold text-white mb-8 px-2">Outgoing Webhooks</h3>
           <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                       <Globe className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-sm font-bold text-white">Slack Notifications</div>
                       <div className="text-xs text-gray-500">https://hooks.slack.com/services/T0123/B456...</div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <span className="px-3 py-1 rounded-full bg-green/10 text-green text-[10px] font-bold uppercase tracking-widest border border-green/20">Live</span>
                    <button className="text-xs text-gray-500 hover:text-white font-bold transition-colors">Test Event</button>
                 </div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 border-dashed text-xs text-gray-500 font-bold hover:text-white hover:bg-white/[0.04] transition-all">
                 + Add New Webhook Endpoint
              </button>
           </div>
        </div>
      </div>
    </main>
  );
}
