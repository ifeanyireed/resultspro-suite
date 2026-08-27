"use client";

import { IconUser as User, IconBell as Bell, IconShield as Shield, IconCreditCard as CreditCard, IconLogout as LogOut, IconSmartphone as Smartphone, IconGlobe as Globe, IconCheck as Check, IconChevronRight as ChevronRight, IconCamera as Camera, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function StudentSettings() {
  const { user, fetchUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/student/settings/notifications');
        setNotificationSettings(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notification settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/student/settings/profile', {
        full_name: e.target.full_name.value,
        grade: e.target.grade.value
      });
      toast.success("Profile update requested");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'devices', name: 'Devices', icon: Smartphone },
  ];

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'PARENT', 'SCHOOL_ADMIN', 'PLATFORM_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
                
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Account <span className="text-blue">Settings</span>
            </h1>
            <p className="text-gray-400">Manage your profile, security, and notification preferences.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Settings Navigation */}
            <div className="lg:w-64 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue text-white shadow-lg shadow-blue/20' 
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{tab.name}</span>
                </button>
              ))}
              <div className="pt-8 mt-8 border-t border-white/5">
                <button 
                  onClick={logout}
                  className="w-full p-4 rounded-2xl flex items-center gap-4 text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12">
                 {activeTab === 'profile' && (
                   <form onSubmit={handleUpdateProfile} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                         <div className="relative group">
                            {user?.avatar_url ? (
                              <img src={user.avatar_url} className="w-32 h-32 rounded-[40px] object-cover" alt="U" />
                            ) : (
                              <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                                 {user?.full_name?.[0] || 'U'}
                              </div>
                            )}
                            <button type="button" className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-navy border border-white/10 text-white shadow-xl hover:scale-110 transition-all">
                               <Camera className="w-5 h-5" />
                            </button>
                         </div>
                         <div className="text-center md:text-left">
                            <h3 className="text-2xl font-display font-bold text-white mb-1">{user?.full_name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{user?.role} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                            <button type="button" className="px-6 py-2 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-all">
                               Change Avatar
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input name="full_name" type="text" defaultValue={user?.full_name || ''} className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue/50 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" readOnly defaultValue={user?.email} className="w-full bg-navy/50 border border-white/10 rounded-2xl py-4 px-6 text-gray-500 cursor-not-allowed" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Grade Level</label>
                            <select name="grade" className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue/50 transition-all appearance-none">
                               <option>Grade 10</option>
                               <option>Grade 11</option>
                               <option>Grade 12</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Preferred Language</label>
                            <div className="relative">
                               <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                               <input type="text" defaultValue="English (UK)" className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-blue/50 transition-all" />
                            </div>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex justify-end">
                         <button 
                           disabled={saving}
                           className="px-10 py-4 rounded-2xl bg-blue text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue/20 disabled:opacity-50"
                         >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                         </button>
                      </div>
                   </form>
                 )}

                 {activeTab === 'notifications' && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                         <h3 className="text-2xl font-display font-bold text-white mb-2">Notifications</h3>
                         <p className="text-sm text-gray-500">Choose how you want to be notified about class updates and activity.</p>
                      </div>

                      <div className="space-y-4">
                         {(notificationSettings.length > 0 ? notificationSettings : [
                           { type: 'EMAIL', title: 'Email Notifications', desc: 'Receive class reminders and billing alerts via email.', enabled: true },
                           { type: 'PUSH', title: 'Push Notifications', desc: 'Get real-time updates on your desktop or mobile device.', enabled: false },
                           { type: 'WHATSAPP', title: 'WhatsApp Updates', desc: 'Receive session links and homework alerts on WhatsApp.', enabled: true },
                           { type: 'PROGRESS', title: 'Progress Reports', desc: 'Weekly summary of your learning activity and results.', enabled: true },
                         ]).map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-navy border border-white/5">
                              <div className="flex-1 pr-8">
                                 <h4 className="font-bold text-white mb-1">{item.title || item.type}</h4>
                                 <p className="text-xs text-gray-500">{item.desc}</p>
                              </div>
                              <button className={`w-12 h-6 rounded-full relative transition-all ${item.enabled ? 'bg-green' : 'bg-white/10'}`}>
                                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
