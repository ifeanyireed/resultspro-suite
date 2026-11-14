"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTenant } from '@/components/TenantProvider';
import { useLandingConfig } from '@/lib/landingConfig';

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
  const { tenant } = useTenant();
  const { config } = useLandingConfig();
  const router = useRouter();
  const schoolName = tenant?.name || config.schoolName || 'Greenwood High Academy';
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'teacher' | 'admin'>('student');

  const roleRoutes = {
    student: '/student/dashboard',
    parent: '/parent/dashboard',
    teacher: '/teacher/dashboard',
    admin: '/admin/pulse',
  };

  return (
    <section
      id="hero"
      data-no-rise="true"
      aria-label={`Hero — ${schoolName}`}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--color-nets-navy-dark)',
        marginTop: '-72px'
      }}
    >
      {/* ── Full-bleed background photo ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={config.heroImage || '/photo07.jpeg'}
          alt={`${schoolName} Campus`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          loading="eager"
        />
        {/* Cinematic overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(13,16,96,0.95) 0%, rgba(13,16,96,0.7) 45%, rgba(13,16,96,0) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,16,96,0.6) 0%, transparent 40%)' }} />
        {/* Accent — thin left rule */}
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
              {config.heroOverline} · {schoolName}
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
            {config.heroTitleTop}
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>{config.heroTitleHighlight}</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{config.heroTitleBottom}</span>
          </motion.h1>

          {/* Body */}
          <motion.p variants={staggerItem} style={{ 
            maxWidth: '480px', 
            marginBottom: '2rem', 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.5'
          }}>
            Welcome to {schoolName}. {config.heroDescription}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <Link href="#admissions" className="btn btn-red btn-lg">
              Apply for Admission
            </Link>
            <Link href="#facilities" className="btn btn-outline-white btn-lg">
              Explore Facilities
            </Link>
          </motion.div>

          {/* Trust badges & checkmark features */}
          <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>WAEC & NECO Accredited</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>STEM & Coding Labs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
              <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
              <span>24/7 Parent & Student Portal</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right — Quick Dashboard Auth Card ── */}
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
              background: 'rgba(13,16,96,0.88)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              marginTop: '1.5rem'
            }}
          >
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <div className="overline-dark" style={{ marginBottom: '0.35rem' }}>Dashboard Access</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Sign in to Campus Portal
              </h2>
            </div>

            {/* Role Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
              {(['student', 'parent', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  style={{
                    padding: '0.45rem 0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    border: selectedRole === r ? '1px solid var(--color-nets-red)' : '1px solid rgba(255,255,255,0.15)',
                    background: selectedRole === r ? 'var(--color-nets-red)' : 'rgba(255,255,255,0.06)',
                    color: selectedRole === r ? '#0D1060' : 'rgba(255,255,255,0.8)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <form
              aria-label="Portal Login"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(roleRoutes[selectedRole]);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              <div>
                <label className="field-label-dark">
                  {selectedRole === 'student' ? 'Student Admission No. or Email' : 'Email or Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'student' ? 'e.g. GHA/2026/0142' : 'name@school.edu.ng'}
                  className="input-dark"
                  style={{ padding: '0.625rem 1rem', width: '100%' }}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="field-label-dark">Password / PIN</label>
                  <Link href="/forgot-password" style={{ fontSize: '0.7rem', color: 'var(--color-nets-red)', textDecoration: 'none', marginBottom: '0.5rem' }}>
                    Forgot PIN?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-dark"
                  style={{ padding: '0.625rem 1rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Enter {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                <Link href={`/login?role=${selectedRole}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                  Full Login Page &rarr;
                </Link>
                <Link href="/register" style={{ color: 'var(--color-nets-red)', fontWeight: 700, textDecoration: 'none' }}>
                  Activate Account
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
