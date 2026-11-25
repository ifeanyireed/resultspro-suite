"use client";

import Link from 'next/link';
import { IconCheck, IconPlayerPlay as IconPlay, IconBook, IconBrain } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 } }
};

const Hero = () => {
  return (
    <section
      id="hero"
      data-no-rise
      aria-label="Hero — ResultsPRO"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--color-nets-navy-dark)',
        marginTop: '-72px' // to offset navbar height exactly
      }}
    >
      {/* ── Full-bleed background photo ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/photo07.jpeg"
          alt="ResultsPRO 3D Campus"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          loading="eager"
        />
        {/* Cinematic overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(13,16,96,0.95) 0%, rgba(13,16,96,0.7) 45%, rgba(13,16,96,0) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,16,96,0.6) 0%, transparent 40%)' }} />
        {/* Red accent — thin left rule */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
          background: 'var(--color-nets-red)',
          zIndex: 10,
        }} />
      </div>

      {/* ── Content ── */}
      <div
        className="container-nets"
        style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
          alignItems: 'center',
          paddingTop: '10rem',
          paddingBottom: '4rem',
          flex: 1
        }}
      >
        {/* ── Left — Editorial headline ── */}
        <motion.div
          style={{ gridColumn: 'span 12' }}
          className="lg:col-span-7"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Overline */}
          <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
            <span className="overline-dark">
              AI-Powered School Assessment &amp; Performance Intelligence Engine
            </span>
          </motion.div>

          {/* Headline — editorial split */}
          <motion.h1 variants={staggerItem} className="fw-300" style={{ 
            color: '#fff', 
            marginBottom: '1rem', 
            fontSize: 'clamp(2.5rem, 3.8vw, 3.65rem)', 
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}>
            From Manual Score Entry
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#FBBC04' }}>To Intelligent</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Academic Reporting.</span>
          </motion.h1>

          {/* Body */}
          <motion.p variants={staggerItem} style={{ 
            maxWidth: '540px', 
            marginBottom: '2rem', 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.78)',
            lineHeight: '1.55'
          }}>
            Snap handwritten marksheets for AI OCR extraction, reconcile against CampusPRO multi-campus rosters, run pre-publication AI result audits, generate personalized report-card remarks, and close the learning loop with ClassroomPRO.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <Link href="/dashboard" className="btn btn-red btn-lg">
              Launch 9-Step Webinar Demo
            </Link>
            <Link href="/login" className="btn btn-outline-white btn-lg">
              School Portal Login
            </Link>
          </motion.div>

          {/* Trust badges & checkmark features */}
          <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#FBBC04" />
              <span>Multi-Sheet Handwritten OCR</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#FBBC04" />
              <span>AI Result Auditor &amp; Officer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#FBBC04" />
              <span>100% Deterministic Broadsheets</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right — Quick Practice card ── */}
        <motion.div
          style={{ gridColumn: 'span 12', display: 'flex' }}
          className="lg:col-span-5 lg:col-start-8 lg:justify-end justify-center"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div
            id="quote"
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(13,16,96,0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              marginTop: '1.5rem'
            }}
          >
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Result Portal</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Check Your Results
              </h2>
            </div>

            <form aria-label="Check Result" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Scratch Card PIN</label>
                <input type="text" placeholder="Enter 12-digit PIN" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>
              
              <div>
                <label className="field-label-dark">Student ID / Registration No.</label>
                <input type="text" placeholder="e.g. REG-00123" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/check" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  View Result
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
