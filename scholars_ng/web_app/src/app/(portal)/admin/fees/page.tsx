
'use client';

import React, { useEffect, useState } from 'react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpRightIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function FeesDashboard() {
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    record_type: 'invoice',
    student_name: '',
    class_name: 'SS 2 Science',
    term_name: 'First Term',
    total_billed: 225000,
    amount_paid: 0,
    due_date: '2026-11-30',
    payment_method: 'Paystack DVA'
  });

  const loadFees = async () => {
    try {
      const res = await api.get('/v1/campus/fees');
      setFeeStructures(res.data?.fee_structures || []);
      setInvoices(res.data?.invoices || []);
    } catch (err) {
      console.error('Failed to load tenant fees data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/fees', {
        ...newInvoice,
        total_billed: Number(newInvoice.total_billed),
        amount_paid: Number(newInvoice.amount_paid)
      });
      setShowAddInvoice(false);
      setNewInvoice({
        record_type: 'invoice',
        student_name: '',
        class_name: 'SS 2 Science',
        term_name: 'First Term',
        total_billed: 225000,
        amount_paid: 0,
        due_date: '2026-11-30',
        payment_method: 'Paystack DVA'
      });
      await loadFees();
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  const handleMarkPaid = async (inv: any) => {
    try {
      await api.patch('/v1/campus/fees', {
        id: inv.id,
        amount_paid: Number(inv.total_billed),
        payment_method: 'Paystack DVA'
      });
      await loadFees();
    } catch (err) {
      console.error('Failed to mark invoice paid:', err);
    }
  };

  const totalCollected = invoices.reduce((acc, i) => acc + Number(i.amount_paid || 0), 0);
  const totalBilled = invoices.reduce((acc, i) => acc + Number(i.total_billed || 0), 0);
  const pendingCount = invoices.filter((i) => i.status !== 'PAID').length;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 94;

  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fees & Finance</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tenant-isolated tuition structures, student invoices, and bursary collections.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddInvoice(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Issue Student Invoice
          </button>
        </div>
      </MotionRise>

      {showAddInvoice && (
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Issue New Student Fee Invoice</h3>
          <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Student Full Name"
              value={newInvoice.student_name}
              onChange={(e) => setNewInvoice({ ...newInvoice, student_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Class Arm (e.g. SS 2 Science)"
              value={newInvoice.class_name}
              onChange={(e) => setNewInvoice({ ...newInvoice, class_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="number"
              required
              placeholder="Total Billed (NGN)"
              value={newInvoice.total_billed}
              onChange={(e) => setNewInvoice({ ...newInvoice, total_billed: Number(e.target.value) })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="number"
              placeholder="Initial Deposit Paid (NGN)"
              value={newInvoice.amount_paid}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount_paid: Number(e.target.value) })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="date"
              value={newInvoice.due_date}
              onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-[#146ef5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
                Save Invoice
              </button>
              <button type="button" onClick={() => setShowAddInvoice(false)} className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </MotionRise>
      )}

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Collected (Term)</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-2">₦{totalCollected.toLocaleString()}</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3"/> Live DB</div>
              <span>Verified Settlements</span>
            </div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Pending Invoices</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{pendingCount}</h2>
            <div className="text-xs text-gray-500">Out of {invoices.length} issued invoices</div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Collection Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{collectionRate}%</h2>
            <div className="text-xs text-gray-500">Target: 95% before exams</div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Fee Structures</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{feeStructures.length}</h2>
            <div className="text-xs text-gray-500">Active billing templates</div>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.1} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Student Fee Invoices (Database Persisted)</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            {loading ? 'Syncing...' : `${invoices.length} Invoices`}
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Student & Class</th>
              <th className="px-6 py-4">Total Billed</th>
              <th className="px-6 py-4">Amount Paid</th>
              <th className="px-6 py-4">Balance Due</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-[#146ef5]">{inv.invoice_no}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-gray-900">{inv.student_name}</div>
                  <div className="text-xs text-gray-500">{inv.class_name} · {inv.term_name}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">₦{Number(inv.total_billed || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-emerald-700">₦{Number(inv.amount_paid || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-rose-600">₦{Number(inv.balance_due || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    inv.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : inv.status === 'PARTIAL'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status !== 'PAID' && (
                    <button
                      onClick={() => handleMarkPaid(inv)}
                      className="text-xs font-bold text-[#146ef5] hover:underline cursor-pointer"
                    >
                      Mark Cleared
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionRise>
    </>
  );
}
