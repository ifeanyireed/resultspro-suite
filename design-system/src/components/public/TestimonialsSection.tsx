import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { testimonials } from '@/data/stats'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion'

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="testimonials" ref={ref}
      aria-labelledby="testimonials-heading"
      style={{ background: 'var(--color-nets-white)' }}
    >
      <div className="container-nets section-py-xl">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ marginBottom: '6rem' }}
        >
          <div className="overline" style={{ marginBottom: '1.5rem' }}>Client Perspectives</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'end' }}>
            <h2 id="testimonials-heading" className="text-d2 fw-300 lg:col-span-7" style={{ color: 'var(--color-nets-navy-dark)', gridColumn: 'span 12' }}>
              Trusted by Nigeria's
              <br /><strong style={{ fontWeight: 700 }}>most discerning passengers.</strong>
            </h2>
          </div>
        </motion.div>

        {/* ── Editorial testimonials — alternating layout ── */}
        <motion.div
          variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
        >
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.id}
              variants={staggerItem}
              cite="#"
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr auto' : 'auto 1fr',
                gap: '0',
                padding: '4rem 0',
                borderBottom: i < testimonials.length - 1 ? '1px solid var(--color-nets-border)' : 'none',
                margin: 0,
              }}
              className="lg:grid-cols-[1fr_auto]"
            >
              <div style={{
                gridColumn: i % 2 === 0 ? 1 : 2,
                gridRow: 1,
                maxWidth: '720px',
                paddingRight: i % 2 === 0 ? '4rem' : '0',
                paddingLeft: i % 2 === 1 ? '4rem' : '0',
              }}>
                {/* Red line accent */}
                <div aria-hidden style={{ width: '28px', height: '2px', background: 'var(--color-nets-red)', marginBottom: '2rem' }} />

                <p className="pull-quote" style={{ color: 'var(--color-nets-navy-dark)', marginBottom: '2rem' }}>
                  {t.quote}
                </p>

                <footer style={{ fontStyle: 'normal' }}>
                  <cite style={{ fontStyle: 'normal' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-nets-navy-dark)', marginBottom: '0.25rem' }}>
                      {t.author}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                      {t.role} · {t.company}
                    </div>
                  </cite>
                </footer>
              </div>

              {/* Step number / decorative */}
              <div style={{
                gridColumn: i % 2 === 0 ? 2 : 1,
                gridRow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
                <span style={{
                  fontSize: 'clamp(5rem, 10vw, 9rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: 'var(--color-nets-navy-10)',
                  userSelect: 'none',
                  fontFamily: 'Georgia, serif',
                }}>
                  &ldquo;
                </span>
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
