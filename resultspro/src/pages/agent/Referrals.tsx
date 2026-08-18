import React, { useEffect, useState } from 'react';
import { TrendingUp, Building2, Users, Target, BarChart01, Trophy, DollarSign, Calendar, User, LogOut } from '@/lib/hugeicons-compat';
import { useAgentReferrals } from '@/hooks/useAgentAnalytics';
import { useNavigate } from 'react-router-dom';

export const Referrals: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { referrals, stats, loading, fetchReferrals, fetchStats } = useAgentReferrals('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchReferrals((page - 1) * 10, 10);
  }, [page, fetchReferrals, fetchStats]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'APPROVED':
        return 'text-green-400 bg-green-900/20';
      case 'PAID':
        return 'text-blue-400 bg-blue-900/20';
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
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 text-white hover:bg-white/5 transition-colors">
        <h1 className="text-3xl font-bold mb-2">Referral Tracking</h1>
        <p className="text-gray-300">Monitor your referrals and earnings</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Referrals</span>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pending</span>
              <Building2 className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.pendingReferrals}</div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Approved</span>
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.approvedReferrals}</div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Successful Signups</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.successfulRegistrations}</div>
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
          <h2 className="text-lg font-semibold text-white">Recent Referrals</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading referrals...</div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No referrals found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(0,0,0,0.40)] border-b border-[rgba(255,255,255,0.07)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.07)]">
                {referrals.map((referral: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)] transition">
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        {referral.school?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{referral.referredByEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(referral.status)}`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ₦{referral.commissionAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(referral.createdAt).toLocaleDateString()}
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

export default Referrals;
