'use client';

import { useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import Image from 'next/image';

export default function TourPage() {
  const [formData, setFormData] = useState({
    parent_name: '',
    parent_email: '',
    tour_date: '',
    campus: '',
    time_slot: ''
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
      await api.post('/admissions/tour', formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Tour booking failed:', err);
      alert('Failed to book tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-sky-blue)', color: 'white' }}>
        <h2>Tour Scheduled!</h2>
        <p>We look forward to seeing you on {new Date(formData.tour_date).toLocaleDateString()}.</p>
        <a href="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back to Home</a>
      </div>
    );
  }

  return (
    <>
      <HeroEditorial 
        title="Experience Loral Firsthand"
        subtitle="Schedule a visit to see our world-class facilities and meet our dedicated staff."
        image="/photo07.jpeg"
        ctaText="Book a Tour"
        ctaLink="#tour-form"
      />
      <section id="tour-form" className="section section-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2>Book a School Tour</h2>
            <p>Select your preferred campus and time for a personalized visit.</p>
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
                  <h3 style={{ gridColumn: 'span 2', fontSize: '1.25rem', color: 'var(--color-sky-blue)', marginBottom: '0.5rem' }}>Tour Details</h3>
                  <select 
                    required
                    style={{ ...inputStyle, gridColumn: 'span 2' }}
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  >
                    <option value="">Select Campus to Visit</option>
                    <option value="festac">Festac Town, Lagos (Day School)</option>
                    <option value="igbesa">Igbesa, Ogun State (Boarding & Day)</option>
                  </select>
                  <input 
                    type="date" 
                    required
                    style={inputStyle} 
                    value={formData.tour_date}
                    onChange={(e) => setFormData({ ...formData, tour_date: e.target.value })}
                  />
                  <select 
                    required
                    style={inputStyle}
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                  >
                    <option value="">Preferred Time</option>
                    <option value="morning">Morning (9:00 AM - 11:00 AM)</option>
                    <option value="afternoon">Afternoon (1:00 PM - 3:00 PM)</option>
                  </select>

                  <h3 style={{ gridColumn: 'span 2', fontSize: '1.25rem', color: 'var(--color-sky-blue)', marginTop: '1rem', marginBottom: '0.5rem' }}>Contact Information</h3>
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
                  
                  <div style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary" 
                      style={{ width: '100%', background: 'var(--color-sky-blue)', color: 'white' }}
                    >
                      {loading ? 'Scheduling...' : 'Schedule Tour'}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" className="hide-tablet" delay={300}>
              <div style={{ 
                position: 'relative', 
                height: '700px', 
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.05)'
              }}>
                <Image 
                  src="/photo02.jpeg" 
                  alt="Loral Facilities" 
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
