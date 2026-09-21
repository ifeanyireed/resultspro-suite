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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Universal Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Cleared Balance</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><WalletIcon className="w-4 h-4" /></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">₦450,000</h2>
            <p className="text-xs text-emerald-600 font-medium">+₦45,000 this month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Escrow</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><BanknotesIcon className="w-4 h-4" /></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">₦24,500</h2>
            <p className="text-xs text-orange-600 font-medium">Awaiting cycle clearance</p>
          </div>
        </div>

        {/* Dynamic Cards based on Model */}
        {payoutModel === 'BASE_PLUS_SLA' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Review Time</h3>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><ClockIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">14 hours</h2>
                <p className="text-xs text-gray-500 font-medium">Keep under 24h for SLA bonus</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Student Satisfaction</h3>
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><StarIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">4.8 / 5.0</h2>
                <p className="text-xs text-purple-600 font-medium">Top 10% of mentors</p>
              </div>
            </div>
          </>
        )}

        {payoutModel === 'PAY_PER_ACTION' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Completed Actions</h3>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><CheckCircleIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">45 <span className="text-lg font-medium text-gray-400">Reviews</span></h2>
                <p className="text-xs text-gray-500 font-medium">+4 Live Classes held</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Available Bounties</h3>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><CurrencyDollarIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">₦12,500</h2>
                <p className="text-xs text-indigo-600 font-medium">Value of pending review queue</p>
              </div>
            </div>
          </>
        )}

        {payoutModel === 'REVENUE_SHARE' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Active Mentees</h3>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><UserGroupIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">124</h2>
                <p className="text-xs text-gray-500 font-medium">Across all assigned cohorts</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">Cohort Completion</h3>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><ChartBarIcon className="w-4 h-4" /></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">82%</h2>
                <p className="text-xs text-emerald-600 font-medium">High retention rate secured</p>
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
            {/* Mock Rows */}
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
