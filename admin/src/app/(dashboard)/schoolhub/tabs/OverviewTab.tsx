import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Palette, Cloud, ArrowUp, ArrowDown, AlertCircle, ArrowRight } from 'lucide-react';

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
      label: 'Active Tenants',
      value: '142',
      change: 18,
      icon: Building2,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      label: 'Verification Queue',
      value: '15',
      change: -4,
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: 'Custom Domains',
      value: '84',
      change: 12,
      icon: Cloud,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      label: 'Branded Themes',
      value: '120',
      change: 5,
      icon: Palette,
      color: 'text-pink-600 bg-pink-50 border-pink-200'
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
          className="group p-6 bg-blue-50/50 border border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Provision Tenant</h4>
            <p className="text-xs text-slate-500 mt-1">Setup a new school instance</p>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">KYC Verifications</h4>
            <p className="text-xs text-slate-500 mt-1">Review pending tenant approvals</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
        </button>

        <button
          className="group p-6 bg-pink-50/50 border border-pink-200 rounded-2xl hover:bg-pink-50 transition-colors flex items-center justify-between text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <Palette className="w-5 h-5 text-pink-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Platform Branding</h4>
            <p className="text-xs text-slate-500 mt-1">Manage global theme configurations</p>
          </div>
          <ArrowRight className="w-5 h-5 text-pink-400 group-hover:text-pink-600 transition-colors transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
