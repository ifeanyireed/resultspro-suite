"use client";

import { IconUser as User, IconBell as Bell, IconShield as Shield, IconCreditCard as CreditCard, IconLogout as LogOut, IconDeviceMobile as Smartphone, IconGlobe as Globe, IconCheck as Check, IconChevronRight as ChevronRight, IconCamera as Camera, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </main>
    );
  }

  const TABS = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="mb-10">
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Settings</h1>
             <p className="text-sm text-gray-500">Manage your profile, preferences, and account settings.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 shrink-0 space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#146ef5] shadow-sm border border-gray-200/60 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent font-medium'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#146ef5]' : 'text-gray-400'}`} />
                  <span className="text-sm">{tab.name}</span>
                </button>
              ))}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button 
                  onClick={logout}
                  className="w-full p-3.5 rounded-xl flex items-center gap-3 text-red-500 hover:bg-red-50 transition-all font-medium border border-transparent"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 w-full">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                 {activeTab === 'profile' && (
                   <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                         <div className="relative group shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm border border-gray-200 bg-gray-50">
                               <img 
                                  src={user?.avatar_url || user?.avatarUrl || `/avatars/character${(user?.full_name?.length % 20) || 1}.jpg`} 
                                  alt={user?.full_name || 'User'} 
                                  className="w-full h-full object-cover" 
                               />
                            </div>
                            <button type="button" className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:text-[#146ef5] transition-all group-hover:scale-105">
                               <Camera className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="text-center md:text-left flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.full_name || 'Student Name'}</h3>
                            <p className="text-sm text-gray-500 mb-3 capitalize">{user?.role?.toLowerCase() || 'Student'} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                            <button type="button" className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                               Change Avatar
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input name="full_name" type="text" defaultValue={user?.full_name || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white transition-all shadow-sm text-sm" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" readOnly defaultValue={user?.email || ''} className="w-full bg-gray-100/70 border border-gray-200 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed shadow-sm text-sm" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Grade Level</label>
                            <select name="grade" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white transition-all appearance-none shadow-sm text-sm">
                               <option>Grade 10</option>
                               <option>Grade 11</option>
                               <option>Grade 12</option>
                            </select>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Language</label>
                            <div className="relative">
                               <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input type="text" defaultValue="English (UK)" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white transition-all shadow-sm text-sm" />
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 mt-4 flex justify-end">
                         <button 
                           disabled={saving}
                           className="px-6 py-2.5 rounded-xl bg-[#146ef5] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#105bd1] transition-all shadow-sm disabled:opacity-50 min-w-[140px]"
                         >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                         </button>
                      </div>
                   </form>
                 )}

                 {activeTab === 'notifications' && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-1">Notification Preferences</h3>
                         <p className="text-sm text-gray-500">Choose how you want to be notified about class updates and activity.</p>
                      </div>

                      <div className="space-y-3">
                         {(notificationSettings.length > 0 ? notificationSettings : [
                           { type: 'EMAIL', title: 'Email Notifications', desc: 'Receive class reminders and billing alerts via email.', enabled: true },
                           { type: 'PUSH', title: 'Push Notifications', desc: 'Get real-time updates on your desktop or mobile device.', enabled: false },
                           { type: 'WHATSAPP', title: 'WhatsApp Updates', desc: 'Receive session links and homework alerts on WhatsApp.', enabled: true },
                           { type: 'PROGRESS', title: 'Progress Reports', desc: 'Weekly summary of your learning activity and results.', enabled: true },
                         ]).map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                              <div className="flex-1 pr-8">
                                 <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{item.title || item.type}</h4>
                                 <p className="text-xs text-gray-500">{item.desc}</p>
                              </div>
                              <button className={`w-11 h-6 rounded-full relative transition-all shadow-inner ${item.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${item.enabled ? 'left-6' : 'left-1'}`} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
                 
                 {/* Temporary placeholders for other tabs */}
                 {activeTab === 'security' && (
                   <div className="py-12 text-center text-gray-500 animate-in fade-in">
                     <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Security Settings</h3>
                     <p className="text-sm">Password and authentication settings will appear here.</p>
                   </div>
                 )}
                 
                 {activeTab === 'billing' && (
                   <div className="py-12 text-center text-gray-500 animate-in fade-in">
                     <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Billing & Invoices</h3>
                     <p className="text-sm">Payment methods and transaction history will appear here.</p>
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
