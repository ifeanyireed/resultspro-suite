'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HelpCircleIcon, 
  Book02Icon, 
  Message01Icon, 
  CallIcon, 
  ArrowRight01Icon,
  GlobalIcon
} from 'hugeicons-react';

export default function SupportPage() {
  const categories = [
    { 
      title: 'Knowledge Base', 
      desc: 'Browse our extensive documentation and guides.', 
      icon: <Book02Icon size={24} />, 
      color: '#146ef5', 
      bg: '#eff6ff' 
    },
    { 
      title: 'Community Forum', 
      desc: 'Connect with other users and share experiences.', 
      icon: <GlobalIcon size={24} />, 
      color: '#10b981', 
      bg: '#ecfdf5' 
    },
    { 
      title: 'Live Chat', 
      desc: 'Talk to our support team in real-time.', 
      icon: <Message01Icon size={24} />, 
      color: '#6366f1', 
      bg: '#eef2ff' 
    },
    { 
      title: 'Phone Support', 
      desc: 'Available 8 AM - 6 PM for urgent matters.', 
      icon: <CallIcon size={24} />, 
      color: '#f59e0b', 
      bg: '#fffbeb' 
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ 
        background: '#146ef5', 
        borderRadius: '2.5rem', 
        padding: '4rem 3rem', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.5 }}
          >
            Welcome to SchoolHub Support. Find answers to common questions or reach out to our dedicated team of education experts.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}
          >
             <input 
               type="text" 
               placeholder="Search for articles, guides..." 
               style={{ 
                 padding: '1rem 1.5rem', 
                 borderRadius: '1.25rem', 
                 border: 'none', 
                 width: '100%', 
                 maxWidth: '400px',
                 fontSize: '1rem',
                 fontWeight: '600',
                 color: '#1e293b',
                 outline: 'none'
               }}
             />
             <button style={{ 
               padding: '0 2rem', 
               borderRadius: '1.25rem', 
               background: '#1e293b', 
               color: 'white', 
               border: 'none', 
               fontWeight: '800', 
               cursor: 'pointer' 
             }}>
               Search
             </button>
          </motion.div>
        </div>

        <div style={{ position: 'relative', width: '240px', height: '240px' }}>
           <Image src="/monster_meditating.png" alt="Support Monster" width={240} height={240} style={{ objectFit: 'contain' }} />
        </div>

        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              padding: '2.5rem 2rem',
              background: 'white',
              borderRadius: '2rem',
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '1.25rem', 
              background: cat.bg, 
              color: cat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              {cat.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.75rem 0' }}>{cat.title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>{cat.desc}</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: cat.color, fontWeight: '800', fontSize: '0.85rem' }}>
              Learn more <ArrowRight01Icon size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '2.25rem', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'How do I reset my portal password?',
              'Where can I find the new term timetable?',
              'How to update student medical records?',
              'Payment processing times and receipts'
            ].map((q, i) => (
              <div key={i} style={{ 
                padding: '1.25rem', 
                background: 'white', 
                borderRadius: '1.25rem', 
                border: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ fontWeight: '700', color: '#475569', fontSize: '0.95rem' }}>{q}</span>
                <ArrowRight01Icon size={18} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          padding: '2.5rem', 
          borderRadius: '2.25rem', 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>Need immediate help?</h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem', lineHeight: 1.5 }}>Our support lines are open Monday to Friday, 8:00 AM — 6:00 PM. Typical response time for chat is under 2 minutes.</p>
            <button style={{ 
              background: '#146ef5', 
              color: 'white', 
              border: 'none', 
              padding: '1rem 2.5rem', 
              borderRadius: '1.25rem', 
              fontWeight: '800', 
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Start a Conversation
            </button>
          </div>
          {/* Watermark Icon */}
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
             <HelpCircleIcon size={200} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}
