import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { TrendingUp, Users, Building2, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';
import Link from 'next/link';

export default function OverviewTab() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setSchools([
      { id: '1', name: 'Greenwood High', contactEmail: 'info@greenwood.edu.ng', status: 'ACTIVE', subscriptionTier: 'PRO', createdAt: '2026-08-10' },
      { id: '2', name: 'Kings College Lagos', contactEmail: 'admin@kingscollege.edu.ng', status: 'PENDING_VERIFICATION', subscriptionTier: 'BASIC', createdAt: '2026-08-15' },
      { id: '3', name: 'Queens College Yaba', contactEmail: 'contact@qcyaba.edu.ng', status: 'ACTIVE', subscriptionTier: 'ENTERPRISE', createdAt: '2026-08-17' },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <GradientMetricCard
          title="Total Commissions"
          value="₦1.45M"
          subtitle="Agent network payouts"
          trend="+8.5%"
          icon={DollarSign}
        />
        <WhiteMetricCard
          title="Total Schools"
          value="24"
          subtitle="Active on ResultPRO"
          trend="+12%"
          trendColor="green"
          icon={Building2}
        />
        <WhiteMetricCard
          title="Total Agents"
          value="38"
          subtitle="Field partners"
          trend="+4%"
          trendColor="green"
          icon={TrendingUp}
        />
        <WhiteMetricCard
          title="Pending Verify"
          value="5"
          subtitle="Awaiting checks"
          trend="-2%"
          trendColor="red"
          icon={AlertCircle}
        />
      </div>

      {/* Lower Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8 flex flex-col gap-3">
          <WidgetCard title="Recent Schools">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School Name</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-xs text-slate-500">Loading schools...</td>
                    </tr>
                  ) : schools.map((school) => (
                    <tr key={school.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 text-xs">{school.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">{school.contactEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={school.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={school.subscriptionTier || 'FREE'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetCard>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <WidgetCard title="Quick Actions">
            <div className="flex flex-col gap-4">
              <button className="group p-4 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Review Verifications</h4>
                  <p className="text-xs text-slate-500 mt-1">Check pending schools</p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
              </button>

              <button className="group p-4 bg-purple-50/50 border border-purple-200 rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Manage Agents</h4>
                  <p className="text-xs text-slate-500 mt-1">View network partners</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </button>

              <button className="group p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Support Team</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage support staff</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
