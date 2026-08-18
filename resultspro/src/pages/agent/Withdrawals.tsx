import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, Wallet, Clock, CheckCircle, AlertTriangle, BarChart01, Building2, TrendingUp, Trophy, Calendar, User, LogOut } from '@/lib/hugeicons-compat';
import { useAgentWithdrawals } from '@/hooks/useAgentAnalytics';
import { useNavigate } from 'react-router-dom';

export const Withdrawals: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { withdrawals, stats, loading, fetchWithdrawals, fetchStats, requestWithdrawal } =
    useAgentWithdrawals('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    paymentMethod: 'BANK_TRANSFER',
    bankAccountName: '',
    bankCode: '',
    accountNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchWithdrawals((page - 1) * 10, 10);
  }, [page, fetchStats, fetchWithdrawals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount < 25000) {
      alert('Minimum withdrawal amount is ₦25,000');
      return;
    }

    try {
      setSubmitting(true);
      await requestWithdrawal(
        formData.amount,
        formData.paymentMethod,
        {
          bankAccountName: formData.bankAccountName,
          bankCode: formData.bankCode,
          accountNumber: formData.accountNumber,
        }
      );
      alert('Withdrawal request submitted successfully');
      setShowForm(false);
      setFormData({
        amount: 0,
        paymentMethod: 'BANK_TRANSFER',
        bankAccountName: '',
        bankCode: '',
        accountNumber: '',
      });
      fetchWithdrawals();
      fetchStats();
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'APPROVED':
        return 'text-blue-400 bg-blue-900/20';
      case 'PAID':
        return 'text-green-400 bg-green-900/20';
      case 'REJECTED':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-6">
      {/* Header */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-6 text-white border border-[rgba(255,255,255,0.07)]">
        <h1 className="text-3xl font-bold mb-2">Withdrawal Management</h1>
        <p className="text-gray-300">Manage your commission withdrawals</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pending</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Withdrawn</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              ₦{stats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Requests</span>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalWithdrawals}</div>
          </div>
        </div>
      )}

      {/* New Withdrawal Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 transition"
        >
          <DollarSign className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Request Withdrawal'}
        </button>
      </div>

      {/* New Withdrawal Form */}
      {showForm && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-6 border border-[rgba(255,255,255,0.07)]">
          <h2 className="text-lg font-semibold text-white mb-4">New Withdrawal Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Amount (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  min="25000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  placeholder="Minimum ₦25,000"
                  className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-green-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Minimum withdrawal: ₦25,000</p>
              </div>
            </div>

            {/* Bank Transfer Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Account Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-green-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="0123456789"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-green-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Bank Code</label>
                <input
                  type="text"
                  placeholder="033 (e.g. UBA)"
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-green-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={submitting || formData.amount < 25000}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition"
              >
                {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.10)] text-white rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawals Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
          <h2 className="text-lg font-semibold text-white">Withdrawal History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No withdrawals found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(0,0,0,0.40)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.07)]">
                {withdrawals.map((withdrawal: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        ₦{withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      {withdrawal.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : withdrawal.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {withdrawal.paidAt ? new Date(withdrawal.paidAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.07)] flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 text-white text-sm rounded transition"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-gray-300">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition"
          >
            Next
          </button>
        </div>
      </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t border-white/10" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.2) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-2 py-4 flex-wrap">
            {[
              { label: 'Dashboard', icon: BarChart01, href: '/agent/dashboard' },
              { label: 'Schools', icon: Building2, href: '/agent/schools' },
              { label: 'Referrals', icon: TrendingUp, href: '/agent/referrals' },
              { label: 'Rewards', icon: Trophy, href: '/agent/rewards' },
              { label: 'Withdrawals', icon: DollarSign, href: '/agent/withdrawals' },
              { label: 'Plans', icon: Calendar, href: '/agent/subscription-plans' },
              { label: 'Profile', icon: User, href: '/agent/profile' },
              { label: 'Logout', icon: LogOut, href: '#logout' },
            ].map((item) => {
              const Icon = item.icon;
              const active = window.location.pathname === item.href;
              const isLogout = item.href === '#logout';
              
              return (
                <div key={item.href} className="relative group">
                  <button
                    onClick={() => {
                      if (isLogout) {
                        localStorage.clear();
                        navigate('/auth/login');
                      } else {
                        navigate(item.href);
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                      active && !isLogout
                        ? 'text-white bg-white/15 border border-white/30 shadow-lg shadow-blue-500/20'
                        : isLogout
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </button>
                  {hoveredItem === item.href && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none border border-white/10">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
