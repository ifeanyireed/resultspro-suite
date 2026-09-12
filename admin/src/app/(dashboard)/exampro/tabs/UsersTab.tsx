import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, UserPlus, Upload, RefreshCw, Check, X, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproUsers, fetchExamproPlans } from '@/lib/api';
import toast from 'react-hot-toast';

const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || '';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('resultspro_admin_token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    is_premium: false,
    premium_expires_at: '',
    coin_balance: 0,
    active_plan_id: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, plansData] = await Promise.all([fetchExamproUsers(), fetchExamproPlans()]);
      setPlans(Array.isArray(plansData) ? plansData : []);
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({
      is_premium: user.isPremium || false,
      premium_expires_at: user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toISOString().split('T')[0] : '',
      coin_balance: user.coinBalance || 0,
      active_plan_id: user.activePlanId || ''
    });
  };

  const handleSave = async (userId: string) => {
    try {
      await fetch(`${EXAMS_API}/api/admin/users-access/${userId}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_premium: !!editForm.active_plan_id,
          premium_expires_at: editForm.premium_expires_at ? new Date(editForm.premium_expires_at).toISOString() : null,
          coin_balance: Number(editForm.coin_balance),
          active_plan_id: editForm.active_plan_id || null
        })
      });
      toast.success("Access updated successfully!");
      setEditingId(null);
      loadData();
    } catch (e) {
      toast.error("Failed to update access");
    }
  };

  
  const handleVerify = async (userId: string) => {

    try {
      const res = await fetch(`${EXAMS_API}/api/admin/users-access/${userId}/verify`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error("API request failed with status: " + res.status);
      toast.success("User verified successfully!");
      loadData();
    } catch (e) {
      toast.error("Failed to verify user");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${EXAMS_API}/api/admin/users-access/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      toast.success("User deleted successfully!");
      loadData();
    } catch (e) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Candidates & Access Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage exam candidates and their subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email..." 
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium">
            <option>All Plans</option>
            <option>Pro</option>
            <option>Free</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">User Info</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Verified</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Coins</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">App Plan</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Sub Expiry</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm border border-slate-200">
                        <img src={u.avatarUrl || `/avatars/character${(u.id.charCodeAt(0) % 20) + 1}.jpg`} alt={u.name || 'User'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{u.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge status={u.accountStatus === 'active' ? 'VERIFIED' : 'PENDING'} />
                  </td>

                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <input type="number" value={editForm.coin_balance} onChange={e => setEditForm({...editForm, coin_balance: Number(e.target.value)})} className="border border-slate-200 rounded p-1 w-20 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    ) : (
                      <span className="text-slate-600 font-medium">{u.coinBalance || 0}</span>
                    )}
                  </td>
                  

                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <select value={editForm.active_plan_id} onChange={e => setEditForm({...editForm, active_plan_id: e.target.value})} className="border border-slate-200 rounded p-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="">FREE (No Plan)</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.activePlanId ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.activePlanId ? plans.find(p => p.id === u.activePlanId)?.name || 'PRO' : 'FREE'}
                      </span>
                    )}
                  </td>


                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <input type="date" value={editForm.premium_expires_at} onChange={e => setEditForm({...editForm, premium_expires_at: e.target.value})} className="border border-slate-200 rounded p-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    ) : (
                      <span className="text-slate-600 font-medium">{u.premiumExpiresAt ? new Date(u.premiumExpiresAt).toLocaleDateString() : '-'}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {editingId === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleSave(u.id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors" title="Save Changes">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        
                        {u.accountStatus !== 'active' && (
                          <button onClick={() => handleVerify(u.id)} className="p-1.5 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Manually Verify Email">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleEdit(u)} className="p-1.5 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit Access">

                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
