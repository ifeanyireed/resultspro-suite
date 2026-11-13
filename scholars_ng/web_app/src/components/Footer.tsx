"use client";

import Link from 'next/link';
import { useTenant } from '@/components/TenantProvider';

const footerSections = [
  {
    title: 'Explore Campus',
    links: [
      { label: 'Campus Facilities',         href: '/#facilities' },
      { label: 'Admissions & Entry',        href: '/#admissions' },
      { label: 'News & Events',             href: '/#news' },
      { label: 'Official Notice Board',     href: '/#notices' },
      { label: 'Leadership & Team',         href: '/#team' },
    ],
  },
  {
    title: 'Dashboard Portals',
    links: [
      { label: 'Student Dashboard',         href: '/login?role=student' },
      { label: 'Parent & Guardian Portal',  href: '/login?role=parent' },
      { label: 'Teacher Workspace',         href: '/login?role=teacher' },
      { label: 'Admin & Principal Hub',     href: '/login?role=admin' },
    ],
  },
  {
    title: 'Account & Support',
    links: [
      { label: 'Portal Sign In',            href: '/login' },
      { label: 'Activate Portal Account',   href: '/register' },
      { label: 'Reset Password / PIN',      href: '/forgot-password' },
      { label: 'Contact Admissions',        href: '/#admissions' },
    ],
  },
];

export default function Footer() {
  const { tenant } = useTenant();
  const schoolName = tenant?.name || 'Greenwood High Academy';
  const schoolLogo = tenant?.logo_url || '/logo.png';

  return (
    <footer id="contact" role="contentinfo" style={{ background: 'var(--color-nets-navy-dark)' }}>
      {/* Top accent */}
      <div style={{ height: '3px', background: 'var(--color-nets-navy)' }} />

      <div className="container-nets" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', transition: 'opacity 0.2s ease', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <img src={schoolLogo} alt={`${schoolName} Logo`} style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{schoolName}</span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Committed to academic excellence, moral integrity, and technological fluency across Primary, Junior Secondary, and Senior Secondary streams.
            </p>

            {/* Contact quick */}
            {[
              { label: 'Email',    value: 'admissions@school.scholars.ng' },
              { label: 'Campus',   value: 'Lagos, Nigeria' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: '1rem', marginBottom: '0.625rem', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em',
                  color: 'var(--color-nets-red)', textTransform: 'uppercase',
                  width: '56px', flexShrink: 0, paddingTop: '1px',
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
            © {new Date().getFullYear()} {schoolName} · Powered by ScholarsNG
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
        </div>
      </div>
    </footer>
  );
}
