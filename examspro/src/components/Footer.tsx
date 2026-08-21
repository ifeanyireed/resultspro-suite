"use client";

import Link from 'next/link';

const footerSections = [
  {
    title: 'Services',
    links: [
      { label: 'Practice Mode',             href: '/practice' },
      { label: 'Live Games',                href: '/live' },
      { label: 'Battle Mode',               href: '/battle-mode' },
      { label: 'AI Study Assistant',        href: '/study-assistant' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Leaderboard',               href: '/leaderboard' },
      { label: 'Blog',                      href: '/blog' },
      { label: 'Refer & Earn',              href: '/referral' },
      { label: 'Coin Shop',                 href: '/shop' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Support',           href: '/support' },
      { label: 'Terms of Service',          href: '/terms' },
      { label: 'Privacy Policy',            href: '/privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" role="contentinfo" style={{ background: 'var(--color-nets-navy-dark)' }}>
      {/* Top accent */}
      <div style={{ height: '3px', background: 'var(--color-nets-navy)' }} />

      <div className="container-nets" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <img src="/logo.png" alt="ExamsPRO Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Nigeria's ultimate CBT practice platform. Supercharge your prep with AI tutoring, live multiplayer games, and battle modes.
            </p>

            {/* Contact quick */}
            {[
              { label: 'Email',    value: 'hello@resultspro.ng' },
              { label: 'Location', value: 'Lagos, Nigeria' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: '1rem', marginBottom: '0.625rem', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em',
                  color: 'var(--color-nets-red)', textTransform: 'uppercase',
                  width: '52px', flexShrink: 0, paddingTop: '1px',
                }}>{c.label}</span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{c.value}</span>
              </div>
            ))}
          </div>

          {/* Nav columns */}
          <div
            style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
            className="lg:col-span-7 lg:col-start-6"
          >
            {footerSections.map(sec => (
              <div key={sec.title}>
                <h3 style={{
                  fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                  marginBottom: '1.5rem',
                }}>
                  {sec.title}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem', padding: 0, margin: 0 }}>
                  {sec.links.map(lk => {
                    const style = { fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', transition: 'color 0.15s ease', textDecoration: 'none' }
                    const onEnter = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = '#fff')
                    const onLeave = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
                    
                    return (
                      <li key={lk.label}>
                        <Link href={lk.href} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                          {lk.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-nets" style={{
          paddingTop: '1.5rem', paddingBottom: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} ExamsPRO.ng · All rights reserved
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map((l, i) => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>·</span>}
                <Link href={l.href} style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)', transition: 'color 0.15s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="ResultsPRO on Twitter"
              style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
