"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerSections = [
  {
    title: 'Products',
    links: [
      { label: 'SchoolHub',             href: '#schoolhub' },
      { label: 'ExamsPRO',              href: 'https://examspro.resultspro.ng' },
      { label: 'ClassroomPRO',          href: '#classroompro' },
      { label: 'ResultsPRO',            href: '#resultspro' },
      { label: 'TutorsPRO',             href: '#tutorspro' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',                  href: '/about' },
      { label: 'Careers',                   href: '/careers' },
      { label: 'Blog',                      href: '/blog' },
      { label: 'Contact',                   href: '/contact' },
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
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith('/onboard');

  if (isOnboarding) return null;

  return (
    <footer className="bg-navy text-white" style={{ backgroundColor: 'var(--color-nets-navy-dark)', paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div className="container-nets">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <img src="/logo.png" alt="ResultsPRO Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="text-muted-light text-sm mb-6 max-w-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Building the infrastructure to power the needed culture shift in African K12 education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="sr-only">Twitter</span>
                {/* SVG placeholder */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="fw-600 text-white mb-6 uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} ResultsPRO Education. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
