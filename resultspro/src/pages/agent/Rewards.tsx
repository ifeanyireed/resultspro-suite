import React, { useEffect, useState } from 'react';
import { Trophy, Star, Medal, Award, Zap, Crown, BarChart01, Users, TrendingUp, DollarSign, Calendar, User, LogOut } from '@/lib/hugeicons-compat';
import { useAgentRewards } from '@/hooks/useAgentAnalytics';
import { useNavigate } from 'react-router-dom';

const BADGE_ICONS: Record<string, React.ReactNode> = {
  FIRST_SCHOOL: <Star className="w-8 h-8 text-yellow-400" />,
  FIVE_SCHOOLS: <Medal className="w-8 h-8 text-blue-400" />,
  TEN_SCHOOLS: <Trophy className="w-8 h-8 text-purple-400" />,
  REFERRAL_MASTER: <Award className="w-8 h-8 text-green-400" />,
  TOP_PERFORMER: <Trophy className="w-8 h-8 text-red-400" />,
  POWER_AGENT: <Zap className="w-8 h-8 text-orange-400" />,
  PREMIUM_SUBSCRIBER: <Crown className="w-8 h-8 text-yellow-500" />,
};

export const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { rewards, leaderboard, loading, fetchRewards, fetchLeaderboard } = useAgentRewards('');
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    fetchRewards();
    setLeaderboardLoading(true);
    fetchLeaderboard(100).finally(() => setLeaderboardLoading(false));
  }, [fetchRewards, fetchLeaderboard]);

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative pb-20">
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
        <h1 className="text-3xl font-bold mb-2">Rewards & Gamification</h1>
        <p className="text-gray-300">Track your points, badges, and ranking</p>
      </div>

      {rewards && (
        <>
          {/* Points Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 text-white border border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors">
              <div className="text-sm text-gray-400 mb-2">Current Balance</div>
              <div className="text-4xl font-bold mb-4">{rewards.pointsBalance}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 text-white border border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors">
              <div className="text-sm text-gray-400 mb-2">Lifetime Points</div>
              <div className="text-4xl font-bold mb-4">{rewards.lifetimePoints}</div>
              <div className="text-xs text-gray-400">All Time</div>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 text-white border border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors">
              <div className="text-sm text-gray-400 mb-2">Leaderboard Rank</div>
              <div className="text-4xl font-bold mb-4">
                {rewards.leaderboardRank ? `#${rewards.leaderboardRank}` : '—'}
              </div>
              <div className="text-xs text-gray-400">Top Agents</div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-6 border border-[rgba(255,255,255,0.07)]">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Your Badges ({rewards.badges?.length || 0})
            </h2>

            {rewards.badges && rewards.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rewards.badges.map((badge: any, idx: number) => (
                  <div
                    key={idx}
                    className="text-center bg-[rgba(0,0,0,0.40)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-center mb-2">
                      {BADGE_ICONS[badge.badgeType] || <Award className="w-8 h-8 text-gray-400" />}
                    </div>
                    <div className="text-xs font-semibold text-white">{badge.badgeType}</div>
                    <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No badges earned yet. Keep working to unlock achievements!</p>
              </div>
            )}
          </div>

          {/* Points Breakdown */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-6 border border-[rgba(255,255,255,0.07)]">
            <h2 className="text-lg font-semibold text-white mb-4">How Points Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[rgba(0,0,0,0.40)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
                <div className="text-blue-400 font-semibold text-sm mb-1">School Signup</div>
                <div className="text-2xl font-bold text-white">50 pts</div>
              </div>
              <div className="bg-[rgba(0,0,0,0.40)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
                <div className="text-green-400 font-semibold text-sm mb-1">Referral Completed</div>
                <div className="text-2xl font-bold text-white">100 pts</div>
              </div>
              <div className="bg-[rgba(0,0,0,0.40)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
                <div className="text-yellow-400 font-semibold text-sm mb-1">Referral Approved</div>
                <div className="text-2xl font-bold text-white">150 pts</div>
              </div>
              <div className="bg-[rgba(0,0,0,0.40)] rounded-[20px] p-4 border border-[rgba(255,255,255,0.07)]">
                <div className="text-purple-400 font-semibold text-sm mb-1">Monthly Goal Hit</div>
                <div className="text-2xl font-bold text-white">300 pts</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Leaderboard */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top 100 Agents
          </h2>
        </div>

        {leaderboardLoading ? (
          <div className="p-8 text-center text-gray-400">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No agents on leaderboard</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(0,0,0,0.40)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Lifetime Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">
                    Schools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.07)]">
                {leaderboard.map((agent: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                        {idx === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                        {idx === 2 && <Medal className="w-5 h-5 text-orange-400" />}
                        <span className="font-semibold text-white">#{idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">
                        {agent.user?.firstName} {agent.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-400">{agent.state || agent.locationType || 'Agent'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold text-lg">{agent.lifetimePoints}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-semibold">
                        {agent.badges?.length || 0} badges
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {agent.schoolAssignments?.length || 0} schools
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default Rewards;