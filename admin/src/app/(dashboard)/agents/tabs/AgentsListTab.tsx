import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Search, MoreVertical, Plus } from 'lucide-react';

export default function AgentsListTab() {
  const [agents, setAgents] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-xs">
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent Name</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Tier</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Earnings</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No agents found</td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{agent.firstName} {agent.lastName}</td>
                  <td className="px-6 py-4 text-slate-500">{agent.email}</td>
                  <td className="px-6 py-4"><code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{agent.uniqueReferralCode}</code></td>
                  <td className="px-6 py-4">{agent.subscriptionTier}</td>
                  <td className="px-6 py-4 font-bold">₦{agent.totalCommissionEarned}</td>
                  <td className="px-6 py-4"><Badge status={agent.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600"><MoreVertical size={16}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
