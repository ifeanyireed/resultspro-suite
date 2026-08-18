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
    // Initial sample fallback while loading
    setUsers([
      { id: '1', full_name: 'Super Admin', email: 'superadmin@resultspro.ng', account_status: 'active', phone: '+2348011111111', created_at: '2026-01-01' },
      { id: '2', full_name: 'Mr. Adeniyi', email: 'teacher@greenwoodhigh.edu.ng', account_status: 'active', phone: '+2348055555555', created_at: '2026-02-10' },
      { id: '3', full_name: 'Jane Doe', email: 'student@example.com', account_status: 'active', phone: '+2348066666666', created_at: '2026-03-01' },
      { id: '4', full_name: 'Mrs. Doe', email: 'parent@example.com', account_status: 'active', phone: '+2348077777777', created_at: '2026-03-01' },
      { id: '5', full_name: 'Agent Chinedu', email: 'agent@resultspro.ng', account_status: 'active', phone: '+2348088888888', created_at: '2026-01-15' },
    ]);
    setLoading(false);
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
    <div className="flex-1 flex flex-col">
      <Header
        title="Universal User Directory"
        subtitle="Manage master identity profiles, account statuses, and MFA settings"
      />

      <div className="p-8 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by user name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {user.full_name ? user.full_name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-slate-400 font-normal">id: {user.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={user.account_status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.created_at}</td>
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
