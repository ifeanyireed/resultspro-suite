'use client';

import { useState, useMemo } from 'react';
import HeroEditorial from '@/components/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';

const NIGERIA_STATES = {
  "Lagos": ["Ikeja", "Badagry", "Epe", "Ikorodu", "Lagos Island", "Lagos Mainland"],
  "Abuja (FCT)": ["Gwagwalada", "Kuje", "Abuja Municipal", "Bwari", "Kwali"],
  "Kano": ["Kano Municipal", "Dala", "Fagge", "Gwale", "Tarauni", "Nasarawa"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Okrika", "Eleme", "Oyigbo"],
  "Oyo": ["Ibadan North", "Ibadan South", "Egbeda", "Olorunsogo"],
};

export default function SubscribePage() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    state: '',
    lga: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const lgas = useMemo(() => {
    return formData.state ? NIGERIA_STATES[formData.state as keyof typeof NIGERIA_STATES] || [] : [];
  }, [formData.state]);

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
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8080/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-sky-blue)', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <ScrollReveal animation="zoom-in">
          <h1 style={{ marginBottom: '1.5rem' }}>Welcome to the Family!</h1>
          <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>Thank you for subscribing. You&apos;re now on our list and will be among the first to receive our latest updates and education news.</p>
          <Link href="/" className="btn btn-secondary">Return Home</Link>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <>
      <HeroEditorial 
        title="Stay Connected"
        subtitle="Join our community of forward-thinking educators and administrators. Get the latest insights delivered to your inbox."
        image="/photo03.jpeg"
        ctaText="Subscribe Now"
        ctaLink="#subscribe-form"
        tagline="Official Newsletter"
      />

      <section id="subscribe-form" className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
            <ScrollReveal animation="fade-up">
              <div style={{ padding: '3rem', border: '1px solid var(--color-border)', background: '#fafafa' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-sky-blue)', marginBottom: '0.5rem' }}>Subscriber Information</h3>
                  
                  {status === 'error' && (
                    <div style={{ color: 'red', fontSize: '0.875rem', fontWeight: '600' }}>{errorMessage}</div>
                  )}

                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    style={inputStyle}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    style={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <select 
                      required 
                      style={inputStyle}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value, lga: '' })}
                    >
                      <option value="">Select State</option>
                      {Object.keys(NIGERIA_STATES).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <select 
                      required 
                      disabled={!formData.state}
                      style={inputStyle}
                      value={formData.lga}
                      onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    >
                      <option value="">Select LGA</option>
                      {lgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="btn btn-primary" 
                    style={{ background: 'var(--color-sky-blue)', color: 'white', marginTop: '1.5rem' }}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" className="hide-tablet" delay={300}>
              <div style={{ position: 'relative', height: '600px', width: '100%', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                <Image 
                  src="/photo07.jpeg" 
                  alt="Education Technology" 
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
