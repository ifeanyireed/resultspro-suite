import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/Badge';

export default function FinancialsTab() {
  const transactions = [
    { id: 'TXN-001', user: 'John Doe', amount: '+5,000 NGN', type: 'COIN_PURCHASE', date: 'Oct 14, 2026', status: 'COMPLETED' },
    { id: 'TXN-002', user: 'Jane Smith', amount: '-1,500 NGN', type: 'BATTLE_PAYOUT', date: 'Oct 14, 2026', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1"/> 12.5%</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Revenue (MTD)</p>
          <p className="text-3xl font-bold text-slate-800">₦450,200</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Coin Purchases</p>
          <p className="text-3xl font-bold text-slate-800">1,245</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Battle Payouts</p>
          <p className="text-3xl font-bold text-slate-800">₦125,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Transaction ID</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">User</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Amount</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500">{t.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t.user}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{t.type}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{t.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <Badge status={t.status} />
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
