import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { fetchAgentPayouts } from '@/lib/api';

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState<any[]>([]);

  React.useEffect(() => {
    fetchAgentPayouts().then(setPayouts);
  }, []);

  const handleAction = (id: string, newStatus: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent Info</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Bank Details</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Requested At</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No payout requests pending</td>
              </tr>
            ) : (
              payouts.map((req) => (
                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{req.account_name}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{req.agent_id.substring(0,8)}...</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₦{req.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">{req.bank_name}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{req.account_number}</p>
                  </td>
                  <td className="px-6 py-4"><Badge status={req.status} /></td>
                  <td className="px-6 py-4 text-slate-500">{new Date(req.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleAction(req.id, 'APPROVED')} className="text-emerald-500 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                          <CheckCircle2 size={14}/> Approve
                        </button>
                        <button onClick={() => handleAction(req.id, 'REJECTED')} className="text-rose-500 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded">
                          <XCircle size={14}/> Reject
                        </button>
                      </div>
                    )}
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
