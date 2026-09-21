"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { 
  BanknotesIcon, 
  WalletIcon, 
  ClockIcon, 
  StarIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function MentorEarnings() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['mentor-profile-earnings'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
      </div>
    );
  }

  const payoutsEnabled = profile?.payouts_enabled ?? true;
  const payoutModel = profile?.payout_model || 'BASE_PLUS_SLA';

  if (!payoutsEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BanknotesIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Earnings Managed Externally</h2>
        <p className="text-gray-500 text-sm max-w-md text-center">
          Your organization has chosen to handle mentor payouts and earnings off-platform. 
          Please contact your administrator for details on your compensation.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Track your mentor bounties and payouts.</p>
        </div>
        <button className="px-4 py-2 bg-[#146ef5] text-white text-sm font-medium rounded-lg hover:bg-[#105bd1] transition-colors shadow-sm">
          Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {/* Universal Cards */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Cleared Balance</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><WalletIcon className="w-4 h-4" strokeWidth={2} /></div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">₦450k</h2>
            <p className="text-xs text-blue-100 font-medium">+₦45k this month</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Pending Escrow</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><BanknotesIcon className="w-4 h-4" strokeWidth={2} /></div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">₦24.5k</h2>
            <p className="text-xs text-orange-500 font-medium">Awaiting clearance</p>
          </div>
        </div>

        {/* Dynamic Cards based on Model */}
        {payoutModel === 'BASE_PLUS_SLA' && (
          <>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Review Time</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><ClockIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">14h</h2>
                <p className="text-xs text-gray-500 font-medium">Keep under 24h for bonus</p>
              </div>
            </div>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Satisfaction</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><StarIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">4.8</h2>
                <p className="text-xs text-gray-500 font-medium">Average student rating</p>
              </div>
            </div>
          </>
        )}

        {payoutModel === 'PAY_PER_ACTION' && (
          <>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Graded</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><CheckCircleIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">45</h2>
                <p className="text-xs text-gray-500 font-medium">+4 Live Classes held</p>
              </div>
            </div>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Bounties</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><CurrencyDollarIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">₦12.5k</h2>
                <p className="text-xs text-gray-500 font-medium">Value of pending queue</p>
              </div>
            </div>
          </>
        )}

        {payoutModel === 'REVENUE_SHARE' && (
          <>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Mentees</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><UserGroupIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">124</h2>
                <p className="text-xs text-gray-500 font-medium">Across all assigned cohorts</p>
              </div>
            </div>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Retention</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><ChartBarIcon className="w-4 h-4" strokeWidth={2} /></div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">82%</h2>
                <p className="text-xs text-gray-500 font-medium">High retention rate secured</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Earning History</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 20, 2026</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">Reviewed 10 Assignments (Python Module)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">+₦5,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Cleared</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 18, 2026</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">Hosted Live Class (Cohort A)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">+₦15,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Cleared</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 01, 2026</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">Base Stipend (September)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">+₦100,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Cleared</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
