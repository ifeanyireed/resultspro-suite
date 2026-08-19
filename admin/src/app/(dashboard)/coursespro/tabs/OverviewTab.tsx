import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Layers, GraduationCap, ArrowUp, ArrowDown, AlertCircle, ArrowRight } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);

  const stats: StatCard[] = [
    {
      label: 'Active Cohorts',
      value: '42',
      change: 5,
      icon: Layers,
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      label: 'Total Enrollments',
      value: '18,500',
      change: 12,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Completion Rate',
      value: '84%',
      change: -2,
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'Active Mentors',
      value: '156',
      change: 8,
      icon: GraduationCap,
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
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="group p-6 bg-orange-50/50 border border-orange-200 rounded-2xl hover:bg-orange-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">New Cohort</h4>
            <p className="text-xs text-slate-500 mt-1">Create a new learning cohort</p>
          </div>
          <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Review Enrollments</h4>
            <p className="text-xs text-slate-500 mt-1">Approve pending enrollments</p>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-purple-50/50 border border-purple-200 rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Mentor Applications</h4>
            <p className="text-xs text-slate-500 mt-1">Review new mentor requests</p>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
