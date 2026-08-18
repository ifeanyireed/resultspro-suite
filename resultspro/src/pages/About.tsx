import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { ArrowRight01, Zap, Users, Shield, CheckCircle } from '@/lib/hugeicons-compat';

const About: React.FC = () => {
  const values = [
    {
      icon: Zap,
      title: 'Simplicity First',
      description: 'Technology should work for teachers, not against them. We make result management effortless.'
    },
    {
      icon: Users,
      title: 'Student-Centric',
      description: 'Every feature is built with learners in mind. Results should empower, not confuse.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your school\'s data is sacred. Enterprise-grade security, Nigerian compliance, always.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Schools Using Results Pro' },
    { number: '2M+', label: 'Students Reached' },
    { number: '10M+', label: 'Results Published' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  const whyUs = [
    {
      title: 'Built for Nigeria',
      description: 'Designed by Nigerians, for Nigerian schools. We understand the education landscape, challenges, and opportunities.'
    },
    {
      title: 'Truly Affordable',
      description: 'Pay per term or annually. No hidden fees. Pricing that respects school budgets while supporting sustainable growth.'
    },
    {
      title: 'Quick Implementation',
      description: 'Get started in hours, not weeks. CSV upload, instant setup, and our team guides you every step.'
    },
    {
      title: 'Local Support',
      description: 'Real humans. Real support. In Nigerian time zones. Email, phone, and chat support when you need it.'
    }
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
            Transforming Nigerian <span className="text-blue-400">Education</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Result management shouldn't be complicated. We're making it simple, secure, and accessible for every school in Nigeria.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our <span className="text-blue-400">Mission</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We exist to solve a real problem: exam result management in Nigerian schools is outdated, time-consuming, and error-prone.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Teachers spend hours manually publishing results. Parents struggle to access their children's performance. Students wait anxiously for updates.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-blue-300 font-semibold">Results Pro exists to change this.</span> We give schools the tools to publish results securely, instantly, and accessibly. Teachers get peace of mind. Parents get transparency. Students get clarity.
              </p>
            </div>
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex w-10 h-10 rounded-lg items-center justify-center bg-red-500/30 text-red-300">X</div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">The Problem</h3>
                    <p className="text-gray-400 text-sm">Manual result processing, security risks, poor parent access, student anxiety</p>
                  </div>
                </div>
                <div className="border-t border-white/10"></div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex w-10 h-10 rounded-lg items-center justify-center bg-green-500/30 text-green-300">✓</div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Our Solution</h3>
                    <p className="text-gray-400 text-sm">Instant results, bank-level security, parent portal access, student verification tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Our <span className="text-blue-400">Core Values</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            These principles guide everything we build
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex w-12 h-12 rounded-lg items-center justify-center bg-blue-500/30 text-blue-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            By The <span className="text-blue-400">Numbers</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Growing impact across Nigerian education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 text-center shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <p className="text-gray-300 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Choose <span className="text-blue-400">Results Pro</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            We're not just another software. We're built differently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyUs.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Schools Across Nigeria
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform how your school manages results. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Get Started Free
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Contact Us
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
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
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

export default About;
