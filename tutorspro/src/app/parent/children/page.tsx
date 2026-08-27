"use client";

import api from '@/lib/api';
import { IconUsers as Users, IconPlus as Plus, IconUserPlus as UserPlus, IconSettings as Settings, IconShieldCheck as ShieldCheck, IconChevronRight as ChevronRight, IconUserCircle2 as UserCircle2, IconTrash2 as Trash2, IconExternalLink as ExternalLink, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentChildren() {
  const [mounted, setMounted] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await api.get('/parent/children');
      setChildren(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!inviteCode) {
      toast.error('Please enter an invite code');
      return;
    }

    setLinking(true);
    try {
      await api.post('/parent/children', { invite_code: inviteCode });
      toast.success('Account linked successfully!');
      setInviteCode('');
      fetchChildren();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to link account');
    } finally {
      setLinking(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              My <span className="text-blue">Children</span>
            </h1>
            <p className="text-gray-400">Manage linked student accounts and supervision settings.</p>
          </div>
          <button 
            onClick={() => document.getElementById('invite-input')?.focus()}
            className="px-6 py-3 rounded-2xl bg-blue text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue/20"
          >
            <Plus className="w-5 h-5" />
            ADD ANOTHER CHILD
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Children List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-50">
                <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
                <p className="text-white font-bold">Loading children...</p>
              </div>
            ) : children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="p-6 md:p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white text-3xl font-black shadow-xl">
                        {child.avatar}
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-blue transition-colors">{child.name}</h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{child.grade}</span>
                          <span className="px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue uppercase tracking-widest">{child.subjects} Active Subjects</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${child.last_active === 'Active' ? 'bg-green animate-pulse' : 'bg-gray-500'}`} />
                          Last active: {child.last_active}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center gap-2">
                      <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <ExternalLink className="w-4 h-4" />
                        VIEW DASHBOARD
                      </button>
                      <div className="flex gap-2">
                        <button className="flex-1 md:flex-none p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex-1 md:flex-none p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 rounded-[40px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <UserPlus className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">No children linked yet</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Enter an invite code on the right to start monitoring your child's progress.</p>
              </div>
            )}
          </div>

          {/* Sidebar / Invite Form */}
          <div className="space-y-8">
            <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Invite Code</h3>
              <p className="text-sm text-gray-400 mb-8">Your child can find this code in their Profile settings.</p>
              
              <div className="space-y-4">
                <input 
                  id="invite-input"
                  type="text" 
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="EX: Student ID"
                  className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-center tracking-widest placeholder:text-gray-700 focus:outline-none focus:border-blue transition-all"
                />
                <button 
                  onClick={handleLinkAccount}
                  disabled={linking}
                  className="w-full py-4 rounded-2xl bg-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LINK ACCOUNT'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </section>

            {/* Quick Tips */}
            <section className="p-8 rounded-[40px] bg-gradient-to-br from-purple/20 to-transparent border border-white/10">
               <h4 className="font-bold text-white mb-4">Why link accounts?</h4>
               <ul className="space-y-4">
                 {[
                   'Real-time attendance alerts',
                   'Weekly progress reports',
                   'Direct messaging with tutors',
                   'Simplified billing management'
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-sm text-gray-400">
                     <div className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" />
                     {tip}
                   </li>
                 ))}
               </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
