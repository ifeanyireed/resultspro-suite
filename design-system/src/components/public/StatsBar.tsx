import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '@/data/stats'
import { staggerContainer, staggerItem } from '@/lib/motion'

export function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} aria-label="Company performance metrics" style={{ background: 'var(--color-nets-navy)' }}>
      <div className="container-nets">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            padding: '0',
          }}
          className="sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              variants={staggerItem}
              style={{
                padding: '3rem 2rem',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Red top accent on first item */}
              {i === 0 && (
                <div aria-hidden style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '32px', height: '2px', background: 'var(--color-nets-red)',
                }} />
              )}
              <div style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 300,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginBottom: '0.75rem',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
