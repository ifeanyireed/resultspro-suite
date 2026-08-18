'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { CreditCard, Check, DollarSign, FileText, ArrowUpRight } from 'lucide-react';

export default function SubscriptionsPage() {
  const plans = [
    {
      name: 'Free',
      price: '₦0',
      period: 'forever',
      students: 100,
      teachers: 15,
      results: 100,
      storage: '2 GB',
      features: ['Up to 100 students', 'Up to 15 teachers', 'Basic report cards', 'Email verification'],
      currentSchools: 56,
      badge: 'STARTER',
    },
    {
      name: 'Pro',
      price: '₦25,000',
      period: 'per month',
      students: 2000,
      teachers: 300,
      results: 2000,
      storage: '50 GB',
      features: ['Up to 2,000 students', 'Up to 300 teachers', 'Scratch card PIN access', 'CBT exams & analytics', 'SMS notifications'],
      currentSchools: 68,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Enterprise',
      price: '₦75,000',
      period: 'per month',
      students: 'Unlimited',
      teachers: 'Unlimited',
      results: 'Unlimited',
      storage: '500 GB',
      features: ['Unlimited students & staff', 'SchoolHub white-label portal', 'Custom school domain', 'Priority 24/7 account manager', 'Dedicated database backups'],
      currentSchools: 18,
      badge: 'FULL SUITE',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Subscriptions & Central Billing"
        subtitle="Manage standardized subscription tiers, quotas, and invoice ledgers across the suite"
      />

      <div className="p-8 space-y-8">
        {/* Tier Plans */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Centrally Enforced Plan Boundaries
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border p-6 shadow-sm relative flex flex-col justify-between ${
                  plan.name === 'Pro' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {plan.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {plan.currentSchools} Active Schools
                    </span>
                  </div>

                  <h4 className="text-xl font-medium text-slate-800 text-xs">{plan.name}</h4>
                  <div className="mt-2 flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500">/{plan.period}</span>
                  </div>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Max Students:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.students}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Max Teachers:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.teachers}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Results / Term:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.results}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Storage:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.storage}</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 text-xs text-slate-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Institutional Invoices</h3>
            <span className="text-xs text-slate-500">Auto-generated upon renewal</span>
          </div>

          <div className="divide-y divide-slate-50 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 text-xs">INV-2026-001 • Greenwood High</p>
                <p className="text-[11px] text-slate-500">Pro Plan Annual Renewal • Due Oct 1, 2026</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-slate-800 text-xs">₦250,000</span>
                <Badge status="PAID" />
              </div>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 text-xs">INV-2026-002 • Kings College Lagos</p>
                <p className="text-[11px] text-slate-500">Enterprise Plan Termly • Due Nov 15, 2026</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-slate-800 text-xs">₦750,000</span>
                <Badge status="PAID" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
