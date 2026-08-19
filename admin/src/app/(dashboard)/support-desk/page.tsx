'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { AlertCircle, Clock, CheckCircle2, XCircle, Search, Filter, Eye, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    // Mock Data
    setStats({
      open: 12, pending: 5, inProgress: 8, resolved: 45, closed: 120, averageResolutionTimeHours: 4.5
    });
    setTickets([
      { id: '1', ticketNumber: 'TKT-001', title: 'Cannot generate scratch cards', description: 'System says batch limit reached but I only generated 100.', category: 'TECHNICAL', priority: 'HIGH', status: 'OPEN', school: { name: 'Greenwood High' }, createdByUser: { firstName: 'Admin', lastName: 'User' } },
      { id: '2', title: 'Billing issue for Term 2', description: 'My card was charged twice for the same subscription plan.', category: 'BILLING', priority: 'CRITICAL', status: 'IN_PROGRESS', school: { name: 'Kings College' }, createdByUser: { firstName: 'Bursar', lastName: 'Kings' } },
    ]);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Support Desk"
        subtitle="Manage and resolve incoming support tickets from schools and agents"
      />

      <div className="p-8 space-y-6 max-w-[1400px] mx-auto w-full">
        {/* Header Overview */}
        <div className="flex items-center justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Support Overview</h2>
            <p className="text-xs text-slate-500 mt-1">Manage and respond to school support requests</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Avg Resolution</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.averageResolutionTimeHours} <span className="text-xs text-slate-400 font-normal">hrs</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Open', value: stats?.open, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
            { label: 'Pending', value: stats?.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
            { label: 'In Progress', value: stats?.inProgress, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
            { label: 'Resolved', value: stats?.resolved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Closed', value: stats?.closed, icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
          ].map((stat, idx) => (
            <div key={idx} className={`rounded-2xl border p-5 shadow-sm ${stat.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">{(stat.value || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search tickets..." className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all" />
          </div>
          <div className="flex-1 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium">
              <option>All Statuses</option>
              <option>Open</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="flex-1 relative">
            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium">
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-800">Active Tickets</h2>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{tickets.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-xs mb-0.5">{ticket.title}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[250px]">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700 text-xs">{ticket.school?.name}</p>
                      <p className="text-[10px] text-slate-400">{ticket.createdByUser?.firstName} {ticket.createdByUser?.lastName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={ticket.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
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
