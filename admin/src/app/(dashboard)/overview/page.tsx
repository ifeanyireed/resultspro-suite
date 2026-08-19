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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <GradientMetricCard
            title="Suite Revenue"
            value={`₦${((stats?.totalRevenue || 24500000) / 1000000).toFixed(1)}M`}
            subtitle="Total revenue across all modules"
            trend="+18.4%"
            icon={TrendingUp}
          />
          <WhiteMetricCard
            title="Total Schools"
            value={stats?.totalSchools || 142}
            subtitle="Verified tenants in network"
            trend="+12%"
            trendColor="green"
            icon={Building2}
          />
          <WhiteMetricCard
            title="Universal Users"
            value={stats?.totalUsers ? stats.totalUsers.toLocaleString() : '4,850'}
            subtitle="Students, Teachers, Parents"
            trend="+5%"
            trendColor="green"
            icon={Users}
          />
        </div>

        {/* Lower Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Microservices Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <WidgetCard title="ResultPRO Pulse">
                <div className="flex flex-col items-center justify-center py-4">
                  <FileCheck2 size={40} className="text-blue-600 mb-4" />
                  <div className="text-5xl font-bold text-gray-900">12,450</div>
                  <p className="text-gray-500 mt-2">Term results published</p>
                  <Link href="/resultspro" className="mt-6 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-100 transition-colors">
                    Open Control Center
                  </Link>
                </div>
              </WidgetCard>
              <WidgetCard title="ExamsPRO Pulse">
                <div className="flex flex-col items-center justify-center py-4">
                  <Sparkles size={40} className="text-purple-600 mb-4" />
                  <div className="text-5xl font-bold text-gray-900">520</div>
                  <p className="text-gray-500 mt-2">CBT Exams taken today</p>
                  <Link href="/exampro" className="mt-6 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-purple-100 transition-colors">
                    Open Control Center
                  </Link>
                </div>
              </WidgetCard>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Action Required */}
            <WidgetCard title="Action Required">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Payouts</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Chinedu Okafor</p>
                    <p className="text-xs text-gray-500">Zenith Bank • 1029384756</p>
                  </div>
                  <p className="font-bold text-orange-500">₦75,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Folake Adeleke</p>
                    <p className="text-xs text-gray-500">Access Bank • 0039281745</p>
                  </div>
                  <p className="font-bold text-orange-500">₦120,000</p>
                </div>

                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6">Recent Registrations</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Greenwood High</p>
                    <p className="text-xs text-gray-500">Pro Tier • Unverified</p>
                  </div>
                  <p className="font-bold text-blue-600">Today</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Kings College</p>
                    <p className="text-xs text-gray-500">Enterprise Tier • Verified</p>
                  </div>
                  <p className="font-bold text-gray-400">Yesterday</p>
                </div>
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  );
}
