import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproFinancials } from '@/lib/api';

export default function FinancialsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproFinancials();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const transactions = stats?.transactions || [];

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
          <p className="text-3xl font-bold text-slate-800">₦{(stats?.revenueMTD || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Coin Purchases</p>
          <p className="text-3xl font-bold text-slate-800">{(stats?.coinPurchases || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Battle Payouts</p>
          <p className="text-3xl font-bold text-slate-800">₦{(stats?.battlePayouts || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
          <button onClick={loadData} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
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
              {transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500">{t.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t.user || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{t.type}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{t.amount_ngn ? `₦${t.amount_ngn}` : `${t.amount_coins} Coins`}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
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
