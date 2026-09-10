import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, UserPlus, Upload, RefreshCw, Check, X, Edit2 } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproUsers } from '@/lib/api';
import toast from 'react-hot-toast';

const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('resultspro_admin_token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    has_ican: false,
    ican_plan: '',
    ican_targets: '',
    ican_expires_at: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproUsers();
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
      has_ican: user.hasIcan || false,
      ican_plan: user.icanPlan || '',
      ican_targets: user.icanTargets || '',
      ican_expires_at: user.icanExpiresAt ? new Date(user.icanExpiresAt).toISOString().split('T')[0] : ''
    });
  };

  const handleSave = async (userId: string) => {
    try {
      await fetch(`${EXAMS_API}/api/v1/admin/users-access/${userId}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          has_ican: editForm.has_ican,
          ican_plan: editForm.ican_plan || null,
          ican_targets: editForm.ican_targets || null,
          ican_expires_at: editForm.ican_expires_at ? new Date(editForm.ican_expires_at).toISOString() : null
        })
      });
      toast.success("Access updated successfully!");
      setEditingId(null);
      loadData();
    } catch (e) {
      toast.error("Failed to update access");
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
          <p className="text-xs text-slate-500 mt-1">Manage exam candidates, ICAN access, and their subscriptions</p>
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
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">App Plan</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Has ICAN?</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">ICAN Plan Type</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">ICAN Expiry</th>
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
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.isPremium ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      {u.isPremium ? 'PRO' : 'FREE'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <input type="checkbox" checked={editForm.has_ican} onChange={e => setEditForm({...editForm, has_ican: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                    ) : (
                      <Badge status={u.hasIcan ? 'ACTIVE' : 'INACTIVE'} />
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <select value={editForm.ican_plan} onChange={e => setEditForm({...editForm, ican_plan: e.target.value})} className="border border-slate-200 rounded p-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="">None</option>
                        <option value="Single Paper">Single Paper</option>
                        <option value="Complete Level">Complete Level</option>
                        <option value="Full Access">Full Access</option>
                      </select>
                    ) : (
                      <span className="text-slate-600 font-medium">{u.icanPlan || '-'}</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <input type="date" value={editForm.ican_expires_at} onChange={e => setEditForm({...editForm, ican_expires_at: e.target.value})} className="border border-slate-200 rounded p-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    ) : (
                      <span className="text-slate-600 font-medium">{u.icanExpiresAt ? new Date(u.icanExpiresAt).toLocaleDateString() : '-'}</span>
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
                      <button onClick={() => handleEdit(u)} className="p-1.5 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit Access">
                        <Edit2 className="w-4 h-4" />
                      </button>
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
