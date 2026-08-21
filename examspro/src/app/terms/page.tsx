"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
      <Navbar />

      <section style={{ paddingTop: '160px', paddingBottom: '120px', background: 'var(--color-nets-navy-dark)', flex: 1 }}>
        <div className="container-nets">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '4rem' }}>
              <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'block' }}>Legal</span>
              <h1 className="h2" style={{ color: 'white', marginBottom: '1.5rem' }}>Terms of Service</h1>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Last Updated: April 8, 2026<br/>
                Please read these terms carefully before using our platform.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {sections.map((section, i) => (
                <div key={i}>
                  <h2 className="h4" style={{ color: 'white', marginBottom: '1rem' }}>{section.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="h5" style={{ color: 'white', marginBottom: '1rem' }}>Contact Us</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Questions about our terms? Contact our legal team at <a href="mailto:legal@resultspro.ng" style={{ color: 'var(--color-nets-red)', textDecoration: 'none' }}>legal@resultspro.ng</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
