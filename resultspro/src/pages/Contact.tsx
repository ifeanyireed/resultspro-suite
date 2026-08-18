import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import { ArrowRight01, Mail, Phone, MapPin, MessageCircle } from '@/lib/hugeicons-compat';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${baseURL}/support/contact`, formData);
      
      setFormStatus('success');
      setFormData({
        name: '',
        school: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setFormStatus('error');
      // Reset status after 5 seconds to allow retry
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'General Support',
      value: 'support@resultspro.ng',
      description: 'For technical issues and general inquiries',
      action: 'mailto:support@resultspro.ng'
    },
    {
      icon: Mail,
      title: 'Sales Inquiries',
      value: 'sales@resultspro.ng',
      description: 'For enterprise plans and partnerships',
      action: 'mailto:sales@resultspro.ng'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '08035428870',
      description: 'Mon-Fri, 9AM-6PM WAT',
      action: 'tel:08035428870'
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'AMG Workspace, Festac, Lagos',
      description: '22 Road, Festac, Lagos, Nigeria',
      action: '#'
    }
  ];

  const faqs = [
    {
      q: 'What\'s your response time?',
      a: 'We typically respond to support inquiries within 4 business hours. Sales inquiries get priority response within 2 hours.'
    },
    {
      q: 'Do you offer phone support?',
      a: 'Yes! Call us at 08035428870. Our team is available Monday-Friday, 9AM-6PM WAT.'
    },
    {
      q: 'Can I schedule a demo?',
      a: 'Absolutely. Contact our sales team at sales@resultspro.ng and we\'ll arrange a customized demo for your school.'
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
            Get in <span className="text-blue-400">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
            We're here to help. Whether you have questions, need support, or want to explore a partnership—reach out.
          </p>
          <p className="text-gray-400 text-sm">We typically respond within 4 business hours</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Contact <span className="text-blue-400">Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <a
                  key={idx}
                  href={method.action}
                  className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] p-6 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex w-10 h-10 rounded-lg items-center justify-center bg-blue-500/30 text-blue-300 group-hover:bg-blue-500/40 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-blue-300 font-medium text-sm mb-2">{method.value}</p>
                  <p className="text-gray-400 text-xs">{method.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Send us a <span className="text-blue-400">Message</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">School Name</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                      placeholder="Your school"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                  >
                    <option value="general">General Question</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    formStatus === 'success'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : formStatus === 'error'
                      ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                      : 'bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 text-white hover:shadow-[0_6px_16px_rgba(59,130,246,0.5)] shadow-[0_4px_12px_rgba(59,130,246,0.4)] disabled:opacity-50'
                  }`}
                >
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'success' && 'Message sent! ✓'}
                  {formStatus === 'error' && 'Error sending. Try again.'}
                  {formStatus === 'idle' && (
                    <>
                      Send Message
                      <ArrowRight01 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Response Time */}
              <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
                <h3 className="text-lg font-semibold text-white mb-4">Response Time</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-300">▪</div>
                    <div>
                      <p className="text-white font-medium text-sm">General Support</p>
                      <p className="text-gray-400 text-xs">Within 4 business hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-blue-300">▪</div>
                    <div>
                      <p className="text-white font-medium text-sm">Sales Inquiries</p>
                      <p className="text-gray-400 text-xs">Within 2 business hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-blue-300">▪</div>
                    <div>
                      <p className="text-white font-medium text-sm">Urgent Issues</p>
                      <p className="text-gray-400 text-xs">Call us directly at 08035428870</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Whatsapp chat */}
              <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-gradient-to-b from-blue-500/20 to-blue-600/10 border-solid border-blue-400/30 p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex w-12 h-12 rounded-lg items-center justify-center bg-blue-500/40 text-blue-300 animate-pulse">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Whatsapp chat</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Chat with our team in real-time on Whatsapp. We're usually online Monday-Friday, 9AM-6PM WAT.
                    </p>
                    <a 
                      href="https://wa.me/2348035428870" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/50 text-blue-300 text-sm font-medium transition-colors"
                    >
                      Chat on Whatsapp
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Quick Help</h3>
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-medium text-white hover:text-blue-300 transition-colors">
                      {faq.q}
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-gray-400 text-sm">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
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
            Don't have time for a conversation? Start your free trial immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Start Free Trial
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/about" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Learn More
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

export default Contact;
