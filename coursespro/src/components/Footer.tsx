"use client";

import Link from 'next/link';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Cohorts',            href: '/cohorts' },
      { label: 'Enterprise Training',       href: '/enterprise' },
      { label: 'Pricing & Plans',           href: '/pricing' },
      { label: 'Student Workspace',         href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About CoursesPRO',          href: '/about' },
      { label: 'Become an Instructor',      href: '/apply' },
      { label: 'Our Blog',                  href: '/blog' },
      { label: 'Careers',                   href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',               href: '/support' },
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
              <img src="/logo.png" alt="CoursesPRO Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              The ultimate cohort-based learning operating system. Upskill with live classes, peer-to-peer collaboration, and industry-leading mentors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', opacity: 0.7 }}>
              <span className="text-white">© {new Date().getFullYear()} CoursesPRO. All rights reserved.</span>
            </div>
          </div>

          {/* Nav columns */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {footerSections.map(section => (
                <div key={section.title}>
                  <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {section.title}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {section.links.map(link => (
                      <li key={link.label}>
                        <Link 
                          href={link.href}
                          style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-nets-red)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
