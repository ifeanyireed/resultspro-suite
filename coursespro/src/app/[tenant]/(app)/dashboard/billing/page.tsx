"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  CreditCardIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const mockSubscriptions = [
  {
    id: 'sub_1',
    planName: 'Pro Student Plan',
    status: 'active',
    amount: 45000,
    interval: 'month',
    nextBillingDate: '2026-10-25',
  }
];

const mockOrders = [
  {
    id: 'ord_123',
    date: '2026-09-15',
    description: 'Pro Student Plan (Monthly)',
    amount: 45000,
    status: 'paid',
  },
  {
    id: 'ord_124',
    date: '2026-08-15',
    description: 'Frontend Bootcamp - Single Purchase',
    amount: 150000,
    status: 'paid',
  },
  {
    id: 'ord_125',
    date: '2026-07-15',
    description: 'Pro Student Plan (Monthly)',
    amount: 45000,
    status: 'failed',
  }
];

const mockPaymentMethods = [
  {
    id: 'pm_1',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/28',
    isDefault: true,
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'history' | 'methods'>('subscriptions');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user) return null;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your subscriptions, view order history, and update payment methods.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'subscriptions'
              ? 'border-[#146ef5] text-[#146ef5]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Active Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-[#146ef5] text-[#146ef5]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Order History
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'methods'
              ? 'border-[#146ef5] text-[#146ef5]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Payment Methods
        </button>
      </div>

      <div className="max-w-4xl">
        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {mockSubscriptions.length === 0 ? (
              <div className="bg-white rounded-[1.5rem] p-8 text-center shadow-sm border border-gray-100">
                <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No active subscriptions</h3>
                <p className="text-gray-500 mt-2 mb-6">You don't have any active recurring plans.</p>
                <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all">
                  Browse Courses
                </button>
              </div>
            ) : (
              mockSubscriptions.map(sub => (
                <div key={sub.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{sub.planName}</h3>
                      {sub.status === 'active' && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(sub.amount)} / {sub.interval}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Next billing date: <span className="font-medium text-gray-900">{sub.nextBillingDate}</span>
                    </p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-center">
                      Cancel Plan
                    </button>
                    <button className="flex-1 md:flex-none bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-center">
                      Upgrade
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.description}</div>
                        <div className="text-xs text-gray-500">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'paid' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        )}
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <ClockIcon className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                        {order.status === 'failed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <XCircleIcon className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#146ef5] transition-colors p-2 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENT METHODS TAB */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Saved Payment Methods</h3>
                <button className="flex items-center gap-2 text-[#146ef5] hover:text-[#105bd1] text-sm font-semibold transition-colors">
                  <PlusIcon className="w-4 h-4" />
                  Add New Card
                </button>
              </div>
              
              <div className="space-y-4">
                {mockPaymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                        {/* Mock Brand Icon */}
                        <span className="text-xs font-bold text-gray-500 uppercase">{pm.brand}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {pm.brand} ending in {pm.last4}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires {pm.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {pm.isDefault && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Default
                        </span>
                      )}
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
