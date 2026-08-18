import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { whyNets } from '@/data/services'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion'

export function WhyNETS() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="about" ref={ref} aria-labelledby="why-heading" style={{ background: 'var(--color-nets-white)' }}>
      <div className="container-nets section-py-xl">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'start' }}>

          {/* ── Left: sticky editorial text ── */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-5">
            <div style={{ position: 'sticky', top: '120px' }}>
              <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                <div className="overline" style={{ marginBottom: '2rem' }}>Why New Era</div>
                <h2 id="why-heading" className="text-d2 fw-300" style={{ color: 'var(--color-nets-navy-dark)', marginBottom: '2rem' }}>
                  Built for
                  <br />passengers
                  <br /><strong style={{ fontWeight: 700 }}>who demand
                  <br />excellence.</strong>
                </h2>
                <p className="text-body-xl" style={{ color: 'var(--color-nets-text-2)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '380px' }}>
                  Whether moving corporate teams, wedding guests, or school children, every detail of our operation is designed to guarantee that you arrive safely, on time, every time.
                </p>
                <a href="#quote" className="btn btn-red btn-lg">Speak with our team</a>
              </motion.div>

              {/* Accent photo */}
              <motion.div
                variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                transition={{ delay: 0.2 }}
                style={{ marginTop: '4rem', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}
              >
                <img
                  src="/vehicles/hiace.jpg"
                  alt="Professional corporate driver — NETS"
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                  loading="lazy"
                />
                {/* Floating counter */}
                <div style={{
                  position: 'absolute', bottom: '1.5rem', right: '1.5rem',
                  background: 'var(--color-nets-navy-dark)', color: '#fff',
                  padding: '1rem 1.25rem', borderRadius: '2px', borderLeft: '3px solid var(--color-nets-red)',
                }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>15+</div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>
                    Years of service
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Right: value propositions ── */}
          <motion.div
            style={{ gridColumn: 'span 12' }} className="lg:col-span-6 lg:col-start-7"
            variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          >
            {whyNets.map((item, i) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '2rem',
                  padding: '2.5rem 0',
                  borderBottom: i < whyNets.length - 1 ? '1px solid var(--color-nets-border)' : 'none',
                  alignItems: 'start',
                }}
              >
                {/* Large number */}
                <div style={{
                  fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em',
                  color: 'var(--color-nets-red)',
                  width: '32px', textAlign: 'center', paddingTop: '4px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div>
                  <h3 style={{
                    fontSize: '1.125rem', fontWeight: 700,
                    color: 'var(--color-nets-navy-dark)',
                    marginBottom: '0.625rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.title}
                  </h3>
                  <p className="text-body-md" style={{ color: 'var(--color-nets-text-2)', lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
