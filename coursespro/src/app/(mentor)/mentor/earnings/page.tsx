"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { 
  BanknotesIcon, 
  WalletIcon, 
  ClockIcon, 
  StarIcon, 
  CheckCircleIcon, 
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const NIGERIAN_BANKS = [
  "Guaranty Trust Bank (GTBank)",
  "Access Bank Plc",
  "Zenith Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Kuda Microfinance Bank",
  "Moniepoint MFB",
  "OPay Digital Services",
  "Stanbic IBTC Bank",
  "Wema Bank (ALAT)",
  "Fidelity Bank",
  "Sterling Bank",
  "First City Monument Bank (FCMB)",
  "Union Bank of Nigeria"
];

interface HistoryItem {
  id: string;
  type: 'EARNING' | 'WITHDRAWAL';
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

export default function MentorEarnings() {
  const queryClient = useQueryClient();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [bankName, setBankName] = useState(NIGERIAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: earningsData, isLoading } = useQuery({
    queryKey: ['mentor-earnings'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/earnings');
      return res.data;
    }
  });

  const payoutMutation = useMutation({
    mutationFn: async (payload: { amount: number; bank_name: string; account_number: string; account_name: string }) => {
      const res = await coursesApi.post('/api/mentor/payouts/request', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-earnings'] });
      setSuccessMessage("Withdrawal request submitted! Transfers are processed within 24 hours.");
      setAmount('');
      setAccountNumber('');
      setAccountName('');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setSuccessMessage(null);
      }, 2000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.error || "Failed to submit withdrawal request.");
    }
  });

  const clearedBalance = earningsData?.cleared_balance || 0;
  const pendingEscrow = earningsData?.pending_escrow || 0;
  const lifetimeEarnings = earningsData?.lifetime_earnings || 0;
  const avgRating = earningsData?.avg_rating || 5.0;
  const turnaroundHours = earningsData?.avg_turnaround_hours || 14;
  const payoutModel = earningsData?.payout_model || 'BASE_PLUS_SLA';
  const history: HistoryItem[] = earningsData?.history || [];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 5000) {
      setErrorMessage("Minimum withdrawal amount is ₦5,000.");
      return;
    }

    if (numAmount > clearedBalance) {
      setErrorMessage(`Withdrawal cannot exceed cleared balance of ₦${clearedBalance.toLocaleString()}.`);
      return;
    }

    if (accountNumber.trim().length < 10) {
      setErrorMessage("Please enter a valid 10-digit NUBAN account number.");
      return;
    }

    if (!accountName.trim()) {
      setErrorMessage("Please enter the beneficiary account name.");
      return;
    }

    payoutMutation.mutate({
      amount: numAmount,
      bank_name: bankName,
      account_number: accountNumber.trim(),
      account_name: accountName.trim()
    });
  };

  const handleSetMaxAmount = () => {
    if (clearedBalance > 0) {
      setAmount(clearedBalance.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] mb-2 border border-blue-100">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            Instructor Compensation & Escrow
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings & Bounties</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track evaluation bounties, monthly base stipends, and request bank payouts in Nigerian Naira.
          </p>
        </div>

        <button 
          onClick={() => {
            setErrorMessage(null);
            setSuccessMessage(null);
            setShowWithdrawModal(true);
          }}
          disabled={clearedBalance < 5000}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm inline-flex items-center gap-2 ${
            clearedBalance >= 5000 
              ? 'bg-[#146ef5] text-white hover:bg-[#105bd1]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <WalletIcon className="w-4 h-4" />
          Withdraw Funds
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Cleared Balance */}
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-2xl p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wider">Cleared Balance</h3>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <WalletIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div className="z-10 mt-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">
              ₦{clearedBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-blue-200 font-medium">Available for instant bank withdrawal</p>
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Escrow</h3>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <BanknotesIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-1">
              ₦{pendingEscrow.toLocaleString()}
            </h2>
            <p className="text-xs text-amber-600 font-medium">Clears automatically upon grading reviews</p>
          </div>
        </div>

        {/* Turnaround Time SLA */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Review SLA</h3>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <ClockIcon className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-1">
              {turnaroundHours}h
            </h2>
            <p className="text-xs text-emerald-600 font-medium">Target: &lt;24h for maximum bounty</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Rating</h3>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-1">
              {avgRating.toFixed(1)} <span className="text-lg text-gray-400 font-normal">/ 5.0</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">Lifetime Gross: ₦{lifetimeEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Model Compensation Notice */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#146ef5] shrink-0 font-bold">
            ₦
          </div>
          <div>
            <span className="font-bold">Active Compensation Structure: </span>
            <span>
              {payoutModel === 'BASE_PLUS_SLA' && 'Base Monthly Stipend + ₦15,000 SLA evaluation bounty per approved student milestone.'}
              {payoutModel === 'PAY_PER_ACTION' && 'Direct Bounty: ₦15,000 per reviewed project submission + live workshop honorarium.'}
              {payoutModel === 'REVENUE_SHARE' && 'Cohort Revenue Share: Proportion of cohort tuition fees plus dedicated student retention bounties.'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white rounded-full text-blue-700 font-bold border border-blue-200 shrink-0">
          {payoutModel}
        </span>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Earning & Payout Ledger</h3>
          <span className="text-xs text-gray-500">Processed in Nigerian Naira (NGN)</span>
        </div>
        
        {history.length > 0 ? (
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold text-xs">
                <th className="px-6 py-3.5">Transaction</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => {
                const isWithdrawal = item.type === 'WITHDRAWAL';
                const formattedDate = new Date(item.date).toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isWithdrawal ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isWithdrawal ? (
                            <ArrowUpRightIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeftIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.description}</p>
                          <p className="text-xs text-gray-400 capitalize">{item.type.toLowerCase()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formattedDate}
                    </td>

                    <td className="px-6 py-4 text-right font-bold whitespace-nowrap">
                      <span className={isWithdrawal ? 'text-gray-900' : 'text-emerald-600'}>
                        {isWithdrawal ? '-' : '+'}₦{item.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'CLEARED' || item.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'PENDING' || item.status === 'PROCESSING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-1">No Transactions Recorded</h4>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              Evaluation rewards and base stipends will appear here as submissions are approved.
            </p>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                  <BuildingLibraryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Withdraw Funds</h3>
                  <p className="text-xs text-gray-500">Direct transfer to your Nigerian Bank Account</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  {successMessage}
                </div>
              )}

              {/* Cleared Balance Available */}
              <div className="bg-blue-50/70 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900">
                <span>Available Cleared Balance:</span>
                <span className="font-bold text-sm text-[#146ef5]">₦{clearedBalance.toLocaleString()}</span>
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select Nigerian Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  10-Digit NUBAN Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ifeanyi Felix"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Withdrawal Amount (₦)
                  </label>
                  <button
                    type="button"
                    onClick={handleSetMaxAmount}
                    className="text-xs font-bold text-[#146ef5] hover:underline"
                  >
                    Max (₦{clearedBalance.toLocaleString()})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                  <input
                    type="number"
                    min={5000}
                    max={clearedBalance}
                    placeholder="50,000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Minimum withdrawal is ₦5,000</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutMutation.isPending}
                  className="px-5 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {payoutMutation.isPending ? "Submitting..." : "Confirm Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
