"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
      <Navbar />

      <section style={{ paddingTop: '160px', paddingBottom: '120px', background: 'var(--color-nets-navy-dark)', flex: 1 }}>
        <div className="container-nets">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '4rem' }}>
              <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'block' }}>Legal</span>
              <h1 className="h2" style={{ color: 'white', marginBottom: '1.5rem' }}>Privacy Policy</h1>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Effective Date: April 8, 2026<br/>
                Your privacy is critically important to us. This policy explains what data we collect, how it's used, and your rights regarding your personal information.
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
                If you have any questions or concerns regarding this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@resultspro.ng" style={{ color: 'var(--color-nets-red)', textDecoration: 'none' }}>privacy@resultspro.ng</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
