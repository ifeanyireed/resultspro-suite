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
      aria-label="Hero — My School Academy"
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
          src="/images/Students2.jpeg"
          alt=""
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
              Excellence in Education
            </span>
          </motion.div>

          {/* Headline — editorial split */}
          <motion.h1 variants={staggerItem} className="fw-300" style={{ 
            color: '#fff', 
            marginBottom: '1rem', 
            fontSize: 'clamp(2.75rem, 4vw, 3.75rem)', 
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}>
            Premium Exam
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Preparation</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>for Every Student.</span>
          </motion.h1>

          {/* Body */}
          <motion.p variants={staggerItem} style={{ 
            maxWidth: '460px', 
            marginBottom: '2rem', 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.5'
          }}>
            Welcome to My School Academy's official portal. Access resources, track performance, and stay connected.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <Link href="/school/login" className="btn btn-red btn-lg">
              Portal Login
            </Link>
            <Link href="/admissions" className="btn btn-outline-white btn-lg">
              Apply Now
            </Link>
          </motion.div>

          {/* Trust badges & checkmark features */}
          <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>Certified Teachers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>Modern Facilities</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>Holistic Curriculum</span>
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
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Parent Portal</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Sign in to your account
              </h2>
            </div>

            <form aria-label="Portal Login" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Email or Phone</label>
                <input type="text" placeholder="Enter your credentials" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>
              
              <div>
                <label className="field-label-dark">Password</label>
                <input type="password" placeholder="••••••••" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/school/login" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Secure Login
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
