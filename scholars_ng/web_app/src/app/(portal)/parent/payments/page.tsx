'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function ParentPaymentsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    api.get('/v1/campus/fees')
      .then((res) => {
        setInvoices(res.data?.invoices || []);
      })
      .catch((err) => console.error('Failed to load parent fee invoices:', err));
  }, []);

  const totalOutstanding = invoices.reduce((acc, inv) => acc + Number(inv.balance_due || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + Number(inv.amount_paid || 0), 0);

  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments & Fees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tuition, outstanding balances, and receipts.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          Make a Payment
        </button>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Outstanding</h3>
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-orange-500 mb-2">₦{totalOutstanding.toLocaleString()}</h2>
            <p className="text-xs text-gray-500">Live Bursary Balance</p>
          </div>
        </MotionRise>
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Paid (YTD)</h3>
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-gray-900 mb-2">₦{totalPaid.toLocaleString()}</h2>
            <p className="text-xs text-gray-500">2026/2027 Academic Year</p>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.08} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Payment & Invoice History</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv, i) => (
              <tr key={inv.id || i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {inv.term_name} Tuition · {inv.student_name} ({inv.invoice_no})
                </td>
                <td className="px-6 py-4 font-medium">₦{Number(inv.total_billed || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{inv.due_date || 'Current Term'}</td>
                <td className="px-6 py-4 text-right">
                  {inv.status === 'PAID' && (
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionRise>
    </>
  );
}
