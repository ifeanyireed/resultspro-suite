"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconBrandFacebook, 
  IconBrandInstagram, 
  IconBrandLinkedin, 
  IconBrandX 
} from '@tabler/icons-react';

const footerSections = [
  {
    title: 'Products',
    links: [
      { label: 'ScholarsNG',             href: '/scholars_ng' },
      { label: 'CampusPRO',              href: '/campuspro' },
      { label: 'ExamsPRO',              href: '/examspro' },
      { label: 'ClassroomPRO',          href: '/classroompro' },
      { label: 'ResultsPRO',            href: '/resultspro' },
      { label: 'TutorsPRO',             href: '/tutorspro' },
      { label: 'CoursesPRO',            href: '/coursespro' },
      { label: 'PuzzlePRO',             href: '/puzzlepro' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Book a Demo',               href: '/demo' },
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
  const isOnboarding = pathname?.startsWith('/onboard') || pathname?.startsWith('/login');

  if (isOnboarding) return null;

  return (
    <footer className="bg-navy text-white" style={{ backgroundColor: 'var(--color-nets-navy-dark)', paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div className="container-nets">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <img src="/logo.png" alt="ResultsPRO Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="text-muted-light text-sm mb-4 max-w-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Building the infrastructure to power the needed culture shift in African K12 education.
            </p>
            <div className="flex items-center gap-3 mb-2">
              <a 
                href="https://facebook.com/resultsprong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all text-white/80"
                aria-label="ResultsPRO on Facebook (@resultsprong)"
                title="Facebook: @resultsprong"
              >
                <IconBrandFacebook size={18} stroke={1.5} />
              </a>
              <a 
                href="https://instagram.com/resultsprong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all text-white/80"
                aria-label="ResultsPRO on Instagram (@resultsprong)"
                title="Instagram: @resultsprong"
              >
                <IconBrandInstagram size={18} stroke={1.5} />
              </a>
              <a 
                href="https://linkedin.com/company/resultsprong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all text-white/80"
                aria-label="ResultsPRO on LinkedIn (/company/resultsprong)"
                title="LinkedIn: /company/resultsprong"
              >
                <IconBrandLinkedin size={18} stroke={1.5} />
              </a>
              <a 
                href="https://x.com/resultsprong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all text-white/80"
                aria-label="ResultsPRO on X (@resultsprong)"
                title="X.com: @resultsprong"
              >
                <IconBrandX size={18} stroke={1.5} />
              </a>
            </div>
            <p className="text-xs text-white/50 tracking-wide">
              Follow us <span className="text-white/70 font-semibold">@resultsprong</span>
            </p>
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
