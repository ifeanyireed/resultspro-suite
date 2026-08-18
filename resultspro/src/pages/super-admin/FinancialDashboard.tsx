import React from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Download01, Filter, TrendingUp } from '@/lib/hugeicons-compat';

const FinancialDashboard: React.FC = () => {
  const transactions = [
    { id: 1, school: 'Lagos Central High School', amount: 500000, type: 'subscription', date: '2024-02-15', status: 'completed' },
    { id: 2, school: 'Abuja International School', amount: 150000, type: 'subscription', date: '2024-02-14', status: 'completed' },
    { id: 3, school: 'Kano Educational Institute', amount: 450000, type: 'subscription', date: '2024-02-13', status: 'completed' },
    { id: 4, school: 'Port Harcourt Academy', amount: 120000, type: 'subscription', date: '2024-02-12', status: 'pending' },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-gray-400">Revenue, transactions, and subscription analytics</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium">
            <Download01 className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue', value: '₦52.4M', trend: '+28.5%', color: 'from-green-500 to-green-600' },
            { label: 'This Month', value: '₦8.2M', trend: '+15.3%', color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', value: '₦1.2M', trend: '3 schools', color: 'from-orange-500 to-orange-600' }
          ].map((stat, idx) => (
            <div key={idx} className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-green-400 text-sm font-semibold">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden hover:bg-white/5 transition-all duration-300">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Type</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-medium">{tx.school}</td>
                    <td className="py-4 px-6 text-white font-bold">₦{(tx.amount || 0).toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-400 capitalize">{tx.type}</td>
                    <td className="py-4 px-6 text-gray-400">{tx.date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {tx.status === 'completed' ? 'Completed' : 'Pending'}
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

export default FinancialDashboard;
