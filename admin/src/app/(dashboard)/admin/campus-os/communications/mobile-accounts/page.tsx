'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  ShieldCheck,
  Apple
} from 'lucide-react';
import { fetchMobileAccounts, MobileAccount } from '@/lib/campus-api';

const DEVICE_FILTERS = ['All Devices', 'iOS', 'Android', 'Web'];

export default function CommunicationsMobileAccountsPage() {
  const [accounts, setAccounts] = useState<MobileAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState('All Devices');
  const [searchTerm, setSearchTerm] = useState('');
  const [testNotificationSent, setTestNotificationSent] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoading(true);
    const data = await fetchMobileAccounts();
    setAccounts(data);
    setLoading(false);
  }

  function handleSendTestPush(id: string) {
    setTestNotificationSent(id);
    setTimeout(() => {
      setTestNotificationSent(null);
    }, 3000);
  }

  const filteredAccounts = accounts.filter((acc) => {
    const matchesDevice = selectedDevice === 'All Devices' || acc.device_type === selectedDevice;
    const matchesSearch =
      acc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDevice && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Device Filter */}
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {DEVICE_FILTERS.map((dev) => (
              <option key={dev} value={dev}>{dev}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parent, student, device ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
          {filteredAccounts.length} Active Devices Connected
        </div>
      </div>

      {/* Mobile Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Registered ScholarsNG Mobile Device Accounts</h3>
            <p className="text-xs text-slate-500">Parent and student mobile app push tokens for real-time exam notifications and fee alerts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-4">Portal Role</th>
                <th className="py-3 px-4">Device OS</th>
                <th className="py-3 px-4">Push Notification Token</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{acc.full_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{acc.user_id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[11px]">
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{acc.device_type}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] max-w-xs truncate">
                    {acc.push_token || 'No Push Token Active'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {acc.last_active}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSendTestPush(acc.id)}
                      className={`px-3 py-1 font-bold rounded-lg text-xs transition-colors ${
                        testNotificationSent === acc.id
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-50 hover:bg-blue-100 text-[#146ef5]'
                      }`}
                    >
                      {testNotificationSent === acc.id ? 'Ping Dispatched!' : 'Send Test Ping'}
                    </button>
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
