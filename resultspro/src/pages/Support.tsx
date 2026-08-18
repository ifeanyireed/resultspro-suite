import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { ArrowRight01, MessageCircle, Mail, Phone, Check, Ticket01 } from '@/lib/hugeicons-compat';
import TicketSubmissionModal from '@/components/TicketSubmissionModal';

const Support: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const faqs = [
    {
      question: 'How do I upload exam results?',
      answer: 'Download the CSV template from your dashboard, fill in student scores, and upload. The system validates everything automatically and flags any errors.'
    },
    {
      question: 'Can I customize grading systems?',
      answer: 'Yes. We support WASSCE, NABTEB, NECO, and custom templates. Configure once during setup and it auto-applies to all future uploads.'
    },
    {
      question: 'Is my school data secure?',
      answer: 'Absolutely. We use end-to-end encryption, GDPR compliance, role-based access control, and daily automatic backups. Your data is always yours.'
    },
    {
      question: 'How do parents access results?',
      answer: 'Parents log in via the mobile app or web. They can view their child\'s performance, track progress over terms, and see personalized recommendations.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Paystack integration handles cards, bank transfers, and mobile money. All Nigerian payment methods are supported.'
    },
    {
      question: 'How quickly can we get started?',
      answer: 'Most schools are up and running within 24-48 hours. Our onboarding team handles CSV setup and customization. You can publish results on day one.'
    },
    {
      question: 'Do you offer volume discounts?',
      answer: 'Yes. School districts and multi-school operations get custom pricing. Contact us for an Enterprise quote.'
    },
    {
      question: 'Can we integrate with our existing systems?',
      answer: 'Yes. We offer a REST API with full documentation. Custom integrations are available for Enterprise customers.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team during business hours',
      detail: '9am - 5pm GMT'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: '24-hour response time for all inquiries',
      detail: 'support@resultspro.ng'
    },
    {
      icon: Ticket01,
      title: 'Support Ticket',
      description: 'Create a ticket for tracked assistance',
      detail: 'Recommended for technical issues',
      action: () => setIsTicketModalOpen(true)
    },
    {
      icon: Check,
      title: 'Knowledge Base',
      description: '100+ articles and video tutorials',
      detail: 'Available 24/7'
    }
  ];

  return (
    <div className="w-full bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black">
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0 opacity-60"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            We're Here to <span className="text-blue-400">Help</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
          
          <button 
            onClick={() => setIsTicketModalOpen(true)}
            className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-blue-600/20 flex gap-2 overflow-hidden px-8 py-4 rounded-full border-solid border-blue-500/30 hover:bg-blue-600/30 transition-all text-white text-lg font-semibold inline-flex mx-auto"
          >
            <Ticket01 className="w-6 h-6" />
            Create Support Ticket
          </button>
        </div>
      </section>

      {/* Support Channels */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Multiple Ways to <span className="text-blue-400">Get Support</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Choose the support method that works best for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, idx) => {
              const Icon = channel.icon;
              const isActionable = !!channel.action;
              
              return (
                <div
                  key={idx}
                  onClick={channel.action}
                  className={`relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] p-6 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] ${isActionable ? 'cursor-pointer hover:bg-white/5 hover:scale-[1.02]' : ''}`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex w-10 h-10 rounded-lg items-center justify-center bg-blue-500/30 text-blue-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{channel.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{channel.description}</p>
                  <p className="text-blue-300 text-sm font-medium">{channel.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Find answers to the most common questions about Results Pro
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-white/5 transition-all duration-300 border-solid border-[rgba(255,255,255,0.07)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <svg
                    className={`h-5 w-5 text-blue-300 flex-shrink-0 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
                  </svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 pt-0 border-t border-white/10">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist. Reach out anytime and we\'ll get back to you quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTicketModalOpen(true)}
              className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-blue-600 flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-blue-500/30 hover:bg-blue-700 transition-colors text-white text-sm font-medium inline-flex"
            >
              <Ticket01 className="w-5 h-5" />
              Submit a Ticket
            </button>
            <a 
              href="mailto:support@resultspro.ng"
              className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex"
            >
              Email Support
              <ArrowRight01 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Ticket Submission Modal */}
      <TicketSubmissionModal 
        open={isTicketModalOpen}
        onOpenChange={setIsTicketModalOpen}
      />

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
              <p className="text-gray-400 text-sm">Modern results management for Nigerian schools.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/support" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><a href="mailto:support@resultspro.ng" className="hover:text-blue-400 transition-colors">Email</a></li>
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

export default Support;
