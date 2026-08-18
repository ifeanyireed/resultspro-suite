import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { industries, processSteps } from '@/data/services'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion'

export function IndustriesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <>
      {/* ── Industries — Light section ── */}
      <section
        id="industries" ref={ref}
        aria-labelledby="industries-heading"
        style={{ background: 'var(--color-nets-light)' }}
      >
        <div className="container-nets section-py-xl">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'start' }}>

            {/* Left header */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{ gridColumn: 'span 12' }} className="lg:col-span-4"
            >
              <div style={{ position: 'sticky', top: '120px' }}>
                <div className="overline" style={{ marginBottom: '1.5rem' }}>Who We Serve</div>
                <h2 id="industries-heading" className="text-d3 fw-300" style={{ color: 'var(--color-nets-navy-dark)', marginBottom: '1.5rem' }}>
                  Trusted by
                  <br /><strong style={{ fontWeight: 700 }}>everyone we move.</strong>
                </h2>
                <p className="text-body-lg text-muted">
                  From multinational corporations to private families — whatever your destination, we ensure you arrive with confidence.
                </p>
              </div>
            </motion.div>

            {/* Right — editorial industry list */}
            <motion.div
              style={{ gridColumn: 'span 12' }} className="lg:col-span-7 lg:col-start-6"
              variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            >
              {industries.map((ind, i) => (
                <motion.div
                  key={ind.id}
                  variants={staggerItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem 0',
                    borderBottom: i < industries.length - 1 ? '1px solid var(--color-nets-border)' : 'none',
                    gap: '1rem',
                    cursor: 'default',
                    transition: 'padding-left 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.paddingLeft = '0.75rem')}
                  onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em',
                      color: 'var(--color-nets-red)', width: '28px', flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)' }}>
                      {ind.name}
                    </span>
                  </div>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '1px solid var(--color-nets-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s ease',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-nets-navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── How It Works — Dark section ── */}
      <section aria-label="How it works" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets section-py-xl">

          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ marginBottom: '5rem' }}
          >
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>How It Works</div>
            <h2 className="text-d2 fw-300" style={{ color: '#fff', maxWidth: '600px' }}>
              From enquiry to
              <br /><strong style={{ fontWeight: 700 }}>confirmed journey.</strong>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0',
            }}
            className="lg:grid-cols-4"
          >
            {processSteps.map((step, i) => (
              <motion.div
                key={step.id}
                variants={staggerItem}
                style={{
                  padding: '2.5rem 2rem',
                  borderRight: i < processSteps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  position: 'relative',
                }}
              >
                {/* Red accent on first step */}
                <div aria-hidden style={{
                  position: 'absolute', top: '-1px', left: 0,
                  height: '2px',
                  width: i === 0 ? '100%' : '0',
                  background: 'var(--color-nets-red)',
                }} />

                {/* Giant step number */}
                <div style={{
                  fontSize: 'clamp(4rem, 6vw, 6rem)',
                  fontWeight: 300,
                  color: 'rgba(26,31,168,0.35)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  marginBottom: '1.5rem',
                }}>
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
