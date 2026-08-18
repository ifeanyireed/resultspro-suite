import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { vehicles } from '@/data/vehicles'
import { fadeUp } from '@/lib/motion'

export function FleetShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section
      id="fleet" ref={ref}
      aria-labelledby="fleet-heading"
      style={{ background: 'var(--color-nets-navy-dark)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Noise texture overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(26,31,168,0.3) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container-nets section-py-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}
        >
          <div style={{ maxWidth: '520px' }}>
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Fleet</div>
            <h2 id="fleet-heading" className="text-d2 fw-300" style={{ color: '#fff' }}>
              The right vehicle
              <br /><strong style={{ fontWeight: 700 }}>for every journey.</strong>
            </h2>
          </div>
          <a href="/fleet" className="btn btn-outline-white">View Full Fleet</a>
        </motion.div>

        {/* ── Fleet grid layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {vehicles.map((v) => (
            <motion.article
              key={v.id}
              variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(192,39,45,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              aria-label={`${v.name} — ${v.capacity} seats`}
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#0a0d24' }}>
                <img
                  src={v.imageUrl} alt={`${v.name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  loading="lazy"
                />
                <div aria-hidden style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(13,16,96,0.85) 0%, transparent 60%)',
                }} />
                {/* Capacity badge top-right */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className="badge badge-red">{v.capacity} seats</span>
                </div>
              </div>
              {/* Details */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  {v.category}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{v.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{v.bestFor}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', marginTop: 'auto' }}>
                  {v.features.slice(0, 3).map(f => (
                    <span key={f} style={{
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px', padding: '0.2rem 0.5rem',
                    }}>{f}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <a href={`/fleet/${v.slug}`} className="btn btn-ghost-white btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Details</a>
                  <a href="#quote" className="btn btn-red btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Get Quote</a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
