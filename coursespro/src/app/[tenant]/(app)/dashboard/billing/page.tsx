"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { 
  CreditCardIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  PlusIcon, 
  XCircleIcon,
  TrashIcon,
  ShieldCheckIcon,
  ReceiptPercentIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';

interface Subscription {
  id: string;
  planName: string;
  cohortTitle?: string;
  status: 'active' | 'canceled' | 'past_due' | 'pending';
  amount: number;
  currency: string;
  interval: string;
  is_recurring: boolean;
  nextBillingDate?: string;
  enrolledAt?: string;
}

interface OrderHistory {
  id: string;
  description: string;
  date: string;
  amount: number;
  currency?: string;
  status: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function BillingPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'history' | 'methods'>('subscriptions');
  const [selectedInvoice, setSelectedInvoice] = useState<OrderHistory | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // 1. Fetch Active Plans
  const { data: subscriptions = [], isLoading: loadingSubs } = useQuery<Subscription[]>({
    queryKey: ['billing-subscriptions', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/billing/subscriptions');
      return res.data || [];
    },
    enabled: !!user,
  });

  // 2. Fetch Order History
  const { data: history = [], isLoading: loadingHistory } = useQuery<OrderHistory[]>({
    queryKey: ['billing-history', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/billing/history');
      return res.data || [];
    },
    enabled: !!user,
  });

