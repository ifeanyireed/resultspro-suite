'use client';

import HeroEditorial from '@/components/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
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
        title="Connect with the Future"
        subtitle="Our team is ready to help you transform your school's digital infrastructure. Let's discuss how we can scale excellence together."
        image="/photo10.jpeg"
        ctaText="Send Message"
        ctaLink="#contact-section"
        tagline="Partnership & Support"
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
                    <p style={{ color: 'var(--color-text-on-white)' }}>hello@resultspro.ng</p>
                    <p style={{ color: 'var(--color-text-on-white)' }}>+234 (0) 800 000 0000</p>
                  </div>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-sky-blue)' }}>Partnership</h3>
                    <p style={{ color: 'var(--color-text-on-white)' }}>partners@resultspro.ng</p>
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
    </>
  );
}
