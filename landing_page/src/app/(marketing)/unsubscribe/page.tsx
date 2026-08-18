'use client';

import { useState } from 'react';
import PhotoHero from '@/components/PhotoHero';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8080/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-sky-blue)', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <ScrollReveal animation="zoom-in">
          <h1 style={{ marginBottom: '1.5rem' }}>Successfully Unsubscribed</h1>
          <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>You have been removed from our mailing list. We&apos;re sorry to see you go!</p>
          <Link href="/" className="btn btn-secondary">Return Home</Link>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <>
      <PhotoHero 
        title="We're Sorry to See You Go"
        subtitle="Please confirm your email address to unsubscribe from our newsletter."
        image="/photo04.jpeg"
        tagline="Manage Subscription"
      />

      <section className="section section-white">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <ScrollReveal animation="fade-up">
            <h2 style={{ color: 'var(--color-sky-blue)', marginBottom: '2rem' }}>Confirm Unsubscribe</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-sky-blue)',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '1rem',
                  width: '100%',
                  background: 'white'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn btn-primary" 
                style={{ background: 'var(--color-sky-blue)', color: 'white' }}
              >
                {status === 'loading' ? 'Processing...' : 'Unsubscribe Now'}
              </button>
            </form>
            {status === 'error' && (
              <p style={{ color: 'red', marginTop: '1.5rem', fontWeight: '600' }}>Something went wrong. Please try again or contact support.</p>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
