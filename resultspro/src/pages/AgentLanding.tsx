import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { IconTrendingUp as TrendingUp, IconDollarSign as DollarSign, IconUsers as Users, IconAward as Award, IconZap as Zap, IconShield as Shield, IconArrowRight as ArrowRight } from '@tabler/icons-react';

const AgentLanding = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div className="w-full bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-32 pb-20">
        {/* Background Image */}
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Earn as an Agent
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Nigeria's fastest-growing education technology network and earn up to 25% recurring commissions by referring schools to Results Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register-agent" className="items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              GET STARTED
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/auth/login" className="items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              AGENT LOGIN
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your agent account and get verified',
              },
              {
                step: '02',
                title: 'Share Link',
                description: 'Share your unique referral link with schools',
              },
              {
                step: '03',
                title: 'Schools Subscribe',
                description: 'Schools sign up through your referral link',
              },
              {
                step: '04',
                title: 'Earn Commissions',
                description: 'Receive commissions automatically monthly',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 h-full hover:bg-white/10 transition-all duration-300 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
                  <div className="text-5xl font-bold text-blue-500/30 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 bg-blue-600/20 rounded-full items-center justify-center text-white font-bold -translate-y-1/2">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">Commission Tiers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                plan: 'Free Plans',
                commission: '10%',
                description: 'One-time commission on Free plan referrals',
              },
              {
                plan: 'Pro Plans',
                commission: '15%',
                description: 'Monthly recurring commissions',
                highlighted: true,
              },
              {
                plan: 'Enterprise Plans',
                commission: '25%',
                description: 'Maximum recurring commissions',
              },
            ].map((tier, index) => (
              <div
                key={index}
                className={`rounded-[20px] p-8 border transition-all shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-[rgba(59,130,246,0.1)] border-blue-500/30 shadow-lg shadow-blue-500/10 transform scale-105'
                    : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.07)] hover:bg-white/10'
                }`}
              >
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-3">{tier.plan}</p>
                  <span className="text-5xl font-bold text-blue-400">{tier.commission}</span>
                </div>
                <p className="text-gray-300">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Become an Agent</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Passive Income',
                description: 'Earn recurring monthly commissions from schools you refer',
              },
              {
                icon: TrendingUp,
                title: 'Growing Market',
                description: 'Join a rapidly expanding education technology sector in Nigeria',
              },
              {
                icon: Award,
                title: 'High Payouts',
                description: 'Competitive commission rates up to 25% on enterprise plans',
              },
              {
                icon: Zap,
                title: 'Easy Setup',
                description: 'Simple registration and immediate access to your dashboard',
              },
              {
                icon: Users,
                title: 'Marketing Support',
                description: 'Get promotional materials and sales support from our team',
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Automatic withdrawals to your bank account every month',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-4 bg-[rgba(255,255,255,0.05)] p-8 rounded-[20px] border border-[rgba(255,255,255,0.07)] hover:bg-white/10 transition-all duration-300 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Max Commission', value: '25%' },
              { label: 'Schools Onboarded', value: '100+' },
              { label: 'Commissions Paid', value: '₦M+' },
            ].map((stat, index) => (
              <div key={index} className="bg-[rgba(255,255,255,0.05)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">Questions?</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'How do I get paid?',
                a: 'Commissions are calculated monthly and automatically transferred to your registered bank account. We support all major Nigerian banks.',
              },
              {
                q: 'When do I start earning?',
                a: 'You start earning immediately when a school referred through your link completes their first payment.',
              },
              {
                q: 'Is there a minimum payout?',
                a: 'No minimum payout required. All earned commissions are paid out automatically every month.',
              },
              {
                q: 'Can I refer multiple schools?',
                a: 'Yes! There is no limit. Earn more by building your network across multiple schools in your region.',
              },
              {
                q: 'Do I need experience?',
                a: 'No prior experience needed. We provide all the marketing materials and support you need to succeed.',
              },
              {
                q: 'How is my referral tracked?',
                a: 'Each agent gets a unique referral link. We automatically track all referrals and attribute commissions correctly.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.05)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
                onClick={() => setExpandedFaq(expandedFaq === item.q ? null : item.q)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{item.q}</h3>
                  <span className={`text-blue-400 transition-transform ${expandedFaq === item.q ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                {expandedFaq === item.q && (
                  <p className="text-gray-400 mt-4">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of agents already earning passive income from school referrals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register-agent" className="items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              BECOME AN AGENT
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex w-full sm:w-auto justify-center">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative border-t border-[rgba(255,255,255,0.07)] bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2026 Results Pro. All rights reserved.</p>
          <p className="mt-2">Empowering education in Nigeria through technology</p>
        </div>
      </footer>
    </div>
  );
};

export default AgentLanding;
