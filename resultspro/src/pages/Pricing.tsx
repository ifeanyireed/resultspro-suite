import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { ArrowRight01, Check, X } from '@/lib/hugeicons-compat';

const Pricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'termly' | 'annually'>('annually');
  const [isToggleStickyNeeded, setIsToggleStickyNeeded] = useState(false);
  const heroToggleRef = useRef<HTMLDivElement>(null);
  const comparisonSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        // Show sticky toggle when the hero toggle is NOT in view
        setIsToggleStickyNeeded(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    const comparisonObserver = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky toggle when comparison section is in view
        if (entry.isIntersecting) {
          setIsToggleStickyNeeded(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (heroToggleRef.current) {
      heroObserver.observe(heroToggleRef.current);
    }

    if (comparisonSectionRef.current) {
      comparisonObserver.observe(comparisonSectionRef.current);
    }

    return () => {
      if (heroToggleRef.current) {
        heroObserver.unobserve(heroToggleRef.current);
      }
      if (comparisonSectionRef.current) {
        comparisonObserver.unobserve(comparisonSectionRef.current);
      }
    };
  }, []);

  // Reusable toggle component
  const BillingPeriodToggle = ({ sticky = false }) => (
    <div className={`inline-flex items-center rounded-full p-1 bg-gradient-to-b from-gray-700 to-gray-800 border border-gray-600/50 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${sticky ? 'fixed top-20 left-1/2 transform -translate-x-1/2 z-40' : ''}`}>
      {['termly', 'annually'].map((period, idx) => (
        <button
          key={period}
          onClick={() => setBillingPeriod(period as 'termly' | 'annually')}
          className={`px-6 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            billingPeriod === period
              ? 'rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]'
              : 'text-gray-300 hover:text-white'
          } ${idx !== 0 ? 'ml-1' : ''}`}
        >
          {period === 'termly' && 'Per Term'}
          {period === 'annually' && (
            <span>
              Annually
              <span className="ml-1.5 text-green-300 text-xs font-semibold">(Save 17%)</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const pricingPlans = [
    {
      name: 'Free',
      studentCount: '0-100',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for testing Results Pro',
      highlighted: false,
      features: {
        included: [
          'CSV result upload',
          'Basic result publishing',
          'Parent viewing portal',
          'Email notifications',
          'Basic analytics',
          'Email support',
        ],
        excluded: [
          'Result checker (scratch cards)',
          'Mobile app access',
          'Advanced analytics',
          'SMS notifications',
          'Priority support',
          'Custom branding',
          'API access',
          'White-label option'
        ]
      },
      cta: 'Get Started Free',
      ctaLink: '/auth/register'
    },
    {
      name: 'Pro',
      studentCount: '101-2,000',
      monthlyPrice: 50000,
      annualPrice: 150000,
      description: 'For growing schools',
      highlighted: true,
      features: {
        included: [
          'All Free features',
          'Result checker with scratch cards',
          'Parent mobile app access',
          'Advanced analytics',
          'SMS notifications',
          'Priority email support',
          'Custom branding',
          'Batch processing',
          'CSV data export',
        ],
        excluded: [
          'Multiple schools management',
          'API access',
          'White-label option',
          'Dedicated account manager',
          'Custom integrations'
        ]
      },
      cta: 'Start Free Trial',
      ctaLink: '/auth/register'
    },
    {
      name: 'Enterprise',
      studentCount: 'Unlimited',
      monthlyPrice: 200000,
      annualPrice: 600000,
      description: 'For large school networks',
      highlighted: false,
      features: {
        included: [
          'All Pro features',
          'Multiple schools management',
          'White-label platform',
          'Dedicated account manager',
          '24/7 phone & email support',
          'API access',
          'Custom integrations',
          'Advanced security features',
          'Custom SLA agreement',
        ],
        excluded: []
      },
      cta: 'Contact Sales',
      ctaLink: '/contact'
    }
  ];

  const comparisonFeatures = [
    'CSV Upload',
    'Result Publishing',
    'Basic Analytics',
    'Advanced Analytics',
    'Scratch Cards',
    'Mobile App',
    'SMS Notifications',
    'Custom Branding',
    'API Access',
    'Multiple Schools',
    'White-Label',
    'Priority Support',
    '24/7 Support'
  ];

  return (
    <div className="w-full bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black">
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Simple, Transparent <span className="text-blue-400">Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Choose the perfect plan for your school. All plans include core features. Upgrade anytime.
          </p>
          <div ref={heroToggleRef}>
            <BillingPeriodToggle sticky={false} />
          </div>
        </div>
      </section>

      {/* Sticky Toggle - appears when hero toggle scrolls out of view */}
      {isToggleStickyNeeded && (
        <BillingPeriodToggle sticky={true} />
      )}

      {/* Pricing Cards Section */}
      <section className="relative pt-4 pb-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-[30px] border overflow-hidden flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? 'shadow-[0_1px_3px_0_rgba(199,220,255,0.60)_inset,0_0_60px_0_rgba(198,204,255,0.45)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] hover:bg-white/10 border-solid border-[rgba(255,255,255,0.07)]'
                    : 'shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 border-solid border-[rgba(255,255,255,0.07)]'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-2 text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow">
                  {/* Plan name and count */}
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.studentCount} students</p>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{plan.description}</p>

                  {/* Pricing */}
                  <div className="mb-8">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-white">
                            ₦{billingPeriod === 'termly' ? plan.monthlyPrice.toLocaleString() : plan.annualPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-400">{billingPeriod === 'termly' ? '/term' : '/year'}</span>
                        </div>
                        {billingPeriod === 'termly' && (
                          <p className="text-xs text-gray-500 mt-2">
                            Billed ₦{plan.monthlyPrice.toLocaleString()} per academic term
                          </p>
                        )}
                        {billingPeriod === 'annually' && plan.annualPrice && (
                          <p className="text-xs text-gray-500 mt-2">
                            Billed ₦{plan.annualPrice.toLocaleString()} per year (3 months free)
                          </p>
                        )}
                        {plan.monthlyPrice > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            (~${(plan.monthlyPrice / 1500).toFixed(0)} per term USD)
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-300">Custom pricing</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={plan.ctaLink}
                    className={`glow-button items-center border flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid transition-colors text-sm font-medium inline-flex justify-center w-full mb-8 ${
                      plan.highlighted
                        ? 'shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white'
                        : 'shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features List */}
                  <div className="space-y-3 flex-grow">
                    {plan.features.included.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {plan.features.excluded.map((feature, i) => (
                      <div key={`excluded-${i}`} className="flex items-start gap-3 opacity-50">
                        <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section ref={comparisonSectionRef} className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Detailed <span className="text-blue-400">Comparison</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            See exactly what features are included in each plan
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-300 font-semibold">Free</th>
                  <th className="text-center py-4 px-6 text-gray-300 font-semibold">Pro</th>
                  <th className="text-center py-4 px-6 text-gray-300 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => {
                  const availability = {
                    'CSV Upload': [true, true, true],
                    'Result Publishing': [true, true, true],
                    'Basic Analytics': [true, true, true],
                    'Advanced Analytics': [false, true, true],
                    'Scratch Cards': [false, true, true],
                    'Mobile App': [false, true, true],
                    'SMS Notifications': [false, true, true],
                    'Custom Branding': [false, true, true],
                    'API Access': [false, false, true],
                    'Multiple Schools': [false, false, true],
                    'White-Label': [false, false, true],
                    'Priority Support': [false, true, true],
                    '24/7 Support': [false, false, true],
                  };

                  return (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-gray-300">{feature}</td>
                      {availability[feature as keyof typeof availability]?.map((available, i) => (
                        <td key={i} className="text-center py-4 px-6">
                          {available ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Pricing <span className="text-blue-400">FAQ</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Common questions about our pricing and plans
          </p>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle. No cancellation fees.'
              },
              {
                q: 'What happens if I exceed my student count?',
                a: 'You\'ll be notified when you\'re approaching the limit. You can upgrade to the next tier anytime. We\'ll add a pro-rata credit for any unused time.'
              },
              {
                q: 'What are scratch cards?',
                a: 'Scratch cards are a revenue-generating feature available on Pro and Enterprise plans. Schools can purchase and resell them to parents/students as a gamified way to access exam results.'
              },
              {
                q: 'Do you offer discounts for multi-year contracts?',
                a: 'Yes! Contact our sales team for custom quotes on 2-3 year contracts. We also offer volume discounts for school districts with multiple schools.'
              },
              {
                q: 'Is there a free trial?',
                a: 'All plans include a 14-day free trial. The Free tier is literally free forever for up to 100 students. Enterprise plans include custom trial periods.'
              },
              {
                q: 'How do I get started with scratches cards?',
                a: 'Schools on Pro or Enterprise plans can contact our sales team for scratch card details and pricing. We\'ll provide all the information you need to start generating additional revenue.'
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] overflow-hidden"
              >
                <details className="group p-6">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-white hover:text-blue-300 transition-colors">
                    <span className="text-base md:text-lg">{faq.q}</span>
                    <span className="transition group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-400 leading-relaxed text-sm md:text-base">{faq.a}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join schools across Nigeria using Results Pro. Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Start Free Trial
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
              <p className="text-gray-400 text-sm">
                Modern results management for Nigerian schools.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Results Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
