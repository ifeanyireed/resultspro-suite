"use client";

import React from 'react';
import { 
  BanknotesIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function LedgerPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ledger & Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Track your earnings, bounties, and withdrawal history.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Request Withdrawal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Balance */}
        <div className="bg-[#111827] rounded-[1.5rem] p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg h-[160px]">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,20 Q25,10 50,30 T100,20 L100,100 L0,100 Z" fill="#146ef5" />
              <path d="M0,40 Q25,30 50,50 T100,40 L100,100 L0,100 Z" fill="#0e4aad" opacity="0.6" />
              <path d="M0,60 Q25,50 50,70 T100,60 L100,100 L0,100 Z" fill="#0a3273" opacity="0.8" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-300 relative z-10">Available for Withdrawal</h3>
          <div className="relative z-10 mt-auto">
            <div className="text-4xl font-medium tracking-wider mb-1 font-mono">₦150,000</div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-600 text-sm font-medium">Total Lifetime Earnings</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5]">
              <BanknotesIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">₦450,000</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> +12%</div>
              <span>vs last year</span>
            </div>
          </div>
        </div>

        {/* Pending Clearing */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-600 text-sm font-medium">Pending Verification</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">₦50,000</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Clears in 3-5 business days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
          <button className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 font-semibold border-b border-gray-100">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 text-gray-500">Nov 20, 2024</td>
                <td className="p-4 font-medium text-gray-900">Greenwood High Onboarding</td>
                <td className="p-4 text-gray-500">Bounty</td>
                <td className="p-4 font-medium text-[#146ef5]">+₦50,000</td>
                <td className="p-4 pr-6"><span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-md">Pending</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 text-gray-500">Nov 15, 2024</td>
                <td className="p-4 font-medium text-gray-900">Withdrawal to GTBank</td>
                <td className="p-4 text-gray-500">Payout</td>
                <td className="p-4 font-medium text-gray-900">-₦100,000</td>
                <td className="p-4 pr-6"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">Completed</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 text-gray-500">Nov 10, 2024</td>
                <td className="p-4 font-medium text-gray-900">Wholesale PINs (Standard)</td>
                <td className="p-4 text-gray-500">Purchase</td>
                <td className="p-4 font-medium text-gray-900">-₦80,000</td>
                <td className="p-4 pr-6"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">Completed</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 text-gray-500">Nov 05, 2024</td>
                <td className="p-4 font-medium text-gray-900">Excel Academy Onboarding</td>
                <td className="p-4 text-gray-500">Bounty</td>
                <td className="p-4 font-medium text-[#146ef5]">+₦50,000</td>
                <td className="p-4 pr-6"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
