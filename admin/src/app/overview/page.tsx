'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import {
  Building2,
  Users,
  CreditCard,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { fetchSuiteStats, fetchSchools, fetchPayoutRequests } from '@/lib/api';
import { SuiteStats, School, PayoutRequest } from '@/lib/types';
import Link from 'next/link';

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
    <div className="flex-1 flex flex-col">
      <Header
        title="Suite Executive Overview"
        subtitle="Live cross-microservice telemetrics and control hub"
      />

      <div className="p-8 space-y-8">
        {/* Top-Level KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Registered Schools"
            value={stats?.totalSchools || 142}
            subtitle={`${stats?.verifiedSchools || 118} verified`}
            icon={Building2}
            color="blue"
            trend="+12% this month"
          />
          <StatCard
            title="Universal Users"
            value={stats?.totalUsers ? stats.totalUsers.toLocaleString() : '4,850'}
            subtitle="Students, Teachers, Parents"
            icon={Users}
            color="emerald"
            trend="+240 new this week"
          />
          <StatCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions || 86}
            subtitle="Pro & Enterprise tiers"
            icon={CreditCard}
            color="purple"
            trend="82% renewal rate"
          />
          <StatCard
            title="Total Suite Gross Revenue"
            value={`₦${((stats?.totalRevenue || 24500000) / 1000000).toFixed(1)}M`}
            subtitle="Subscriptions & Scratch Cards"
            icon={TrendingUp}
            color="amber"
            trend="+18.4% YoY"
          />
        </div>

        {/* Modular Ecosystem Pulse */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Modular Microservices Pulse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* ResultPRO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-sm text-slate-900">ResultPRO</h4>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Assessment sheets & scratch card pins</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-slate-900">12,450</p>
                  <p className="text-[11px] text-slate-400">Term results published</p>
                </div>
                <Link href="/resultspro" className="text-xs font-semibold text-blue-600 hover:underline flex items-center">
                  Control <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* examsPRO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-sm text-slate-900">examsPRO</h4>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-slate-500 mb-3">CBT tests, battles & question bank</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-slate-900">520</p>
                  <p className="text-[11px] text-slate-400">Exams taken today</p>
                </div>
                <Link href="/examspro" className="text-xs font-semibold text-purple-600 hover:underline flex items-center">
                  Control <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* ClassroomPRO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900">ClassroomPRO</h4>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Study handouts & flashcard SRS</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-slate-900">3,120</p>
                  <p className="text-[11px] text-slate-400">Active study sessions</p>
                </div>
                <Link href="/classroompro" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center">
                  Control <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* TutorsPRO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-amber-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-sm text-slate-900">TutorsPRO</h4>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Private tutors & lesson scheduling</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-slate-900">84</p>
                  <p className="text-[11px] text-slate-400">Verified tutors active</p>
                </div>
                <Link href="/tutorspro" className="text-xs font-semibold text-amber-600 hover:underline flex items-center">
                  Control <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Operational Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Schools Registered */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-slate-900">Recent School Registrations</h3>
              <Link href="/schools" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentSchools.length > 0 ? (
                recentSchools.map((school) => (
                  <div key={school.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{school.name}</p>
                      <p className="text-[11px] text-slate-500">{school.contact_email || 'No contact email'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge status={school.subscription_tier} />
                      <Badge status={school.verification_status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Greenwood High, Kings College, Queen's College, St. Gregory's College
                </div>
              )}
            </div>
          </div>

          {/* Actionable Agent Payout Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-900">Pending Agent Payouts</h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <Link href="/agents/payouts" className="text-xs font-bold text-blue-600 hover:underline">
                Manage Payouts
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Agent Chinedu Okafor</p>
                  <p className="text-[11px] text-slate-500">Zenith Bank • 1029384756</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">₦75,000</p>
                  <Badge status="PENDING" />
                </div>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Agent Folake Adeleke</p>
                  <p className="text-[11px] text-slate-500">Access Bank • 0039281745</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">₦120,000</p>
                  <Badge status="PENDING" />
                </div>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Agent Emeka Nwosu</p>
                  <p className="text-[11px] text-slate-500">GTBank • 0128475839</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">₦45,000</p>
                  <Badge status="PENDING" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
