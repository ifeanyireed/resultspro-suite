"use client";
import React, { useState, useEffect } from 'react';
import { CreditCardIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'history' | 'methods'>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'subscriptions') {
        const res = await api.get('/student/billing/subscriptions');
        setSubscriptions(res.data || []);
      } else if (activeTab === 'history') {
        const res = await api.get('/student/billing/history');
        setHistory(res.data || []);
      } else if (activeTab === 'methods') {
        const res = await api.get('/student/billing/methods');
        setMethods(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load ' + activeTab);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await api.put(`/student/billing/subscriptions/${id}/cancel`);
      toast.success('Subscription canceled');
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await api.delete(`/student/billing/methods/${id}`);
      toast.success('Payment method deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete payment method');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active subscriptions, payment history, and saved cards.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'subscriptions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active Plans
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'methods' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payment Methods
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && !loading && (
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-[1.5rem] border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <CreditCardIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Active Subscriptions</h3>
                <p className="text-gray-500 mt-2 mb-6">You don't have any active recurring plans.</p>
                <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all">
                  Browse Courses
                </button>
              </div>
            ) : (
              subscriptions.map(sub => (
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
                      Next billing date: <span className="font-medium text-gray-900">{new Date(sub.nextBillingDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleCancelSubscription(sub.id)}
                      className="flex-1 md:flex-none border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-center"
                    >
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
        {activeTab === 'history' && !loading && (
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
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No payment history available.</td>
                    </tr>
                  ) : history.map((order) => (
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
                        {(order.status === 'paid' || order.status === 'SUCCESS' || order.status === 'PAID') && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        )}
                        {(order.status === 'pending' || order.status === 'PENDING') && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <ClockIcon className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                        {(order.status === 'failed' || order.status === 'FAILED') && (
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
        {activeTab === 'methods' && !loading && (
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
                {methods.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No saved payment methods.</p>
                ) : methods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
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
                      <button 
                        onClick={() => handleDeleteMethod(pm.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
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
