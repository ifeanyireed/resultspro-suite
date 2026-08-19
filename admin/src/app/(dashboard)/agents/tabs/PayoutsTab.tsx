import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState([
    {
      id: 'pay-1',
      agent: 'Chinedu Okafor',
      email: 'chinedu@resultspro.ng',
      amount: 75000,
      bank: 'Zenith Bank',
      accountNum: '1029384756',
      status: 'PENDING',
      requestedAt: '2026-08-16 14:20',
    },
    {
      id: 'pay-2',
      agent: 'Folake Adeleke',
      email: 'folake@resultspro.ng',
      amount: 120000,
      bank: 'Access Bank',
      accountNum: '0039281745',
      status: 'PENDING',
      requestedAt: '2026-08-17 09:15',
    },
    {
      id: 'pay-3',
      agent: 'Emeka Nwosu',
      email: 'emeka@resultspro.ng',
      amount: 45000,
      bank: 'GTBank',
      accountNum: '0128475839',
      status: 'PENDING',
      requestedAt: '2026-08-18 06:45',
    },
  ]);

  const handleAction = (id: string, newStatus: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {payouts.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{p.agent}</h4>
                <p className="text-xs text-slate-500">{p.email}</p>
              </div>
              <Badge status={p.status} />
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Withdrawal Amount:</span>
                <span className="font-bold text-base text-slate-900">₦{p.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Destination:</span>
                <span className="font-semibold text-slate-800">{p.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono font-medium text-slate-800 text-xs">{p.accountNum}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Requested:</span>
                <span>{p.requestedAt}</span>
              </div>
            </div>

            {p.status === 'PENDING' ? (
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => handleAction(p.id, 'PAID')}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-full font-bold text-[11px] hover:bg-emerald-600 transition-all shadow-sm hover:shadow-emerald-500/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize & Mark Paid</span>
                </button>
                <button
                  onClick={() => handleAction(p.id, 'REJECTED')}
                  className="px-4 py-2 bg-rose-500 text-white rounded-full font-bold text-[11px] hover:bg-rose-600 transition-all shadow-sm hover:shadow-rose-500/30 flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs font-semibold text-slate-500">
                Status: {p.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
