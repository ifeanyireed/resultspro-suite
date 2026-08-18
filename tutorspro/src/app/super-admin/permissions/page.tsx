"use client";

import { 
  Lock, 
  Plus, 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  Users, 
  Eye, 
  Edit,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPermissions } from '@/lib/superadmin.api';

export default function RolesPermissions() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getPermissions();
        setRoles(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
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
          <p className="font-bold mb-2">Error Loading Permissions</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">Roles & Permissions</h1>
            <p className="text-gray-400">Define access control levels and manage granular permissions for administrative staff.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm">
            <Plus className="w-5 h-5" /> Create Custom Role
          </button>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 gap-6">
           {roles.map((role, i) => (
             <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all group">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                   <div className="flex gap-6 flex-1">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-all">
                         <ShieldAlert className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{role.role}</h3>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {role.permissions.map((p: string, j: number) => (
                              <span key={j} className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-bold text-gray-500 uppercase tracking-widest">{p}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">View Permissions</button>
                      <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                      <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-rose transition-all"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Permissions Matrix Link */}
        <div className="mt-12 text-center">
           <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-500 font-bold hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-3 mx-auto">
              Access Master Permission Matrix <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </main>
  );
}
