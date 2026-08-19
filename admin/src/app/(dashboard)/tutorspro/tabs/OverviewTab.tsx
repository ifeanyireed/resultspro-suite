import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { TrendingUp, Users, GraduationCap, DollarSign, ArrowUp, ArrowDown, AlertCircle, ArrowRight } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  const stats: StatCard[] = [
    {
      label: 'Total Tutors',
      value: '1,248',
      change: 15,
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      label: 'Total Payouts',
      value: '4500000',
      change: 12.5,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      isCurrency: true
    },
    {
      label: 'Pending Approval',
      value: '24',
      change: -5,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'Active Bookings',
      value: '342',
      change: 8,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
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
                  {stat.isCurrency ? '₦' : ''}{Number(stat.value.replace(/,/g, '')).toLocaleString()}
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
            <h4 className="font-bold text-slate-800 text-sm">Review Tutors</h4>
            <p className="text-xs text-slate-500 mt-1">Check pending tutor verifications</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Process Payouts</h4>
            <p className="text-xs text-slate-500 mt-1">Review pending tutor payouts</p>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-blue-50/50 border border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Manage Disputes</h4>
            <p className="text-xs text-slate-500 mt-1">Resolve booking disputes</p>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
