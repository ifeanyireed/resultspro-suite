'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Wallet,
  Building2
} from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@/components/ui/Cards';
import { fetchCampusSummary, fetchStudentInvoices, CampusSummary, StudentInvoice } from '@/lib/campus-api';

export default function FinanceOverviewPage() {
  const [summary, setSummary] = useState<CampusSummary | null>(null);
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [sum, invs] = await Promise.all([
        fetchCampusSummary(),
        fetchStudentInvoices(),
      ]);
      setSummary(sum);
      setInvoices(invs);
      setLoading(false);
    }
    load();
  }, []);

  const totalCollected = invoices.reduce((acc, i) => acc + i.amount_paid, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientMetricCard
          title="Gross Tuition Inflow"
          value={loading ? '...' : `₦${((summary?.totalRevenueYTD ?? 84500000) / 1000000).toFixed(1)}M`}
          subtitle="1st Term 2026/2027 Inflow"
          trend="+14.2% YoY"
          icon={Wallet}
        />
        <WhiteMetricCard
          title="Collection Rate"
          value="91.8%"
          subtitle="Target: 95% by Week 10"
          trend="+3.4%"
          trendColor="green"
          icon={CheckCircle2}
        />
        <WhiteMetricCard
          title="Outstanding Balances"
          value={loading ? '...' : `₦${(totalOutstanding / 1000).toLocaleString()}k`}
          subtitle="Across 18 student ledgers"
          trend="Overdue Notice"
          trendColor="red"
          icon={AlertCircle}
        />
        <WhiteMetricCard
          title="Active Fee Schedules"
          value="4 Structures"
          subtitle="Junior, Senior & Boarding"
          trend="Active"
          trendColor="green"
          icon={CreditCard}
        />
      </div>

      {/* Finance Navigation CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Class Fee Schedules & Levies</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Define tuition thresholds, development levies, ICT/STEM practical fees, and boarding accommodation packages by class tier.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">4 Class Tiers Configured</span>
            <Link
              href="/admin/campus-os/finance/fees"
              className="text-xs font-bold text-[#146ef5] hover:underline flex items-center gap-1"
            >
              <span>Manage Fee Tables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Invoices & Payment Ledger</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Track student billing accounts, reconcile Paystack and bank transfer receipts, and issue clearance slips for CBT exams.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Live Bursary Ledger</span>
            <Link
              href="/admin/campus-os/finance/invoices"
              className="text-xs font-bold text-[#146ef5] hover:underline flex items-center gap-1"
            >
              <span>View Invoice Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Invoices Quick Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Student Tuition Transactions</h3>
          <span className="text-xs text-slate-500">Live feed from ScholarsNG Bursary Service</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inv.student_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.student_id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{inv.class_name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₦{inv.total_amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">₦{inv.amount_paid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-red-600">
                    {inv.balance > 0 ? `₦${inv.balance.toLocaleString()}` : '₦0'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {inv.payment_reference || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
