"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
      <Navbar />

      <section style={{ paddingTop: '160px', paddingBottom: '80px', background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'inline-block' }}>Support</span>
            <h1 className="h1" style={{ color: 'white', marginBottom: '1.5rem' }}>How can we help?</h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Everything you need to know about ResultsPRO, how to get started, and how to reach our team.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--color-nets-navy)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4rem' }}>
            
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
              <h2 className="h3" style={{ color: 'white', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ padding: '2rem', background: 'var(--color-nets-navy-dark)', borderLeft: '4px solid var(--color-nets-red)', borderRadius: '2px' }}>
                    <h4 className="h5" style={{ color: 'white', marginBottom: '1rem' }}>{faq.q}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.9375rem' }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
              <div style={{ position: 'sticky', top: '120px' }}>
                <h2 className="h4" style={{ color: 'white', marginBottom: '2rem' }}>Get in Touch</h2>
                
                <div style={{ padding: '2rem', background: 'var(--color-nets-red)', color: 'white', borderRadius: '2px', marginBottom: '2rem' }}>
                  <h3 className="h5" style={{ color: 'white', marginBottom: '0.5rem' }}>Contact Sales & Support</h3>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.9 }}>We typically respond within 2 hours during business hours.</p>
                  <a href="mailto:support@resultspro.ng" className="btn" style={{ background: 'white', color: 'var(--color-nets-red)', width: '100%', justifyContent: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
                    Email Us
                  </a>
                  <a href="https://wa.me/2349167919439" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid white', width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                    Chat on WhatsApp
                  </a>
                </div>

                <div>
                  <h3 className="overline" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Office</h3>
                  <p style={{ color: 'white', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
