'use client';

import React, { useEffect, useState } from 'react';
import { dashboardStyles as styles } from '@resultspro/design-system';
import { Building2, Users, CreditCard, Briefcase, TrendingUp, FileCheck2, Sparkles } from 'lucide-react';
import { fetchSuiteStats, fetchSchools, fetchPayoutRequests } from '@/lib/api';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';
import { SuiteStats, School, PayoutRequest } from '@/lib/types';
import Link from 'next/link';

import { Header } from '@/components/Header';

export default function OverviewPage() {
  const [stats, setStats] = useState<SuiteStats | null>(null);
  const [recentSchools, setRecentSchools] = useState<School[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [s, schools, payouts] = await Promise.all([
        fetchSuiteStats(),
        fetchSchools(),
        fetchPayoutRequests(),
      ]);
      setStats(s);
      setRecentSchools(schools.slice(0, 5));
      setPendingPayouts(payouts.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="w-full">
      <Header
        title="Suite Executive Overview"
        subtitle="Live cross-microservice telemetrics and control hub"
      />
      <div className="flex flex-col gap-6">
        {/* Top-Level KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <GradientMetricCard
            title="Suite Revenue"
            value={`₦${((stats?.totalRevenue ?? 0) / 1000).toLocaleString()}k`}
            subtitle="Total revenue across all modules"
            trend={stats?.totalRevenue ? "+18.4%" : "0.0%"}
            icon={TrendingUp}
          />
          <WhiteMetricCard
            title="Total Schools"
            value={stats?.totalSchools ?? 0}
            subtitle="Verified tenants in network"
            trend={stats?.totalSchools ? "+12%" : "0%"}
            trendColor="green"
            icon={Building2}
          />
          <WhiteMetricCard
            title="Universal Users"
            value={(stats?.totalUsers ?? 0).toLocaleString()}
            subtitle="Students, Teachers, Parents"
            trend={stats?.totalUsers ? "+5%" : "0%"}
            trendColor="green"
            icon={Users}
          />
          <WhiteMetricCard
            title="Active Agents"
            value={(stats?.activeAgents ?? 0).toLocaleString()}
            subtitle="Registered field partners"
            trend={stats?.activeAgents ? "+2%" : "0%"}
            trendColor="green"
            icon={Briefcase}
          />
        </div>

        {/* Lower Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-9 flex flex-col gap-3">
            
            {/* Top Row of Left Side */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
              {/* Analytics Bar Chart */}
              <div className="lg:col-span-6 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-xl font-normal text-gray-900 mb-6">Suite Analytics</h3>
                <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2">
                  {[
                    { h: '60%', type: 'stripe' },
                    { h: '80%', type: 'solid-dark' },
                    { h: '65%', type: 'solid-light', tooltip: '₦2.4M' },
                    { h: '90%', type: 'solid-dark' },
                    { h: '70%', type: 'stripe' },
                    { h: '45%', type: 'stripe' },
                    { h: '55%', type: 'stripe' },
                  ].map((bar, i) => (
                    <div key={i} className="w-[12%] flex flex-col items-center gap-3">
                      <div className="w-full relative flex items-end h-[140px]">
                        {bar.tooltip && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-sm text-xs font-bold px-2 py-1 rounded">
                            {bar.tooltip}
                          </div>
                        )}
                        <div 
                          className={`w-full rounded-full transition-all hover:opacity-80 ${
                            bar.type === 'solid-dark' ? 'bg-[#146ef5]' : 
                            bar.type === 'solid-light' ? 'bg-[#6ba0f5]' : 
                            'bg-gray-100'
                          }`}
                          style={{ 
                            height: bar.h,
                            backgroundImage: bar.type === 'stripe' ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, #d1d5db 5px, #d1d5db 7px)' : 'none'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        {['S','M','T','W','T','F','S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health / Reminders */}
              <div className="lg:col-span-3 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
                <div>
                  <h3 className="text-xl font-normal text-gray-900 mb-6">System Status</h3>
                  <h4 className="text-xl font-normal text-gray-900 leading-tight mb-2">All Services<br/>Operational</h4>
                  <p className="text-sm text-gray-500 mb-8 flex items-center gap-2">
                    Uptime : 99.99%
                  </p>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
                  View Logs
                </button>
              </div>
            </div>

            {/* Bottom Row of Left Side */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
              <div className="lg:col-span-5 h-full">
                <WidgetCard title="ResultPRO Pulse">
                  <div className="flex flex-col items-center justify-center py-6 h-full">
                    <FileCheck2 size={40} className="text-blue-600 mb-4" />
                    <div className="text-5xl font-bold text-gray-900">{(stats?.totalSchools ? stats.totalSchools * 4 : 0).toLocaleString()}</div>
                    <p className="text-gray-500 mt-2">Term results published</p>
                    <Link href="/resultspro" className="mt-6 bg-blue-50 text-blue-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-100 transition-colors">
                      Open Control Center
                    </Link>
                  </div>
                </WidgetCard>
              </div>
              <div className="lg:col-span-4 h-full">
                <WidgetCard title="ExamsPRO Pulse">
                  <div className="flex flex-col items-center justify-center py-6 h-full">
                    <Sparkles size={40} className="text-purple-600 mb-4" />
                    <div className="text-5xl font-bold text-gray-900">{(stats?.cbtExamsCount ?? 0).toLocaleString()}</div>
                    <p className="text-gray-500 mt-2">CBT Exams taken today</p>
                    <Link href="/exampro" className="mt-6 bg-purple-50 text-purple-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-purple-100 transition-colors">
                      Open Control Center
                    </Link>
                  </div>
                </WidgetCard>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 flex flex-col gap-3">
            {/* Action Required */}
            <WidgetCard title="Action Required">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Payouts</h4>
                {pendingPayouts.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending payouts.</p>
                ) : (
                  pendingPayouts.map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{p.account_name}</p>
                        <p className="text-xs text-gray-500">{p.bank_name} • {p.account_number}</p>
                      </div>
                      <p className="font-bold text-orange-500">₦{p.amount.toLocaleString()}</p>
                    </div>
                  ))
                )}

                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6">Recent Registrations</h4>
                {recentSchools.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent registrations.</p>
                ) : (
                  recentSchools.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{s.subscription_tier?.toLowerCase() || 'Free'} Tier • {s.verification_status?.toLowerCase()}</p>
                      </div>
                      <p className="font-bold text-gray-400">
                        {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  );
}
