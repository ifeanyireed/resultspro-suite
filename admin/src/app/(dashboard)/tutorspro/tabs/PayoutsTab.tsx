import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Search, RefreshCw, DollarSign, Building } from 'lucide-react';
import { fetchTutorsproPayouts } from '@/lib/api';

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTutorsproPayouts();
      setPayouts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search payout requests..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Tutor ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Bank Details</th>
              <th className="px-4 py-3">Date Requested</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                  {p.tutor_id}
                </td>
                <td className="px-4 py-3.5 font-bold text-emerald-600">
                  {p.currency} {p.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{p.account_name}</span>
                    <span className="flex items-center gap-1 text-slate-500"><Building className="w-3 h-3" /> {p.bank_name}</span>
                    <span className="text-slate-500 font-mono">{p.account_number}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3.5">
                  <Badge status={p.status} />
                </td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  {p.status === 'PENDING' ? (
                    <button className="px-2.5 py-1 bg-blue-600 text-white rounded-full font-semibold text-[11px] hover:bg-blue-700 whitespace-nowrap">
                      Approve & Mark Paid
                    </button>
                  ) : (
                    <span className="text-slate-400">Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {payouts.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No payout requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
