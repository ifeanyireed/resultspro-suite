import React from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Download01, TrendingUp } from '@/lib/hugeicons-compat';

const Analytics: React.FC = () => {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-gray-400">Platform-wide metrics and performance reports</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium">
            <Download01 className="w-5 h-5" />
            Download Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '45,892', trend: '+12.5%' },
            { label: 'Total Schools', value: '1,234', trend: '+8.2%' },
            { label: 'Avg. Revenue/School', value: '₦42.5K', trend: '+15.3%' },
            { label: 'Monthly Growth', value: '23.5%', trend: '+4.1%' }
          ].map((metric, idx) => (
            <div key={idx} className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-green-400 text-xs font-semibold">{metric.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((idx) => (
            <div key={idx} className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all duration-300">
              <h3 className="text-lg font-bold mb-6">Monthly Metrics {idx}</h3>
              <div className="h-64 flex items-end justify-around gap-2">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                    <span className="text-xs text-gray-400">M{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Analytics;