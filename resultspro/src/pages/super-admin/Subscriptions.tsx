import React from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { AlertCircle } from '@/lib/hugeicons-compat';

const SubscriptionsManagement: React.FC = () => {
  const subscriptions = [
    { id: 1, school: 'Lagos Central High School', plan: 'Enterprise', startDate: '2024-01-15', endDate: '2025-01-14', amount: 600000, status: 'active' },
    { id: 2, school: 'Kano Educational Institute', plan: 'Enterprise', startDate: '2024-02-05', endDate: '2025-02-04', amount: 600000, status: 'active' },
    { id: 3, school: 'Abuja International School', plan: 'Pro', startDate: '2024-02-20', endDate: '2025-02-19', amount: 180000, status: 'active' },
    { id: 4, school: 'Port Harcourt Academy', plan: 'Pro', startDate: '2024-03-25', endDate: '2024-06-25', amount: 45000, status: 'active' },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Subscriptions Management</h1>
          <p className="text-gray-400">Active subscriptions, renewals, and billing information</p>
        </div>

        {/* Subscription Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Subscriptions', value: '1,234', color: 'from-green-500 to-green-600' },
            { label: 'Expiring Soon', value: '45', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Due for Renewal', value: '12', color: 'from-red-500 to-red-600' }
          ].map((stat, idx) => (
            <div key={idx} className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden hover:bg-white/5 transition-all duration-300">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
            <h2 className="text-xl font-bold">Active Subscriptions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Plan</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Start Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">End Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-medium">{sub.school}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{sub.startDate}</td>
                    <td className="py-4 px-6 text-gray-400">{sub.endDate}</td>
                    <td className="py-4 px-6 text-white font-bold">₦{sub.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SubscriptionsManagement;