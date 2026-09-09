'use client';

import { 
  IconMail, 
  IconPhoneCall, 
  IconMapPin, 
  IconMessageCircle, 
  IconSend 
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for reaching out! A member of our team will get back to you shortly.');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 left-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300 mx-auto">
            <IconMessageCircle size={16} />
            <span>Support & Partnerships</span>
          </div>
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Let's build the <span style={{ fontWeight: 700, color: 'white' }}>future of education.</span>
          </h1>
          <p className="text-body-lg text-white/70 mt-6">
            Whether you're looking to deploy our infrastructure across your campuses, integrate our APIs, or simply say hello, our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-py bg-light relative -mt-16 z-20">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-nets-border">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <IconMail size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-2">Email Us</h3>
                <p className="text-muted text-sm mb-4">Our friendly team is here to help.</p>
                <div className="space-y-2">
                  <a href="mailto:hello@resultspro.ng" className="block text-navy fw-500 hover:text-blue-600 transition-colors">hello@resultspro.ng</a>
                  <a href="mailto:partners@resultspro.ng" className="block text-navy fw-500 hover:text-blue-600 transition-colors">partners@resultspro.ng</a>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-nets-border">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <IconPhoneCall size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-2">Call Us</h3>
                <p className="text-muted text-sm mb-4">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+2348000000000" className="block text-navy fw-500 hover:text-emerald-600 transition-colors">+234 (0) 800 000 0000</a>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-nets-border">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <IconMapPin size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-2">Visit Us</h3>
                <p className="text-muted text-sm mb-4">Come say hello at our office HQ.</p>
                <address className="not-italic text-navy fw-500 leading-relaxed">
                  Lagos, Nigeria<br />
                  (Full address available upon appointment)
                </address>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-nets-border p-8 sm:p-12">
              <h2 className="text-3xl fw-600 text-navy mb-2">Send us a message</h2>
              <p className="text-muted mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm fw-500 text-navy">First Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane"
                      className="w-full px-4 py-3 rounded-xl border border-nets-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm fw-500 text-navy">Last Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-nets-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm fw-500 text-navy">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="jane@school.edu.ng"
                    className="w-full px-4 py-3 rounded-xl border border-nets-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm fw-500 text-navy">Subject / Area of Interest</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-nets-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option>SchoolHub Deployment</option>
                    <option>ExamsPRO Partnership</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm fw-500 text-navy">Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl border border-nets-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                  style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem', fontSize: '1rem' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <IconSend size={18} />}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
