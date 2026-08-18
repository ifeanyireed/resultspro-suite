import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { TrendingUp, Users, Building2, DollarSign, ArrowUp, ArrowDown, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: any;
  color: string;
  isCurrency?: boolean;
}

export default function OverviewTab() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stats: StatCard[] = [
    {
      label: 'Total Schools',
      value: '24',
      change: 12,
      icon: Building2,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      label: 'Total Commissions',
      value: '1450000',
      change: 8.5,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      isCurrency: true
    },
    {
      label: 'Pending Verification',
      value: '5',
      change: -2,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'Total Agents',
      value: '38',
      change: 4,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  useEffect(() => {
    setLoading(false);
    setSchools([
      { id: '1', name: 'Greenwood High', contactEmail: 'info@greenwood.edu.ng', status: 'ACTIVE', subscriptionTier: 'PRO', createdAt: '2026-08-10' },
      { id: '2', name: 'Kings College Lagos', contactEmail: 'admin@kingscollege.edu.ng', status: 'PENDING_VERIFICATION', subscriptionTier: 'BASIC', createdAt: '2026-08-15' },
      { id: '3', name: 'Queens College Yaba', contactEmail: 'contact@qcyaba.edu.ng', status: 'ACTIVE', subscriptionTier: 'ENTERPRISE', createdAt: '2026-08-17' },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change !== 0 && (
                  <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{Math.abs(stat.change)}%</span>
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.isCurrency ? '₦' : ''}{Number(stat.value).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="group p-6 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Review Verifications</h4>
            <p className="text-xs text-slate-500 mt-1">Check pending schools</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-purple-50/50 border border-purple-200 rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Manage Agents</h4>
            <p className="text-xs text-slate-500 mt-1">View and manage agents</p>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Support Team</h4>
            <p className="text-xs text-slate-500 mt-1">Manage support staff</p>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Recent Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-800">Recent Schools</h2>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School Name</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-500">Loading schools...</td>
                </tr>
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-500">No schools found</td>
                </tr>
              ) : (
                schools.map((school) => (
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
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">
                      {new Date(school.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
