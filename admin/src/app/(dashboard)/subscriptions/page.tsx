'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { CreditCard, Check, DollarSign, FileText, ArrowUpRight } from 'lucide-react';

import { fetchPlans, fetchInvoices } from '@/lib/api';

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [p, i] = await Promise.all([fetchPlans(), fetchInvoices()]);
      setPlans(p);
      setInvoices(i);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="w-full">
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
                    <span className="text-3xl font-extrabold text-slate-900">₦{plan.monthly_price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/per month</span>
                  </div>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Max Students:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.max_students > 900000 ? 'Unlimited' : plan.max_students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Max Teachers:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.max_teachers > 900000 ? 'Unlimited' : plan.max_teachers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Results / Term:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.max_results > 900000 ? 'Unlimited' : plan.max_results.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Storage:</span>
                      <span className="font-medium text-slate-800 text-xs">{plan.storage_gb} GB</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 text-xs text-slate-600">
                    {plan.features?.map((f: string, i: number) => (
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
            {invoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 text-xs">{inv.invoice_number} • {inv.tenant_name}</p>
                  <p className="text-[11px] text-slate-500">{inv.plan_name} Plan {inv.billing_cycle} Renewal • Due {new Date(inv.due_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-slate-800 text-xs">₦{inv.amount.toLocaleString()}</span>
                  <Badge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
