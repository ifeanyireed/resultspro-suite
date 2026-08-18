import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion'

export function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="quote"
      ref={ref}
      aria-label="Get started with NETS"
      style={{ background: 'var(--color-nets-navy-dark)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background photo at low opacity */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/vehicles/hiace.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, var(--color-nets-navy-dark) 30%, rgba(26,31,168,0.6) 100%)',
        }} />
        {/* Red bottom accent stripe */}
        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--color-nets-red)' }} />
      </div>

      <div className="container-nets section-py-xl" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'center' }}>

          {/* Left — editorial headline */}
          <motion.div
            style={{ gridColumn: 'span 12' }} className="lg:col-span-7"
            variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div variants={staggerItem}>
              <div className="overline-dark" style={{ marginBottom: '2rem' }}>Get Started Today</div>
            </motion.div>

            <motion.h2
              variants={staggerItem}
              className="text-d1 fw-300"
              style={{ color: '#fff', marginBottom: '2rem' }}
            >
              Ready to plan
              <br /><strong style={{ fontWeight: 700 }}>your journey?</strong>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="text-body-xl text-muted-light"
              style={{ maxWidth: '480px', marginBottom: '3rem' }}
            >
              Speak with our transport specialists today. We design solutions for organisations and individuals around your schedule, group size and budget.
            </motion.p>

            <motion.div
              variants={staggerItem}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/plan" className="btn btn-red btn-xl">
                Plan Your Journey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <a href="#contact" className="btn btn-outline-white btn-xl">Contact Sales</a>
            </motion.div>
          </motion.div>

          {/* Right — contact panel */}
          <motion.div
            style={{ gridColumn: 'span 12' }} className="lg:col-span-4 lg:col-start-9"
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '3px',
              padding: '2.5rem',
              borderTop: '3px solid var(--color-nets-red)',
            }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
                Contact Information
              </h3>
              {[
                { label: 'Operations Phone', value: '+234 916 791 9439', sub: 'Available 24/7' },
                { label: 'Sales Enquiries', value: 'info@neweratransports.com', sub: 'Response within 2 hours' },
                { label: 'Head Office', value: 'Amuwo-Odofin, Lagos', sub: 'Serving nationwide' },
              ].map((item, i) => (
                <div key={item.label} style={{
                  paddingTop: i > 0 ? '1.5rem' : '0',
                  marginTop: i > 0 ? '1.5rem' : '0',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-nets-red)', marginBottom: '0.375rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{item.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
