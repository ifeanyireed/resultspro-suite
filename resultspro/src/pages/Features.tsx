import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/ui/FeatureCard';
import { ArrowRight01, Check, XClose } from '@/lib/hugeicons-compat';

const Features: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const featureCategories = [
    {
      id: 'all',
      name: 'All Features',
    },
    {
      id: 'admin',
      name: 'Core Administration',
    },
    {
      id: 'results',
      name: 'Result Management',
    },
    {
      id: 'analytics',
      name: 'Analytics & Insights',
    },
    {
      id: 'engagement',
      name: 'Engagement',
    },
    {
      id: 'operations',
      name: 'Operations',
    },
  ];

  const allFeatures = [
    // CORE ADMINISTRATION
    {
      category: 'admin',
      title: 'Custom School Branding',
      description: 'Upload your logo and choose a color scheme that matches your school\'s brand. Every result sheet and portal feels like a natural extension of your institution.',
      icon: null,
      image: '/custom-branding.png',
      features: ['Logo integration', 'Custom colors', 'Branded portals', 'Professional presence'],
    },
    {
      category: 'admin',
      title: 'Guided School Setup Wizard',
      description: 'Setting up your school is a breeze. Our intuitive wizard allows you to configure your entire school digital presence in minutes, not days.',
      icon: null,
      image: '/school-setup.png',
      features: ['Easy onboarding', 'Quick configuration', 'Step-by-step guidance', 'Instant activation'],
    },

    // RESULT MANAGEMENT
    {
      category: 'results',
      title: 'Advanced Results Engine',
      description: 'Configure complex exam components from C.A. to Finals. Define Affective and Psychomotor domains to match your school\'s unique academic standards.',
      icon: null,
      image: '/advanced-system.png',
      features: ['Custom components', 'C.A. + Finals', 'Domain configuration', 'Flexible grading'],
    },
    {
      category: 'results',
      title: '90% Faster Processing',
      description: 'Eliminate manual entry errors. Teachers simply upload a CSV file to sync results instantly, reducing administrative workload by up to 90%.',
      icon: null,
      image: '/faster-processing.png',
      features: ['Bulk CSV import', 'Error detection', 'Auto-validation', 'Rapid syncing'],
    },

    // ENGAGEMENT
    {
      category: 'engagement',
      title: 'Mobile-Responsive Result Checker',
      description: 'A visually stunning, glassmorphic interface that allows students and parents to check results securely on any device, anywhere in the world.',
      icon: null,
      image: '/result-checker.png',
      features: ['Mobile-first design', 'Secure access', 'Glassmorphic UI', 'Real-time viewing'],
    },
    {
      category: 'engagement',
      title: 'Viral Social Achievement Cards',
      description: 'Students can generate branded Social Share Cards to celebrate their achievements on WhatsApp or Instagram, turning students into brand ambassadors.',
      icon: null,
      image: '/social-share.png',
      features: ['One-click sharing', 'Branded graphics', 'Achievement celebration', 'School promotion'],
    },

    // OPERATIONS
    {
      category: 'operations',
      title: 'Integrated Scratch Card System',
      description: 'Recover costs or generate revenue by requiring a digital PIN for result access. Automated revenue collection without the paperwork.',
      icon: null,
      image: '/scratchcards.png',
      features: ['Monetization tools', 'PIN-based access', 'Revenue recovery', 'Cost management'],
    },
    {
      category: 'operations',
      title: 'Automated PIN Management',
      description: 'Request digital PIN batches, track payments, and manage distribution directly from your administrator dashboard.',
      icon: null,
      image: '/digital-pins.png',
      features: ['Batch requests', 'Payment tracking', 'Distribution control', 'Usage analytics'],
    },

    // ANALYTICS & INSIGHTS
    {
      category: 'analytics',
      title: 'Principals\' Analytics Dashboard',
      description: 'Get a bird\'s-eye view of your entire school. Track subject performance across classes and monitor overall growth trends with ease.',
      icon: null,
      image: '/analytics.png',
      features: ['Executive overview', 'Subject analysis', 'Growth tracking', 'Live insights'],
    },
    {
      category: 'analytics',
      title: 'Proactive Academic Intervention',
      description: 'Identify at-risk students instantly through data-driven insights. Turn raw grades into actionable academic intervention plans.',
      icon: null,
      image: '/proactive-rec.png',
      features: ['At-risk detection', 'Subject benchmarking', 'Data-driven insights', 'Proactive planning'],
    },
    {
      category: 'results',
      title: 'Automated Position & Ranking Engine',
      description: 'Automatically calculate class positions, subject rankings, and grade averages with 100% accuracy, eliminating hours of manual math.',
      icon: null,
      image: '/leaderboard.png',
      features: ['Class ranking', 'Subject rankings', 'Automatic averages', 'Instant calculations'],
    },
    {
      category: 'admin',
      title: 'Branded PDF Report Cards',
      description: 'Beyond the digital checker, generate high-quality, printable PDF report cards featuring your school\'s logo, principal\'s signature, and detailed comments.',
      icon: null,
      image: '/gradebook.png',
      features: ['Print-ready PDFs', 'Auto-signatures', 'School branding', 'Detailed remarks'],
    },
  ];

  const displayedFeatures = selectedCategory === 'all' 
    ? allFeatures 
    : allFeatures.filter(f => f.category === selectedCategory);

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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Everything Schools Need
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Result publishing, analytics, parent engagement, secure payments, support tools, and agent programs. All in one platform built for Nigerian schools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Get Started
              <ArrowRight01 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-16 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {featureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFeatures.map((feature, index) => {
              return (
                <FeatureCard
                  key={index}
                  preview={
                    feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className={`h-auto rounded-md object-cover ${feature.image === '/Score.png' ? 'w-1/2 mx-auto' : 'w-full'}`}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex w-8 h-8 shrink-0 rounded-lg items-center justify-center bg-[#3395FF]">
                          {/* @ts-ignore */}
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-300 font-medium">Feature {index + 1}</div>
                          <div className="text-gray-500">Learn more →</div>
                        </div>
                      </div>
                    )
                  }
                  isImagePreview={!!feature.image}
                  title={feature.title}
                  description={feature.description}
                  buttonText="Learn more →"
                  onClick={() => feature.image && setZoomedImage(feature.image)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Deep Dive Into <span className="text-blue-400">Capabilities</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Explore the comprehensive toolset designed for modern education management
          </p>

          <div className="space-y-8">
            {/* Feature Detail 1 */}
            <div className="relative rounded-[30px] border shadow-[0_1px_3px_0_rgba(199,220,255,0.30)_inset,0_0_60px_0_rgba(198,204,255,0.22)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] p-8 overflow-hidden hover:bg-white/10 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Instant Result Publishing
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Upload CSV files → Auto-formatted result slips → One-click PDFs → Email to all parents. What used to take 3 hours now takes 5 minutes.
                  </p>
                  <ul className="space-y-3">
                    {['CSV auto-validation', 'PDF generation', 'Bulk email', 'Archive management', 'Version control', 'Batch processing'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="flex items-center justify-center rounded-2xl min-h-[300px] cursor-zoom-in"
                  onClick={() => setZoomedImage('/gradebook.png')}
                >
                  <img 
                    src="/gradebook.png" 
                    alt="Result Publishing"
                    className="h-auto rounded-md object-cover w-full"
                  />
                </div>
              </div>
            </div>

            {/* Feature Detail 2 */}
            <div className="relative rounded-[30px] border shadow-[0_1px_3px_0_rgba(199,220,255,0.30)_inset,0_0_60px_0_rgba(198,204,255,0.22)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] p-8 overflow-hidden hover:bg-white/10 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="flex items-center justify-center rounded-2xl min-h-[300px] cursor-zoom-in"
                  onClick={() => setZoomedImage('/analytics2.png')}
                >
                  <img 
                    src="/analytics2.png" 
                    alt="Parent Engagement"
                    className="h-auto rounded-md object-cover w-full"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Advanced Student Analytics
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Not just grades. Get AI-powered at-risk detection, attendance impact analysis, subject performance benchmarking, and personalized improvement recommendations.
                  </p>
                  <ul className="space-y-3">
                    {['At-risk scoring (0-100)', 'Class comparison', 'Attendance correlation', '20+ report types', 'Trend visualization', 'Personalized alerts'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Detail 3 */}
            <div className="relative rounded-[30px] border shadow-[0_1px_3px_0_rgba(199,220,255,0.30)_inset,0_0_60px_0_rgba(198,204,255,0.22)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] p-8 overflow-hidden hover:bg-white/10 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Enterprise Security & Compliance
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    End-to-end encryption, GDPR compliant, role-based access control, audit trails, daily automatic backups, and one-click data restoration.
                  </p>
                  <ul className="space-y-3">
                    {['E2E encryption', 'GDPR compliant', 'Role-based access', 'Audit logging', 'Daily backups', 'Data export'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="flex items-center justify-center rounded-2xl min-h-[300px] cursor-zoom-in"
                  onClick={() => setZoomedImage('/security.png')}
                >
                  <img 
                    src="/security.png" 
                    alt="Security"
                    className="h-auto rounded-md object-cover w-full"
                  />
                </div>
              </div>
            </div>

            {/* Feature Detail 4 - NEW */}
            <div className="relative rounded-[30px] border shadow-[0_1px_3px_0_rgba(199,220,255,0.30)_inset,0_0_60px_0_rgba(198,204,255,0.22)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] p-8 overflow-hidden hover:bg-white/10 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="flex items-center justify-center rounded-2xl min-h-[300px] cursor-zoom-in"
                  onClick={() => setZoomedImage('/scratchcards.png')}
                >
                  <img 
                    src="/scratchcards.png" 
                    alt="Monetization"
                    className="h-auto rounded-md object-cover w-full"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Built-In Monetization
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    3-tier subscription plans (Free/Pro/Enterprise). Paystack integration, auto-invoicing, tax calculation, and agent referral program with 15-25% commissions.
                  </p>
                  <ul className="space-y-3">
                    {['3-tier pricing', 'Paystack payments', 'Auto-invoicing', 'Commission tracking', 'Multi-currency', 'Referral program'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Compare Plans & Features
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Everything you need, from starter to enterprise
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
                {[
                  { name: 'Result Publishing & CSV Import', starter: true, pro: true, enterprise: true },
                  { name: 'Student Analytics (5 reports)', starter: true, pro: true, enterprise: true },
                  { name: 'Mobile App Access', starter: false, pro: true, enterprise: true },
                  { name: 'Advanced Analytics (20+ reports)', starter: false, pro: true, enterprise: true },
                  { name: 'At-Risk Student Detection', starter: false, pro: true, enterprise: true },
                  { name: 'Achievement Graphics & Sharing', starter: false, pro: true, enterprise: true },
                  { name: 'Scratch Card Verification', starter: false, pro: false, enterprise: true },
                  { name: 'Multi-School Management', starter: false, pro: false, enterprise: true },
                  { name: 'Agent Referral Program', starter: false, pro: false, enterprise: true },
                  { name: 'API Access', starter: false, pro: false, enterprise: true },
                  { name: 'Priority Support (SLA)', starter: false, pro: false, enterprise: true },
                  { name: 'Dedicated Account Manager', starter: false, pro: false, enterprise: true },
                  { name: 'Student Limit', starter: '100', pro: '2,000', enterprise: 'Unlimited' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-gray-300">{item.name}</td>
                    <td className="text-center py-4 px-6">
                      {item.starter === true ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : item.starter === false ? (
                        <div className="w-5 h-5 border border-gray-600 rounded mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-300">{item.starter}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {item.pro === true ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : item.pro === false ? (
                        <div className="w-5 h-5 border border-gray-600 rounded mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-300">{item.pro}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {item.enterprise === true ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : item.enterprise === false ? (
                        <div className="w-5 h-5 border border-gray-600 rounded mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-300">{item.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl top-1/2 left-0 -translate-y-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl bottom-0 right-0" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Real-World <span className="text-blue-400">Use Cases</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            See how schools use Results Pro to streamline their workflows
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Publishing Term Results',
                description: 'Upload CSV, auto-generate result slips in your school format, email to 500+ parents instantly. Zero manual work.',
                steps: ['Upload results CSV', 'Select grading template', 'Auto-format documents', 'Email to parents'],
                image: '/publishing.png'
              },
              {
                title: 'Identifying At-Risk Students',
                description: 'System automatically flags students at-risk. See who needs help before they fall behind. Get intervention recommendations.',
                steps: ['View risk dashboard', 'See 0-100 risk scores', 'Read recommendations', 'Plan interventions'],
                image: '/proactive-rec.png'
              },
              {
                title: 'Parent Engagement',
                description: 'Parents get push notifications when results publish. They can check child performance, see achievements, and download graphics for social media.',
                steps: ['Parents get alerts', 'View analytics', 'Share achievements', 'Track progress'],
                image: '/social-share.png'
              },
              {
                title: 'Result Verification',
                description: 'Students scratch cards to check results. Gamified experience reduces admin burden by 80%. No more result queries.',
                steps: ['Student login', 'Scratch virtual card', 'View results', 'Share with parents'],
                image: '/gradebook.png'
              },
              {
                title: 'Financial Reporting',
                description: 'Auto-generated invoices, tax calculations, usage tracking. Know exactly how many students you have vs plan limits.',
                steps: ['View dashboard', 'Check usage vs limits', 'Download invoices', 'Track revenue'],
                image: '/scratchcards.png'
              },
              {
                title: 'Multi-School Operations',
                description: 'Manage 10+ schools. Send network alerts, compare performance across schools, bulk operations in seconds.',
                steps: ['SuperAdmin overview', 'View all schools', 'Compare performance', 'Bulk actions'],
                image: '/result-checker.png'
              }
            ].map((useCase, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] overflow-hidden flex flex-col shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
              >
                {/* Image */}
                <div 
                  className="w-full h-40 overflow-hidden cursor-zoom-in"
                  onClick={() => setZoomedImage(useCase.image)}
                >
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-white">{useCase.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-center gap-3">
                        <div className="flex w-6 h-6 rounded-full items-center justify-center bg-blue-500/30 text-blue-300 text-xs font-semibold flex-shrink-0">
                          {stepIdx + 1}
                        </div>
                        <span className="text-sm text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training & Support Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Training & <span className="text-blue-400">Support</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            We're here to help you succeed every step of the way
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Live Chat Support',
                description: 'Chat with our team during business hours. Real people answering real questions about your setup.',
                icon: '💬',
                image: '/Social.png'
              },
              {
                title: 'Video Tutorials',
                description: 'Step-by-step video guides for CSV upload, analytics setup, parent engagement, and more.',
                icon: '🎥',
                image: '/video.png'
              },
              {
                title: 'Knowledge Base',
                description: 'Browse 100+ articles covering every feature. Searchable, organized by topic, always updated.',
                icon: '📚',
                image: '/LessonDashboard.png'
              },
              {
                title: 'Weekly Webinars',
                description: 'Live sessions every week covering best practices, new features, and advanced use cases.',
                icon: '🎓',
                image: '/Results.png'
              },
              {
                title: 'Email Support',
                description: '24-hour response time for all inquiries. Detailed solutions and personalized help.',
                icon: '✉️',
                image: '/Payment.png'
              },
              {
                title: 'Community Forum',
                description: 'Connect with other schools. Share tips, ask questions, learn from peers.',
                icon: '👥',
                image: '/Score.png'
              },
              {
                title: 'Onboarding Sessions',
                description: 'Get personalized setup help from our implementation team. We walk you through everything.',
                icon: '🚀',
                image: '/Results.png'
              },
              {
                title: 'Dedicated Manager',
                description: 'Enterprise clients get a dedicated account manager for all your needs.',
                icon: '⭐',
                image: '/Social.png'
              }
            ].map((support, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] overflow-hidden flex flex-col shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
              >
                {/* Image */}
                <div 
                  className="w-full h-32 overflow-hidden cursor-zoom-in"
                  onClick={() => setZoomedImage(support.image)}
                >
                  <img 
                    src={support.image} 
                    alt={support.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-white">{support.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{support.description}</p>
                </div>
              </div>
            ))}
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
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Find answers to common questions about Results Pro
          </p>

          <div className="space-y-4">
            {[
              {
                q: 'How do I upload results?',
                a: 'Download the CSV template (adapts to your grading system automatically). Upload in bulk for all classes at once. The system validates everything and flags errors. No coding needed.'
              },
              {
                q: 'Can I use my own grading system?',
                a: 'Yes! We support WASSCE, NABTEB, NECO, and custom systems. Configure once during setup, and it auto-applies to all future uploads.'
              },
              {
                q: 'Do teachers need accounts?',
                a: 'Nope. Teachers upload CSV files, that\'s it. No password resets, no login issues, no admin burden managing teacher accounts.'
              },
              {
                q: 'How are at-risk students identified?',
                a: 'Our AI analyzes scores below 50%, attendance below 70%, declining trends, and weak subjects. Gives each student a 0-100 risk score. Includes intervention recommendations.'
              },
              {
                q: 'Is the mobile app free?',
                a: 'Yes. Available on iOS and Android for free. Parents get push notifications when results publish, offline access, and full analytics.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'Paystack integration handles cards, bank transfers, and mobile money. All Nigerian payment methods supported.'
              },
              {
                q: 'Can we use this for multiple schools?',
                a: 'Yes! Enterprise plan allows unlimited schools on one dashboard. Network alerts, bulk operations, cross-school analytics all included.'
              },
              {
                q: 'What if we have payment issues?',
                a: 'Enterprise clients get dedicated account managers with 1-hour response SLA. For other plans, our support team responds within 24 hours.'
              },
              {
                q: 'Is data secure?',
                a: 'End-to-end encryption, GDPR compliant, role-based access control, daily automatic backups, and one-click data export. Your data is always yours.'
              },
              {
                q: 'Can agents earn commissions?',
                a: 'Yes! Join our referral program and earn 15-25% per school. Get points, badges, and access a leaderboard. Multiple payout options.'
              },
              {
                q: 'What support do you offer?',
                a: 'Live chat during business hours, email (24-hour response), knowledge base with 100+ articles, weekly webinars, and video tutorials.'
              },
              {
                q: 'Can we integrate with our existing system?',
                a: 'Yes! RESTful API with full documentation, type-safe TypeScript, and integration examples. Custom integrations available for Enterprise.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] overflow-hidden shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
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
            Ready to Transform Result Management?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Publish results faster, identify at-risk students, engage parents, earn commissions. All in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Start Free Trial
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Back to Home
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
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
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

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImage(null);
            }}
          >
            <XClose className="w-6 h-6" />
          </button>
          <div 
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedImage} 
              alt="Zoomed Feature" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
