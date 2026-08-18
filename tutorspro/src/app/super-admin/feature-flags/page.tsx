"use client";

import { IconFlag as Flag, IconSearch as Search, IconFilter as Filter, IconPlus as Plus, IconToggleRight as ToggleRight, IconUsers as Users, IconGlobe as Globe, IconAlertCircle as AlertCircle, IconMoreVertical as MoreVertical, IconChevronRight as ChevronRight, IconShieldCheck as ShieldCheck, IconSettings as Settings, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getFeatureFlags } from '@/lib/superadmin.api';

export default function FeatureFlags() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const data = await getFeatureFlags();
        setFlags(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch feature flags');
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
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
          <p className="font-bold mb-2">Error Loading Feature Flags</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">Feature Flags</h1>
            <p className="text-gray-400">Toggle functionality globally or perform canary rollouts per user segment.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-600/20">
            <Plus className="w-5 h-5" /> Create New Flag
          </button>
        </div>

        {/* Global Controls */}
        <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                 <ToggleRight className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-sm font-bold text-white">Maintenance Mode</div>
                 <div className="text-xs text-gray-500">Currently: <span className="text-green font-bold">Inactive</span></div>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="text-right">
                 <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Active Experiments</div>
                 <div className="text-lg font-bold text-white">{flags.filter(f => f.enabled).length} / {flags.length}</div>
              </div>
              <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all">Emergency Kill Switch</button>
           </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search feature flags by name or description..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer">
            <option>All Environments</option>
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </div>

        {/* Flags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flags.map((flag, i) => (
            <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-500/10 transition-all" />
               
               <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-red-500 transition-colors mb-1">{flag.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{flag.environment}</span>
                       <span className="w-1 h-1 rounded-full bg-gray-700" />
                       <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{flag.id}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    flag.enabled ? 'bg-green/10 text-green' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </div>
               </div>

               <p className="text-sm text-gray-400 leading-relaxed mb-8 relative z-10">{flag.description}</p>

               <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                  <div className="flex gap-4">
                     <button className="text-xs text-gray-500 font-bold hover:text-white transition-colors flex items-center gap-1">
                        <Users className="w-3 h-3" /> Target Users
                     </button>
                     <button className="text-xs text-gray-500 font-bold hover:text-white transition-colors flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Geofence
                     </button>
                  </div>
                  <button className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                     <Settings className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
      </div>
    </main>
  );
}
