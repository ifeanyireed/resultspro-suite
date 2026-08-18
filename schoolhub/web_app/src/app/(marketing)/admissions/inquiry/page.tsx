'use client';

import { useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import Image from 'next/image';

export default function InquiryPage() {
  const [formData, setFormData] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    class_of_entry: '',
    source: 'web_inquiry'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    padding: '1rem',
    border: '1px solid var(--color-sky-blue)',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
    background: 'white'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admissions/inquiry', formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-sky-blue)', color: 'white' }}>
        <h2>Thank you for your interest!</h2>
        <p>Our admissions team will contact you shortly.</p>
        <a href="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back to Home</a>
      </div>
    );
  }

  return (
    <>
      <HeroEditorial 
        title="Get in Touch"
        subtitle="Have questions? Our admissions team is ready to guide you through every step of your child's journey."
        image="/photo05.jpeg"
        ctaText="Send Inquiry"
        ctaLink="#inquiry-form"
      />
      <section id="inquiry-form" className="section section-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2>Admission Inquiry</h2>
            <p>Fill out the form below and one of our representatives will contact you shortly.</p>
          </ScrollReveal>
            
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 0.8fr', 
            gap: '4rem', 
            marginTop: '4rem',
            alignItems: 'start'
          }}>
            <ScrollReveal animation="fade-up">
              <div style={{ 
                padding: '3rem', 
                border: '1px solid var(--color-border)', 
                background: '#fafafa',
              }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <h3 style={{ gridColumn: 'span 2', fontSize: '1.25rem', color: 'var(--color-sky-blue)', marginBottom: '0.5rem' }}>Your Information</h3>
                  <input 
                    type="text" 
                    placeholder="Parent/Guardian Name" 
                    required
                    style={{ ...inputStyle, gridColumn: 'span 2' }} 
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    style={inputStyle} 
                    value={formData.parent_email}
                    onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    style={inputStyle} 
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  />
                  
                  <select 
                    required
                    style={{ ...inputStyle, gridColumn: 'span 2' }}
                    value={formData.class_of_entry}
                    onChange={(e) => setFormData({ ...formData, class_of_entry: e.target.value })}
                  >
                    <option value="">Interested Level</option>
                    <option value="nursery">Nursery</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="alevel">A-Level College</option>
                  </select>

                  <div style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary" 
                      style={{ width: '100%', background: 'var(--color-sky-blue)', color: 'white' }}
                    >
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" className="hide-tablet" delay={300}>
              <div style={{ 
                position: 'relative', 
                height: '650px', 
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.05)'
              }}>
                <Image 
                  src="/photo03.jpeg" 
                  alt="Inquiry Consultation" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
