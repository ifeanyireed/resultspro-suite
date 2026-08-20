"use client";

import { IconArrowLeft as ArrowLeft, IconMail as Mail, IconShield as Shield, IconBan as Ban, IconCoins as Coins, IconTrophy as Trophy, IconBolt as Zap, IconTarget as Target, IconClock as Clock, IconEdit as Edit2, IconLoader2 as Loader2, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import { useSearchParams } from 'next/navigation';

function AdminUserDetailContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    role: '',
    isPremium: false,
    coinBalance: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Suspend Modal State
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [isSuspending, setIsSuspending] = useState(false);

  useEffect(() => {
    if (userId) fetchUserDetail();
    else setLoading(false);
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      const res = await api.get(`/admin/user-details/${userId}`);
      setData(res.data);
      // Initialize edit data
      setEditData({
        name: res.data.user.name || '',
        phone: res.data.user.phone || '',
        role: res.data.user.role,
        isPremium: res.data.user.isPremium,
        coinBalance: res.data.user.coinBalance
      });
    } catch (err) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/admin/users/${userId}`, editData);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUserDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSuspension = async () => {
    if (!data.user.isBanned && !suspendReason) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    setIsSuspending(true);
    try {
      if (data.user.isBanned) {
        await api.post(`/admin/users/${userId}/unsuspend`);
        toast.success("User unsuspended successfully");
      } else {
        await api.post(`/admin/users/${userId}/suspend`, { reason: suspendReason });
        toast.success("User suspended and notification email sent");
      }
      setIsSuspendModalOpen(false);
      setSuspendReason('');
      fetchUserDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update suspension status");
    } finally {
      setIsSuspending(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No User ID provided</h1>
        <Link href="/admin/users" className="text-green hover:underline">Back to Users</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 bg-navy flex flex-col items-center justify-center text-white p-8 text-center">
        <p>User not found</p>
        <Link href="/admin/users" className="mt-4 text-green underline">Back to Users</Link>
      </div>
    );
  }

  const { user, stats, activity } = data;

  return (
    <>
      <AdminHeader title="User Profile" />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="h-20 bg-white/[0.02] border-b border-white/[0.05] border-t-white/[0.1] flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-4">
            <Link href="/admin/users" className="p-2 hover:bg-white/5 rounded-xl transition-colors group">
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-white" />
            </Link>
            <div>
              <h1 className="text-lg font-display font-bold text-white">User Profile</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsEditModalOpen(true)}
              variant="outline" 
              className="rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 font-bold text-xs gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
            <Button 
              onClick={() => setIsSuspendModalOpen(true)}
              className={`rounded-xl ${user.isBanned ? 'bg-green/10 text-green' : 'bg-red-500/10 text-red-500'} hover:opacity-80 border border-current font-bold text-xs gap-2 transition-all`}
            >
              <Ban className="w-4 h-4" /> {user.isBanned ? 'Unsuspend Account' : 'Suspend Account'}
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center group hover:border-white/10 transition-all">
              <div className="relative inline-block mb-6">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name || user.email}&background=random&size=300`} 
                  className="w-32 h-32 rounded-[40px] border-4 border-white/5 shadow-2xl object-cover" 
                  alt="Avatar" 
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-green flex items-center justify-center text-navy shadow-lg border-4 border-navy">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              
              <h2 className="text-2xl font-display font-black text-white mb-1 uppercase tracking-tight">{user.name || 'No Name'}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Plan</div>
                  <div className="text-sm font-black text-green">{user.isPremium ? 'Premium' : 'Free'}</div>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                  <div className={`text-sm font-black ${user.isBanned ? 'text-red-500' : 'text-blue-400'}`}>{user.isBanned ? 'Banned' : 'Active'}</div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6 group hover:border-white/10 transition-all">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-gray-500">Phone</span>
                  <span className="text-xs font-bold text-white">{user.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-gray-500">Joined Date</span>
                  <span className="text-xs font-bold text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">User Role</span>
                  <span className="text-xs font-bold text-green">{user.role}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 text-xs gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </Button>
            </div>
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Coins', value: stats.coins, icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                { label: 'ELO', value: stats.elo, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Accuracy', value: stats.accuracy, icon: Target, color: 'text-green', bg: 'bg-green/10' },
                { label: 'Battles', value: stats.battles, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group hover:border-white/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-xl font-display font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
              <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex justify-between items-center bg-white/5">
                <h3 className="font-display font-bold text-white text-lg">Activity Log</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-green/10 text-green text-[10px] font-bold uppercase tracking-tight">Recent</button>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {activity.map((log: any, i: number) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{log.action}</div>
                        <div className="text-[10px] text-gray-500 font-medium uppercase">
                          {new Date(log.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>
                    {log.reward && <span className="text-xs font-black text-green">{log.reward}</span>}
                    {log.amount && <span className="text-xs font-black text-red-500">{log.amount}</span>}
                  </div>
                ))}
                {activity.length === 0 && (
                  <div className="px-8 py-10 text-center text-gray-500 text-sm">No recent activity found</div>
                )}
              </div>
              <button className="w-full py-4 bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-green transition-colors border-t border-white/[0.05] border-t-white/[0.1]">
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User Profile">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
              <input 
                type="text" 
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Role</label>
            <select 
              value={editData.role}
              onChange={(e) => setEditData({...editData, role: e.target.value})}
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            >
              <option value="STUDENT" className="bg-navy">Student</option>
              <option value="MODERATOR" className="bg-navy">Moderator</option>
              <option value="ADMIN" className="bg-navy">Administrator</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coin Balance</label>
              <input 
                type="number" 
                value={editData.coinBalance}
                onChange={(e) => setEditData({...editData, coinBalance: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium Status</label>
              <div 
                onClick={() => setEditData({...editData, isPremium: !editData.isPremium})}
                className={`w-full h-[46px] rounded-xl border flex items-center px-4 cursor-pointer transition-all ${editData.isPremium ? 'border-green bg-green/10 text-green' : 'border-white/[0.1] border-t-white/[0.15] bg-white/5 text-gray-500'}`}
              >
                {editData.isPremium ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null}
                <span className="text-xs font-bold">{editData.isPremium ? 'PREMIUM ACTIVE' : 'FREE PLAN'}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleUpdateUser}
            disabled={isUpdating}
            className="w-full bg-green text-navy font-bold py-4 rounded-xl shadow-lg shadow-green/20 mt-4"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Suspend Modal */}
      <Modal isOpen={isSuspendModalOpen} onClose={() => setIsSuspendModalOpen(false)} title={user.isBanned ? 'Unsuspend Account' : 'Suspend Account'}>
        <div className="space-y-4">
          {!user.isBanned ? (
            <>
              <p className="text-sm text-gray-400">Please provide a reason for suspending this account. This reason will be included in the email notification sent to the user.</p>
              <textarea 
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension..."
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-red-500/50 outline-none min-h-[120px] text-sm"
              />
            </>
          ) : (
            <p className="text-sm text-gray-400">Are you sure you want to unsuspend this account? The user will regain full access to the platform immediately.</p>
          )}

          <Button 
            onClick={handleToggleSuspension}
            disabled={isSuspending}
            className={`w-full font-bold py-4 rounded-xl shadow-lg mt-4 ${user.isBanned ? 'bg-green text-navy shadow-green/20' : 'bg-red-500 text-white shadow-red-500/20'}`}
          >
            {isSuspending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (user.isBanned ? 'Confirm Unsuspension' : 'Suspend Account')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default function AdminUserDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    }>
      <AdminUserDetailContent />
    </Suspense>
  );
}
