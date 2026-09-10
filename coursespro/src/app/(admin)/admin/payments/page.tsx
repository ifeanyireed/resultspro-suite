'use client';

import React from 'react';
import { 
  ArrowUpRightIcon,
  CreditCardIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function PaymentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Payments Console</h2>
          <p className="text-sm text-gray-500 mt-1">Subscriptions, scholarships, and revenue.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <DocumentArrowDownIcon className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[1.5rem] p-6 shadow-sm shadow-emerald-500/20 flex flex-col justify-between aspect-video relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-900 rounded-full filter blur-[3rem] opacity-40"></div>
          
          <h3 className="text-xl font-normal text-white z-10">MRR</h3>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">₦4.2M</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> 12%</div>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Active Subs</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">120</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Paid learners</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-video group hover:-translate-y-1 transition-transform">
          <h3 className="text-xl font-normal text-gray-900">Dunning Risk</h3>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-orange-500 mb-2">3</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Cards expiring soon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <CreditCardIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">Student Name {i}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">₦50,000</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Today, 10:42 AM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
