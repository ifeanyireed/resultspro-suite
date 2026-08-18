import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { services } from '@/data/services'
import { fadeUp, staggerContainer, staggerItem, slideInLeft } from '@/lib/motion'

const serviceIcons: Record<string, React.ReactElement> = {
  bus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="m16 8 4 1v4l-4 1"/><path d="M5 17v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1"/><path d="M11 17v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1"/><circle cx="5" cy="17" r="1"/><circle cx="11" cy="17" r="1"/>
    </svg>
  ),
  building: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/>
    </svg>
  ),
  car: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 17H5v-5l2-4h10l2 4v5Z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  package: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
}

export function ServicesGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const primary = services.find(s => s.isPrimary)!
  const secondary = services.filter(s => !s.isPrimary)

  return (
    <section id="services" ref={ref} aria-labelledby="services-heading" style={{ background: 'var(--color-nets-white)' }}>

      {/* ── Section header — editorial ── */}
      <div className="container-nets section-py-lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'end', marginBottom: '5rem' }}>
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ gridColumn: 'span 12' }} className="lg:col-span-7"
          >
            <div className="overline" style={{ marginBottom: '1.5rem' }}>What We Do</div>
            <h2 id="services-heading" className="text-d2 fw-300" style={{ color: 'var(--color-nets-navy-dark)' }}>
              End-to-end transport
              <br /><strong style={{ fontWeight: 700 }}>for every occasion.</strong>
            </h2>
          </motion.div>
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
            style={{ gridColumn: 'span 12' }} className="lg:col-span-4 lg:col-start-9"
          >
            <p className="text-body-xl" style={{ color: 'var(--color-nets-text-2)' }}>
              Built for organisations, groups and individuals who cannot afford to compromise on reliability, safety or professionalism.
            </p>
          </motion.div>
        </div>

        {/* ── Featured — Bus Rental (primary) — full editorial spread ── */}
        <motion.div
          variants={slideInLeft} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ marginBottom: '1.5px' }}
        >
          <article
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              background: 'var(--color-nets-navy-dark)',
              borderRadius: '3px',
              overflow: 'hidden',
              position: 'relative',
            }}
            className="lg:grid-cols-2"
            aria-label="Bus Rental — Flagship Service"
          >
            {/* Left — Image */}
            <div style={{ position: 'relative', minHeight: '420px', overflow: 'hidden' }}>
              <img
                src="/vehicles/coaster.jpg"
                alt="NETS premium bus rental fleet"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                loading="lazy"
              />
              {/* Dark overlay on right edge for text legibility */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, transparent 60%, var(--color-nets-navy-dark) 100%)',
              }} />
              {/* Red left accent */}
              <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--color-nets-red)' }} />
              {/* Flagship badge */}
              <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <span className="badge badge-red">Flagship Service</span>
              </div>
            </div>

            {/* Right — Content */}
            <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: 'var(--color-nets-red)', marginBottom: '1.25rem' }}>
                {serviceIcons[primary.icon]}
              </div>
              <h3 className="text-d3 fw-300" style={{ color: '#fff', marginBottom: '1.25rem' }}>
                {primary.title}
              </h3>
              <p className="text-body-xl" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                {primary.description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#quote" className="btn btn-red btn-lg">Get a Quote</a>
                <a href="#fleet" className="btn btn-ghost-white btn-lg">
                  View Fleet
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </motion.div>

        {/* ── Secondary services — editorial row ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5px',
            background: 'var(--color-nets-border)',
            border: '1px solid var(--color-nets-border)',
            borderTop: 'none',
            borderRadius: '0 0 3px 3px',
            overflow: 'hidden',
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {secondary.map((svc, i) => (
            <motion.article
              key={svc.id}
              variants={staggerItem}
              style={{
                background: 'var(--color-nets-white)',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'background 0.15s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-nets-light)'
                ;(e.currentTarget.querySelector('.svc-icon') as HTMLElement | null)?.style && ((e.currentTarget.querySelector('.svc-icon') as HTMLElement).style.color = 'var(--color-nets-navy)')
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-nets-white)'
              }}
            >
              {/* Top red accent line appears on hover */}
              <div aria-hidden style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'var(--color-nets-red)', transform: 'scaleX(0)', transformOrigin: 'left',
                transition: 'transform 0.2s ease',
              }} className="svc-accent" />

              <div className="svc-icon" style={{ color: 'var(--color-nets-navy)', transition: 'color 0.15s' }}>
                {serviceIcons[svc.icon]}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)', lineHeight: 1.3 }}>
                {svc.title}
              </h3>
              <p className="text-body-sm text-muted" style={{ flex: 1 }}>
                {svc.shortDescription}
              </p>
              <a href="#" className="btn-ghost btn" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                Learn more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
