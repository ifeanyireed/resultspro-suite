'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Briefcase, DollarSign, Award, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function AgentsPage() {
  const agents = [
    {
      id: 'agent-1',
      name: 'Chinedu Okafor',
      email: 'chinedu@resultspro.ng',
      rate: '15%',
      schoolsReferred: 14,
      totalEarned: '₦1,850,000',
      status: 'active',
      bank: 'Zenith Bank • 1029384756',
    },
    {
      id: 'agent-2',
      name: 'Folake Adeleke',
      email: 'folake@resultspro.ng',
      rate: '12%',
      schoolsReferred: 9,
      totalEarned: '₦1,120,000',
      status: 'active',
      bank: 'Access Bank • 0039281745',
    },
    {
      id: 'agent-3',
      name: 'Emeka Nwosu',
      email: 'emeka@resultspro.ng',
      rate: '10%',
      schoolsReferred: 6,
      totalEarned: '₦680,000',
      status: 'active',
      bank: 'GTBank • 0128475839',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Agent Referral Network"
        subtitle="Track sales partner performance, commission ledgers, and portfolio allocation"
      />

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            />
          </div>
          <Link
            href="/agents/payouts"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Manage Payout Requests</span>
          </Link>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent Name</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Commission Rate</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Referred Schools</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Total Lifetime Earnings</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Payout Account</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-xs">{agent.name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{agent.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{agent.rate}</td>
                  <td className="px-6 py-4 text-slate-700 font-semibold">{agent.schoolsReferred} schools</td>
                  <td className="px-6 py-4 font-medium text-slate-800 text-xs">{agent.totalEarned}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-normal">{agent.bank}</td>
                  <td className="px-6 py-4">
                    <Badge status={agent.status} />
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
