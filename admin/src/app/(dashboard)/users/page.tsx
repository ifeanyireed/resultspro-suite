'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Users, Search, Filter, ShieldAlert, UserCheck, KeyRound } from 'lucide-react';
import { fetchUsers, updateUserStatus } from '@/lib/api';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.account_status === 'active' ? 'suspended' : 'active';
    await updateUserStatus(user.id, nextStatus);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, account_status: nextStatus as any } : u))
    );
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || u.account_status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full">
      <Header
        title="Universal User Directory"
        subtitle="Manage master identity profiles, account statuses, and MFA settings"
      />

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-sm shadow-slate-200/50 p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
            <input
              type="text"
              placeholder="Search by user name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-full text-slate-700 text-xs font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100 transition-colors"><span className="font-medium text-slate-500 text-xs mr-2">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-700 font-medium text-xs focus:outline-none cursor-pointer appearance-none pr-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="unverified">Unverified</option>
            </select></div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Created Date</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm border border-slate-200">
                        <img src={`/avatars/character${(user.id.charCodeAt(0) % 20) + 1}.jpg`} alt={user.full_name || 'User'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-xs">{user.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-slate-400 font-normal">id: {user.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">{user.email}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">{user.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={user.account_status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">{user.created_at}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors ${
                          user.account_status === 'active'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {user.account_status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
