"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconFileText as ScrollText, IconShieldCheck as ShieldCheck, IconClock as Clock, IconScale as Scale } from '@tabler/icons-react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using ResultsPRO (the \"Service\"), you agree to be bound by these Terms and Conditions. If you do not agree, you may not use the Service."
    },
    {
      title: "2. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use this Service. Any unauthorized use of your account must be reported immediately."
    },
    {
      title: "3. Virtual Currency (Coins)",
      content: "Coins earned on ResultsPRO have no real-world monetary value outside our specific payout system. We reserve the right to modify coin reward rates or expire balances for inactive accounts (over 12 months) without notice."
    },
    {
      title: "4. Pro Subscription",
      content: "Pro subscriptions are billed monthly. You can cancel at any time, but no refunds will be issued for partial months already paid."
    },
    {
      title: "5. Prohibited Conduct",
      content: "You agree not to: (a) cheat or use automated systems to answer questions; (b) harass other users; (c) attempt to reverse engineer the application; or (d) use the Service for any illegal purposes."
    },
    {
      title: "6. Limitation of Liability",
      content: "ResultsPRO is provided \"as is\". We do not guarantee that the Service will always be available or error-free. We are not liable for any academic outcomes or financial losses related to your use of the Service."
    }
  ];

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-3xl bg-green/10 border border-green/20 flex items-center justify-center mx-auto mb-8">
              <ScrollText className="w-10 h-10 text-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-4">Terms & Conditions</h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Last Updated: April 8, 2026</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/5">
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-green mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Legally Binding</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">10 Min Read</p>
              </div>
              <div className="text-center">
                <Scale className="w-6 h-6 text-amber mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Fair Usage</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-green mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Secure</p>
              </div>
            </div>

            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{section.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="pt-12 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm italic">
                Questions about our terms? Contact us at <span className="text-green">legal@resultspro.ng</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