  // 3. Fetch Payment Methods
  const { data: methods = [], isLoading: loadingMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['billing-methods', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/billing/methods');
      return res.data || [];
    },
    enabled: !!user,
  });

  // Cancel Subscription Mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await coursesApi.put(`/api/student/billing/subscriptions/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Subscription plan canceled');
      queryClient.invalidateQueries({ queryKey: ['billing-subscriptions'] });
    },
    onError: () => {
      toast.error('Failed to cancel subscription');
    },
  });

  // Delete Payment Method Mutation
  const deleteMethodMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await coursesApi.delete(`/api/student/billing/methods/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Payment method removed');
      queryClient.invalidateQueries({ queryKey: ['billing-methods'] });
    },
    onError: () => {
      toast.error('Failed to remove payment method');
    },
  });

  const handleCancelSubscription = (sub: Subscription) => {
    if (confirm(`Are you sure you want to cancel ${sub.planName}? You will maintain access until the end of your paid billing period.`)) {
      cancelMutation.mutate(sub.id);
    }
  };

  const handleDeleteMethod = (id: string) => {
    if (confirm('Are you sure you want to delete this payment card?')) {
      deleteMethodMutation.mutate(id);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    try {
      return new Intl.NumberFormat('en-NG', { 
        style: 'currency', 
        currency: currency || 'NGN',
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `₦${Number(amount).toLocaleString()}`;
    }
  };

  const totalSpent = history.reduce((acc, curr) => {
    if (curr.status === 'PAID' || curr.status === 'SUCCESS' || curr.status === 'paid') {
      return acc + (curr.amount || 0);
    }
    return acc;
  }, 0);

  const activePlansCount = subscriptions.filter(s => s.status === 'active').length;

  return (
    <MotionRise className="space-y-8 pb-16">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] border border-blue-100">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#146ef5]" />
              Secured by Paystack PCI-DSS Tier 1
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Plans</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Manage your cohort tuition plans, recurring installment schedules, official tax invoices, and verified payment cards.
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-emerald-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Plans</p>
              <p className="font-extrabold text-sm">{activePlansCount} Enrolled</p>
            </div>
          </div>

          <div className="bg-gray-50 text-gray-900 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center text-gray-700">
              <ReceiptPercentIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Settled Tuition</p>
              <p className="font-extrabold text-sm">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-gray-100/90 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subscriptions' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Active Plans ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Order Receipts ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'methods' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Payment Cards ({methods.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[360px]">
        {/* TAB 1: SUBSCRIPTIONS & PLANS */}
        {activeTab === 'subscriptions' && (
          <div>
            {loadingSubs ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 font-medium text-xs">Loading active subscriptions...</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center flex flex-col items-center shadow-xs">
                <div className="w-16 h-16 bg-blue-50 text-[#146ef5] rounded-2xl flex items-center justify-center mb-4">
                  <CreditCardIcon className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Active Plans Found</h3>
                <p className="text-gray-500 text-xs mt-1 mb-6 max-w-sm">
                  You are not currently subscribed to any active cohort or recurring installment track.
                </p>
                <Link 
                  href="/dashboard"
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  Explore Cohorts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-lg font-bold text-gray-900">{sub.planName}</h3>
                        {sub.status === 'active' && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Active
                          </span>
                        )}
                        {sub.status === 'canceled' && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Canceled
                          </span>
                        )}
                        {sub.status === 'past_due' && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Payment Overdue
                          </span>
                        )}
                      </div>

                      {sub.cohortTitle && (
                        <p className="text-xs font-semibold text-[#146ef5] mb-1">
                          Cohort: {sub.cohortTitle}
                        </p>
                      )}

                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-gray-900 text-sm">{formatCurrency(sub.amount, sub.currency)}</span> · {sub.interval}
                      </p>

                      {sub.nextBillingDate && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                          Next billing renewal: <span className="font-semibold text-gray-800">{new Date(sub.nextBillingDate).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2.5 w-full md:w-auto">
                      {sub.status === 'active' && sub.is_recurring && (
                        <button 
                          onClick={() => handleCancelSubscription(sub)}
                          disabled={cancelMutation.isPending}
                          className="flex-1 md:flex-none border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all text-center"
                        >
                          Cancel Renewal
                        </button>
                      )}
                      <Link 
                        href="/dashboard/journey"
                        className="flex-1 md:flex-none bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all text-center"
                      >
                        Launch Studio →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER & INVOICE RECEIPTS */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-[2rem] shadow-xs border border-gray-100 overflow-hidden">
            {loadingHistory ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 font-medium text-xs">Loading payment receipts...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs font-medium">
                No past transactions recorded on this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                      <th className="px-6 py-4">Receipt / Reference</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{order.description}</div>
                          <div className="text-[11px] font-mono text-gray-400">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-xs font-extrabold text-gray-900">
                          {formatCurrency(order.amount, order.currency)}
                        </td>
                        <td className="px-6 py-4">
                          {(order.status === 'paid' || order.status === 'SUCCESS' || order.status === 'PAID') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircleIcon className="w-3 h-3" />
                              Settled
                            </span>
                          )}
                          {(order.status === 'pending' || order.status === 'PENDING') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <ClockIcon className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {(order.status === 'failed' || order.status === 'FAILED') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <XCircleIcon className="w-3 h-3" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedInvoice(order)}
                            className="text-gray-400 hover:text-[#146ef5] p-2 rounded-xl hover:bg-blue-50 transition-colors"
                            title="View / Print Tax Receipt"
                          >
                            <DocumentTextIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT METHODS */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Saved Payment Methods</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Cards saved for automatic tuition installments and subscription renewals.</p>
                </div>
                <button 
                  onClick={() => setIsAddCardOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add New Card
                </button>
              </div>

              {loadingMethods ? (
                <div className="py-12 text-center text-xs text-gray-400 font-medium">Loading saved cards...</div>
              ) : methods.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-6">
                  <CreditCardIcon className="w-10 h-10 text-gray-300 mx-auto mb-2 stroke-1" />
                  <p className="text-gray-700 font-bold text-xs">No saved cards yet</p>
                  <p className="text-gray-400 text-[11px] mt-0.5 mb-4">Cards authorized during Paystack checkout will appear here automatically.</p>
                  <button 
                    onClick={() => setIsAddCardOpen(true)}
                    className="text-xs font-bold text-[#146ef5] hover:underline"
                  >
                    Authorize a Card Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {methods.map((pm) => (
                    <div 
                      key={pm.id} 
                      className="flex items-center justify-between p-4 border border-gray-200/80 rounded-2xl hover:border-gray-300 transition-all bg-gray-50/40"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-2xs">
                          <span className="text-[10px] font-extrabold text-blue-700 uppercase">{pm.brand || 'CARD'}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            •••• •••• •••• {pm.last4}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Expires {pm.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {pm.isDefault && (
                          <span className="bg-blue-100 text-[#146ef5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Default
                          </span>
                        )}
                        <button 
                          onClick={() => handleDeleteMethod(pm.id)}
                          disabled={deleteMethodMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove Card"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#146ef5] flex items-center justify-center font-bold text-xs">
                    CP
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Official Tuition Invoice</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Receipt #{selectedInvoice.id}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Billed To</span>
                <span className="font-bold text-gray-900">{(user as any)?.full_name || (user as any)?.name || user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Payment Date</span>
                <span className="font-semibold text-gray-900">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Description</span>
                <span className="font-semibold text-gray-900">{selectedInvoice.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Payment Gateway</span>
                <span className="font-semibold text-emerald-600">Paystack Verified</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-100 text-sm">
                <span className="font-bold text-gray-900">Total Settled</span>
                <span className="font-extrabold text-[#146ef5]">{formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <PrinterIcon className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Guidance Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="font-bold text-gray-900 text-sm">Authorize a New Card</h3>
              </div>
              <button 
                onClick={() => setIsAddCardOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              To tokenize and save a card securely, a temporary verification fee of <strong>₦100</strong> will be charged and refunded automatically by Paystack to verify your card details.
            </p>

            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <ShieldCheckIcon className="w-4 h-4 text-[#146ef5] shrink-0 mt-0.5" />
              <span>We never store your raw CVV or 16-digit card number on our servers. All tokens are encrypted by Paystack.</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setIsAddCardOpen(false)}
                className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAddCardOpen(false);
                  toast('Paystack inline checkout initialized', { icon: '💳' });
                }}
                className="flex-1 py-2 px-4 rounded-xl bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold shadow-xs"
              >
                Proceed with Paystack
              </button>
            </div>
          </div>
        </div>
      )}
    </MotionRise>
  );
}
