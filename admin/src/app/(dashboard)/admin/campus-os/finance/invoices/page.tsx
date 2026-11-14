'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  CreditCard,
  Download,
  ExternalLink
} from 'lucide-react';
import { fetchStudentInvoices, StudentInvoice } from '@/lib/campus-api';

const STATUS_FILTERS = ['All Statuses', 'PAID', 'PARTIAL', 'UNPAID'];

export default function FinanceInvoicesPage() {
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePaymentModal, setActivePaymentModal] = useState<StudentInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    const data = await fetchStudentInvoices();
    setInvoices(data);
    setLoading(false);
  }

  function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!activePaymentModal || paymentAmount <= 0) return;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === activePaymentModal.id) {
          const newPaid = inv.amount_paid + Number(paymentAmount);
          const newBal = Math.max(0, inv.total_amount - newPaid);
          const newStatus = newBal === 0 ? 'PAID' : 'PARTIAL';
          return {
            ...inv,
            amount_paid: newPaid,
            balance: newBal,
            status: newStatus,
            payment_reference: `PAY-REC-${Date.now().toString().slice(-6)}`,
            paid_at: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );
    setActivePaymentModal(null);
    setPaymentAmount(0);
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = selectedStatus === 'All Statuses' || inv.status === selectedStatus;
    const matchesSearch =
      inv.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.class_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name, admission ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
          Total Invoices: {filteredInvoices.length}
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Tuition Ledger & Payment Clearance</h3>
            <p className="text-xs text-slate-500">Live bursary records linked to Paystack webhooks and bank deposit reconciliations</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class & Term</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Outstanding Balance</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inv.student_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.student_id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">{inv.class_name}</div>
                    <div className="text-[11px] text-slate-400">{inv.term} {inv.session}</div>
                  </td>
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
                  <td className="py-3.5 px-4 text-right">
                    {inv.balance > 0 ? (
                      <button
                        onClick={() => {
                          setActivePaymentModal(inv);
                          setPaymentAmount(inv.balance);
                        }}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-bold rounded-lg text-xs transition-colors"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Tuition Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter bursary payment for <span className="font-bold text-slate-800">{activePaymentModal.student_name}</span> ({activePaymentModal.student_id})
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Class:</span>
                  <span className="font-semibold text-slate-800">{activePaymentModal.class_name}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Current Balance:</span>
                  <span className="font-bold text-red-600">₦{activePaymentModal.balance.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Amount to Credit (₦)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={activePaymentModal.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActivePaymentModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
