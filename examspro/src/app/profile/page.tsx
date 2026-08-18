"use client";

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAuthStore } from '@/store/useAuthStore';
import { IconUser as User, IconSettings as Settings, IconLogOut as LogOut, IconChevronRight as ChevronRight, IconAward as Award, IconTarget as Target, IconZap as Zap, IconHistory as History, IconShield as Shield, IconBell as Bell, IconCoins as Coins, IconTrophy as Trophy, IconSword as Sword, IconCheckCircle2 as CheckCircle2, IconLock as Lock, IconSmartphone as Smartphone, IconGift as Gift, IconMail as Mail, IconUsers as Users, IconEye as Eye, IconImage as ImageIcon, IconLoader2 as Loader2, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface UserStats {
  accuracy: string;
  questionsSolved: string;
  coinEarnings: string;
  globalRank: string;
  streak: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile State
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, txRes, examsRes] = await Promise.all([
          api.get('/user/analytics'),
          api.get('/user/coin-history'),
          api.get('/exams')
        ]);
        setStats(statsRes.data.stats);
        setTransactions(txRes.data);
        setExams(examsRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleToggleExam = async (examName: string) => {
    if (!user) return;
    const currentExams = user.targetExams ? user.targetExams.split(',').filter(e => e.length > 0) : [];
    let newExams;
    if (currentExams.includes(examName)) {
      newExams = currentExams.filter(e => e !== examName);
    } else {
      newExams = [...currentExams, examName];
    }
    
    const targetExamsString = newExams.join(',');
    try {
      const response = await api.put('/user/profile', { targetExams: targetExamsString });
      updateUser({ targetExams: response.data.targetExams });
    } catch (error) {
      console.error('Failed to update target exams:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
    }
  }, [user]);

  if (!user && mounted) {
    return (
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/[0.1] border-t-white/[0.15]">
            <Trophy className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
            Your Pro Profile
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Log in to view your detailed analytics, track your exam readiness, manage your coins, and customize your preferences.
          </p>
          <Link href="/login?redirect=/profile" className="inline-block bg-green text-navy hover:bg-green/90 rounded-xl px-12 py-6 text-lg font-bold">
            Sign In to Continue
          </Link>
        </div>
      </main>
    );
  }

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/user/profile', { name: editName, phone: editPhone });
      updateUser({ name: response.data.name });
      setActiveModal(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePreference = async (key: 'emailNotifications' | 'pushNotifications' | 'isPublic' | 'twoFactorEnabled') => {
    if (!user) return;
    try {
      const newVal = !user[key];
      const response = await api.put('/user/profile', { [key]: newVal });
      updateUser({ [key]: response.data[key] });
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
    }
  };

  if (!mounted) return null;

  const displayStats = [
    { label: "Questions Solved", value: stats?.questionsSolved || "0", icon: Target, color: "blue" },
    { label: "Accuracy", value: stats?.accuracy || "0%", icon: Sword, color: "green" },
    { label: "Global Rank", value: stats?.globalRank || "N/A", icon: Trophy, color: "amber" },
    { label: "Current Streak", value: `${stats?.streak || 0} Days`, icon: Zap, color: "orange" },
  ];

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <User className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-green/20 p-1">
              <img 
                src={`https://i.pravatar.cc/300?u=${user?.id}`} 
                className="w-full h-full rounded-full object-cover border-4 border-navy" 
                alt="Avatar" 
              />
            </div>
            <button 
              onClick={() => setActiveModal('edit-profile')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-green text-navy hover:scale-110 transition-transform"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center md:text-left relative z-10">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <h1 className="text-3xl font-display font-bold text-white">{user?.name || 'Student'}</h1>
              {user?.isPremium && (
                <span className="px-2 py-0.5 rounded bg-green/10 text-green text-[10px] font-black uppercase tracking-widest border border-green/20">Pro</span>
              )}
            </div>
            <p className="text-gray-500 mb-6 font-medium">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'} • Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                <Coins className="w-4 h-4 text-amber" />
                <span className="text-sm font-bold text-white">{user?.coinBalance || 0} Coins</span>
              </div>
              <Button 
                onClick={() => setActiveModal('edit-profile')}
                variant="outline" 
                className="border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 rounded-xl"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {displayStats.map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-xl font-display font-bold text-white">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Settings Groups */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 ml-2">Account Settings</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Target Examinations", icon: Target, value: "JAMB, WAEC", id: 'exams' },
                    { label: "Achievements & Badges", icon: Award, value: "View Unlocked", id: 'achievements' },
                    { label: "Transaction History", icon: History, value: `Last: ${transactions[0]?.amount > 0 ? '+' : ''}${transactions[0]?.amount || 0} coins`, id: 'transactions' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveModal(item.id)}
                      className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all text-left w-full"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-green transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className="text-xs text-gray-500 font-medium">{item.value}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-green transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 ml-2">Preferences</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Notifications", icon: Bell, value: "Settings", id: 'notifications' },
                    { label: "Privacy & Security", icon: Shield, value: "Security Level", id: 'privacy' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveModal(item.id)}
                      className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all text-left w-full"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className="text-xs text-gray-500 font-medium">{item.value}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'exams'} 
        onClose={() => setActiveModal(null)} 
        title="Target Examinations"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">Choose the examinations you are preparing for to customize your practice sessions.</p>
          {exams.length > 0 ? exams.map((exam) => {
            const isSelected = user?.targetExams?.split(',').includes(exam.name);
            return (
              <div 
                key={exam.id} 
                onClick={() => handleToggleExam(exam.name)}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:border-green/30 transition-colors cursor-pointer group`}
              >
                <span className="text-sm font-bold text-white">{exam.name}</span>
                <div className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${isSelected ? 'bg-green border-green' : 'border-white/10'}`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-navy" />}
                </div>
              </div>
            );
          }) : (
            <p className="text-center py-4 text-gray-500 text-xs italic">No exams found.</p>
          )}
          <Button onClick={() => setActiveModal(null)} className="w-full bg-green text-navy hover:bg-green/90 rounded-xl font-bold mt-4">Done</Button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'achievements'} 
        onClose={() => setActiveModal(null)} 
        title="Achievements & Badges"
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Fastest Fingers', desc: 'Answered in < 2s', icon: Zap, color: 'text-amber' },
            { label: 'Winning Streak', desc: '7 days consistent', icon: Trophy, color: 'text-green' },
            { label: 'Battle Master', desc: 'Won 10 battles', icon: Sword, color: 'text-blue' },
            { label: 'Social Butterfly', desc: 'Referred 5 friends', icon: Gift, color: 'text-purple' },
          ].map((ach) => (
            <div key={ach.label} className="p-4 rounded-3xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] text-center flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${ach.color}`}>
                <ach.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">{ach.label}</div>
              <div className="text-[10px] text-gray-500">{ach.desc}</div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'transactions'} 
        onClose={() => setActiveModal(null)} 
        title="Transaction History"
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {transactions.length > 0 ? transactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${tx.amount < 0 ? 'text-red-500' : 'text-green'}`}>
                  {tx.amount < 0 ? <ArrowRight className="w-4 h-4 rotate-45" /> : <ArrowRight className="w-4 h-4 -rotate-45" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tx.description || tx.type}</div>
                  <div className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className={`text-sm font-black ${tx.amount < 0 ? 'text-red-400' : 'text-green'}`}>
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} <Coins className="w-3 h-3 inline ml-0.5" />
              </div>
            </div>
          )) : (
            <p className="text-center py-8 text-gray-500 text-sm">No transactions yet.</p>
          )}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'notifications'} 
        onClose={() => setActiveModal(null)} 
        title="Notification Settings"
      >
        <div className="space-y-6">
          {[
            { label: 'Push Notifications', desc: 'Get alerts for battles and results', icon: Bell, key: 'pushNotifications' as const },
            { label: 'Email Reports', desc: 'Weekly summary of your progress', icon: Mail, key: 'emailNotifications' as const },
            { label: 'Social Updates', desc: 'When friends join or win', icon: Users, disabled: true },
          ].map((pref) => (
            <div key={pref.label} className={`flex items-center justify-between ${pref.disabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  <pref.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{pref.label}</div>
                  <div className="text-[10px] text-gray-500">{pref.desc}</div>
                </div>
              </div>
              <button 
                onClick={() => pref.key && handleTogglePreference(pref.key)}
                disabled={pref.disabled}
                className={`w-12 h-6 rounded-full transition-colors relative ${(!pref.disabled && pref.key && user?.[pref.key]) ? 'bg-green' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-navy rounded-full transition-all ${(!pref.disabled && pref.key && user?.[pref.key]) ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy & Security"
      >
        <div className="space-y-4">
          {[
            { label: 'Profile Visibility', desc: 'Allow others to see your stats', key: 'isPublic' as const, icon: Eye },
            { label: 'Two-Factor Auth', desc: 'Secure your account with OTP', key: 'twoFactorEnabled' as const, icon: Lock },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-gray-500">{item.desc}</div>
                </div>
              </div>
              <button 
                onClick={() => handleTogglePreference(item.key)}
                className={`w-12 h-6 rounded-full transition-colors relative ${user?.[item.key] ? 'bg-green' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-navy rounded-full transition-all ${user?.[item.key] ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-white">Active Devices</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </div>

          <Button variant="outline" className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl font-bold mt-4">Delete Account</Button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'edit-profile'} 
        onClose={() => setActiveModal(null)} 
        title="Edit Profile"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <img src={`https://i.pravatar.cc/300?u=${user?.id}`} className="w-24 h-24 rounded-[32px] border-2 border-white/10" alt="Avatar" />
              <div className="absolute inset-0 bg-navy/60 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <button className="text-xs font-bold text-green hover:underline">Change Avatar</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="text" 
                value={editPhone} 
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Optional"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" defaultValue={user?.email || ""} className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green/50 opacity-50 cursor-not-allowed" disabled />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full bg-green text-navy hover:bg-green/90 rounded-xl font-bold mt-4"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
          </Button>
        </div>
      </Modal>
    </main>
  );
}
