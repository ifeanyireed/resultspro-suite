import React, { useState, useEffect } from 'react';
import { Banknote, TrendingUp, CreditCard, ArrowDownToLine, Search, Download, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { fetchExamproFinancials } from '@/lib/api';
import toast from 'react-hot-toast';

export default function FinancialsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchExamproFinancials();
      setData(result || { summary: {}, transactions: [] });
    } catch (err) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'failed': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'failed': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const transactions = data?.transactions || [];
  const summary = data?.summary || { mtdRevenue: 0, avgTransaction: 0, pendingPayouts: 0 };
  
  const filteredTransactions = transactions.filter((t: any) => 
    t.user?.toLowerCase().includes(search.toLowerCase()) || 
    t.id?.toLowerCase().includes(search.toLowerCase()) ||
    t.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-500" /> Financial Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">Monitor revenue, coin purchases, and withdrawal payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCwIcon loading={loading} /> Refresh Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold hover:bg-indigo-100 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Banknote className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">MTD Revenue</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(summary.mtdRevenue)}</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <CreditCard className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Transaction</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(summary.avgTransaction)}</h3>
          <p className="text-xs font-medium text-slate-500 mt-2">Across all successful payments</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ArrowDownToLine className="w-16 h-16 text-amber-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(summary.pendingPayouts)}</h3>
          <p className="text-xs font-medium text-slate-500 mt-2">Awaiting admin approval</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search user, ID or pack..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <Banknote className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">No transactions found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Pack Type</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Gateway</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-[11px] font-bold text-slate-500">{t.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{t.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-800">{t.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-500">{t.method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(t.status)}`}>
                        {getStatusIcon(t.status)}
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-500">
                        {new Date(t.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function RefreshCwIcon({ loading }: { loading: boolean }) {
  return (
    <svg 
      className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} 
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
