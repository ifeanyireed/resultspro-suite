import React, { useEffect, useState } from 'react';
import {
  BarChart01,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Trophy,
  Calendar,
  Copy,
  CheckCircle,
  User,
  LogOut,
} from '@/lib/hugeicons-compat';
import { useNavigate } from 'react-router-dom';
import { useAgentDashboard } from '@/hooks/useAgentAnalytics';

interface AgentDashboardProps {
  agentId?: string;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agentId = '' }) => {
  const navigate = useNavigate();
  const { data, loading, fetchDashboard } = useAgentDashboard(agentId);
  const [copied, setCopied] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard - either for specified agentId or for current user
    fetchDashboard();
  }, [fetchDashboard]);

  const copyReferralCode = () => {
    if (data?.agent.uniqueReferralCode) {
      navigator.clipboard.writeText(data.agent.uniqueReferralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">No agent data found</div>
      </div>
    );
  }

  const { agent, referralStats, rewards, withdrawalStats } = data;
  const subscriptionTierColor = {
    Free: 'text-gray-400',
    Pro: 'text-blue-400',
    Premium: 'text-yellow-400',
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative pb-20">
      <style>{`
        .nav-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          margin-bottom: 8px;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      {/* Background Effects - Fixed/Static */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Header with Logo and User Actions */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 md:px-8" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 relative">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Results Pro</div>
                <div className="text-sm font-semibold text-white">Agent</div>
              </div>
            </div>

            {/* Center Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">Agent Dashboard</div>
                <div className="text-xs text-gray-400 italic mt-1">Grow your network and earn commissions</div>
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/agent/profile')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 text-white hover:bg-white/5 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
            <p className={`text-lg font-semibold ${subscriptionTierColor[agent.subscriptionTier as 'Free' | 'Pro' | 'Premium']}`}>
              {agent.subscriptionTier} Plan
            </p>
            <div className="mt-2 text-sm text-gray-300">
              Status: <span className="text-green-400">{agent.verificationStatus}</span>
            </div>
          </div>
          {agent.avatarUrl && (
            <img
              src={agent.avatarUrl}
              alt={agent.specialization}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commission Earned */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Earned</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ₦{agent.totalCommissionEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Pending: ₦{agent.pendingCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Points Balance */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Points Balance</span>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{rewards.pointsBalance}</div>
          <div className="text-xs text-gray-400 mt-1">
            Lifetime: {rewards.lifetimePoints}
          </div>
        </div>

        {/* Active Referrals */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Referrals</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {referralStats.totalReferrals}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Approved: {referralStats.approvedReferrals}
          </div>
        </div>

        {/* Leaderboard Rank */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Leaderboard Rank</span>
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            #{rewards.leaderboardRank || '—'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {rewards.badges?.length || 0} badges
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Your Referral Code
        </h2>
        <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.40)] rounded-lg p-4 border border-[rgba(255,255,255,0.07)]">
          <code className="text-white font-mono text-lg flex-1">
            {agent.uniqueReferralCode}
          </code>
          <button
            onClick={copyReferralCode}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {referralStats.successfulRegistrations}
            </div>
            <div className="text-xs text-gray-400">Successful Registrations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {referralStats.approvedReferrals}
            </div>
            <div className="text-xs text-gray-400">Approved Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              ₦{referralStats.totalCommissionPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400">Commission Paid</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {rewards.badges && rewards.badges.length > 0 && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Your Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.badges.map((badge: any, idx: number) => (
              <div
                key={idx}
                className="text-center bg-[rgba(255,255,255,0.02)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors"
              >
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-white">{badge.badgeType}</div>
                <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Withdrawal Stats */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <h3 className="text-sm font-semibold text-white mb-3">Withdrawals</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Pending:</span>
              <span className="text-yellow-400 font-semibold">{withdrawalStats.pending}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Approved:</span>
              <span className="text-blue-400 font-semibold">{withdrawalStats.approved}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Withdrawn:</span>
              <span className="text-green-400 font-semibold">
                ₦{withdrawalStats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <h3 className="text-sm font-semibold text-white mb-3">Referral Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Total:</span>
              <span className="text-blue-400 font-semibold">
                {referralStats.totalReferrals}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Conversion Rate:</span>
              <span className="text-green-400 font-semibold">
                {referralStats.totalClicks > 0
                  ? ((referralStats.approvedReferrals / referralStats.totalClicks) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-xs text-blue-400 hover:text-blue-300 transition">
              → View Referrals
            </button>
            <button className="w-full text-left text-xs text-blue-400 hover:text-blue-300 transition">
              → Request Withdrawal
            </button>
            <button className="w-full text-left text-xs text-blue-400 hover:text-blue-300 transition">
              → Upgrade Plan
            </button>
          </div>
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
              { label: 'Schools', icon: Users, href: '/agent/schools' },
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

export default AgentDashboard;
