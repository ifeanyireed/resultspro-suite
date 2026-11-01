'use client';

import React from 'react';
import { 
  CreditCardIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function ParentPaymentsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments & Fees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tuition, outstanding balances, and receipts.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          Make a Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Outstanding</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-orange-500 mb-2">₦45,000</h2>
            <p className="text-xs text-gray-500">Due on Oct 25</p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Total Paid (YTD)</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">₦250,000</h2>
            <p className="text-xs text-gray-500">2026/2027 Academic Year</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { desc: 'Term 1 Tuition', amount: '₦150,000', status: 'Paid', date: 'Sep 01', color: 'emerald' },
              { desc: 'Future Skills (Courses)', amount: '₦50,000', status: 'Paid', date: 'Sep 05', color: 'emerald' },
              { desc: 'Transport Bus Fee', amount: '₦50,000', status: 'Paid', date: 'Sep 05', color: 'emerald' },
              { desc: 'Term 2 Tuition (Installment 1)', amount: '₦45,000', status: 'Pending', date: 'Oct 25', color: 'orange' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.desc}</td>
                <td className="px-6 py-4 font-medium">{p.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold bg-${p.color}-50 text-${p.color}-600`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
                <td className="px-6 py-4 text-right">
                  {p.status === 'Paid' && (
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
