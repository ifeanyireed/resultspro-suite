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

interface HeroProps {
  tenantName?: string;
  heroBgUrl?: string;
  overline?: string;
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  description?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  features?: string[];
}

const Hero = ({ 
  tenantName = "CoursesPRO",
  heroBgUrl,
  overline,
  titleLine1 = "Master New",
  titleLine2 = "Skills",
  titleLine3 = "with Expert Cohorts.",
  description = "Join live, interactive cohorts and learn high-income skills from industry professionals.",
  ctaPrimaryText = "Browse Cohorts",
  ctaPrimaryLink = "/cohorts",
  ctaSecondaryText = "Learn More",
  ctaSecondaryLink = "/about",
  features = ["Industry Experts", "Live Cohorts", "Project-based Learning"]
}: HeroProps) => {
  return (
    <section
      id="hero"
      aria-label="Hero — CoursesPRO"
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
          src={heroBgUrl || "/images/Students1.jpeg"}
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
              {overline || `Welcome to ${tenantName}`}
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
            {titleLine1}
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>{titleLine2}</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{titleLine3}</span>
          </motion.h1>

          {/* Body */}
          <motion.p variants={staggerItem} style={{ 
            maxWidth: '460px', 
            marginBottom: '2rem', 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.5'
          }}>
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <Link href={ctaPrimaryLink} className="btn btn-red btn-lg">
              {ctaPrimaryText}
            </Link>
            <Link href={ctaSecondaryLink} className="btn btn-outline-white btn-lg">
              {ctaSecondaryText}
            </Link>
          </motion.div>

          {/* Trust badges & checkmark features */}
          <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
                <IconCheck size={15} strokeWidth={1.25} color="#4ade80" />
                <span>{feat}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
