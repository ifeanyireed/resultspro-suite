"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, ShieldCheck, Database, Lock } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Data We Collect",
      content: "We collect information you provide directly to us (name, email, phone number) and information about your usage of the Service (answered questions, coin transactions, ELO rating, device information)."
    },
    {
      title: "2. How We Use Data",
      content: "We use your data to: (a) provide and personalize the Service; (b) process coin rewards and payouts; (c) facilitate competitive matchmaking; and (d) send important notifications or updates."
    },
    {
      title: "3. Data Sharing",
      content: "We do not sell your personal data. We may share anonymized, aggregated statistics with academic partners or advertisers. Your name and ranking are public on our leaderboards."
    },
    {
      title: "4. Data Security",
      content: "We implement industry-standard security measures, including SSL encryption and secure database protocols, to protect your data from unauthorized access."
    },
    {
      title: "5. Your Rights",
      content: "You can update your profile information at any time. You may request account deletion by contacting support, which will remove all personal identifiers from our databases within 30 days."
    }
  ];

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-3xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center mx-auto mb-8">
              <Eye className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Effective: April 8, 2026</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/5">
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-green mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Safe</p>
              </div>
              <div className="text-center">
                <Database className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Private</p>
              </div>
              <div className="text-center">
                <Lock className="w-6 h-6 text-amber mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Encrypted</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-green mx-auto mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Reliable</p>
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
                Privacy concerns? Contact us at <span className="text-blue-400">privacy@resultspro.ng</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
