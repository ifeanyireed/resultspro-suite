import React from 'react';
import { Badge } from '@/components/Badge';
import { DownloadCloud, Filter, TrendingUp } from 'lucide-react';

export default function FinancialsTab() {
  const transactions = [
    { id: 1, school: 'Lagos Central High School', amount: 500000, type: 'subscription', date: '2024-02-15', status: 'completed' },
    { id: 2, school: 'Abuja International School', amount: 150000, type: 'subscription', date: '2024-02-14', status: 'completed' },
    { id: 3, school: 'Kano Educational Institute', amount: 450000, type: 'subscription', date: '2024-02-13', status: 'completed' },
    { id: 4, school: 'Port Harcourt Academy', amount: 120000, type: 'subscription', date: '2024-02-12', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm">
          <DownloadCloud className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: '₦52.4M', trend: '+28.5%', isPositive: true },
          { label: 'This Month', value: '₦8.2M', trend: '+15.3%', isPositive: true },
          { label: 'Pending', value: '₦1.2M', trend: '3 schools', isPositive: false }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-slate-500 text-xs font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
            <div className="flex items-center space-x-1">
              {stat.isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
              <p className={`text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-800">Recent Transactions</h2>
          <button className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 text-xs">{tx.school}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-xs">₦{(tx.amount || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 capitalize font-medium">{tx.type}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{tx.date}</td>
                  <td className="px-6 py-4">
                    <Badge status={tx.status.toUpperCase()} />
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
