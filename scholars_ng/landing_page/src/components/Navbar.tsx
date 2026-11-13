"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = [
    { label: 'Specialist Apps', href: '/#apps' },
    { label: 'Why ScholarsNG', href: '/#why-us' },
    { label: 'Role Workspaces', href: '/#roles' },
    { label: 'Mobile App', href: '/#mobile-app' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  const isActive = (href: string) => pathname.startsWith(href) && href !== '/';

  return (
    <>
      <div aria-hidden style={{ height: '72px', width: '100%', flexShrink: 0, display: 'block', background: 'var(--color-nets-navy-dark)' }} />
      <header
        role="banner"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '72px',
          display: 'flex', alignItems: 'center',
          background: scrolled ? 'var(--color-nets-navy-dark)' : 'var(--color-nets-navy-dark)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="container-nets" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Logo */}
          <Link href="/" aria-label="ScholarsNG" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <img src="/logo.png" alt="ScholarsNG Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ marginLeft: '12px', fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>Scholars<span style={{ color: 'var(--color-nets-red)' }}>NG</span></span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary Desktop" style={{ gap: '2.5rem', alignItems: 'center' }} className="nav-desktop">
            {mounted ? (
              navItems.map(l => (
                <Link key={l.label} href={l.href} className="nav-link">{l.label}</Link>
              ))
            ) : (
              <div style={{ display: 'flex', gap: '2.5rem' }}>
                <div style={{ width: '60px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                <div style={{ width: '80px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                <div style={{ width: '70px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
              </div>
            )}
            
            {mounted && (
              <Link href="#pricing" className="btn btn-red" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
                Deploy Portal
              </Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div style={{ alignItems: 'center', gap: '1.25rem' }} className="nav-desktop-actions">
            {mounted && (
              <Link href="#quote" className="btn btn-outline-white btn-sm" style={{ textDecoration: 'none' }}>
                Find School
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', padding: '0.5rem', flexDirection: 'column', gap: '5px', flexShrink: 0, cursor: 'pointer' }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '24px', height: '2px', background: '#fff', borderRadius: '1px' }} />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />

            <motion.div key="dr" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              role="dialog" aria-modal aria-label="Navigation"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
                zIndex: 300, background: 'var(--color-nets-navy-dark)',
                display: 'flex', flexDirection: 'column', padding: '2rem',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexShrink: 0 }}>
                <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src="/logo.png" alt="ScholarsNG Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ marginLeft: '12px', fontSize: '1.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>Scholars<span style={{ color: 'var(--color-nets-red)' }}>NG</span></span>
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', padding: '0.5rem', cursor: 'pointer' }}>✕</button>
              </div>

              <nav aria-label="Mobile Navigation" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', textDecoration: 'none' }}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05), duration: 0.3, ease: 'easeOut' }}
                        style={{ 
                          padding: '1rem', 
                          fontSize: '1.25rem', 
                          fontWeight: active ? 600 : 500, 
                          color: active ? 'var(--color-nets-red)' : '#fff', 
                          borderLeft: active ? '3px solid var(--color-nets-red)' : '3px solid transparent',
                          background: active ? 'rgba(251, 188, 4, 0.12)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {l.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}
                style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <Link href="#pricing" onClick={() => setMobileOpen(false)} className="btn btn-red" style={{ width: '100%', justifyContent: 'center', padding: '1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                  Deploy School Portal
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a href="mailto:hello@resultspro.ng" style={{ fontSize: '0.875rem', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Email</span> hello@resultspro.ng
                  </a>
                  <div style={{ fontSize: '0.875rem', color: '#fff', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>HQ</span> 
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
