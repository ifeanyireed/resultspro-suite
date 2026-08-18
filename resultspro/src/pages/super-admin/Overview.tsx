import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { TrendingUp, Users, Building2, DollarSign, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from '@/lib/hugeicons-compat';
import api from '@/lib/api';

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  isCurrency?: boolean;
}

const SuperAdminOverview: React.FC = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [stats, setStats] = useState<StatCard[]>([
    {
      label: 'Total Schools',
      value: '0',
      change: 0,
      icon: Building2,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Commissions',
      value: '0',
      change: 0,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      isCurrency: true
    },
    {
      label: 'Pending Verification',
      value: '0',
      change: 0,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Total Agents',
      value: '0',
      change: 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, schoolsRes] = await Promise.all([
        api.get('/super-admin/overview/stats'),
        api.get('/super-admin/schools', { params: { limit: 5 } }),
      ]);

      const data = statsRes.data.data;
      const schoolsList = schoolsRes.data.data || [];

      setSchools(schoolsList);
      setStats([
        {
          label: 'Total Schools',
          value: data.totalSchools.toString(),
          change: 0,
          icon: Building2,
          color: 'from-blue-500 to-blue-600'
        },
        {
          label: 'Total Commissions',
          value: data.totalCommission.toString(),
          change: 0,
          icon: DollarSign,
          color: 'from-green-500 to-green-600',
          isCurrency: true
        },
        {
          label: 'Pending Verification',
          value: data.pendingSchools.toString(),
          change: 0,
          icon: AlertCircle,
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          label: 'Total Agents',
          value: data.totalAgents.toString(),
          change: 0,
          icon: TrendingUp,
          color: 'from-purple-500 to-purple-600'
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your system today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <div
                key={idx}
                className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-2">
                  {stat.isCurrency ? '₦' : ''}{Number(stat.value).toLocaleString()}
                </p>
                {stat.change !== 0 && (
                  <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUp className="w-3 h-3 inline mr-1" /> : <ArrowDown className="w-3 h-3 inline mr-1" />}
                    {Math.abs(stat.change)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Schools */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-all duration-300">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Schools</h2>
              <a href="/super-admin/schools" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View all →
              </a>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading schools...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School Name</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Tier</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">No schools found</td>
                    </tr>
                  ) : (
                    schools.map((school) => (
                      <tr key={school.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-white font-medium">
                          <div>{school.name}</div>
                          <div className="text-xs text-gray-500 font-normal">{school.contactEmail}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            school.status === 'APPROVED' || school.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' :
                            school.status === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {school.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400">{school.subscriptionTier || 'Free'}</td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{new Date(school.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/super-admin/verifications"
            className="p-6 rounded-[20px] border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all"
          >
            <AlertCircle className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="text-white font-bold mb-1">Review Verifications</h4>
            <p className="text-gray-400 text-sm">Check pending schools</p>
          </a>

          <a
            href="/super-admin/agents"
            className="p-6 rounded-[20px] border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all"
          >
            <Users className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="text-white font-bold mb-1">Manage Agents</h4>
            <p className="text-gray-400 text-sm">View and manage agents</p>
          </a>

          <a
            href="/super-admin/support-staff"
            className="p-6 rounded-[20px] border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all"
          >
            <TrendingUp className="w-6 h-6 text-green-400 mb-3" />
            <h4 className="text-white font-bold mb-1">Support Team</h4>
            <p className="text-gray-400 text-sm">Manage support staff</p>
          </a>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminOverview;
