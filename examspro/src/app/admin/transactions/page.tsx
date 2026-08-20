"use client";

import { useState, useEffect } from 'react';
import { IconSearch as Search, IconFilter as Filter, IconDownload as Download, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconCurrencyDollar as DollarSign, IconClock as Clock, IconCircleCheck as CheckCircle2, IconAlertCircle as AlertCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminTransactionPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/finances/stats');
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch financial logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  const summary = data?.summary || { mtdRevenue: 0, avgTransaction: 0, pendingPayouts: 0 };
  const transactions = data?.transactions || [];

  const filteredTransactions = transactions.filter((t: any) => 
    t.user?.toLowerCase().includes(search.toLowerCase()) || 
    t.id?.toLowerCase().includes(search.toLowerCase()) ||
    t.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Financial Logs" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Financial Logs</h1>
            <p className="text-sm text-gray-500">Monitor all platform transactions and revenue.</p>
          </div>
          <Button variant="outline" onClick={() => window.print()} className="rounded-xl border-white/[0.05] border-t-white/[0.1] bg-white/5 text-white hover:bg-white/10 font-bold text-xs gap-2">
            <Download className="w-4 h-4" /> Export View
          </Button>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Revenue (MTD)", value: `₦${summary.mtdRevenue.toLocaleString()}`, trend: "Live", up: true },
            { label: "Avg. Transaction", value: `₦${summary.avgTransaction.toLocaleString()}`, trend: "Success", up: true },
            { label: "Pending Payouts", value: `₦${summary.pendingPayouts.toLocaleString()}`, trend: "Withdrawals", up: false },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-black ${stat.up ? 'text-green' : 'text-amber-400'}`}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-display font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by transaction ID, user, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchStats} className="rounded-xl border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] text-white hover:bg-white/5">
              <Clock className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type / Method</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-gray-500 text-sm">No transactions found</td>
                  </tr>
                ) : filteredTransactions.map((txn: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-black text-white uppercase">{txn.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-white">{txn.user}</div>
                    </td>
                    <td className={`px-8 py-6 text-sm font-black ${txn.amount.startsWith('-') ? 'text-red-400' : 'text-green'}`}>
                      {txn.amount}
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-gray-400">{txn.type}</div>
                      <div className="text-[10px] text-gray-600 font-medium uppercase tracking-tight">{txn.method}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                        txn.status === 'Success' ? 'bg-green/10 text-green' : 
                        txn.status === 'Pending' ? 'bg-amber-400/10 text-amber-400' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-gray-500 font-bold uppercase">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
