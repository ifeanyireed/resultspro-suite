import React, { useEffect, useState } from 'react';
import { Crown, Check, X, BarChart01, Users, Building2, TrendingUp, DollarSign, Calendar, User, LogOut, Trophy } from '@/lib/hugeicons-compat';
import { useAgentSubscription, useAgentProfile } from '@/hooks/useAgentAnalytics';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPlans: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { profile, fetchProfile } = useAgentProfile();
  const { pricing, loading, fetchPricing, upgradePlan } = useAgentSubscription();
  const [upgrading, setUpgrading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'termly' | 'annually'>('termly');

  useEffect(() => {
    fetchPricing();
    fetchProfile();
  }, [fetchPricing, fetchProfile]);

  const handleUpgrade = async (tier: 'Free' | 'Pro' | 'Premium') => {
    if (tier === 'Free') return;
    if (!profile) {
      alert('Please complete your profile first');
      return;
    }
    if (!window.confirm(`Upgrade to ${tier} plan?`)) return;

    try {
      setUpgrading(true);
      const result = await upgradePlan(profile.id, tier);
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        alert('Subscription updated successfully');
        fetchPricing();
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading plans...</div>
      </div>
    );
  }

  const plans = [
    {
      tier: 'Free' as const,
      name: 'Starter',
      description: 'Perfect for getting started',
      termlyFee: 0,
      commissionRate: 15,
      maxSchools: 3,
      features: [
        'Basic referral tracking',
        'Commission calculation',
        'Email support',
        'Monthly reports',
      ],
    },
    {
      tier: 'Pro' as const,
      name: 'Professional',
      description: 'For growing agents',
      termlyFee: 50000,
      commissionRate: 20,
      maxSchools: 15,
      features: [
        'Advanced referral tracking',
        'Commission calculation',
        'Gamification & badges',
        'Analytics dashboard',
        'Priority email support',
      ],
      highlighted: true,
    },
    {
      tier: 'Premium' as const,
      name: 'Enterprise',
      description: 'For professional networks',
      termlyFee: 300000,
      commissionRate: 25,
      maxSchools: 100,
      features: [
        'Unlimited referral tracking',
        'Advanced commission tracking',
        'Full gamification system',
        'Advanced analytics',
        'Dedicated account manager',
        'Custom branding',
      ],
    },
  ];

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
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-8 text-white border border-[rgba(255,255,255,0.07)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Subscription Plans</h1>
          <p className="text-gray-300 text-center md:text-left">Choose the perfect plan for your business</p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
          <button 
            onClick={() => setBillingPeriod('termly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingPeriod === 'termly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Per Term
          </button>
          <button 
            onClick={() => setBillingPeriod('annually')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billingPeriod === 'annually' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Annually
            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative rounded-[20px] border p-6 transition ${
              plan.highlighted
                ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(59,130,246,0.50)] hover:border-[rgba(59,130,246,0.70)]'
                : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:bg-white/5'
            }`}
          >
            {/* Highlighted Badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              </div>
              <p className="text-gray-400 text-sm">{plan.description}</p>
            </div>

            {/* Pricing */}
            <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.07)]">
              <div className="text-4xl font-bold text-white mb-1 font-mono">
                ₦{(billingPeriod === 'termly' ? plan.termlyFee : plan.termlyFee * 2.5).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm uppercase font-bold tracking-tighter">
                per {billingPeriod === 'termly' ? 'term' : 'year'}
              </div>
              <div className="mt-4 text-blue-300 text-sm font-semibold bg-blue-500/10 px-3 py-1 rounded-lg w-fit">
                {plan.commissionRate}% commission rate
              </div>
            </div>

            {/* Key Stats */}
            <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{plan.maxSchools}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Max Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{plan.commissionRate}%</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Commission</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleUpgrade(plan.tier)}
              disabled={upgrading || (profile?.subscriptionTier === plan.tier)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.highlighted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              } disabled:opacity-50`}
            >
              {upgrading ? 'Processing...' : profile?.subscriptionTier === plan.tier ? 'Current Plan' : plan.termlyFee === 0 ? 'Starter' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest">Detailed Comparison</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Free
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Pro
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                'Referral Tracking',
                'Commission Calculation',
                'Gamification & Badges',
                'Analytics Dashboard',
                'Priority Support',
                'API Access',
                'Custom Branding',
                'Dedicated Manager',
              ].map((feature, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-300 font-bold text-sm">{feature}</td>
                  <td className="px-6 py-4 text-center">
                    {idx < 2 ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {idx < 6 ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-10 border border-[rgba(255,255,255,0.07)] shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-8">Agent Pricing FAQs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Can I change plans anytime?
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Yes! You can upgrade or downgrade your plan anytime. Upgrades take effect immediately, while downgrades apply at the end of your current month.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              What payment methods do you accept?
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We support Paystack payments (Cards, Bank Transfer, USSD) and direct bank deposits.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              How do I earn commissions?
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              When a school you refer pays for a subscription, your commission (15-25% depending on your plan) is automatically calculated and credited to your pending balance.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              When are payouts processed?
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Withdrawal requests are reviewed and processed within 48 hours. Commissions are typically eligible for withdrawal after the referral is verified.
            </p>
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

export default SubscriptionPlans;
