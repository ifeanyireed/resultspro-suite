'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Search, Edit2, Check, X } from 'lucide-react';
import { Badge } from '@/components/Badge';

const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('resultspro_admin_token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export default function AccessTab() {
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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${EXAMS_API}/api/v1/admin/users-access`, { headers: getAuthHeader() });
      const data = await res.json();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
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
      setEditingId(null);
      loadUsers();
    } catch (e) {
      alert("Failed to update access");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-6 font-semibold text-slate-600">User</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Has ICAN?</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Plan Type</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Target IDs</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Expiry</th>
              <th className="py-4 px-6 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filteredUsers.map(u => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 px-6">
                  <div className="font-semibold text-slate-900">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="py-3 px-6">
                  {editingId === u.id ? (
                    <input type="checkbox" checked={editForm.has_ican} onChange={e => setEditForm({...editForm, has_ican: e.target.checked})} />
                  ) : (
                    <Badge variant={u.hasIcan ? 'success' : 'neutral'}>{u.hasIcan ? 'Yes' : 'No'}</Badge>
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === u.id ? (
                    <select value={editForm.ican_plan} onChange={e => setEditForm({...editForm, ican_plan: e.target.value})} className="border border-slate-200 rounded p-1 text-sm">
                      <option value="">None</option>
                      <option value="Single Paper">Single Paper</option>
                      <option value="Complete Level">Complete Level</option>
                      <option value="Full Access">Full Access</option>
                    </select>
                  ) : (
                    <span className="text-slate-600">{u.icanPlan || '-'}</span>
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === u.id ? (
                    <input type="text" value={editForm.ican_targets} onChange={e => setEditForm({...editForm, ican_targets: e.target.value})} className="border border-slate-200 rounded p-1 text-sm w-32" placeholder="IDs (e.g. 1,4)" />
                  ) : (
                    <span className="text-slate-600">{u.icanTargets || '-'}</span>
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === u.id ? (
                    <input type="date" value={editForm.ican_expires_at} onChange={e => setEditForm({...editForm, ican_expires_at: e.target.value})} className="border border-slate-200 rounded p-1 text-sm" />
                  ) : (
                    <span className="text-slate-600">{u.icanExpiresAt ? new Date(u.icanExpiresAt).toLocaleDateString() : '-'}</span>
                  )}
                </td>
                <td className="py-3 px-6 text-right">
                  {editingId === u.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleSave(u.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(u)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
