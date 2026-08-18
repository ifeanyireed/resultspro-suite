"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, 
  MessageCircle, 
  HelpCircle, 
  Info, 
  Target, 
  Users, 
  ShieldCheck,
  Zap,
  ChevronRight,
  Globe,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SupportPage() {
  const faqs = [
    {
      q: "How do I earn coins?",
      a: "You earn coins by answering questions correctly (1 coin per MCQ), maintaining daily streaks (15 coins for 7 days), and referring friends (25 coins each)."
    },
    {
      q: "What is the Pro Plan?",
      a: "The Pro Plan gives you unlimited access to all subjects, 500 monthly bonus coins, AI-powered explanations for all questions, and early access to live tournaments."
    },
    {
      q: "Can I use ResultsPRO offline?",
      a: "Currently, ResultsPRO requires an active internet connection to sync your progress, update coin balances, and enable real-time battle mode."
    },
    {
      q: "How do I withdraw my earnings?",
      a: "Once you accumulate at least 10,000 coins, you can request a payout to your bank account via the Payout dashboard."
    }
  ];

  return (
    <main className="min-h-screen bg-navy overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green/10 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <HelpCircle className="w-3 h-3" />
            Support & Information
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tight mb-6">
            We&apos;re here to <span className="text-green">help</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about ResultsPRO, how to get started, and how to reach our team.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-amber font-bold text-xs uppercase tracking-widest">
                <Info className="w-4 h-4" />
                About ResultsPRO
              </div>
              <h2 className="text-4xl font-display font-bold text-white uppercase">Revolutionizing Exam Practice</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                ResultsPRO is West Africa&apos;s leading gamified learning platform, designed to help students master their exams through competitive play and AI-powered insights. 
              </p>
              <p className="text-gray-400 font-medium leading-relaxed">
                Since 2024, we&apos;ve helped over 50,000 students across Nigeria, Ghana, and Sierra Leone achieve their academic goals using our unique &quot;Earn as you Learn&quot; model.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                  <Target className="w-8 h-8 text-green mb-4" />
                  <h4 className="text-white font-bold mb-1">Our Mission</h4>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-tighter">Gamify excellence for every student.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                  <Users className="w-8 h-8 text-blue-400 mb-4" />
                  <h4 className="text-white font-bold mb-1">Our Community</h4>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-tighter">50K+ Active students & counting.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[60px] bg-gradient-to-br from-green/20 to-blue/20 border border-white/10 flex items-center justify-center p-12 overflow-hidden group">
                <div className="absolute inset-0 bg-navy/40 backdrop-blur-3xl" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 rounded-full bg-green flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,200,83,0.4)]">
                    <Zap className="w-12 h-12 text-navy fill-navy" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">The #1 Study Platform</h3>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20">
            {/* FAQs */}
            <div className="flex-1 space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight mb-4">Common Questions</h2>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest italic">Quick answers to help you get started</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/[0.1] border-t-white/[0.15] hover:border-green/30 transition-all group">
                    <h4 className="text-white font-bold mb-3 flex items-start gap-4">
                      <span className="text-green opacity-50">Q.</span>
                      {faq.q}
                    </h4>
                    <p className="text-gray-400 text-sm font-medium pl-8 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form / Info */}
            <div className="w-full md:w-[400px] space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight mb-4">Get in Touch</h2>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest italic">We typically respond within 2-4 hours</p>
              </div>

              <div className="p-10 rounded-[40px] bg-green text-navy shadow-[0_20px_50px_rgba(0,200,83,0.2)]">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-6 leading-tight">Send us a message</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Email Support</p>
                      <p className="font-bold">hello@resultspro.ng</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Live Chat</p>
                      <p className="font-bold text-sm mb-2">Available 8am - 8pm WAT</p>
                      <div className="flex flex-col gap-2">
                        <a 
                          href="https://wa.me/message/JYMZWFDPVSCIF1" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-navy/20 hover:bg-navy/30 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all w-fit"
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.506-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-2.578l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Chat on WhatsApp
                        </a>
                        <a 
                          href="https://whatsapp.com/channel/0029VaEVqxV9cDDfTBkB1s1e" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-navy/20 hover:bg-navy/30 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all w-fit"
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.506-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-2.578l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp Channel
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-navy/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Follow our journey</p>
                  <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center hover:bg-navy/20 transition-all"><Twitter className="w-5 h-5" /></button>
                    <button className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center hover:bg-navy/20 transition-all"><Instagram className="w-5 h-5" /></button>
                    <button className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center hover:bg-navy/20 transition-all"><Facebook className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
                <ShieldCheck className="w-6 h-6 text-blue-400 mb-4" />
                <h4 className="text-white font-bold text-sm mb-2">Safe & Secure Learning</h4>
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Your data is encrypted and protected. Learn more in our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
