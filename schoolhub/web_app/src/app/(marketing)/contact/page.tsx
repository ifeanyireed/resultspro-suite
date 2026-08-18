'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';

export default function ContactPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Contact...
      </div>
    );
  }

  const { contact } = tenantInfo.content;

  const inputStyle = {
    padding: '1rem',
    border: '1px solid var(--color-sky-blue)',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
    background: 'white'
  };

  return (
    <>
      <HeroEditorial 
        title={contact.hero_title}
        subtitle={contact.hero_subtitle}
        image={contact.hero_image}
        ctaText="Send Message"
        ctaLink="#contact-section"
      />

      <section id="contact-section" className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '5rem', alignItems: 'start' }}>
            {/* Contact Info Side */}
            <div style={{ padding: '2rem 0' }}>
              <ScrollReveal animation="fade-up">
                <span className="caption" style={{ color: 'var(--color-sky-blue)', marginBottom: '1rem', display: 'block' }}>Get in Touch</span>
                <h2>Contact Information</h2>
                <div style={{ marginTop: '3rem' }}>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-sky-blue)' }}>General Inquiry</h3>
                    <p style={{ color: 'var(--color-text-on-white)' }}>{contact.email}</p>
                    <p style={{ color: 'var(--color-text-on-white)' }}>{contact.phone}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form Side */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div style={{ 
                padding: '4rem', 
                border: '1px solid var(--color-border)', 
                background: '#fafafa',
                boxShadow: '0 30px 60px rgba(0,0,0,0.02)'
              }}>
                <form style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <input type="text" placeholder="Full Name" style={inputStyle} />
                    <input type="email" placeholder="Email Address" style={inputStyle} />
                  </div>
                  <input type="text" placeholder="Subject" style={inputStyle} />
                  <textarea placeholder="Your Message" rows={6} style={{ ...inputStyle, fontFamily: 'inherit' }}></textarea>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--color-sky-blue)', color: 'white', marginTop: '1rem' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', color: 'white' }}>Our Campuses</h2>
          </ScrollReveal>
        </div>
        
        <FeatureSplit 
          title="Festac Town, Lagos"
          description="Our Festac campus provides a serene and conducive environment for day students in Nursery, Primary, and Secondary levels. Located in the heart of Lagos, it combines accessibility with world-class facilities."
          imageMain="/photo11.jpeg"
          imageSecondary="/photo02.jpeg"
        />

        <FeatureSplit 
          title="Igbesa, Ogun State"
          description="The Igbesa campus is home to our premium boarding facilities and A-Level College. Spread across a vast landscape, it offers a distraction-free environment where students can focus on holistic development and academic excellence."
          imageMain="/photo05.jpeg"
          imageSecondary="/photo08.jpeg"
          reverse
        />
      </section>
    </>
  );
}
